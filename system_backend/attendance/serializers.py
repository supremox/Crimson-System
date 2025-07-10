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
            'holiday_types',
            'night_diff_hours',
            'is_rest_day',
            'is_overtime',
            'is_halfday',
            'is_leave_paid',
            'is_oncall',
            'status',
        ]

    def get_employee_id(self, obj):
        return obj.employee.employee_id if obj.employee else None

    def get_avatar(self, obj):
        request = self.context.get("request")
        if obj.employee and obj.employee.avatar and request:
            return request.build_absolute_uri(obj.employee.avatar.url)
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
