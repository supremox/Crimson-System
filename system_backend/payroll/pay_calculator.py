
from pan4 import AttendanceCalculation
import datetime as dt

from typing import Literal
special_day_type = Literal[
    "regular", 
    "special_non_working",
    "special_working",]

def get_base_multiplier(
    holiday_types=None,
    is_rest_day=False,
    is_ordinary=False
):
    holiday_types = holiday_types or []

    is_double_holiday = holiday_types.count("regular") >= 2
    is_regular = "regular" in holiday_types
    is_special_non_working = "special_non_working" in holiday_types
    is_special_working = "special_working" in holiday_types
    is_double_special = holiday_types.count("special_non_working") >= 2

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
        ('ordinary', False): 1.0,
    }

    if is_double_holiday:
        key = ('double_holiday', is_rest_day)
    elif is_regular:
        key = ('regular_holiday', is_rest_day)
    elif is_double_special:
        key = ('double_special', is_rest_day)
    elif is_special_non_working:
        key = ('special_non_working', is_rest_day)
    elif is_special_working:
        key = ('ordinary', False)  # treated as regular day
    elif is_rest_day:
        key = ('rest_day', False)
    else:
        key = ('ordinary', False)

    return condition_map.get(key, 1.0)



def compute_deduction(
    holiday_types,
    hourly_rate,
    late_minutes,
    undertime_minutes
):
    deduction_hours = (late_minutes + undertime_minutes) / 60
    if "regular" in holiday_types:
        return round(hourly_rate * deduction_hours, 2)
    else:
        return round(hourly_rate * deduction_hours, 2)




def compute_pay(
    *,
    holiday_types: list[special_day_type]=None,
    is_rest_day: bool =False,
    is_night_shift: bool =False,
    is_overtime: bool =False,
    is_ordinary: bool =False,
    hourly_rate: float =76.25,
    overtime_hrs: int = 0,
    hours_worked: int = 8,
    late_minutes: int = 0,
    undertime_minutes: int = 0
):
    holiday_types = holiday_types or []

    is_regular = "regular" in holiday_types
    is_double_holiday = holiday_types.count("regular") >= 2

    # Get multiplier based on conditions
    base_multiplier = get_base_multiplier(
        holiday_types=holiday_types,
        is_rest_day=is_rest_day,
        is_ordinary=is_ordinary
    )

    final_multiplier = base_multiplier

    # Add Night Shift
    if is_night_shift:
        final_multiplier *= 1.1  # +10%

    # Compute base gross pay
    gross_pay = hourly_rate * hours_worked * final_multiplier

    # Compute Overtime
    ot_pay = 0
    if is_overtime:
        if is_double_holiday:
            ot_rate = hourly_rate * 3.9  # already includes holiday + rest + OT
        elif is_regular:
            ot_rate = hourly_rate * 2.6 * 1.3  # 260% base * 130% OT
        elif is_ordinary:
            ot_rate = hourly_rate * 1.25
        else:
            ot_rate = hourly_rate * 1.3  # special or rest OT
        ot_pay = ot_rate * overtime_hrs

    # Compute Deduction
    deduction = compute_deduction(
        holiday_types=holiday_types,
        hourly_rate=hourly_rate,
        late_minutes=late_minutes,
        undertime_minutes=undertime_minutes
    )

    # Final Pay
    total_pay = round(gross_pay + ot_pay - deduction, 2)

    return {
        "multiplier": round(final_multiplier, 4),
        "hourly_rate": hourly_rate,
        "hours_worked": hours_worked,
        "gross_pay": round(gross_pay, 2),
        "overtime_pay": round(ot_pay, 2),
        "late_minutes": late_minutes,
        "undertime_minutes": undertime_minutes,
        "deduction": deduction,
        "total_pay": total_pay
    }

shift_start = "08:30"
shift_end = "17:30"
break_start = "12:00"
break_end = "13:00"
time_in = "08:39"
time_out = "00:05"
overtime_start = "1731"
overtime_end = "0000"

result = compute_pay(
    holiday_types=["regular","special_non_working"],
    is_rest_day=True,
    is_overtime=True,
    is_night_shift=True,
    hourly_rate=80.625,
    overtime_hrs=0,
    hours_worked=8,  
    late_minutes=0,
    undertime_minutes=0
)

print(result)

time_in = dt.datetime.strptime(time_in, "%H:%M").time()
time_out = dt.datetime.strptime(time_out, "%H:%M").time()
shift_start = dt.datetime.strptime(shift_start, "%H:%M").time()
shift_end = dt.datetime.strptime(shift_end, "%H:%M").time()
break_start = dt.datetime.strptime(break_start, "%H:%M").time()
break_end = dt.datetime.strptime(break_end, "%H:%M").time()


calc = AttendanceCalculation.calculate_attendance(time_in, time_out, shift_start, shift_end, break_start, break_end)

# print(calc)