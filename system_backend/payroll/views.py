from rest_framework import generics, views, status
from rest_framework.response import Response

from .serializers import PayrollGenerateSerializer, ComputePaySerializer

from attendance.models import Attendance
from attendance.serializers import AttendanceSerializer 
from calendar_event.models import CalendarEvent, Overtime
from employee.models import Employee, EmployeeYearlySchedule
from payroll.utils import PayCalculator

from typing import TypedDict
import datetime as dt
class AttendanceRecord(TypedDict):
    date: dt.date
    late: str
    undertime: str
    overtime:str
    holiday_types: list
    is_rest_day: bool
    is_overtime: bool
    is_night_shift: bool


# Create your views here.
class PayrollGenerateAPIView(views.APIView):
    def post(self, request, *args, **kwargs):
        start_date = request.data.get("start_date")
        end_date = request.data.get("end_date")
        print(f"Payroll Generation: {request.data}")
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
                # check_date = record['date']
                
                employee = Employee.objects.get(employee_id=emp_id)

                # employee_schedule = EmployeeYearlySchedule.objects.filter(
                #         employee=employee,
                #         date=check_date,
                # ).first()

                hourly_rate = int(employee.salary) / int(employee.total_working_days) / int(employee.total_duty_hrs)

                employees[emp_id] = {
                    'employee_id': emp_id,
                    'employee_name': record['employee_name'],
                    'avatar': record['avatar'],
                    'earnings': []
                }

            pay_input = PayCalculator(
                holiday_types=record["holiday_types"],
                is_rest_day=record["is_rest_day"],
                is_overtime=record["is_overtime"],
                is_night_shift=record["is_night_shift"],
                hourly_rate=hourly_rate,
                hours_worked=self.hours(record["total_hours_worked"]),
                night_diff_hours=record["night_diff_hours"],
                employee_duty_hrs=int(employee.total_duty_hrs),
                overtime_hrs=record["overtime"],
                late_minutes= self.minutes(record["late"]),
                undertime_minutes=self.minutes(record["undertime"])
            )

            pay_result = pay_input.compute_pay() 
            # print(f"Holiday_types: {record["holiday_types"]}")  
            print(f"Date: {record['date']}, Employee_name: {record['employee_name']}, Gross Pay: {pay_result["gross_pay"]} Net Pay: {pay_result["total_pay"]}")
            # print(pay_result)        
            # employees[emp_id]['earnings'].append({
            #     'date': record['date'],
            #     'pay_details': pay_result,
                
            # })
        return  Response(status=status.HTTP_200_OK)      

    @staticmethod
    def minutes(time):
        hours, minutes = map(int, time.split(':'))
        total_minutes = hours * 60 + minutes
        return total_minutes

    @staticmethod
    def hours(time):
        hours, minutes = map(int, time.split(':'))
        total_hours = hours + minutes / 60
        return round(total_hours, 2)
        
        
