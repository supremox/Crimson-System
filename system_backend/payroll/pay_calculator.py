
from pan4 import AttendanceCalculation
import datetime as dt

from typing import Literal

special_day_type = Literal[
    "regular", 
    "special_non_working",
    "special_working",]

# def get_base_multiplier(day_type: str, worked: bool, is_rest_day: bool = False):
#     table = {
#         # day_type         worked  rest_day → multiplier
#         ('double_regular', False, False): 2.0,
#         ('double_regular', True,  False): 3.0,
#         ('double_regular', True,  True): 3.6,

#         ('mixed_holiday', False, False): 1.0,
#         ('mixed_holiday', True,  False): 2.3,
#         ('mixed_holiday', True,  True): 2.6,

#         ('regular', False, False): 1.0,
#         ('regular', True,  False): 2.0,
#         ('regular', True,  True): 2.6,  

#         ('double_special', False, False): 0.0, # no work, no pay
#         ('double_special', True,  False): 1.5,

#         ('special', False, False): 0.0,  # no work, no pay
#         ('special', True,  False): 1.3,
#         ('special', True,  True): 1.5,

#         ('ordinary', False,  False): 0.0,
#         ('ordinary', True, False): 1.0,
#         ('ordinary', True, True): 1.3,
#     }
#     return table.get((day_type, worked, is_rest_day), 1.0)

# def get_ot_multiplier(day_type: str, is_rest_day: bool = False):
#     """
#     Returns the correct overtime multiplier based on Philippine labor laws.
#     These are NOT just +25%, but based on premium rate * 1.3 if applicable.
#     """
#     ot_multiplier_map = {
#         # (day_type, is_rest_day): OT multiplier
#         ('ordinary', False): 1.25,  # Weekday OT
#         ('ordinary', True): 1.69,   # Rest day OT = 1.3 * 1.3

#         ('special', False): 1.69,   # 1.3 base * 1.3 OT
#         ('special', True): 1.95,    # 1.5 base * 1.3 OT

#         ('regular', False): 2.6,    # 2.0 base * 1.3 OT
#         ('regular', True): 3.38,    # 2.6 base * 1.3 OT

#         ('mixed_holiday', False): 2.99,  # 2.3 * 1.3
#         ('mixed_holiday', True): 3.38,   # 2.6 * 1.3

#         ('double_regular', False): 3.9,  # 3.0 base * 1.3
#         ('double_regular', True): 4.68,  # 3.6 base * 1.3

#         ('double_special', False): 1.95, # 1.5 * 1.3
#         ('double_special', True): 1.95,  # same as above (no rest day bonus)
#     }

#     return round(ot_multiplier_map.get((day_type, is_rest_day), 1.25), 2)

# def get_day_type(holiday_types):
#     if holiday_types.count("regular") >= 2:
#         return "double_regular"
#     elif "regular" in holiday_types and "special_non_working" in holiday_types:
#         return "mixed_holiday"
#     elif "regular" in holiday_types:
#         return "regular"
#     elif holiday_types.count("special_non_working") >= 2:
#         return "double_special"
#     elif "special_non_working" in holiday_types:
#         return "special"
#     elif "special_working" in holiday_types:
#         return "ordinary"
#     return "ordinary"

# def compute_deduction(
#     hourly_rate,
#     late_minutes,
#     undertime_minutes
# ):
#     late_hours = late_minutes / 60
#     undertime_hours = undertime_minutes / 60

#     late_deduction = round(hourly_rate * late_hours, 2)
#     undertime_deduction = round(hourly_rate * undertime_hours, 2)

#     total_deduction = round(late_deduction + undertime_deduction, 2)

#     return {
#         "late_deduction": late_deduction,
#         "undertime_deduction": undertime_deduction,
#         "total_deduction": total_deduction
#     }

# def compute_pay(
#     holiday_types: list[special_day_type]=None,
#     is_rest_day: bool =False,
#     is_night_shift: bool =False,
#     is_overtime: bool =False,
#     hourly_rate: float =80.625,
#     overtime_hrs: int = 0,
#     hours_worked: int = 8,
#     late_minutes: int = 0,
#     undertime_minutes: int = 0
# ):
#     holiday_types = holiday_types or []
#     overtime_hrs = overtime_hrs or {
#         "before_10pm": {"hours": 0, "minutes": 0},
#         "after_10pm": {"hours": 0, "minutes": 0},
#         "after_6am": {"hours": 0, "minutes": 0}
#     }

