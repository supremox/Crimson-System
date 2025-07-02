from rest_framework import serializers
from .models import Attendance
from employee.models import Employee  # If needed for nested representation


class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField(read_only=True)
    employee_id = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = Attendance
        fields = [
            'id',
            'employee_name',
            'employee_id',
            'date',
            'avatar',
            'time_in',
            'time_out',
            'late',
            'undertime',
            'overtime',
            'total_hours_worked',
            'status',
        ]

    def get_employee_id(self, obj):
        return obj.employee.employee_id if obj.employee else None

    def get_avatar(self, obj):
        if obj.employee and obj.employee.avatar:
            return obj.employee.avatar.url
        return None
    
    def get_employee_name(self, obj):
        if obj.employee and obj.employee.user:
            return f"{obj.employee.user.first_name} {obj.employee.user.last_name}"
        return None
    
class AttendanceQuerySerializer(serializers.Serializer):
    employee_id = serializers.CharField(required=True)
    date = serializers.DateField(required=True)

class FileUploadSerializer(serializers.Serializer):
    file_upload = serializers.FileField()
