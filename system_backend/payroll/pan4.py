


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



from datetime import date
year = date.today().year


import django
from django.utils.translation import gettext
django.utils.translation.gettext = gettext

from datetime import datetime, time, timedelta

class AttendanceCalculation:
    def __init__(self):
        pass

    @staticmethod
    def calculate_attendance(time_in, time_out, shift_start, shift_end, break_start, break_end):
        today = datetime.today().date()
        time_in_dt = datetime.combine(today, time_in)
        time_out_dt = datetime.combine(today, time_out)
        shift_start_dt = datetime.combine(today, shift_start)
        shift_end_dt = datetime.combine(today, shift_end)
        break_start_dt = datetime.combine(today, break_start)
        break_end_dt = datetime.combine(today, break_end)

        # Handle overnight logic
        if break_start_dt < shift_start_dt:
            break_start_dt += timedelta(days=1)
            break_end_dt += timedelta(days=1)

        if shift_end_dt < shift_start_dt:
            shift_end_dt += timedelta(days=1)

        if time_out_dt < time_in_dt:
            time_out_dt += timedelta(days=1)

        return {
            'late': AttendanceCalculation.calculate_late(time_in_dt, shift_start_dt, break_start_dt, break_end_dt),
            'undertime': AttendanceCalculation.calculate_undertime(time_out_dt, shift_end_dt),
            'overtime_hrs': AttendanceCalculation.calculate_overtime(time_out_dt, shift_end_dt),
            'total_work_hours': AttendanceCalculation.calculate_total_work_hours(time_in_dt, time_out_dt, break_start_dt, break_end_dt, shift_end_dt, shift_start_dt),
            'night_diff_hours': AttendanceCalculation.calculate_night_diff_hours(shift_start_dt, shift_end_dt, break_start_dt, break_end_dt)
        }

    @staticmethod
    def calculate_late(time_in_dt, shift_start_dt, break_start_dt, break_end_dt):
        if time_in_dt <= shift_start_dt:
            return {'hours': 0, 'minutes': 0, 'status': 'On-Time' if time_in_dt == shift_start_dt else 'Early'}

        if shift_start_dt <= time_in_dt < break_start_dt:
            total_minutes = (time_in_dt - shift_start_dt).total_seconds() // 60
        elif break_start_dt <= time_in_dt < break_end_dt:
            total_minutes = (time_in_dt - shift_start_dt - (time_in_dt - break_start_dt)).total_seconds() // 60
        else:
            total_minutes = (time_in_dt - shift_start_dt - (break_end_dt - break_start_dt)).total_seconds() // 60

        return {
            'hours': int(total_minutes // 60),
            'minutes': int(total_minutes % 60),
            'status': 'Late'
        }

    @staticmethod
    def calculate_undertime(time_out_dt, shift_end_dt):
        if time_out_dt >= shift_end_dt:
            return {'hours': 0, 'minutes': 0}

        undertime_duration = shift_end_dt - time_out_dt
        total_minutes = undertime_duration.total_seconds() // 60
        return {
            'hours': int(total_minutes // 60),
            'minutes': int(total_minutes % 60)
        }

    @staticmethod
    def calculate_overtime(time_out_dt, shift_end_dt):
        if time_out_dt <= shift_end_dt:
            return {
                'before_10pm': {'hours': 0, 'minutes': 0},
                'after_10pm': {'hours': 0, 'minutes': 0},
                'after_6am': {'hours': 0, 'minutes': 0}
            }

        overtime_start = max(shift_end_dt, datetime.combine(shift_end_dt.date(), time(0, 0)))
        threshold_10pm = datetime.combine(overtime_start.date(), time(22, 0))
        threshold_6am = datetime.combine(overtime_start.date(), time(6, 0)) + timedelta(days=1)

        overtime = time_out_dt - shift_end_dt

        before_10pm = max(timedelta(0), min(time_out_dt, threshold_10pm) - shift_end_dt)
        after_10pm = max(timedelta(0), min(time_out_dt, threshold_6am) - max(shift_end_dt, threshold_10pm))
        after_6am = max(timedelta(0), time_out_dt - threshold_6am)

        def duration_to_hm(td):
            minutes = td.total_seconds() // 60
            # print(f"In Minutes: {minutes / 60}")
            return {'hours': int(minutes // 60), 'minutes': int(minutes % 60)}

        return {
            'before_10pm': duration_to_hm(before_10pm),
            'after_10pm': duration_to_hm(after_10pm),
            'after_6am': duration_to_hm(after_6am)
        }

    @staticmethod
    def calculate_night_diff_hours(shift_start_dt, shift_end_dt, break_start_dt, break_end_dt):
        nd_start = datetime.combine(shift_start_dt.date(), time(22, 0))  # 10 PM
        nd_end = datetime.combine(shift_start_dt.date(), time(6, 0)) + timedelta(days=1)  # 6 AM next day

        # Handle overnight shifts
        if shift_end_dt < shift_start_dt:
            shift_end_dt += timedelta(days=1)

        overlap_start = max(shift_start_dt, nd_start)
        overlap_end = min(shift_end_dt, nd_end)

        if overlap_start >= overlap_end:
            return {'hours': 0, 'minutes': 0}

        # Night diff duration before adjusting for break
        night_diff_duration = overlap_end - overlap_start

        # Adjust break time if within night diff window
        break_overlap = timedelta(0)
        if break_start_dt < overlap_end and break_end_dt > overlap_start:
            adjusted_break_start = max(break_start_dt, overlap_start)
            adjusted_break_end = min(break_end_dt, overlap_end)
            break_overlap = adjusted_break_end - adjusted_break_start

        # Subtract break time
        net_night_diff = night_diff_duration - break_overlap
        total_minutes = net_night_diff.total_seconds() // 60

        return {
            'hours': int(total_minutes // 60),
            'minutes': int(total_minutes % 60)
        }

    @staticmethod
    def calculate_total_work_hours(time_in_dt, time_out_dt, break_start_dt, break_end_dt, shift_end_dt, shift_start_dt):
        actual_end = min(time_out_dt, shift_end_dt)
        work_duration = actual_end - time_in_dt

        break_duration = timedelta(0)
        if break_start_dt < actual_end and break_end_dt > time_in_dt:
            break_start = max(break_start_dt, time_in_dt)
            break_end = min(break_end_dt, actual_end)
            if break_end > break_start:
                break_duration = break_end - break_start

        net_work_duration = work_duration - break_duration
        total_minutes = net_work_duration.total_seconds() // 60
        return {
            'hours': int(total_minutes // 60),
            'minutes': int(total_minutes % 60)
        }







