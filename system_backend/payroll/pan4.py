def get_base_multiplier(
    is_ordinary=False,
    is_rest_day=False,
    is_special_non_working=False,
    is_regular_holiday=False,
    is_double_holiday=False,
    is_double_special=False,
):
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

    if is_double_holiday:
        key = ('double_holiday', is_rest_day)
    elif is_regular_holiday:
        key = ('regular_holiday', is_rest_day)
    elif is_double_special:
        key = ('double_special', is_rest_day)
    elif is_special_non_working:
        key = ('special_non_working', is_rest_day)
    elif is_rest_day:
        key = ('rest_day', False)
    else:
        key = ('ordinary', False)

    return condition_map.get(key, 1.0)


def compute_pay(
    is_ordinary=False,
    is_rest_day=False,
    is_special_non_working=False,
    is_regular_holiday=True,
    is_double_holiday=False,
    is_double_special=False,
    is_night_shift=False,
    is_overtime=False,
    hourly_rate=76.25,
    overtime_hrs=0,
    hours_worked=8,
    late_minutes=0,
    undertime_minutes=0
):
    # Base multiplier
    multiplier = get_base_multiplier(
        is_ordinary=is_ordinary,
        is_rest_day=is_rest_day,
        is_special_non_working=is_special_non_working,
        is_regular_holiday=is_regular_holiday,
        is_double_holiday=is_double_holiday,
        is_double_special=is_double_special,
    )

   
    # Add OT
    ot_pay = 0
    if is_overtime:
        ot_multiplier = 1.25 if is_ordinary else 1.30
        ot_pay = hourly_rate * overtime_hrs * ot_multiplier     
   
   
    # Add night shift
    if is_night_shift:
        multiplier *= 1.1

   
    # Gross Pay
    gross_pay = hourly_rate * hours_worked * multiplier + ot_pay

    # Deduction
    deduction_hours = (late_minutes + undertime_minutes) / 60
    deduction = hourly_rate * deduction_hours

    total_pay = round(gross_pay - deduction, 2)

    return {
        "multiplier": round(multiplier, 4),
        "hourly_rate": hourly_rate,
        "hours_worked": hours_worked,
        "gross_pay": round(gross_pay, 2),
        "late_minutes": late_minutes,
        "undertime_minutes": undertime_minutes,
        "deduction": round(deduction, 2),
        "total_pay": total_pay
    }


