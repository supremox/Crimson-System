from django.contrib import admin

from .models import CustomUser
from employee.models import Employee, EmployeeYearlySchedule, Shift, TotalLeave
from calendar_event.models import CalendarEvent , Leave, ShiftChangeRequest, Overtime
from attendance.models import Attendance
from payroll.models import SSSContribution, PagIbigContributionRule, PhilhealthContributionRule, WithholdingTaxBracket

class EmployeeYearlyScheduleInline(admin.TabularInline):
    model = EmployeeYearlySchedule
    extra = 0
    fields = ('year', 'month', 'date', 'type')
    readonly_fields = ('year', 'month', 'date', 'type')
    can_delete = False
    show_change_link = False

# Custom Employee admin
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('employee_id', 'get_name', 'department', 'position')
    inlines = [EmployeeYearlyScheduleInline]

    def get_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
    get_name.short_description = 'Name'


# Register your models here.
admin.site.register(CustomUser)
admin.site.register(Employee, EmployeeAdmin)
admin.site.register(CalendarEvent)
admin.site.register(Leave)
admin.site.register(ShiftChangeRequest)
admin.site.register(Shift)
admin.site.register(Attendance)
admin.site.register(Overtime)
admin.site.register(TotalLeave)
admin.site.register(WithholdingTaxBracket)
admin.site.register(SSSContribution)
admin.site.register(PagIbigContributionRule)
admin.site.register(PhilhealthContributionRule)