#     # Get multiplier based on conditions
#     day_type = get_day_type(holiday_types)
#     worked = hours_worked > 0
#     base_multiplier = get_base_multiplier(day_type, worked, is_rest_day)

#     final_multiplier = base_multiplier

#     # Add Night Shift
#     if is_night_shift:
#         final_multiplier *= 1.1  # +10%

#     employee_duty_hrs = 8 # This should be coming from employee records  duty hrs
#     print(f"final Multiplier: {final_multiplier}")
#     # Compute base gross pay
#     if worked:
#         gross_pay = hourly_rate * employee_duty_hrs * final_multiplier
#     else:
#         if "regular" in holiday_types:
#             gross_pay = hourly_rate * employee_duty_hrs * final_multiplier  # 8 hrs standard pay
#             return {
#                         "multiplier": round(final_multiplier, 4),
#                         "hourly_rate": hourly_rate,
#                         "hours_worked": 0,
#                         "gross_pay": round(gross_pay, 2),
#                         "overtime_pay": round(0, 2),
#                         "late_minutes": 0,
#                         "undertime_minutes": 0,
#                         "deduction": 0,
#                         "total_pay": 0
#                     }
#         else:
#             return {
#                         "multiplier": round(0, 4),
#                         "hourly_rate": hourly_rate,
#                         "hours_worked": 0,
#                         "gross_pay": round(0, 2),
#                         "overtime_pay": round(0, 2),
#                         "late_minutes": 0,
#                         "undertime_minutes": 0,
#                         "deduction": 0,
#                         "total_pay": 0
#                     }

#      # OT helpers
#     def calc_hours_decimal(hours, minutes):
#         return hours + (minutes / 60)
    
#     ot_pay = 0
    
#     if is_overtime:
#         # OT segments
#         before_10pm = calc_hours_decimal(**overtime_hrs["before_10pm"])
#         after_10pm = calc_hours_decimal(**overtime_hrs["after_10pm"])
#         after_6am = calc_hours_decimal(**overtime_hrs["after_6am"])

#         base_ot_rate = get_ot_multiplier(day_type, is_rest_day)
#         print(after_10pm)
        
#         # Night diff after 10pm: additional 10%
#         night_ot_rate = base_ot_rate * 1.1

#         # After 6am goes back to base OT (no night diff)
#         after_6am_rate = base_ot_rate

#         # Calculate segment pay
#         ot_pay_before_10pm = hourly_rate * base_ot_rate * before_10pm
#         ot_pay_after_10pm = hourly_rate * night_ot_rate * after_10pm
#         ot_pay_after_6am = hourly_rate * after_6am_rate * after_6am

#         print(f"OT Pay Before 10pm: {ot_pay_before_10pm}")
#         print(f"OT Pay After 10pm: {ot_pay_after_10pm}")
#         print(f"OT Pay After 6am: {ot_pay_after_6am}")

#         # Total OT Pay
#         ot_pay = ot_pay_before_10pm + ot_pay_after_10pm + ot_pay_after_6am


#     # Compute Deduction
#     deduction = compute_deduction(
#         hourly_rate=hourly_rate,
#         late_minutes=late_minutes,
#         undertime_minutes=undertime_minutes
#     )

#     # Final Pay
#     total_pay = round(gross_pay + ot_pay - deduction["total_deduction"], 2)

