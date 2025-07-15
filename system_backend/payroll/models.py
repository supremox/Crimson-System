from django.db import models
from employee.models import Employee
from attendance.models import Attendance

# Create your models here.
class PayrollGenerate(models.Model):
    class Payroll_Status_Choices(models.TextChoices):
        PENDING = "Pending"
        APPROVE = "Approve"
        REJECTED = "Rejected"

    start_date = models.DateField()
    end_date = models.DateField()
    attendance_record = models.ForeignKey(Attendance, on_delete=models.CASCADE)
    total_payroll_amount = models.CharField(max_length=255)
    generated_by = models.ForeignKey(Employee, on_delete=models.CASCADE)
    payroll_status = models.CharField(max_length=50, choices=Payroll_Status_Choices)


class ComputePay(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    total_net_pay = models.CharField(max_length=100)
    total_gross_pay = models.CharField(max_length=100)
    total_overtime_pay = models.CharField(max_length=50, default="0")
    total_late = models.CharField(max_length=50)
    total_undertime = models.CharField(max_length=50)
    total_overtime = models.CharField(max_length=50)
    total_late_deduction = models.CharField(max_length=50, default="0")
    total_undertime_deduction = models.CharField(max_length=50, default="0")
    total_deduction = models.CharField(max_length=50)

class SSSContribution(models.Model):
    compensation_from = models.DecimalField(max_digits=10, decimal_places=2)
    compensation_to = models.DecimalField(max_digits=10, decimal_places=2)

    # Monthly Salary Credit
    regular_ss_credit = models.DecimalField(max_digits=10, decimal_places=2,  null=True, blank=True)
    ec_credit = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    mpf_credit = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    total_credit = models.DecimalField(max_digits=10, decimal_places=2)

    # Employer Contribution
    employer_regular_ss = models.DecimalField(max_digits=10, decimal_places=2,  null=True, blank=True)
    employer_mpf = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    employer_ec = models.DecimalField(max_digits=10, decimal_places=2,  null=True, blank=True)
    employer_total = models.DecimalField(max_digits=10, decimal_places=2)

    # Employee Contribution
    employee_regular_ss = models.DecimalField(max_digits=10, decimal_places=2,  null=True, blank=True)
    employee_mpf = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    employee_total = models.DecimalField(max_digits=10, decimal_places=2)

    # Grand Total
    overall_total = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = "SSS Contribution"
        verbose_name_plural = "SSS Contributions"

    def __str__(self):
        return f"₱{self.compensation_from} - ₱{self.compensation_to}"
    
    
class PagIbigContributionRule(models.Model):
    min_salary = models.DecimalField(max_digits=10, decimal_places=2)  # inclusive
    max_salary = models.DecimalField(max_digits=10, decimal_places=2)  # inclusive
    employee_rate = models.DecimalField(max_digits=4, decimal_places=2, help_text="Percentage rate (e.g. 1.00 or 2.00)")
    employer_rate = models.DecimalField(max_digits=4, decimal_places=2, help_text="Percentage rate (e.g. 2.00)")

    def __str__(self):
        return f"{self.min_salary} - {self.max_salary}: E {self.employee_rate}%, ER {self.employer_rate}%"
    
class PhilhealthContributionRule(models.Model):
    employee_rate = models.DecimalField(max_digits=4, decimal_places=3, help_text="Percentage rate (e.g. 1.00 or 2.00)")
    employer_rate = models.DecimalField(max_digits=4, decimal_places=3, help_text="Percentage rate (e.g. 2.00)")
    premium_rate = models.DecimalField(
        max_digits=4, decimal_places=2, default=5.00,
        help_text="Total premium rate (employer + employee)"
    )
    salary_floor = models.DecimalField(
        max_digits=10, decimal_places=2, default=10000.00,
        help_text="Minimum salary used for premium calculation"
    )
    salary_ceiling = models.DecimalField(
        max_digits=10, decimal_places=2, default=100000.00,
        help_text="Maximum salary used for premium calculation"
    )

    def __str__(self):
        return f"PhilHealth Rate {self.premium_rate}% ({self.salary_floor} - {self.salary_ceiling})"

class WithholdingTaxBracket(models.Model):
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('semi-monthly', 'Semi-Monthly'),
        ('monthly', 'Monthly'),
    ]

    frequency = models.CharField(max_length=15, choices=FREQUENCY_CHOICES)
    min_compensation = models.DecimalField(max_digits=12, decimal_places=2)
    max_compensation = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)  # Null if no upper limit
    base_tax = models.DecimalField(max_digits=12, decimal_places=2)
    percentage_over = models.DecimalField(max_digits=5, decimal_places=2)
    excess_over = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        ordering = ['frequency', 'min_compensation']

    def __str__(self):
        max_display = f"{self.max_compensation}" if self.max_compensation else "above"
        return f"{self.frequency.title()} - ₱{self.min_compensation} to ₱{max_display}"

 