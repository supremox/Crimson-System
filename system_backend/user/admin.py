from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from django.urls import reverse

from mptt.admin import DraggableMPTTAdmin


# Models of All Apps
from .models import CustomUser, CustomPermission, Role
from employee.models import Employee, EmployeeYearlySchedule, Shift, TotalLeave, Department, Position, Incentive
from calendar_event.models import CalendarEvent , Leave, ShiftChangeRequest, Overtime
from attendance.models import Attendance
from payroll.models import SSSContribution, PagIbigContributionRule, PhilhealthContributionRule, WithholdingTaxBracket
from company.models import Company, Stamping

@admin.register(CustomPermission)
class CustomPermissionAdmin(admin.ModelAdmin):
    list_display = ('code', 'description')
    search_fields = ('code',)

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ('name',)
    filter_horizontal = ('permissions',)
    search_fields = ('name',)

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email', 'first_name', 'last_name', 'get_roles', 'get_permissions', 'company')
    list_filter = ('is_staff', 'is_active', 'company')  # Add company filter
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    filter_horizontal = ('roles', 'custom_permissions')

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'company')}),
        ('Roles & Permissions', {'fields': ('roles', 'custom_permissions')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login',)}),
    )

    readonly_fields = ('date_joined',)  # Add this lin

    def get_roles(self, obj):
        return ", ".join([role.name for role in obj.roles.all()])
    get_roles.short_description = "Roles"

    def get_permissions(self, obj):
        perms = list(obj.custom_permissions.values_list('code', flat=True))
        role_perms = list(CustomPermission.objects.filter(roles__in=obj.roles.all()).values_list('code', flat=True))
        all_perms = set(perms + role_perms)
        return ", ".join(all_perms)
    get_permissions.short_description = "Permissions"

    # Allow filtering by company
    def lookup_allowed(self, lookup, value):
        if lookup == 'company__id__exact':
            return True
        return super().lookup_allowed(lookup, value)


admin.site.register(CustomUser, CustomUserAdmin)

class EmployeeInline(admin.TabularInline):
    model = Employee
    extra = 0
    fields = ['employee_id', 'position', 'department', 'user']
    readonly_fields = ['user']

    def get_queryset(self, request):
        # This method ensures that we only fetch employees for the company
        qs = super().get_queryset(request)
        return qs.select_related('user')

class CustomUserInline(admin.StackedInline):
    model = CustomUser
    extra = 0  # No extra empty rows

class EmployeeYearlyScheduleInline(admin.TabularInline):
    model = EmployeeYearlySchedule
    extra = 0
    fields = ('year', 'month', 'date', 'type')
    readonly_fields = ('year', 'month', 'date', 'type')
    can_delete = False
    show_change_link = False

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = (
        'employee_id',
        'get_employee_name',
        'department',
        'position',
        'get_company_name',
        'get_user_email'
    )
    search_fields = (
        'employee_id',
        'department',
        'position',
        'user__email',
        'user__first_name',
        'user__last_name',
        'user__company__company_name'
    )
    list_filter = ('department', 'position', 'user__company')  # Add this line

    def get_employee_name(self, obj):
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}"
        return "-"
    get_employee_name.short_description = 'Employee Name'

    def get_company_name(self, obj):
        return obj.user.company.company_name if obj.user and obj.user.company else "-"
    get_company_name.short_description = 'Company Name'

    def get_user_email(self, obj):
        return obj.user.email if obj.user else "-"
    get_user_email.short_description = 'User Email'

@admin.register(Company)
class CompanyAdmin(DraggableMPTTAdmin):
    mptt_indent_field = "company_name"
    list_display = (
        'tree_actions',
        'indented_title',
        'company_code',
        'is_super_company',
        'date_created',
        'view_employees_link',
    )
    list_display_links = ('indented_title',)

    def view_users_link(self, obj):
        url = (
            reverse('admin:user_customuser_changelist')
            + f'?company__id__exact={obj.id}'
        )
        return format_html('<a href="{}">View Users</a>', url)
    view_users_link.short_description = 'Users'

    def view_employees_link(self, obj):
        url = (
            reverse('admin:employee_employee_changelist')
            + f'?user__company__id__exact={obj.id}'
        )
        return format_html('<a href="{}">View Employees</a>', url)

    view_employees_link.short_description = 'Employees'

# Register your models here.
admin.site.register(Stamping)
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
admin.site.register(Department)
admin.site.register(Position)
admin.site.register(Incentive)
