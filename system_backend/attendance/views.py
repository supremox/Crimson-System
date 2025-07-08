from rest_framework import generics, views
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, permissions

from django.http import HttpResponse
from django.core.mail import EmailMessage


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
    queryset = Attendance.objects.select_related('employee__user').all()
    serializer_class = AttendanceSerializer

    def get(self, request, format=None):
        attendances = self.get_queryset()
        serializer = self.get_serializer(attendances, many=True)
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
            # print(record)
            # pay_result = {
            #     "holiday_types":record["holiday_types"],
            #     "is_rest_day":record["is_rest_day"],
            #     "is_overtime":record["is_overtime"],
            #     "is_night_shift":record["is_night_shift"],
            #     "hours_worked":record["total_hours_worked"],
            #     "night_diff_hours":record["night_diff_hours"],
            #     "overtime_hrs":record["overtime"],
            #     "late_minutes":record["late"],
            #     "undertime_minutes":record["undertime"]

            # }
            # print(pay_result)
        # print(list(employees.values()))
        return Response(list(employees.values()), status=status.HTTP_200_OK)
    

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
                    if yearly_schedule.type == "work":

                        # Check if the date is a Holiday
                        is_holiday = CalendarEvent.objects.filter(
                            event_date=check_date,
                        ).exists()

                        print(f"Holiday Types: {holiday_types}")

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
                                is_night_shift=False,
                                status="Holiday"
                            ))
                            continue

                        leave_request = Leave.objects.filter(
                            employee=employee_instance,
                            leave_status="Approve",
                            leave_start_date=check_date,
                            leave_end_date=check_date
                        ).first()

                        if leave_request:
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
                                is_night_shift=False,
                                status=leave_request.leave_type
                            ))
                            continue

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
                            is_night_shift=False,
                            status="Absent"
                        ))

                        print(f"Checking leave for {employee_instance} on {check_date}: {leave_request}")
                        
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
                            is_night_shift=False,
                            status="On-Call"
                        ))

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
                            is_night_shift=False,
                            status="Rest Day"
                        ))

                    continue

                try:
                    attendance_date = dt.datetime.strptime(date + "-" + str(year), "%m-%d-%Y").date()
                    time_in = dt.datetime.strptime(row[date][:5], "%H:%M").time()
                    time_out = dt.datetime.strptime(row[date][-5:], "%H:%M").time()
                except Exception:
                    continue

                # ============== Rest Day Checker =================== #

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

                if overtime_request:
                    is_overtime = True
                else:
                    is_overtime = False
                
                # ============== Shift Change Checker =================== #

                is_night_shift = False

                shift_request = ShiftChangeRequest.objects.filter(
                    employee=employee_instance,
                    date=attendance_date,
                    shift_status="Approve"
                ).first()

                if shift_request:
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


                if shift_end < shift_start:
                    is_night_shift = True
                

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
                    is_night_shift=is_night_shift,
                    status=status_label
                ))

        Attendance.objects.bulk_create(attendance_objects)

        return Response({
            "message": "File uploaded and processed successfully!",
            "attendance": serializer.data
        }, status=status.HTTP_201_CREATED)


