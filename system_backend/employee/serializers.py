from django.contrib.auth import get_user_model

from rest_framework import serializers
from .models import (
    Shift,
    Department,
    Position,
    Incentive,
    DayOfWeek,
    Employee,
    TotalLeave
)
from user.models import CustomUser

from employee.utils import generate_day_schedule
from datetime import date
from .utils import generate_and_store_yearly_schedule

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'middle_name', 'suffix', 'email']

class ShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = '__all__'


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'


class PositionSerializer(serializers.ModelSerializer):
    department = serializers.CharField() 
    department_name = serializers.CharField(source='department.department_name', read_only=True)

    class Meta:
        model = Position
        fields = ['id', 'position_name', 'department', 'department_name']

    def create(self, validated_data):
        print(f"Data: {validated_data}")
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
        fields = ['id', 'incentive_name', 'incentive_amount']

class TotalLeaveSerializer(serializers.ModelSerializer):
    total_leave = serializers.SerializerMethodField()

    class Meta:
        model = TotalLeave
        fields = ['id', 'vacation_leave', 'sick_leave', 'total_leave']

    def get_total_leave(self, obj):
        return obj.total_leave
    

class WorkingDaySerializer(serializers.ModelSerializer):
    day_display = serializers.SerializerMethodField()
    class Meta:
        model = DayOfWeek
        fields = ['id', 'day', 'day_display']

    def get_day_display(self, obj):
        return obj.get_day_display()
    
class EmployeeUserSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')

    class Meta:
        model = Employee
        fields = [
            'avatar',
            'employee_id',
            'first_name',
            'last_name',
            'position',
        ]

class EmployeeSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    middle_name = serializers.CharField(source='user.middle_name', required=False, allow_blank=True)
    suffix = serializers.CharField(source='user.suffix', required=False, allow_blank=True)
    email = serializers.EmailField(source='user.email')
    
    incentives_id = serializers.PrimaryKeyRelatedField(queryset=Incentive.objects.all(), write_only=True, source='incentives', many=True, required=False)
    
    work_days = serializers.ListField(
        child=serializers.ChoiceField(choices=DayOfWeek.Day_choices),
        write_only=True
    )

    on_call_days = serializers.ListField(
        child=serializers.ChoiceField(choices=DayOfWeek.Day_choices),
        write_only=True
    )

    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), write_only=True, source='department'
    )
    position_id = serializers.PrimaryKeyRelatedField(
        queryset=Position.objects.all(), write_only=True, source='position'
    )

    shift_id = serializers.PrimaryKeyRelatedField(
        queryset=Shift.objects.all(), write_only=True, source='shift'
    )

    shift = ShiftSerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)
    position = PositionSerializer(read_only=True)
    working_days_display = WorkingDaySerializer(source='work_days', many=True, read_only=True)
    on_call_days_display = WorkingDaySerializer(source='on_call_days', many=True, read_only=True)
    incentives = IncentiveSerializer(many=True, read_only=True)

    yearly_schedule = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = [
            'id', 
            'first_name', 'last_name', 'middle_name', 'suffix', 'email',
            'employee_id', 
            'date_of_birth', 
            'gender', 'civil_status', 
            'educational_attainment',
            'phone_no', 
            'address', 
            'sss', 
            'pag_ibig', 
            'philhealth', 
            'tin',
            'start_date', 
            'salary', 
            'shift', 'shift_id',
            'department', 'department_id',
            'position', 'position_id',
            'incentives', 'incentives_id',
            'work_days', 'on_call_days',
            'total_working_days', 'total_duty_hrs',
            'working_days_display', 'on_call_days_display', 'yearly_schedule',
            'career_status'
        ]

    def get_yearly_schedule(self, obj):
        year = date.today().year
        work_days = list(obj.work_days.values_list('day', flat=True))
        on_call_days = list(obj.on_call_days.values_list('day', flat=True))
        yearly = {}
        for month in range(1, 13):
            yearly[f"{year}-{month:02d}"] = generate_day_schedule(year, month, work_days, on_call_days)

        return yearly

    def create(self, validated_data):
        print(f"Validated_Data: {validated_data}")
        user_pop = validated_data.pop('user')     
        user_data = {
            "first_name" : user_pop.pop('first_name'),
            "last_name"  : user_pop.pop("last_name"),
            "middle_name": user_pop.pop('middle_name', ""), 
            "suffix"     : user_pop.pop('suffix', ""), 
            "email"      : user_pop.pop('email'), 

        }
        working_day_codes = validated_data.pop('work_days', [])
        on_call_day_codes = validated_data.pop('on_call_days', [])
        incentives = validated_data.pop('incentives', [])

        government_ids = {
            "sss"       : validated_data.pop('sss'),
            "pag_ibig"  : validated_data.pop('pag_ibig'),
            "philhealth": validated_data.pop('philhealth'), 
            "tin"       : validated_data.pop('tin'), 
        }

        for id_name, id_number in government_ids.items():
            filter_kwargs = {id_name: id_number}
            if Employee.objects.filter(**filter_kwargs).exists():
                raise serializers.ValidationError({id_name: f"This {id_name} is already registered."})

        if User.objects.filter(email=user_data['email']).exists():
            raise serializers.ValidationError({"email": "This email is already registered."})
        
        validated_data.update(government_ids)
        user = User.objects.create(**user_data)
        user.set_password("123")  # Set default password
        user.save()
        employee = Employee.objects.create(user=user, **validated_data)

        # Get or create WorkingDay objects
        working_days = [DayOfWeek.objects.get_or_create(day=code)[0] for code in working_day_codes]
        on_call_days = [DayOfWeek.objects.get_or_create(day=code)[0] for code in on_call_day_codes]

        employee.work_days.set(working_days)
        employee.on_call_days.set(on_call_days)
        employee.incentives.set(incentives)

        generate_and_store_yearly_schedule(employee)

        return employee
    
    def update(self, instance, validated_data):
        user_pop = validated_data.pop('user')     
        user_info = {
            "first_name" : user_pop.pop('first_name'),
            "last_name"  : user_pop.pop("last_name"),
            "middle_name": user_pop.pop('middle_name', ""), 
            "suffix"     : user_pop.pop('suffix', ""), 
            "email"      : user_pop.pop('email'), 

        }

        for attr, value in user_info.items():
            setattr(instance.user, attr, value)
        instance.user.save()
        
        # Handle incentives, work_days, on_call_days if present
        incentives = validated_data.pop('incentives', None)
        work_days = validated_data.pop('work_days', None)
        on_call_days = validated_data.pop('on_call_days', None)

        # Government IDs: only check if changed, and exclude current instance
        gov_id_fields = ['sss', 'pag_ibig', 'philhealth', 'tin']
        for field in gov_id_fields:
            if field not in validated_data:
                continue

            new_value = validated_data[field]
            current_value = getattr(instance, field)

            if new_value != current_value:
                if Employee.objects.exclude(id=instance.id).filter(**{field: new_value}).exists():
                    raise serializers.ValidationError({field: f"This {field} is already registered."})
            
            setattr(instance, field, new_value)

        email = user_info.get('email')

        if email and email != instance.user.email:
            if User.objects.exclude(id=instance.user.id).filter(email=email).exists():
                raise serializers.ValidationError({"email": "This email is already registered."})
        
   
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if incentives is not None:
            instance.incentives.set(incentives)
        if work_days is not None:
            working_days = [DayOfWeek.objects.get_or_create(day=code)[0] for code in work_days]
            instance.work_days.set(working_days)
        if on_call_days is not None:
            on_call_days_objs = [DayOfWeek.objects.get_or_create(day=code)[0] for code in on_call_days]
            instance.on_call_days.set(on_call_days_objs)

        generate_and_store_yearly_schedule(instance)

        return instance

