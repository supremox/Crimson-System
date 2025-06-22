from rest_framework import serializers
from .models import Attendance
from employee.models import Employee  # If needed for nested representation


class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.first_name', read_only=True)  
    class Meta:
        model = Attendance
        fields = [
            'id',
            'employee',
            'employee_name',
            'date',
            'time_in',
            'time_out',
            'late',
            'undertime',
            'overtime',
            'status',
        ]

class FileUploadSerializer(serializers.Serializer):
    file_upload = serializers.FileField()
