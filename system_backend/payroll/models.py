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
    net_pay = models.CharField(max_length=100)
    gross_pay = models.CharField(max_length=100)
    total_late = models.CharField(max_length=50)
    total_undertime = models.CharField(max_length=50)
    total_overtime = models.CharField(max_length=50)
    total_deduction = models.CharField(max_length=50)


