from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, permissions

from django.http import HttpResponse
from django.core.mail import EmailMessage


from employee.models import Employee
from user.models import CustomUser
from calendar_event.models import ShiftChangeRequest

from .models import Attendance
from .serializers import AttendanceSerializer, FileUploadSerializer
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

        employees = {}
        for record in serializer.data:
            emp_id = record['employee_id']
            if emp_id not in employees:
                employees[emp_id] = {
                    'employee_id': emp_id,
                    'employee_name': record['employee_name'],
                    'avatar': record['avatar'],
                    'attendance': {
                        'date': record['date'],
                        'time_in': record['time_in'],
                        'time_out': record['time_out'],
                        'status': record['status'],
                    }
                }
            employees[emp_id][record['atte']] = {
                'time_in': record['time_in'],
                'time_out': record['time_out'],
                'status': record['status'],
            }
        print(list(employees.values()))
        return Response(serializer.data, status=status.HTTP_200_OK)
    


# class AttendanceAPIView(generics.ListAPIView):
#     # permission_classes = [IsAuthenticated]

#     def get(self, request, format=None):
#         attendances = Attendance.objects.select_related('employee__user').all()
#         serializer = AttendanceSerializer(attendances, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     def post(self, request, format=None):
#         attendances = Attendance.objects.select_related('employee__user').all()

#         action_map = {
#             'excel': self._handle_excel,
#             # 'pdf': self._handle_pdf,
#             'sendmail': self._handle_sendmail,
#         }

#         for key, handler in action_map.items():
#             if request.data.get(key):
#                 return handler(attendances)

#         return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

#     def _handle_excel(self, data):
#         xlsx_data = ExcelReportWriter(data)
#         response = HttpResponse(
#             xlsx_data,
#             content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
#         )
#         response['Content-Disposition'] = 'attachment; filename=Weekly_Report.xlsx'
#         return response

#     # def _handle_pdf(self, data):
#     #     pdf_data = WriteToPdf(data)
#     #     response = HttpResponse(
#     #         pdf_data,
#     #         content_type='application/pdf'
#     #     )
#     #     response['Content-Disposition'] = 'attachment; filename=Weekly_Report.pdf'
#     #     return response

#     def _handle_sendmail(self, data):
#         xlsx_data = ExcelReportWriter(data)
#         email = EmailMessage(
#             subject="Weekly Report for testing",
#             body="Dear testing,\n\nAttached is the weekly report for your department.",
#             from_email='hello@demomailtrap.co',
#             to=["vincentcarlcalidguid@gmail.com"],
#         )
#         email.attach(
#             "Weekly_Report.xlsx",
#             xlsx_data,
#             'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
#         )
#         email.send()
#         return Response({"message": "Email sent successfully!"}, status=status.HTTP_200_OK)
    
class AttendanceImportAPIView(APIView):
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
                if row[date] == "":
                    continue

                try:
                    attendance_date = dt.datetime.strptime(date + "-" + str(year), "%m-%d-%Y").date()
                    time_in = dt.datetime.strptime(row[date][:5], "%H:%M").time()
                    time_out = dt.datetime.strptime(row[date][-5:], "%H:%M").time()
                except Exception:
                    continue

                employees = Employee.objects.filter(employee_id=row['Staff Code'])
                if not employees.exists():
                    continue

                employee_instance = employees.get()

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


