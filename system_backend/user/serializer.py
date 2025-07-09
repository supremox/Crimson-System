from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser
from django.apps import apps

class CustomUserSerializer(serializers.ModelSerializer):
    employee_id = serializers.SerializerMethodField()
    position = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            'first_name', 
            'last_name', 
            'middle_name', 
            'suffix', 
            'email', 
            'employee_id', 
            'position'
        ]

    def get_employee_model(self):
        return apps.get_model('employee', 'Employee')

    def get_employee(self, obj):
        Employee = self.get_employee_model()
        try:
            return Employee.objects.select_related('position').get(user=obj)
        except Employee.DoesNotExist:
            return None
    
    def get_employee_id(self, obj):
        employee = self.get_employee(obj)
        return employee.employee_id if employee else None

    def get_position(self, obj):
        employee = self.get_employee(obj)
        return employee.position.position_name if employee and employee.position else None


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # The default result (access/refresh tokens)
        data = super(CustomTokenObtainPairSerializer, self).validate(attrs)
        # Custom data you want to include
        data.update({'user': self.user.first_name})
        # and everything else you want to send in the response
        return data