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
                
                employee = Employee.objects.get(employee_id=emp_id)

                hourly_rate = int(employee.salary) / int(employee.total_working_days) / int(employee.total_duty_hrs)

                employees[emp_id] = {
                    'employee_id': emp_id,
                    'employee_name': record['employee_name'],
                    # 'avatar': record['avatar'],
                    'earnings': []
                }

            pay_input = PayCalculator(
                holiday_types    =  record["holiday_types"],
                is_rest_day      =  record["is_rest_day"],
                is_overtime      =  record["is_overtime"],
                is_halfday       =  record["is_halfday"],
                is_leave_paid    =  record["is_leave_paid"],
                is_oncall        =  record["is_oncall"],
                hourly_rate      =  hourly_rate,
                hours_worked     =  self.hours(record["total_hours_worked"]),
                night_diff_hours =  record["night_diff_hours"],
                employee_duty_hrs=  int(employee.total_duty_hrs),
                overtime_hrs     =  record["overtime"],
                late_minutes     =  self.minutes(record["late"]),
                undertime_minutes=  self.minutes(record["undertime"])
            )

            pay_result = pay_input.compute_pay()     
            employees[emp_id]['earnings'].append({
                'date': record['date'],
                'pay_details': pay_result,  
            })

        pay_summary = self.process_earnings(employees)
        print(pay_summary)
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
    
    @staticmethod
    def process_earnings(data):
        results = []

        for key,employee_record in data.items():
            # Each record has a single key like "202501"
            employee_id = employee_record["employee_id"]
            employee_name = employee_record["employee_name"]
            employee_earnings = employee_record["earnings"]

            total_gross_pay = 0.0
            total_net_pay = 0.0
            total_overtime_pay = 0.0
            total_late_minutes = 0
            total_undertime_minutes = 0
            total_late_deduction = 0.0
            total_undertime_deduction = 0.0
            total_deduction = 0.0

            for earning in employee_earnings:
                pay = earning["pay_details"]
                total_gross_pay += pay["gross_pay"]
                total_net_pay += pay["total_pay"]
                total_overtime_pay += pay["overtime_pay"]
                total_late_minutes += pay["late_minutes"]
                total_undertime_minutes += pay["undertime_minutes"]
                total_late_deduction += pay["deduction"]["late_deduction"]
                total_undertime_deduction += pay["deduction"]["undertime_deduction"]
                total_deduction += pay["deduction"]["total_deduction"]

            results.append({
                "employee_id": employee_id,
                "employee_name": employee_name,
                "total_gross_pay": round(total_gross_pay, 2),
                "total_net_pay": round(total_net_pay, 2),
                "total_overtime_pay": round(total_overtime_pay, 2),
                "total_late_hours": round(total_late_minutes / 60, 2),
                "total_undertime_hours": round(total_undertime_minutes / 60, 2),
                "total_late_deduction": round(total_late_deduction, 2),
                "total_undertime_deduction": round(total_undertime_deduction, 2),
                "total_deduction": round(total_deduction, 2),
            })

        return results
    
    @staticmethod
    def process_monthly_contribution(data):
        total_pay = []

        return total_pay



        
        