Sample_data = [
    {
        "employee_id": 2025001,
        "employee_name": "Vince",
        "attendance_record" : [
                {
                    "label": "Regular Day + Overtime",
                    "is_regular_holiday": False,
                    "is_special_non_working": False,
                    "is_ordinary": True,
                    "is_rest_day": False,
                    "is_double_holiday": False,
                    "is_double_special": False,
                    "is_night_shift": False,
                    "is_overtime": True,
                    "hourly_rate": 80.625,
                    "hours_worked": 8,
                    "overtime_hrs": 2,
                    "late_minutes": 0,
                    "undertime_minutes": 0
                },
                {
                    "label": "Special Non-Working + Night + OT",
                    "is_regular_holiday": False,
                    "is_special_non_working": True,
                    "is_ordinary": False,
                    "is_rest_day": False,
                    "is_double_holiday": False,
                    "is_double_special": False,
                    "is_night_shift": True,
                    "is_overtime": True,
                    "hourly_rate": 80.625,
                    "hours_worked": 8,
                    "overtime_hrs": 1,
                    "late_minutes": 5,
                    "undertime_minutes": 0
                },
                {
                    "label": "Regular Holiday + Rest Day + Night OT",
                    "is_regular_holiday": True,
                    "is_special_non_working": False,
                    "is_ordinary": False,
                    "is_rest_day": True,
                    "is_double_holiday": False,
                    "is_double_special": False,
                    "is_night_shift": True,
                    "is_overtime": True,
                    "hourly_rate": 80.625,
                    "hours_worked": 8,
                    "overtime_hrs": 3,
                    "late_minutes": 0,
                    "undertime_minutes": 15
                },
                {
                    "label": "Ordinary Day + Night Shift Only",
                    "is_regular_holiday": False,
                    "is_special_non_working": False,
                    "is_ordinary": True,
                    "is_rest_day": False,
                    "is_double_holiday": False,
                    "is_double_special": False,
                    "is_night_shift": True,
                    "is_overtime": False,
                    "hourly_rate": 80.625,
                    "hours_worked": 8,
                    "overtime_hrs": 0,
                    "late_minutes": 0,
                    "undertime_minutes": 0
                },
                {
                    "label": "Double Holiday + OT + Night",
                    "is_regular_holiday": False,
                    "is_special_non_working": False,
                    "is_ordinary": False,
                    "is_rest_day": False,
                    "is_double_holiday": True,
                    "is_double_special": False,
                    "is_night_shift": True,
                    "is_overtime": True,
                    "hourly_rate": 80.625,
                    "hours_worked": 8,
                    "overtime_hrs": 2,
                    "late_minutes": 10,
                    "undertime_minutes": 10
                },
                {
                    "label": "Rest Day Only (Ordinary Day)",
                    "is_regular_holiday": False,
                    "is_special_non_working": False,
                    "is_ordinary": True,
                    "is_rest_day": True,
                    "is_double_holiday": False,
                    "is_double_special": False,
                    "is_night_shift": False,
                    "is_overtime": False,
                    "hourly_rate": 80.625,
                    "hours_worked": 8,
                    "overtime_hrs": 0,
                    "late_minutes": 45,
                    "undertime_minutes": 120
                },
                {
                    "label": "Ordinary Day",
                    "is_regular_holiday": False,
                    "is_special_non_working": False,
                    "is_ordinary": True,
                    "is_rest_day": False,
                    "is_double_holiday": False,
                    "is_double_special": False,
                    "is_night_shift": False,
                    "is_overtime": False,
                    "hourly_rate": 80.625,
                    "hours_worked": 8,
                    "overtime_hrs": 0,
                    "late_minutes": 0,
                    "undertime_minutes": 0
                }
        ]
    },
    {
        "employee_id": 2025002,
        "employee_name": "Steph",
        "attendance_record" : [
                {
                    "label": "Regular Day + Overtime",
                    "is_regular_holiday": False,
                    "is_special_non_working": False,
                    "is_ordinary": True,
                    "is_rest_day": False,
                    "is_double_holiday": False,
                    "is_double_special": False,
                    "is_night_shift": False,
                    "is_overtime": True,
                    "hourly_rate": 80.625,
                    "hours_worked": 8,
                    "overtime_hrs": 2,
                    "late_minutes": 0,
                    "undertime_minutes": 0
                },
                {
                    "label": "Special Non-Working + Night + OT",
                    "is_regular_holiday": False,
                    "is_special_non_working": True,
                    "is_ordinary": False,
                    "is_rest_day": False,
                    "is_double_holiday": False,
                    "is_double_special": False,
                    "is_night_shift": True,
                    "is_overtime": True,
                    "hourly_rate": 80.625,
                    "hours_worked": 8,
                    "overtime_hrs": 1,
                    "late_minutes": 5,
                    "undertime_minutes": 0
                },
                {
                    "label": "Regular Holiday + Rest Day + Night OT",
                    "is_regular_holiday": True,
                    "is_special_non_working": False,
                    "is_ordinary": False,
                    "is_rest_day": True,
                    "is_double_holiday": False,
                    "is_double_special": False,
                    "is_night_shift": True,
                    "is_overtime": True,
                    "hourly_rate": 80.625,
                    "hours_worked": 8,
                    "overtime_hrs": 3,
                    "late_minutes": 0,
                    "undertime_minutes": 15
                },
                {
                    "label": "Ordinary Day + Night Shift Only",
                    "is_regular_holiday": False,
                    "is_special_non_working": False,
                    "is_ordinary": True,
                    "is_rest_day": False,
                    "is_double_holiday": False,
                    "is_double_special": False,
                    "is_night_shift": True,
                    "is_overtime": False,
                    "hourly_rate": 80.625,
                    "hours_worked": 8,
                    "overtime_hrs": 0,
                    "late_minutes": 0,
                    "undertime_minutes": 0
                },
                {
                    "label": "Double Holiday + OT + Night",
                    "is_regular_holiday": False,
                    "is_special_non_working": False,
                    "is_ordinary": False,
                    "is_rest_day": False,
                    "is_double_holiday": True,
                    "is_double_special": False,
                    "is_night_shift": True,
                    "is_overtime": True,
                    "hourly_rate": 80.625,
                    "hours_worked": 8,
                    "overtime_hrs": 2,
                    "late_minutes": 10,
                    "undertime_minutes": 10
                },
                {
                    "label": "Rest Day Only (Ordinary Day)",
                    "is_regular_holiday": False,
                    "is_special_non_working": False,
                    "is_ordinary": True,
                    "is_rest_day": True,
                    "is_double_holiday": False,
                    "is_double_special": False,
                    "is_night_shift": False,
                    "is_overtime": False,
                    "hourly_rate": 80.625,
                    "hours_worked": 8,
                    "overtime_hrs": 0,
                    "late_minutes": 45,
                    "undertime_minutes": 120
                },
                {
                    "label": "Ordinary Day",
                    "is_regular_holiday": False,
                    "is_special_non_working": False,
                    "is_ordinary": True,
                    "is_rest_day": False,
                    "is_double_holiday": False,
                    "is_double_special": False,
                    "is_night_shift": False,
                    "is_overtime": False,
                    "hourly_rate": 80.625,
                    "hours_worked": 8,
                    "overtime_hrs": 0,
                    "late_minutes": 0,
                    "undertime_minutes": 0
                }
        ]
    },
]

for employee in Sample_data:
    print(f"\n🧾 Payroll Summary for {employee['employee_name']} (ID: {employee['employee_id']}):\n")
    total_deduction = 0
    total = 0
    for record in employee["attendance_record"]:
        label = record.pop("label")
        result = compute_pay(**record)
        print(f"📅 {label} ➜ ₱{result['total_pay']}")
        total_deduction += result["deduction"]
        total += result["total_pay"]
    # print(f"\n💰 Total Deduction: ₱{round(total_deduction, 2)}\n{'-'*50}")
    # print(f"\n💰 Total Gross Pay: ₱{round(total, 2)}\n{'-'*50}")

# for case in Sample_data:
#     label = case.pop("label")
#     result = compute_pay(**case)
#     print(f"{label} ➜ ₱{result}")


# result = compute_pay(
#     is_regular_holiday=False,
#     is_special_non_working=False,
#     is_ordinary=True,
#     is_rest_day=False,
#     is_night_shift=False,
#     is_overtime=True,
#     hourly_rate=80.625,
#     hours_worked=8,
#     overtime_hrs=2,
#     late_minutes=0,
#     undertime_minutes=0
# )

# Display Result
# print(f"Multiplier: {result['multiplier']}x")
# print(f"Hourly Rate: ₱{result['hourly_rate']}")
# print(f"Hours Worked: {result['hours_worked']} hrs")
# print(f"Gross Pay: ₱{result['gross_pay']}")
# print(f"Late: {result['late_minutes']} mins")
# print(f"Undertime: {result['undertime_minutes']} mins")
# print(f"Deduction: ₱{result['deduction']}")
# print(f"Total Pay: ₱{result['total_pay']}")

from datetime import date
year = date.today().year

print(f"year:, {year} " )