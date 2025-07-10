from typing import Literal

special_day_type = Literal[
    "Regular holiday",
    "Special Non-working Holiday",
    "Special working Holiday",
]

class PayCalculator:
    def __init__(
        self,
        hourly_rate: float = 80.625,
        holiday_types: list[special_day_type] = None,
        is_rest_day: bool = False,
        is_halfday: bool = False,
        is_leave_paid: bool = False,
        is_oncall: bool = False,
        is_overtime: bool = False,
        overtime_hrs: dict = None,
        night_diff_hours: dict = None,
        employee_duty_hrs: int = 8,
        hours_worked: int = 8,
        late_minutes: int = 0,
        undertime_minutes: int = 0
    ):
        self.hourly_rate = hourly_rate
        self.holiday_types = holiday_types or []
        self.is_rest_day = is_rest_day
        self.is_halfday = is_halfday
        self.is_leave_paid = is_leave_paid
        self.is_oncall = is_oncall
        self.is_overtime = is_overtime
        self.overtime_hrs = overtime_hrs or {
            "before_10pm": {"hours": 0, "minutes": 0},
            "after_10pm": {"hours": 0, "minutes": 0},
            "after_6am": {"hours": 0, "minutes": 0}
        }
        self.night_diff_hours = night_diff_hours
        self.hours_worked = hours_worked
        self.late_minutes = late_minutes
        self.undertime_minutes = undertime_minutes
        self.employee_duty_hrs = employee_duty_hrs  # Can be parameterized per employee

    def get_day_type(self):
        ht = self.holiday_types
        if ht.count("Regular holiday") >= 2:
            return "double_regular"
        elif "Regular holiday" in ht and "Special Non-working Holiday" in ht:
            return "mixed_holiday"
        elif "Regular holiday" in ht:
            return "regular"
        elif ht.count("Special Non-working Holiday") >= 2:
            return "double_special"
        elif "Special Non-working Holiday" in ht:
            return "special"
        elif "Special working Holiday" in ht:
            return "ordinary"
        return "ordinary"

    @staticmethod
    def get_base_multiplier(day_type: str, worked: bool, is_rest_day: bool = False):
        table = {
            ('double_regular', False, False): 2.0,
            ('double_regular', True,  False): 3.0,
            ('double_regular', True,  True): 3.6,

            ('mixed_holiday', False, False): 1.0,
            ('mixed_holiday', True,  False): 2.3,
            ('mixed_holiday', True,  True): 2.6,

            ('regular', False, False): 1.0,
            ('regular', True,  False): 2.0,
            ('regular', True,  True): 2.6,

            ('double_special', False, False): 0.0,
            ('double_special', True,  False): 1.5,

            ('special', False, False): 0.0,
            ('special', True,  False): 1.3,
            ('special', True,  True): 1.5,

            ('ordinary', False,  False): 0.0,
            ('ordinary', True, False): 1.0,
            ('ordinary', True, True): 1.3,
        }
        return table.get((day_type, worked, is_rest_day), 1.0)

    @staticmethod
    def get_ot_multiplier(day_type: str, is_rest_day: bool = False):
        ot_multiplier_map = {
            ('ordinary', False): 1.25,
            ('ordinary', True): 1.69,

            ('special', False): 1.69,
            ('special', True): 1.95,

            ('regular', False): 2.6,
            ('regular', True): 3.38,

            ('mixed_holiday', False): 2.99,
            ('mixed_holiday', True): 3.38,

            ('double_regular', False): 3.9,
            ('double_regular', True): 4.68,

            ('double_special', False): 1.95,
            ('double_special', True): 1.95,
        }
        return round(ot_multiplier_map.get((day_type, is_rest_day), 1.25), 2)

    @staticmethod
    def compute_deduction(hourly_rate, late_minutes, undertime_minutes):
        late_hours = late_minutes / 60
        undertime_hours = undertime_minutes / 60

        late_deduction = round(hourly_rate * late_hours, 2)
        undertime_deduction = round(hourly_rate * undertime_hours, 2)
        total_deduction = round(late_deduction + undertime_deduction, 2)

        return {
            "late_deduction": late_deduction,
            "undertime_deduction": undertime_deduction,
            "total_deduction": total_deduction
        }

    @staticmethod
    def calc_hours_decimal(hours, minutes):
        return hours + (minutes / 60)

    def compute_pay(self):
        worked = self.hours_worked > 0
        day_type = self.get_day_type()
        base_multiplier = self.get_base_multiplier(day_type, worked, self.is_rest_day)
        final_multiplier = base_multiplier

        # if self.is_night_shift:
        #     final_multiplier *= 1.1  # Add 10% night diff

        if worked:
            if self.is_halfday:
                night_diff_pay = self.hourly_rate * 0.10 * (self.night_diff_hours["hours"] + self.night_diff_hours["minutes"] / 60)
                gross_pay = self.hourly_rate * self.employee_duty_hrs / 2 * final_multiplier
            else:
                night_diff_pay = self.hourly_rate * 0.10 * (self.night_diff_hours["hours"] + self.night_diff_hours["minutes"] / 60)
                gross_pay = self.hourly_rate * self.employee_duty_hrs * final_multiplier
        else:
            if "regular" in self.holiday_types:
                night_diff_pay = self.hourly_rate * 0.10 * (self.night_diff_hours["hours"] + self.night_diff_hours["minutes"] / 60)
                gross_pay = self.hourly_rate * self.employee_duty_hrs * final_multiplier
                total_pay = gross_pay + night_diff_pay
                return self._empty_pay_result(final_multiplier, gross_pay, total_pay)
            
            if self.is_leave_paid or self.is_oncall:
                final_multiplier += 1.0
                night_diff_pay = self.hourly_rate * 0.10 * (self.night_diff_hours["hours"] + self.night_diff_hours["minutes"] / 60)
                gross_pay = self.hourly_rate * self.employee_duty_hrs * final_multiplier
                total_pay = gross_pay + night_diff_pay
                return self._empty_pay_result(final_multiplier, gross_pay, total_pay)
               
            return self._empty_pay_result(0, 0, 0)

        # Calculate OT Pay
        ot_pay = 0
        if self.is_overtime:
            before_10pm = self.calc_hours_decimal(**self.overtime_hrs["before_10pm"])
            after_10pm = self.calc_hours_decimal(**self.overtime_hrs["after_10pm"])
            after_6am = self.calc_hours_decimal(**self.overtime_hrs["after_6am"])

            base_ot_rate = self.get_ot_multiplier(day_type, self.is_rest_day)
            night_ot_rate = base_ot_rate * 1.1
            after_6am_rate = base_ot_rate

            ot_pay_before_10pm = self.hourly_rate * base_ot_rate * before_10pm
            ot_pay_after_10pm = self.hourly_rate * night_ot_rate * after_10pm
            ot_pay_after_6am = self.hourly_rate * after_6am_rate * after_6am

            ot_pay = ot_pay_before_10pm + ot_pay_after_10pm + ot_pay_after_6am

        # Deduction
        deduction = self.compute_deduction(
            self.hourly_rate,
            self.late_minutes,
            self.undertime_minutes
        )

        total_pay = round(gross_pay + ot_pay + night_diff_pay - deduction["total_deduction"], 2)

        return {
            "multiplier": round(final_multiplier, 4),
            "hourly_rate": self.hourly_rate,
            "hours_worked": self.hours_worked,
            "gross_pay": round(gross_pay, 2),
            "overtime_pay": round(ot_pay, 2),
            "late_minutes": self.late_minutes,
            "undertime_minutes": self.undertime_minutes,
            "deduction": deduction,
            "total_pay": total_pay
        }

    def _empty_pay_result(self, multiplier, gross_pay, total_pay):
        return {
            "multiplier": round(multiplier, 4),
            "hourly_rate": self.hourly_rate,
            "hours_worked": 0,
            "gross_pay": round(gross_pay, 2),
            "overtime_pay": 0,
            "late_minutes": 0,
            "undertime_minutes": 0,
            "deduction": {'late_deduction': 0.0, 'undertime_deduction': 0.0, 'total_deduction': 0.0},
            "total_pay": round(total_pay, 2)
        }
