from rest_framework import generics, views
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, permissions

from django.http import HttpResponse
from django.core.mail import EmailMessage
from django.utils import timezone
from datetime import timedelta


from employee.models import Employee, EmployeeYearlySchedule
from user.models import CustomUser
from calendar_event.models import ShiftChangeRequest, Leave, CalendarEvent, Overtime

from .models import Attendance
from .serializers import AttendanceSerializer, FileUploadSerializer, AttendanceQuerySerializer
from .utils import AttendanceCalculation
from .utils import ExcelReportWriter
# from export.pdf  import WriteToPdf 

import datetime as dt
import pandas as pd

class AttendanceAPIView(generics.ListAPIView):
    serializer_class = AttendanceSerializer

    def get_queryset(self):
        user_company = self.request.user.company
        if not user_company:
            return Attendance.objects.none()  # Or raise PermissionDenied

        # Get latest 15 distinct attendance dates
        recent_dates = (
            Attendance.objects.order_by("-date")
            .values_list("date", flat=True)
            .distinct()[:15]
        )

        return Attendance.objects.select_related("employee__user").filter(
            date__in=recent_dates,
            employee__user__company=user_company
        )

    def get(self, request, format=None):
        attendances = self.get_queryset()
        serializer = self.get_serializer(attendances, many=True, context={'request': request})
        # print(f"Serializer Data: {serializer.data}")
        employees = {}
        for record in serializer.data:
            emp_id = record['employee_id']
            if emp_id not in employees:
                employees[emp_id] = {
                    'employee_id': emp_id,
                    'employee_name': record['employee_name'],
                    'avatar': record['avatar'],
                    'attendance': []
                }
            employees[emp_id]['attendance'].append({
                'date': record['date'],
                'time_in': record['time_in'],
                'time_out': record['time_out'],
                'status': record['status'],
            })
        return Response(list(employees.values()), status=status.HTTP_200_OK)

class AttendanceUserAPIView(generics.ListAPIView): 
    serializer_class = AttendanceSerializer

    def get_queryset(self):
        user = self.request.user  # Get the logged-in user
        if not user.is_authenticated:
            return Attendance.objects.none()

        # Get the latest 15 attendance dates for this user's employee
        recent_dates = (
            Attendance.objects.filter(employee__user=user)
            .order_by("-date")
            .values_list("date", flat=True)
            .distinct()[:15]
        )
        return Attendance.objects.select_related("employee__user").filter(
            employee__user=user,
            date__in=recent_dates
        )

    def get(self, request, format=None):
        attendances = self.get_queryset()
        serializer = self.get_serializer(attendances, many=True, context={'request': request})
        
        # Format the result for only this user
        user = request.user
        if not attendances:
            return Response([], status=status.HTTP_200_OK)
        
        record = serializer.data[0]  # Assuming all records are for the same user
        response_data = {
            'employee_id': record['employee_id'],
            'employee_name': record['employee_name'],
            'avatar': record['avatar'],
            'attendance': []
        }

        for record in serializer.data:
            response_data['attendance'].append({
                'date': record['date'],
                'time_in': record['time_in'],
                'time_out': record['time_out'],
                'status': record['status'],
            })

        return Response(response_data, status=status.HTTP_200_OK)


