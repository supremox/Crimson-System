from rest_framework import generics, views
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, permissions

from django.http import HttpResponse
from django.core.mail import EmailMessage


from employee.models import Employee
from user.models import CustomUser
from calendar_event.models import ShiftChangeRequest, Leave

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
                employees = Employee.objects.filter(employee_id=row['Staff Code'])
                if not employees.exists():
                    continue

                employee_instance = employees.get()


                if row[date] == "":
                    # Check if employee is on leave for this date
                    leave_date =  dt.datetime.strptime(date + "-" + str(year), "%m-%d-%Y").date()
                    leave_request = Leave.objects.filter(
                        employee=employee_instance,
                        leave_status="Approve",
                        leave_start_date=leave_date,
                        leave_end_date=leave_date
                    ).first()

                    if leave_request:
                        attendance_objects.append(Attendance(
                            employee=employee_instance,
                            date=leave_date,
                            time_in=dt.time(0, 0, 0),
                            time_out=dt.time(0, 0, 0),
                            late="00:00",
                            undertime="00:00",
                            overtime="00:00",
                            status=leave_request.leave_type
                        ))
                        continue

                    print(f"Checking leave for {employee_instance} on {leave_date}: {leave_request}")
                    continue

                try:
                    attendance_date = dt.datetime.strptime(date + "-" + str(year), "%m-%d-%Y").date()
                    time_in = dt.datetime.strptime(row[date][:5], "%H:%M").time()
                    time_out = dt.datetime.strptime(row[date][-5:], "%H:%M").time()
                except Exception:
                    continue

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

                calc = AttendanceCalculation.calculate_attendance(time_in, time_out, shift_start, shift_end, break_start, break_end)

                late = f"{calc['late']['hours']}:{calc['late']['minutes']:02}"
                undertime = f"{calc['undertime']['hours']}:{calc['undertime']['minutes']:02}"
                overtime = f"{calc['overtime']['hours']}:{calc['overtime']['minutes']:02}"
                status_label = calc['late']['status']

                attendance_objects.append(Attendance(
                    employee=employee_instance,
                    date=attendance_date,
                    time_in=time_in,
                    time_out=time_out,
                    late=late,
                    undertime=undertime,
                    overtime=overtime,
                    status=status_label
                ))

        Attendance.objects.bulk_create(attendance_objects)

        return Response({
            "message": "File uploaded and processed successfully!",
            "attendance": serializer.data
        }, status=status.HTTP_201_CREATED)


