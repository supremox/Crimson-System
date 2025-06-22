from django.db import models
from user.models import CustomUser

class Shift(models.Model):
    shift_name = models.CharField(max_length=100)
    start_time = models.TimeField()
    end_time = models.TimeField()
    break_start = models.TimeField()
    end_start = models.TimeField()

    def __str__(self):
        return self.shift_name
        
class Department(models.Model):
    department_name = models.CharField(max_length=100)

    def __str__(self):
        return self.department_name
    
class Position(models.Model):
    position_name = models.CharField(max_length=100)
    department = models.ForeignKey('Department', on_delete=models.CASCADE, related_name='positions')

    def __str__(self):
        return self.position_name
    
class Incentive(models.Model):
    incentive_name = models.CharField(max_length=100)
    incentive_amount = models.CharField(max_length=100)

    def __str__(self):
        return self.incentive_name
    
class Work_days(models.Model):
    monday = models.BooleanField(default=True)
    tuesday = models.BooleanField(default=True)
    wednesday = models.BooleanField(default=True)
    thursday = models.BooleanField(default=True)
    friday = models.BooleanField(default=True)
    saturday = models.BooleanField(default=False)
    sunday = models.BooleanField(default=False)

class OnCall_days(models.Model):
    monday = models.BooleanField(default=False)
    tuesday = models.BooleanField(default=False)
    wednesday = models.BooleanField(default=False)
    thursday = models.BooleanField(default=False)
    friday = models.BooleanField(default=False)
    saturday = models.BooleanField(default=True)
    sunday = models.BooleanField(default=False)


# Create your models here.
class Employee(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    employee_id = models.CharField(unique=True, max_length=10)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=100)
    civil_status = models.CharField(max_length=100)
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
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    position = models.ForeignKey(Position, on_delete=models.CASCADE)
    incentives = models.ManyToManyField(Incentive)
    work_days = models.ManyToManyField(Work_days)
    on_call_days = models.ManyToManyField(OnCall_days)
    status = models.CharField(max_length=50)

    def __str__(self):
        return self.employee_id
    
