from rest_framework import serializers
from .models import (
    CalendarEvent,
    Leave,
    ShiftChangeRequest
)
from employee.models import Employee

class CalendarEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarEvent
        fields = '__all__'
        read_only_fields = ['employees']

    def create(self, validated_data):
        event = CalendarEvent.objects.create(**validated_data)
        all_employees = Employee.objects.all()
        event.employees.set(all_employees)  # Link to all employees
        return event
    
class LeaveListSerializer(serializers.ModelSerializer):
    employee_id = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    department = serializers.SerializerMethodField()
    position = serializers.SerializerMethodField()

    class Meta:
        model = Leave
        fields = [
            'id',
            'employee_id',
            'name',
            'avatar',
            'department',
            'position',
            'leave_type',
            'leave_start_date',
            'leave_end_date',
            'leave_description',
            'leave_status',
        ]

    def get_employee_id(self, obj):
        return obj.employee.employee_id if obj.employee else None

    def get_name(self, obj):
        return f"{obj.employee.user.first_name} {obj.employee.user.last_name}" if obj.employee and obj.employee.user else None

    def get_avatar(self, obj):
        if obj.employee and obj.employee.avatar:
            return obj.employee.avatar.url
        return None
    
    def get_department(self, obj):
        return obj.employee.department.department_name if obj.employee and obj.employee.department else None

    def get_position(self, obj):
        return obj.employee.position.position_name if obj.employee and obj.employee.position else None

class LeaveStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = ['leave_status']

    def validate_leave_status(self, value):
        if value not in ['Approve', 'Rejected']:
            raise serializers.ValidationError("Invalid leave status.")
        return value

class LeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = '__all__'
        read_only_fields = ['employee']  

    def create(self, validated_data):
        request = self.context.get('request')
        try:
            employee = Employee.objects.get(user=request.user)
        except Employee.DoesNotExist:
            raise serializers.ValidationError("No Employee record found for this user.")
        leave = Leave.objects.create(employee=employee, **validated_data)
        return leave
    

class ShiftChangeListSerializer(serializers.ModelSerializer):
    employee_id = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    department = serializers.SerializerMethodField()
    position = serializers.SerializerMethodField()

    class Meta:
        model = ShiftChangeRequest
        fields = [
            'id',
            'employee_id',
            'name',
            'avatar',
            'department',
            'position',
            'shift_type',
            'date',
            'start_time',
            'end_time',
            'break_start',
            'break_end',
            'shift_status',
        ]

    def get_employee_id(self, obj):
        return obj.employee.employee_id if obj.employee else None

    def get_name(self, obj):
        return f"{obj.employee.user.first_name} {obj.employee.user.last_name}" if obj.employee and obj.employee.user else None

    def get_avatar(self, obj):
        if obj.employee and obj.employee.avatar:
            return obj.employee.avatar.url
        return None
    
    def get_department(self, obj):
        return obj.employee.department.department_name if obj.employee and obj.employee.department else None

    def get_position(self, obj):
        return obj.employee.position.position_name if obj.employee and obj.employee.position else None

class LeaveStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShiftChangeRequest
        fields = ['shift_status']

    def validate_leave_status(self, value):
        if value not in ['Approve', 'Rejected']:
            raise serializers.ValidationError("Invalid Shift status.")
        return value

class ShiftChangeRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShiftChangeRequest
        fields = '__all__'
        read_only_fields = ['employee']

    def create(self, validated_data):
        request = self.context.get('request')
        try:
            employee = Employee.objects.get(user=request.user)
        except Employee.DoesNotExist:
            raise serializers.ValidationError("No Employee record found for this user.")
        shift_change = ShiftChangeRequest.objects.create(employee=employee, **validated_data)
        return shift_change  
