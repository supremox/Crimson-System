from decimal import Decimal
from rest_framework import generics, views, status
from rest_framework.response import Response

from .serializers import (
    PayrollGenerateSerializer, 
    ComputePaySerializer,  
    SSSContributionListSerializer, 
    SSSCreateContributionSerializer,
    PagibigContributionListSerializer,
    PagibigCreateContributionSerializer,
    PhilhealthContributionListSerializer,
    PhilhealthCreateContributionSerializer,
    TaxContributionListSerializer,
    TaxCreateContributionSerializer
)
from .models import SSSContribution, PagIbigContributionRule, PhilhealthContributionRule, WithholdingTaxBracket

from attendance.models import Attendance
from attendance.serializers import AttendanceSerializer 
from calendar_event.models import CalendarEvent, Overtime
from employee.models import Employee, EmployeeYearlySchedule
from payroll.utils import PayCalculator

from typing import TypedDict
import datetime as dt

# =====================  SSS Views ========================= 

class SSSContributionCreateView(generics.CreateAPIView):
    serializer_class = SSSCreateContributionSerializer

    def perform_create(self, serializer):
        company = self.request.user.company
        serializer.save(company=company)

    def create(self, request, *args, **kwargs):
        print("Incoming SSS Contribution Data:", request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class SSSContributionListView(generics.ListAPIView):
    serializer_class = SSSContributionListSerializer

    def get_queryset(self):
        company = self.request.user.company
        return SSSContribution.objects.filter(company=company)

# =====================  Pagibig Views ========================= 

class PagibigContributionListView(generics.ListAPIView):
    serializer_class = PagibigContributionListSerializer

    def get_queryset(self):
        company = self.request.user.company
        return PagIbigContributionRule.objects.filter(company=company)

class PagibigContributionCreateView(generics.CreateAPIView):
    serializer_class = PagibigCreateContributionSerializer

    def perform_create(self, serializer):
        company = self.request.user.company
        serializer.save(company=company)
   
    def create(self, request, *args, **kwargs):
        print("Incoming Pagibig Contribution Data:", request.data)
        # Proceed with default behavior (validation + saving)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # headers = self.get_success_headers(serializer.data)
        return Response(status=status.HTTP_201_CREATED)
    
# =====================  Philhealth Views ========================= 

class PhilhealthContributionListView(generics.ListAPIView):
    serializer_class = PhilhealthContributionListSerializer

    def get_queryset(self):
        company = self.request.user.company
        return PhilhealthContributionRule.objects.filter(company=company)

class PhilhealthContributionCreateView(generics.CreateAPIView):
    serializer_class = PhilhealthCreateContributionSerializer

    def perform_create(self, serializer):
        company = self.request.user.company
        serializer.save(company=company)

    def create(self, request, *args, **kwargs):
        print("Incoming Philhealth Contribution Data:", request.data)

        # Proceed with default behavior (validation + saving)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # headers = self.get_success_headers(serializer.data)
        return Response(status=status.HTTP_201_CREATED)
    
# =====================  Bir Tax Views ========================= 

class TaxContributionListView(generics.ListAPIView):
    serializer_class = TaxContributionListSerializer

    def get_queryset(self):
        company = self.request.user.company
        return WithholdingTaxBracket.objects.filter(company=company)

class TaxContributionCreateView(generics.CreateAPIView):
    serializer_class = TaxCreateContributionSerializer

    def perform_create(self, serializer):
        company = self.request.user.company
        serializer.save(company=company)

    def create(self, request, *args, **kwargs):
        print("Incoming Bir Tax Contribution Data:", request.data)

        # Proceed with default behavior (validation + saving)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # headers = self.get_success_headers(serializer.data)
        return Response(status=status.HTTP_201_CREATED)
    
# =====================  Payroll Generation Views ========================= 

class PayrollGenerateAPIView(views.APIView):
    def post(self, request, *args, **kwargs):
        start_date     = request.data.get("start_date")
        end_date       = request.data.get("end_date")
        deduction_type = request.data.get("deduction_option")
        payroll_type   = request.data.get("first_cut_off")
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
                    'employee_id'   : emp_id,
                    'employee_name' : record['employee_name'],
                    'basic_salary'  : record['salary'],
                    'payroll_type'  : payroll_type,
                    'payroll_deduction_type': deduction_type,
                    'start_date': start_date,
                    'end_date': end_date,
                    'earnings'      : []
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
                'pay_details': pay_result,  
            })

             
        # pay_summary = self.process_earnings(employees)
        # print(pay_summary)
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
            employee_basic_salary = employee_record["basic_salary"]
            employee_earnings = employee_record["earnings"]

            payroll_type = employee_record["payroll_type"]
            payroll_start_date = employee_record["payroll_start_date"]
            payroll_end_date = employee_record["payroll_end_date"]
            payroll_deduction_type = employee_record["payroll_deduction_type"]

            
            total_gross_pay = 0.0
            total_net_pay = 0.0
            total_overtime_pay = 0.0
            total_late_minutes = 0
            total_undertime_minutes = 0
            total_late_deduction = 0.0
            total_undertime_deduction = 0.0
            total_deduction = 0.0
            taxable_pay = 0.0

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


            if payroll_type == "first_cut_off":
                taxable_pay = total_net

            if payroll_type == "second_cut_off":
                taxable_pay = total_net


            # Handles When will be the Contribution Dedudction happens 
            contribution_deduction = PayrollGenerateAPIView.handles_contribution_deduction(payroll_deduction_type, payroll_type,  )


            sss = contribution_deduction['sss']
            pagibig = contribution_deduction['pagibig']
            philhealth = contribution_deduction['philhealth']

            total_net = total_net_pay - sss - pagibig - philhealth

            # taxable_pay = total_net 

            tax = PayrollGenerateAPIView.compute_tax("monthly", taxable_pay)

       
       
            print(f"SSS Deduction.........: {sss}")
            print(f"Pagibig Deduction.....: {pagibig}")
            print(f"Philhealth Deduction..: {philhealth}")
            print(f"Tax Deduction.........: {tax}")

            total_deduction = total_deduction + sss + pagibig + philhealth + tax

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
                "total_sss_deduction": sss,
                "total_pagibig_deduction": pagibig,
                "total_philhealth_deduction": philhealth,
                "total_tax_deduction": tax,
                "total_deduction": round(total_deduction, 2),
            })

        return results
    


    @staticmethod
    def handles_contribution_deduction(deduction_option, current_salary_generated, past_salary_generated):
        
        """
        Computes the  employee contribution based on the given salary, 
        the given salary can be the employee's basic pay

        Args:
            salary (Decimal or float): The employee's monthly salary.

        Returns:
            Decimal: The employee's contribution's for the given salary.
                    Returns 0.00 if no matching salary range is found in the database.

        """

        salary = Decimal(current_salary_generated + past_salary_generated)

        sss = Decimal('0.00')
        pagibig = Decimal('0.00')
        philhealth = Decimal('0.00')

        if deduction_option == 'Per Cut-Off':
            sss = PayrollGenerateAPIView.compute_sss_contribution(salary) / 2
            pagibig = PayrollGenerateAPIView.compute_pagibig_contribution(salary) / 2
            philhealth = PayrollGenerateAPIView.compute_philhealth_contribution(salary) / 2
      
            return {
                "sss": sss,
                "pagibig": pagibig,
                "philhealth": philhealth
            }
        
        if deduction_option == 'Second Cut-Off':
            sss = PayrollGenerateAPIView.compute_sss_contribution(salary) 
            pagibig = PayrollGenerateAPIView.compute_pagibig_contribution(salary) 
            philhealth = PayrollGenerateAPIView.compute_philhealth_contribution(salary) 
      
            return {
                "sss": sss,
                "pagibig": pagibig,
                "philhealth": philhealth
            }
        
        print(f"{deduction_option} for the Payroll Generated")
        return {
                "sss": sss,
                "pagibig": pagibig,
                "philhealth": philhealth
            }
    
    @staticmethod
    def compute_sss_contribution(salary):
        """
        Computes the SSS employee contribution based on the given salary by querying
        the SSSContribution model in a Django application.

        Args:
            salary (Decimal or float): The employee's monthly salary.

        Returns:
            Decimal: The employee's total SSS contribution for the given salary.
                    Returns 0.00 if no matching salary range is found in the database.
        """
        # Ensure salary is a Decimal for accurate comparison with DecimalFields
        salary = Decimal(str(salary))

        sss_contribution = Decimal('0.00')

        try:
            # Query the SSSContribution model to find the rule where the salary falls
            # within the compensation_from and compensation_to range.
            # .first() will return the first matching object or None if no match is found.
            sss_rule = SSSContribution.objects.filter(
                compensation_from__lte=salary,  # compensation_from is less than or equal to salary
                compensation_to__gte=salary     # compensation_to is greater than or equal to salary
            ).first()

            if sss_rule:
                # If a matching rule is found, get the employee_total
                sss_contribution = sss_rule.employee_total
            else:
                # Optional: Log a warning or handle cases where no rule matches
                print(f"Warning: No SSS contribution rule found for salary ₱{salary}")

        except Exception as e:
            # Handle potential database errors or other exceptions
            print(f"Error computing SSS contribution: {e}")
            sss_contribution = Decimal('0.00') # Default to 0 on error

        return sss_contribution
    
    @staticmethod
    def compute_pagibig_contribution(salary):
        """
        Computes the Pag-IBIG employee and employer contributions based on the given salary,
        querying the PagIbigContributionRule model.

        Args:
            salary (Decimal or float): The employee's monthly salary.

        Returns:
                "employee_share": The employee's rounded Pag-IBIG contribution.
                Returns all zeros if no matching rule is found or an error occurs.
        """
        # Ensure salary is a Decimal for accurate comparison and calculation
        salary = Decimal(str(salary))

        highest_salary = PagIbigContributionRule.objects.all().values_list('min_salary', 'max_salary')

        # Flatten the tuples and get the max
        MAXIMUM_PAGIBIG_FUND_SALARY = max(max(min_salary, max_salary) for min_salary, max_salary in highest_salary)
        employee_contribution = Decimal('0.00')
        employer_contribution = Decimal('0.00')

        try:
            # 1. Determine the applicable monthly compensation for contribution          
            # This caps the salary at MAXIMUM_PAGIBIG_FUND_SALARY for contribution purposes.
            applicable_salary = min(salary, MAXIMUM_PAGIBIG_FUND_SALARY)
        
            # 2. Find the correct Pag-IBIG contribution rule based on the *actual* salary
            # The rates depend on the actual salary bracket, not the capped one.
            pagibig_rule = PagIbigContributionRule.objects.filter(
                min_salary__lte=salary,  # min_salary is less than or equal to actual salary
                max_salary__gte=salary   # max_salary is greater than or equal to actual salary
            ).first()

            if pagibig_rule:
                # 3. Get the rates from the found rule
                employee_rate = pagibig_rule.employee_rate
                employer_rate = pagibig_rule.employer_rate

                # 4. Calculate contributions using the applicable_salary and rates
                employee_contribution = applicable_salary * employee_rate
                employer_contribution = applicable_salary * employer_rate

            if salary > MAXIMUM_PAGIBIG_FUND_SALARY:
                pagibig_rule = PagIbigContributionRule.objects.order_by('-max_salary').first()
                employee_rate = pagibig_rule.employee_rate
                employee_contribution = applicable_salary * employee_rate 


        except Exception as e:
            print(f"Error computing Pag-IBIG contribution for salary ₱{salary}: {e}")
            # Contributions remain 0.00 as initialized

        employee_share = round(employee_contribution, 2)
        return employee_share
     
    @staticmethod
    def compute_philhealth_contribution(salary):
        """
        Computes the Philhealth employee and employer contributions based on the given salary,
        querying the PhilhealthContributionRule model.

        Args:
            salary (Decimal or float): The employee's monthly salary.

        Returns:
                "employee_share": The employee's rounded Philhealth contribution.
                Returns all zeros if no matching rule is found or an error occurs.
        """
        # Ensure salary is a Decimal for accurate comparison and calculation
        salary = Decimal(str(salary))

        salary_ceiling = PhilhealthContributionRule.objects.all().values_list('salary_floor', 'salary_ceiling')
        
        MAXIMUM_PHILHEALTH_FUND_SALARY = max(max(min_salary, max_salary) for min_salary, max_salary in salary_ceiling)
        MINIMUM_PHILHEALTH_FUND_SALARY = min(min(min_salary, max_salary) for min_salary, max_salary in salary_ceiling)
        
        employee_contribution = Decimal('0.00')
        employer_contribution = Decimal('0.00')
        # Clamp salary between floor and ceiling
        applied_salary = min(salary, MAXIMUM_PHILHEALTH_FUND_SALARY)

        philhealth_rule = PhilhealthContributionRule.objects.filter(
                salary_floor__lte=salary,  # min_salary is less than or equal to actual salary
                salary_ceiling__gte=salary   # max_salary is greater than or equal to actual salary
            ).first()
        
        if philhealth_rule:
                # 3. Get the rates from the found rule
                employee_rate = philhealth_rule.employee_rate
        
                # 4. Calculate contributions using the applicable_salary and rates
                employee_contribution = applied_salary * employee_rate

        if salary > MAXIMUM_PHILHEALTH_FUND_SALARY:
                philhealth_rule = PhilhealthContributionRule.objects.order_by('-salary_ceiling').first()
                employee_rate = philhealth_rule.employee_rate
                employee_contribution = applied_salary * employee_rate 

        if salary < MINIMUM_PHILHEALTH_FUND_SALARY:
                philhealth_rule = PhilhealthContributionRule.objects.order_by('-salary_ceiling').first()
                employee_rate = philhealth_rule.employee_rate
                employee_contribution = MINIMUM_PHILHEALTH_FUND_SALARY * employee_rate 

        employee_share = round(employee_contribution, 2)
        return employee_share
    
    @staticmethod
    def compute_tax(frequency, salary):
        """
        Computes the Withholding Tax of employee based on the given salary,
        querying the WithholdingTaxBracket  model.

        Args:
            salary (Decimal or float): The employee's monthly salary.

        Returns:
                "employee_share": The employee's rounded Withholding Tax .
                Returns all zeros if no matching rule is found or an error occurs.
        """

        salary = Decimal(str(salary))
         # Try to find exact bracket where salary falls
        tax_rule = (
            WithholdingTaxBracket.objects.filter(
                frequency=frequency,
                min_compensation__lte=salary,
                max_compensation__gte=salary
            )
            .values_list("base_tax", "percentage_over", "excess_over")
            .first()
        )

        if not tax_rule:
            # Salary exceeds the highest range → get last bracket
            tax_rule = (
                WithholdingTaxBracket.objects.filter(frequency=frequency)
                .order_by("-min_compensation")
                .values_list("base_tax", "percentage_over", "excess_over")
                .first()
            )
            base_tax, percentage_over, excess_over = tax_rule
            print(f"Base Tax: {base_tax}, Percentage: {percentage_over}, Excess: {excess_over}")

        base_tax, percentage_over, excess_over = tax_rule
        tax = base_tax + (percentage_over * (salary - excess_over))

        return tax



        
        
