from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()

class Shift(models.Model):
    shift_name = models.CharField(max_length=100)
    start_time = models.TimeField()
    end_time = models.TimeField()
    break_start = models.TimeField()
    break_end = models.TimeField()

    def __str__(self):
        return self.shift_name
        
class Department(models.Model):
    department_name = models.CharField(max_length=100,  unique=True)

    def __str__(self):
        return self.department_name
    
class Position(models.Model):
    position_name = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='positions')

    def __str__(self):
        return self.position_name
    
class Incentive(models.Model):
    incentive_name = models.CharField(max_length=100)
    incentive_amount = models.CharField(max_length=100)

    def __str__(self):
        return self.incentive_name
    
class DayOfWeek(models.Model):
    class Day_choices(models.TextChoices):
        MONDAY    = ('mon', 'Monday')
        TUESDAY   = ('tue', 'Tuesday')
        WEDNESDAY = ('wed', 'Wednesday')
        THURSDAY  = ('thu', 'Thursday')
        FRIDAY    = ('fri', 'Friday')
        SATURDAY  = ('sat', 'Saturday')
        SUNDAY    = ('sun', 'Sunday')

    day = models.CharField(max_length=3, choices=Day_choices, unique=True)

    def __str__(self):
        return self.get_day_display()


    
# Create your models here.
class Employee(models.Model):
    avatar = models.ImageField(
        upload_to='avatar/',
        null=True,
        blank=True,
        default='avatar/default_avatar.png'  
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee')
    employee_id = models.CharField(unique=True, max_length=10)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=100)
    civil_status = models.CharField(max_length=100)
    educational_attainment = models.CharField(max_length=100, null=True, blank=True)
    phone_no = models.CharField(unique=True, max_length=11)
    address = models.CharField(max_length=255)

    #Government ID
    sss = models.CharField(unique=True, max_length=100)
    pag_ibig = models.CharField(unique=True, max_length=100)
    philhealth = models.CharField(unique=True, max_length=100)
    tin = models.CharField(unique=True, max_length=100)

    # Work Information
    start_date = models.DateField()
    salary = models.CharField(max_length=100)
    shift = models.ForeignKey(Shift, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='employee_department')
    position = models.ForeignKey(Position, on_delete=models.CASCADE, related_name='employee_position')
    incentives = models.ManyToManyField(Incentive, related_name='employee_incentives', blank=True)
    work_days = models.ManyToManyField(DayOfWeek, related_name='employees_working')
    on_call_days = models.ManyToManyField(DayOfWeek, related_name='employees_on_call')
    total_working_days = models.CharField(max_length=100, default="22")
    total_duty_hrs = models.CharField(max_length=100, default="8")
    career_status = models.CharField(max_length=50)

    def __str__(self):
        return self.employee_id
    
class EmployeeYearlySchedule(models.Model):
    class Work_Choices(models.TextChoices):
        WORK    = ('work', 'Work Days')
        ON_CALL   = ('on_call', 'On Call Days')
        REST = ('rest', 'Rest Day')

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='yearly_schedules')
    year = models.IntegerField()
    month = models.IntegerField()
    date = models.DateField()
    type = models.CharField(max_length=10, choices=Work_Choices)

    class Meta:
        unique_together = ('employee', 'date')
        ordering = ['date']
    
class TotalLeave(models.Model):
    vacation_leave = models.IntegerField(default=10)
    sick_leave = models.IntegerField(default=10)

    @property
    def total_leave(self):
        return self.vacation_leave + self.sick_leave

    def __str__(self):
        return str(self.total_leave)