class AttendanceRetrieveAPIView(views.APIView):
    def get(self, request, employee_id, date, *args, **kwargs):
        try:
            attendance = Attendance.objects.select_related('employee__user').get(
                employee__employee_id=employee_id,
                date=date
            )
        except Attendance.DoesNotExist:
            return Response(
                {"error": "Attendance record not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = AttendanceSerializer(attendance)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AttendanceUserfilterRetrieveAPIView(views.APIView):
    permission_classes = [IsAuthenticated]  # Ensure only logged-in users can access

    def post(self, request, *args, **kwargs):
        start_date = request.data.get("start_date")
        end_date = request.data.get("end_date")
        print(f"Start date: {start_date}  End Date: {end_date}")

        if not start_date or not end_date:
            return Response(
                {"error": "start_date and end_date are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user

        attendances = Attendance.objects.select_related('employee__user').filter(
            employee__user=user,
            date__gte=start_date,
            date__lte=end_date
        )

        if not attendances.exists():
            return Response(
                {"error": "No attendance records found for the given date range."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = AttendanceSerializer(attendances, many=True)

        # Construct response for single user
        first_record = serializer.data[0]
        user_attendance = {
            'employee_id': first_record['employee_id'],
            'employee_name': first_record['employee_name'],
            'avatar': first_record['avatar'],
            'attendance': []
        }

        for record in serializer.data:
            user_attendance['attendance'].append({
                'date': record['date'],
                'time_in': record['time_in'],
                'time_out': record['time_out'],
                'total_hours_worked': record['total_hours_worked'],
                'status': record['status'],
            })

        return Response(user_attendance, status=status.HTTP_200_OK)
    

class AttendancefilterRetrieveAPIView(views.APIView):
    def post(self, request, *args, **kwargs):
        start_date = request.data.get("start_date")
        end_date = request.data.get("end_date")
        print(f"Start date: {start_date}  End Date: {end_date}")

        if not start_date or not end_date:
            return Response(
                {"error": "start_date and end_date are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        attendances = Attendance.objects.select_related('employee__user').filter(
            date__gte=start_date,
            date__lte=end_date
        )

        if not attendances.exists():
            return Response(
                {"error": "No attendance records found for the given date range."},
                status=status.HTTP_404_NOT_FOUND)
        
        serializer = AttendanceSerializer(attendances, many=True)
        employees = {}
        for record in serializer.data:
            emp_id = record['employee_id']
            if emp_id not in employees:
                employees[emp_id] = {
                    'employee_id': emp_id,
                    'employee_name': record['employee_name'],
                    'avatar': record['avatar'],
                    'attendance': []
                }
            employees[emp_id]['attendance'].append({
                'date': record['date'],
                'time_in': record['time_in'],
                'time_out': record['time_out'],
                'total_hours_worked': record['total_hours_worked'],
                'status': record['status'],
            })
        
        # print(list(employees.values()))
        return Response(list(employees.values()), status=status.HTTP_200_OK)


    
class AttendanceImportAPIView(views.APIView):
    parser_classes = [MultiPartParser, FormParser]
    # permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        serializer = FileUploadSerializer(data=request.data)
        if not serializer.is_valid():
            uploaded_file = serializer.validated_data['file_upload']
            return Response(
                {"error": "Please select a valid Excel file."},
                status=status.HTTP_400_BAD_REQUEST
            )

        uploaded_file = serializer.validated_data['file_upload']
        df = pd.read_excel(uploaded_file, keep_default_na=False)

        df = df.drop(columns=['Name'], axis=1)
        year = pd.ExcelFile(uploaded_file).sheet_names[0]
        # print(f"Data from Excel: {df}")
        attendance_objects = []

        for index, row in df.iterrows():
            if not Employee.objects.filter(employee_id=row['Staff Code']).exists():
                continue

            for date in df.columns[1:]:
                check_date =  dt.datetime.strptime(date + "-" + str(year), "%m-%d-%Y").date()
                employees = Employee.objects.filter(employee_id=row['Staff Code'])
                if not employees.exists():
                    continue

                employee_instance = employees.get()

                print(f"Shift: {employee_instance.shift}")

                holiday_types = list(
                            CalendarEvent.objects
                            .filter(event_date=check_date)
                            .values_list('event_type', flat=True)
                            # .distinct()
                        )
                
                # Check employee schedule for this date
                yearly_schedule = EmployeeYearlySchedule.objects.filter(
                    employee=employee_instance,
                    date=check_date,
                ).first()


                if row[date] == "":

                    # ============== Work Day Checker =================== #
                    if yearly_schedule.type == "work":

                        # Check if the date is a Holiday
                        is_holiday = CalendarEvent.objects.filter(
                            event_date=check_date,
                        ).exists()

                        print(f"Holiday Types: {holiday_types}")
                    
                    # ============== Holiday Checker =================== #

                        if is_holiday:
                            attendance_objects.append(Attendance(
                                employee=employee_instance,
                                date=check_date,
                                time_in=dt.time(0, 0, 0),
                                time_out=dt.time(0, 0, 0),
                                late="00:00",
                                undertime="00:00",
                                overtime={
                                    "before_10pm": {"hours": 0, "minutes": 0},
                                    "after_10pm": {"hours": 0, "minutes": 0},
                                    "after_6am": {"hours": 0, "minutes": 0}
                                },
                                total_hours_worked="0:0",
                                night_diff_hours= {"hours": 0, "minutes": 0},
                                holiday_types=holiday_types,
                                is_rest_day=False,
                                is_overtime=False,
                                is_halfday=False,
                                is_leave_paid=False,
                                is_oncall=False,
                                status="Holiday"
                            ))
                            continue

                    # ============== Leave Checker =================== #

                        leave_request = Leave.objects.filter(
                            employee=employee_instance,
                            leave_status="Approve",
                            leave_start_date=check_date,
                            leave_end_date=check_date
                        ).first()

                        is_leave_paid = False
                        
                        if leave_request:
                            if leave_request.is_leave_paid:
                                is_leave_paid = True

                            attendance_objects.append(Attendance(
                                employee=employee_instance,
                                date=check_date,
                                time_in=dt.time(0, 0, 0),
                                time_out=dt.time(0, 0, 0),
                                late="00:00",
                                undertime="00:00",
                                overtime={
                                    "before_10pm": {"hours": 0, "minutes": 0},
                                    "after_10pm": {"hours": 0, "minutes": 0},
                                    "after_6am": {"hours": 0, "minutes": 0}
                                },
                                total_hours_worked="0:0",
                                night_diff_hours= {"hours": 0, "minutes": 0},
                                holiday_types=holiday_types,
                                is_rest_day=False,
                                is_overtime=False,
                                is_halfday=False,
                                is_leave_paid=is_leave_paid,
                                is_oncall=False,
                                status=leave_request.leave_type
                            ))
                            continue

                    # ============== Absent =================== # 
                                
                        attendance_objects.append(Attendance(
                            employee=employee_instance,
                            date=check_date,
                            time_in=dt.time(0, 0, 0),
                            time_out=dt.time(0, 0, 0),
                            late="00:00",
                            undertime="00:00",
                            overtime={
                                "before_10pm": {"hours": 0, "minutes": 0},
                                "after_10pm": {"hours": 0, "minutes": 0},
                                "after_6am": {"hours": 0, "minutes": 0}
                            },
                            total_hours_worked="0:0",
                            night_diff_hours= {"hours": 0, "minutes": 0},
                            holiday_types=holiday_types,
                            is_rest_day=False,
                            is_overtime=False,
                            is_halfday=False,
                            is_leave_paid=False,
                            is_oncall=False,
                            status="Absent"
                        ))

                    # ============== On Call Checker =================== #
                                            
                    if yearly_schedule.type == "on_call":
                        attendance_objects.append(Attendance(
                            employee=employee_instance,
                            date=check_date,
                            time_in=dt.time(0, 0, 0),
                            time_out=dt.time(0, 0, 0),
                            late="00:00",
                            undertime="00:00",
                            overtime={
                                "before_10pm": {"hours": 0, "minutes": 0},
                                "after_10pm": {"hours": 0, "minutes": 0},
                                "after_6am": {"hours": 0, "minutes": 0}
                            },
                            total_hours_worked="0:0",
                            night_diff_hours= {"hours": 0, "minutes": 0},
                            holiday_types=holiday_types,
                            is_rest_day=False,
                            is_overtime=False,
                            is_halfday=False,
                            is_leave_paid=False,
                            is_oncall=True,
                            status="On-Call"
                        ))

                    # ============== Rest Day Checker I =================== #

                    if yearly_schedule.type == "rest":
                        attendance_objects.append(Attendance(
                            employee=employee_instance,
                            date=check_date,
                            time_in=dt.time(0, 0, 0),
                            time_out=dt.time(0, 0, 0),
                            late="00:00",
                            undertime="00:00",
                            overtime={
                                "before_10pm": {"hours": 0, "minutes": 0},
                                "after_10pm": {"hours": 0, "minutes": 0},
                                "after_6am": {"hours": 0, "minutes": 0}
                            },
                            total_hours_worked="0:0",
                            night_diff_hours= {"hours": 0, "minutes": 0},
                            holiday_types=holiday_types,
                            is_rest_day=True,
                            is_overtime=False,
                            is_halfday=False,
                            is_leave_paid=False,
                            is_oncall=False,
                            status="Rest Day"
                        ))

                    continue
                
                # ============== Data Proccessing for Date, Time-in, Time-Out =================== #

                try:
                    attendance_date = dt.datetime.strptime(date + "-" + str(year), "%m-%d-%Y").date()
                    time_in = dt.datetime.strptime(row[date][:5], "%H:%M").time()
                    time_out = dt.datetime.strptime(row[date][-5:], "%H:%M").time()
                except Exception:
                    continue

                # ============== Rest Day Checker II =================== #

                attendance_schedule = EmployeeYearlySchedule.objects.filter(
                    employee=employee_instance,
                    date=attendance_date,
                ).first()

                is_rest_day = False
                if attendance_schedule.type == "rest":
                    is_rest_day = True

                # ============== OverTime Checker =================== #

                overtime_request = Overtime.objects.filter(
                    employee=employee_instance,
                    overtime_date=attendance_date,
                    overtime_status="Approve"
                )

                is_overtime = False
                if overtime_request:
                    is_overtime = True
                
                # ============== Shift Change Checker =================== #

                shift_request = ShiftChangeRequest.objects.filter(
                    employee=employee_instance,
                    date=attendance_date,
                    shift_status="Approve"
                ).first()

                is_halfday = False
                

                if shift_request:

                    if shift_request.shift_type == "Halfday":
                        is_halfday = True

                    shift_start = shift_request.start_time
                    shift_end = shift_request.end_time
                    break_start = shift_request.break_start
                    break_end = shift_request.break_end
                else:
                    shift = employee_instance.shift
                    shift_start = shift.start_time
                    shift_end = shift.end_time
                    break_start = shift.break_start
                    break_end = shift.break_end

                # ============== Attendance Calculation =================== #

                calc = AttendanceCalculation.calculate_attendance(time_in, time_out, shift_start, shift_end, break_start, break_end)

                late = f"{calc['late']['hours']}:{calc['late']['minutes']:02}"
                undertime = f"{calc['undertime']['hours']}:{calc['undertime']['minutes']:02}"
                overtime = calc['overtime_hrs']
                total_work_hours = f"{calc['total_work_hours']['hours']}:{calc['total_work_hours']['minutes']:02}"
                status_label = calc['late']['status']
                night_diff_hours = calc['night_diff_hours']

                attendance_objects.append(Attendance(
                    employee=employee_instance,
                    date=attendance_date,
                    time_in=time_in,
                    time_out=time_out,
                    late=late,
                    undertime=undertime,
                    overtime=overtime,
                    total_hours_worked=total_work_hours,
                    night_diff_hours=night_diff_hours,
                    holiday_types=holiday_types,
                    is_rest_day=is_rest_day,
                    is_overtime=is_overtime,
                    is_halfday=is_halfday,
                    is_leave_paid=False,
                    is_oncall=False,
                    status=status_label
                ))

        Attendance.objects.bulk_create(attendance_objects)

        return Response({
            "message": "File uploaded and processed successfully!",
        }, status=status.HTTP_201_CREATED)


