from rest_framework import serializers
from .models import (
    Shift,
    Department,
    Position,
    Incentive,
    Work_days,
    OnCall_days,
    Employee
)
from user.models import CustomUser
from .models import Employee, Shift, Department, Position, Incentive, Work_days, OnCall_days


class ShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = '__all__'


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'


class PositionSerializer(serializers.ModelSerializer):
    department = serializers.CharField()  # Accept department name as input
    department_name = serializers.CharField(source='department.department_name', read_only=True)

    class Meta:
        model = Position
        fields = ['id', 'position_name', 'department_name']

    def create(self, validated_data):
        dept_name = validated_data.pop('department')

        try:
            department = Department.objects.get(department_name=dept_name)
        except Department.DoesNotExist:
            raise serializers.ValidationError({'department': f'Department "{dept_name}" does not exist.'})

        position = Position.objects.create(department=department, **validated_data)
        return position

class IncentiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incentive
        fields = '__all__'


class WorkDaysSerializer(serializers.ModelSerializer):
    class Meta:
        model = Work_days
        fields = '__all__'


class OnCallDaysSerializer(serializers.ModelSerializer):
    class Meta:
        model = OnCall_days
        fields = '__all__'


class EmployeeSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    middle_name = serializers.CharField(required=False, allow_blank=True, write_only=True)
    suffix = serializers.CharField(required=False, allow_blank=True, write_only=True)
    email = serializers.EmailField(write_only=True)

    # Handle many-to-many by accepting lists of IDs
    incentives = serializers.PrimaryKeyRelatedField(queryset=Incentive.objects.all(), many=True)
    work_days = serializers.PrimaryKeyRelatedField(queryset=Work_days.objects.all(), many=True)
    on_call_days = serializers.PrimaryKeyRelatedField(queryset=OnCall_days.objects.all(), many=True)

    class Meta:
        model = Employee
        fields = [
            'first_name', 'last_name', 'middle_name', 'suffix', 'email',
            'employee_id', 'date_of_birth', 'gender', 'civil_status',
            'phone_no', 'address', 'sss', 'pag_ibig', 'philhealth', 'tin',
            'start_date', 'salary', 'shift', 'department', 'position',
            'incentives', 'work_days', 'on_call_days', 'status'
        ]

    def create(self, validated_data):
        # Pop out user data
        user_data = {
            'first_name': validated_data.pop('first_name'),
            'last_name': validated_data.pop('last_name'),
            'middle_name': validated_data.pop('middle_name', ''),
            'suffix': validated_data.pop('suffix', ''),
            'email': validated_data.pop('email'),
        }

        # Pop out many-to-many fields
        incentives = validated_data.pop('incentives')
        work_days = validated_data.pop('work_days')
        on_call_days = validated_data.pop('on_call_days')

        # Create user
        user = CustomUser.objects.create(**user_data)

        # Create employee
        employee = Employee.objects.create(user=user, **validated_data)
        employee.incentives.set(incentives)
        employee.work_days.set(work_days)
        employee.on_call_days.set(on_call_days)

        return employee


