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
    class Leave_Status_Choices(models.TextChoices):
        PENDING = "Pending"
        APPROVE = "Approve"
        REJECTED = "Rejected"

    class Leave_Type_Choices(models.TextChoices):
        VACATION = "Vacation Leave"
        SICK = "Sick Leave"
        PATERNITY = "Paternity Leave"
        MATERNITY = "Maternity Leave"

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='leaves')
    leave_start_date = models.DateField()
    leave_end_date = models.DateField()
    leave_type = models.CharField(max_length=100, choices=Leave_Type_Choices)
    leave_description = models.CharField(max_length=255)
    leave_status = models.CharField(max_length=100, choices=Leave_Status_Choices, default=Leave_Status_Choices.PENDING)

    def __str__(self):
        return self.leave_type
        
class ShiftChangeRequest(models.Model):
    class Shift_Type_Choices(models.TextChoices):
        HALFDAY    = "Halfday"
        TEMP_SHIFT = "Temporary Shift"

    class Shift_Status_Choices(models.TextChoices):
        PENDING = "Pending"
        APPROVE = "Approve"
        REJECTED = "Rejected"

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="shift_change_requests")
    shift_type = models.CharField(max_length=100, choices=Shift_Type_Choices)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    break_start = models.TimeField(null=True, blank=True)
    break_end = models.TimeField(null=True, blank=True)
    shift_status = models.CharField(max_length=100, choices=Shift_Status_Choices, default=Shift_Status_Choices.PENDING)

    def __str__(self):
        return self.shift_type
    
class Overtime(models.Model):
    class Overtime_Status_Choices(models.TextChoices):
        PENDING = "Pending"
        APPROVE = "Approve"
        REJECTED = "Rejected"

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='overtime')
    overtime_start_time = models.TimeField()
    overtime_end_time = models.TimeField()
    overtime_description = models.CharField(max_length=255)
    overtime_status = models.CharField(max_length=100, choices=Overtime_Status_Choices, default=Overtime_Status_Choices.PENDING)

    def __str__(self):
        return self.leave_type
