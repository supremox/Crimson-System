from io import BytesIO
import xlsxwriter
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

#============================ Excel Writer ===========================

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


