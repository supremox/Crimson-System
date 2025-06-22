from django.db import models
from employee.models import Employee

# Create your models here.
class CalendarEvent(models.Model):
    event_name = models.CharField(max_length=100)
    event_date = models.DateField()
    event_type = models.CharField(max_length=100)
    event_description = models.CharField(max_length=255)
    employees = models.ManyToManyField(Employee, related_name='calendar_events')

    def __str__(self):
        return self.event_name
    
class Leave(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='leaves')
    leave_start_date = models.DateField()
    leave_end_date = models.DateField()
    leave_type = models.CharField(max_length=100)
    leave_description = models.CharField(max_length=255)

    def __str__(self):
        return self.leave_type
        
class ShiftChangeRequest(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="shift_change_requests")
    shift_type = models.CharField(max_length=100)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    break_start = models.TimeField(null=True, blank=True)
    end_start = models.TimeField(null=True, blank=True)

    def __str__(self):
        return self.shift_type