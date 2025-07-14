from rest_framework import serializers
from .models import PayrollGenerate, ComputePay, SSSContribution


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

class SSSContributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SSSContribution
        fields = '__all__'

class SSSContributionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = SSSContribution
        fields = [
            'compensation_from',
            'compensation_to',
            'total_credit',
            'employer_total',
            'employee_total'
        ]
