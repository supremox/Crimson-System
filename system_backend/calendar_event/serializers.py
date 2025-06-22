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

class LeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = '__all__'
        read_only_fields = ['employee']  # Prevent override from frontend

    def create(self, validated_data):
        request = self.context.get('request')
        employee = Employee.objects.get(user=request.user)
        leave = Leave.objects.create(employee=employee, **validated_data)
        return leave

class ShiftChangeRequestSerializer(serializers.ModelSerializer):
    employee_id = serializers.CharField(source='employee.employee_id', read_only=True)

    class Meta:
        model = ShiftChangeRequest
        fields = '__all__'
