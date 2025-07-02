from rest_framework import serializers
from .models import PayrollGenerate, ComputePay


class PayrollGenerateSerializer(serializers.ModelSerializer):
    attendance_record = serializers.SerializerMethodField()

    class Meta:
        model = PayrollGenerate
        fields = [
            'id',
            'start_date',
            'end_date',
            'total_payroll_amount',
            'generated_by',
            'attendance_record',
            'payroll_status',
        ]

class ComputePaySerializer(serializers.ModelSerializer):
    class Meta:
        model = ComputePay
        fields = [
            'id',
            'employee',
            'net_pay',
            'gross_pay',
            'total_late',
            'total_undertime',
            'total_overtime',
            'total_deduction',
        ]

    