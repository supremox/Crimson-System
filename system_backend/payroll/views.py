from rest_framework import generics, views, status
from rest_framework.response import Response

from .serializers import PayrollGenerateSerializer, ComputePaySerializer

from attendance.models import Attendance
from attendance.serializers import AttendanceSerializer 
from calendar_event.models import CalendarEvent, Overtime
from employee.models import Employee, EmployeeYearlySchedule
from payroll.utils import PayCalculator

# Create your views here.
class PayrollGenerateAPIView(views.APIView):
    def post(self, request, *args, **kwargs):
        start_date = request.data.get("start_date")
        end_date = request.data.get("end_date")

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
                check_date = record['date']
                
                employee = Employee.objects.get(employee_id=emp_id)

                employee_schedule = EmployeeYearlySchedule.objects.filter(
                        employee=employee,
                        date=check_date,
                ).first()

                hourly_rate = employee.salary / employee.total_working_days / employee.total_duty_hrs

                employees[emp_id] = {
                    'employee_id': emp_id,
                    'employee_name': record['employee_name'],
                    'avatar': record['avatar'],
                    'attendance': []
                }

            pay_input = {
                "is_regular_holiday": record.get("is_regular_holiday", False),
                "is_special_non_working": record.get("is_special_non_working", False),
                "is_ordinary": record.get("is_ordinary", False),
                "is_rest_day": record.get("is_rest_day", False),
                "is_double_holiday": record.get("is_double_holiday", False),
                "is_double_special": record.get("is_double_special", False),
                "is_night_shift": record.get("is_night_shift", False),
                "is_overtime": record.get("is_overtime", False),
                "hourly_rate": hourly_rate,
                "hours_worked": record["total_hours_worked"],
                "overtime_hrs": record.get("overtime_hrs", 0),
                "late_minutes": record["total_hours_worked"],
                "undertime_minutes": record.get("undertime_minutes", 0),
            }

            pay_result = PayCalculator(**pay_input)
                
            employees[emp_id]['attendance'].append({
                'date': record['date'],
                'pay_details': pay_result,
                
            })

        
        
