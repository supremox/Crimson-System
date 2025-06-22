from django.db import models
from employee.models import Employee

# Create your models here.
class Attendance(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="employee_attendance")
    date = models.DateField()
    time_in = models.TimeField()
    time_out = models.TimeField()
    late = models.CharField(max_length=10)
    undertime = models.CharField(max_length=10)
    overtime = models.CharField(max_length=10)
    status = models.CharField(max_length=50)

    def __str__(self):
        return self.date

