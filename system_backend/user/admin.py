from django.contrib import admin

from .models import CustomUser
from employee.models import Employee

# Register your models here.
admin.site.register(CustomUser)
admin.site.register(Employee)