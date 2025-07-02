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


