from django.contrib import admin

from .models import CustomUser
from employee.models import Employee
from calendar_event.models import CalendarEvent , Leave, ShiftChangeRequest
from attendance.models import Attendance


# Register your models here.
admin.site.register(CustomUser)
admin.site.register(Employee)
admin.site.register(CalendarEvent)
admin.site.register(Leave)
admin.site.register(ShiftChangeRequest)
admin.site.register(Attendance)
