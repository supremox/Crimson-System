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
                    'earnings': []
                }

            pay_input = {
                "holiday_types":["special_working"],
                "is_rest_day"  : False,
                "is_overtime"  : False,
                "is_night_shift": False,
                "hourly_rate": hourly_rate,
                "hours_worked":8,
                "late_minutes":0,
                "undertime_minutes":0
            }

            pay_result = PayCalculator(**pay_input)
                
            employees[emp_id]['earnings'].append({
                'date': record['date'],
                'pay_details': pay_result,
                
            })

        
        
