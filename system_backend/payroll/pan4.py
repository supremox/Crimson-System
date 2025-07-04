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



import datetime as dt
from io import BytesIO
import xlsxwriter
import django
from django.utils.translation import gettext
django.utils.translation.gettext = gettext


class AttendanceCalculation:
    def __init__(self):
        pass

    @staticmethod
    def calculate_attendance(time_in, time_out, shift_start, shift_end, break_start, break_end):
        today = dt.date.today()
        time_in_dt = dt.datetime.combine(today, time_in)
        time_out_dt = dt.datetime.combine(today, time_out)
        shift_start_dt = dt.datetime.combine(today, shift_start)
        shift_end_dt = dt.datetime.combine(today, shift_end)
        break_start_dt = dt.datetime.combine(today, break_start)
        break_end_dt = dt.datetime.combine(today, break_end)

        # Handle overnight logic
        if break_start_dt < shift_start_dt:
            break_start_dt += dt.timedelta(days=1)
            break_end_dt += dt.timedelta(days=1)

        if shift_end_dt < shift_start_dt:
            shift_end_dt += dt.timedelta(days=1)

        if time_out_dt < time_in_dt:
            time_out_dt += dt.timedelta(days=1)

        return {
            'late': AttendanceCalculation.calculate_late(time_in_dt, shift_start_dt, break_start_dt, break_end_dt),
            'undertime': AttendanceCalculation.calculate_undertime(time_out_dt, shift_end_dt),
            'overtime': AttendanceCalculation.calculate_overtime(time_out_dt, shift_end_dt),
            'total_work_hours': AttendanceCalculation.calculate_total_work_hours(time_in_dt, time_out_dt, break_start_dt, break_end_dt, shift_end_dt, shift_start_dt)
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
            return {'hours': 0, 'minutes': 0}

        overtime_duration = time_out_dt - shift_end_dt
        total_minutes = overtime_duration.total_seconds() // 60
        return {
            'hours': int(total_minutes // 60),
            'minutes': int(total_minutes % 60)
        }
    
    @staticmethod
    def calculate_total_work_hours(time_in_dt, time_out_dt, break_start_dt, break_end_dt, shift_end_dt, shift_start_dt):
        """
        Returns total hours worked (excluding overtime and break).
        If employee worked overtime, only count up to shift_end_dt.
        """
        # Only count up to shift_end_dt (exclude overtime)
        actual_end = min(time_out_dt, shift_end_dt)
        # Subtract break time if it falls within work period
        if time_in_dt <= shift_start_dt:
            work_duration = actual_end - shift_start_dt

        work_duration = actual_end - time_in_dt
        break_duration = dt.timedelta(0)
        # If break is within work period, subtract it
        if break_start_dt < actual_end and break_end_dt > time_in_dt:
            # Calculate overlap between work period and break
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


class ExcelReportWriter:
    def __init__(self, data):
        self.data = data
        self.output = BytesIO()
        self.workbook = xlsxwriter.Workbook(self.output)
        self.worksheet = self.workbook.add_worksheet("Report")
        self.title_format = self._get_title_format()
        self.header_format = self._get_header_format()
        self.cell_format = self._get_cell_format()

    def _get_title_format(self):
        return self.workbook.add_format({
            'bold': True,
            'font_size': 14,
            'align': 'center',
            'valign': 'vcenter'
        })

    def _get_header_format(self):
        return self.workbook.add_format({
            'bg_color': '#cfe7f5',
            'font_size': 12,
            'color': 'black',
            'align': 'center',
            'valign': 'vcenter',
            'border': 1
        })

    def _get_cell_format(self):
        return self.workbook.add_format({
            'font_size': 10,
            'align': 'center',
            'valign': 'vcenter',
            'border': 1
        })

    def generate_report(self):
        self._write_title()
        self._write_headers()
        self._resize_columns()
        self._write_data()
        self.workbook.close()
        return self.output.getvalue()

    def _write_title(self):
        self.worksheet.merge_range('A2:G2', gettext("Weekly Report"), self.title_format)

    def _write_headers(self):
        headers = [
            gettext("Employee_ID"),
            gettext("Name"),
            gettext("Time In"),
            gettext("Time Out"),
            gettext("Late"),
            gettext("Undertime"),
            gettext("Overtime"),
        ]
        for col, header in enumerate(headers):
            self.worksheet.write(4, col, header, self.header_format)

    def _resize_columns(self):
        self.worksheet.set_column('A:A', 15)  # Employee_ID
        self.worksheet.set_column('B:B', 25)  # Name
        self.worksheet.set_column('C:D', 12)  # Time In, Time Out
        self.worksheet.set_column('E:G', 12)  # Late, Undertime, Overtime

    def _write_data(self):
        for idx, record in enumerate(self.data):
            row = 5 + idx
            self.worksheet.write_string(row, 0, record.employee_id.user.employee_id, self.cell_format)
            self.worksheet.write_string(row, 1, f"{record.employee_id.user.first_name} {record.employee_id.user.last_name}", self.cell_format)
            self.worksheet.write_string(row, 2, str(record.time_in), self.cell_format)
            self.worksheet.write_string(row, 3, str(record.time_out), self.cell_format)
            self.worksheet.write_string(row, 4, str(record.late), self.cell_format)
            self.worksheet.write_string(row, 5, str(record.undertime), self.cell_format)
            self.worksheet.write_string(row, 6, str(record.overtime), self.cell_format)







