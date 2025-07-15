from rest_framework import serializers
from .models import PayrollGenerate, ComputePay, SSSContribution, PagIbigContributionRule, PhilhealthContributionRule, WithholdingTaxBracket


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

class SSSCreateContributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SSSContribution
        fields = [
            'compensation_from',
            'compensation_to',
            'total_credit',
            'employer_total',
            'employee_total',
            'overall_total'

        ]

class SSSContributionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = SSSContribution
        fields = [
            'id',
            'compensation_from',
            'compensation_to',
            'total_credit',
            'employer_total',
            'employee_total',
            'overall_total'
        ]

class PagibigCreateContributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PagIbigContributionRule
        fields = [
            'min_salary',
            'max_salary',
            'employee_rate',
            'employer_rate',
        ]

class PagibigContributionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = PagIbigContributionRule
        fields = [
            'id',
            'min_salary',
            'max_salary',
            'employee_rate',
            'employer_rate',
        ]

class PhilhealthCreateContributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhilhealthContributionRule
        fields = [
            'salary_floor',
            'salary_ceiling',
            'employee_rate',
            'employer_rate',
        ]

class PhilhealthContributionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhilhealthContributionRule
        fields = [
            'id',
            'salary_floor',
            'salary_ceiling',
            'employee_rate',
            'employer_rate',
        ]

class TaxCreateContributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WithholdingTaxBracket
        fields = [
            'frequency',
            'min_compensation',
            'max_compensation',
            'base_tax',
            'percentage_over',
            'excess_over',
        ]

class TaxContributionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = WithholdingTaxBracket
        fields = [
            'id',
            'frequency',
            'min_compensation',
            'max_compensation',
            'base_tax',
            'percentage_over',
            'excess_over',
        ]