#     return {
#         "multiplier": round(final_multiplier, 4),
#         "hourly_rate": hourly_rate,
#         "hours_worked": hours_worked,
#         "gross_pay": round(gross_pay, 2),
#         "overtime_pay": round(ot_pay, 2),
#         "late_minutes": late_minutes,
#         "undertime_minutes": undertime_minutes,
#         "deduction": deduction,
#         "total_pay": total_pay
#     }



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
        hours_worked: int = 8,
        late_minutes: int = 0,
        undertime_minutes: int = 0
    ):
        self.hourly_rate = hourly_rate
        self.holiday_types = holiday_types or []
        self.is_rest_day = is_rest_day
        self.is_overtime = is_overtime
        self.overtime_hrs = overtime_hrs or {
            "before_10pm": {"hours": 0, "minutes": 0},
            "after_10pm": {"hours": 0, "minutes": 0},
            "after_6am": {"hours": 0, "minutes": 0}
        }

        self.is_halfday = is_halfday
        self.is_leave_paid = is_leave_paid
        self.is_oncall = is_oncall
        self.night_diff_hours = night_diff_hours
        self.hours_worked = hours_worked
        self.late_minutes = late_minutes
        self.undertime_minutes = undertime_minutes
        self.employee_duty_hrs = 8  # Can be parameterized per employee

    def get_day_type(self):
        ht = self.holiday_types
        if ht.count("regular") >= 2:
            return "double_regular"
        elif "regular" in ht and "special_non_working" in ht:
            return "mixed_holiday"
        elif "regular" in ht:
            return "regular"
        elif ht.count("special_non_working") >= 2:
            return "double_special"
        elif "special_non_working" in ht:
            return "special"
        elif "special_working" in ht:
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
            "deduction": 0,
            "total_pay": round(total_pay, 2)
        }


pay_result = PayCalculator(
    holiday_types=[],
    is_rest_day=False,
    is_overtime=False,
    is_halfday=False,
    is_leave_paid=True,
    is_oncall=False,
    hourly_rate=80.625,
    overtime_hrs= {
        "before_10pm": {"hours": 0, "minutes": 0},
        "after_10pm": {"hours": 0, "minutes": 0},
        "after_6am": {"hours": 0, "minutes": 0},
    },
    hours_worked=0,
    night_diff_hours = {"hours": 0, "minutes": 0},
    late_minutes=0,
    undertime_minutes=0
)

result = pay_result.compute_pay()

print(f"Gross Pay : {result['gross_pay']}")
# print(f"Overtime Total Pay : {result['overtime_pay']}")
# print(f"Late Deduction: {result['deduction']['late_deduction']} Undertime Deduction: {result['deduction']['undertime_deduction']}")
# print(f"Total Deduction: {result['deduction']['total_deduction']}")
print(f"Net Pay: {result['total_pay']}")



# result = compute_pay(
#     holiday_types=["regular"],
#     is_rest_day=True,
#     is_overtime=True,
#     is_night_shift=False,
#     hourly_rate=80.625,
#     overtime_hrs= {
#         "before_10pm": {"hours": 4, "minutes": 30},
#         "after_10pm": {"hours": 2, "minutes": 5},
#         "after_6am": {"hours": 0, "minutes": 0},
#     },
#     hours_worked=7.85,  
#     late_minutes=9,
#     undertime_minutes=0
# )


# print(f"Gross Pay : {pay_result["gross_pay"]}")
# print(f"Overtime Total Pay : {pay_result["overtime_pay"]}")
# print(f"Late Deduction: {pay_result["deduction"]["late_deduction"]} Undertime Deduction: {pay_result["deduction"]["undertime_deduction"]} ")
# print(f"Total Deduction: {pay_result["deduction"]["total_deduction"]}")
# print(f"Net Pay: {pay_result["total_pay"]}")


shift_start = "22:00"
shift_end = "07:00"
break_start = "02:00"
break_end = "03:00"
time_in = "19:09"
time_out = "04:30"
overtime_start = "1731"
overtime_end = "0000"

time_in = dt.datetime.strptime(time_in, "%H:%M").time()
time_out = dt.datetime.strptime(time_out, "%H:%M").time()
shift_start = dt.datetime.strptime(shift_start, "%H:%M").time()
shift_end = dt.datetime.strptime(shift_end, "%H:%M").time()
break_start = dt.datetime.strptime(break_start, "%H:%M").time()
break_end = dt.datetime.strptime(break_end, "%H:%M").time()


calc = AttendanceCalculation.calculate_attendance(time_in, time_out, shift_start, shift_end, break_start, break_end)

print(f"Night Diff Hours : {calc['night_diff_hours']}")
# print(f"Over Time : {calc['overtime_hrs']}")
# print(f"Under Time : {calc['undertime']}")
# print(f"Late Time : {calc['Late']}")
# print(f"Work Hrs : {calc['total_work_hours']}")
# print(calc)