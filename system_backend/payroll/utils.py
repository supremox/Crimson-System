class PayCalculator:
    def __init__(
        self,
        is_ordinary=False,
        is_rest_day=False,
        is_special_non_working=False,
        is_regular_holiday=False,
        is_double_holiday=False,
        is_double_special=False,
        is_night_shift=False,
        is_overtime=False,
        hourly_rate=80.625,
        overtime_hrs=0,
        hours_worked=8,
        late_minutes=0,
        undertime_minutes=0
    ):
        self.is_ordinary = is_ordinary
        self.is_rest_day = is_rest_day
        self.is_special_non_working = is_special_non_working
        self.is_regular_holiday = is_regular_holiday
        self.is_double_holiday = is_double_holiday
        self.is_double_special = is_double_special
        self.is_night_shift = is_night_shift
        self.is_overtime = is_overtime
        self.hourly_rate = hourly_rate
        self.overtime_hrs = overtime_hrs
        self.hours_worked = hours_worked
        self.late_minutes = late_minutes
        self.undertime_minutes = undertime_minutes

    def get_base_multiplier(self):
        condition_map = {
            ('double_holiday', False): 3.0,
            ('double_holiday', True): 3.9,
            ('regular_holiday', False): 2.0,
            ('regular_holiday', True): 2.6,
            ('double_special', False): 1.5,
            ('double_special', True): 1.95,
            ('special_non_working', False): 1.3,
            ('special_non_working', True): 1.5,
            ('rest_day', False): 1.3,
            ('ordinary', False): 1.0
        }

        if self.is_double_holiday:
            key = ('double_holiday', self.is_rest_day)
        elif self.is_regular_holiday:
            key = ('regular_holiday', self.is_rest_day)
        elif self.is_double_special:
            key = ('double_special', self.is_rest_day)
        elif self.is_special_non_working:
            key = ('special_non_working', self.is_rest_day)
        elif self.is_rest_day:
            key = ('rest_day', False)
        else:
            key = ('ordinary', False)

        return condition_map.get(key, 1.0)

    def compute_pay(self):
        multiplier = self.get_base_multiplier()

        # Overtime Pay
        ot_pay = 0
        if self.is_overtime:
            ot_multiplier = 1.25 if self.is_ordinary else 1.30
            ot_pay = self.hourly_rate * self.overtime_hrs * ot_multiplier

        # Night Shift Adjustment
        if self.is_night_shift:
            multiplier *= 1.1

        # Gross Pay
        gross_pay = self.hourly_rate * self.hours_worked * multiplier + ot_pay

        # Deductions
        deduction_hours = (self.late_minutes + self.undertime_minutes) / 60
        deduction = self.hourly_rate * deduction_hours

        total_pay = round(gross_pay - deduction, 2)

        return {
            "multiplier": round(multiplier, 4),
            "hourly_rate": self.hourly_rate,
            "hours_worked": self.hours_worked,
            "gross_pay": round(gross_pay, 2),
            "late_minutes": self.late_minutes,
            "undertime_minutes": self.undertime_minutes,
            "deduction": round(deduction, 2),
            "total_pay": total_pay
        }
