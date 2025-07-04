from django.db import models
from employee.models import Employee

# Create your models here.
class Attendance(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="employee_attendance")
    date = models.DateField()
    time_in = models.TimeField()
    time_out = models.TimeField()
    total_hours_worked = models.CharField(max_length=10, default="8")
    late = models.CharField(max_length=10)
    undertime = models.CharField(max_length=10)
    overtime = models.CharField(max_length=10)
    holiday_types = models.JSONField(default=list, blank=True)
    is_rest_day = models.BooleanField(default=False)
    is_overtime = models.BooleanField(default=False)
    is_night_shift = models.BooleanField(default=False)

    status = models.CharField(max_length=50)

    def __str__(self):
        return str(self.date)
