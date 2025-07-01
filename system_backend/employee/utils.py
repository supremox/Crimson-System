import calendar
from datetime import datetime, date, timedelta
from .models import EmployeeYearlySchedule


def generate_day_schedule(year, month, work_days, on_call_days):
    day_map = {
        'mon': 0, 'tue': 1, 'wed': 2, 'thu': 3,
        'fri': 4, 'sat': 5, 'sun': 6
    }

    work_set = {day_map[d] for d in work_days}
    on_call_set = {day_map[d] for d in on_call_days}
    # rest_day_set = {day_map[d] for d in rest_days}

    days_in_month = calendar.monthrange(year, month)[1]
    schedule = []

    for day in range(1, days_in_month + 1):
        date = datetime(year, month, day)
        weekday = date.weekday()  # 0 = Monday, 6 = Sunday

        if weekday in work_set:
            type_ = 'work'
        elif weekday in on_call_set:
            type_ = 'on_call'
        else:
            type_ = 'rest'

        schedule.append({
            'date': date.strftime('%Y-%m-%d'),
            'type': type_
        })

    return schedule


def generate_and_store_yearly_schedule(employee, year=None):
    if year is None:
        year = date.today().year

    # Get day codes from the employee
    work_days = list(employee.work_days.values_list('day', flat=True))
    on_call_days = list(employee.on_call_days.values_list('day', flat=True))

    # Generate the monthly schedule
    records = []
    for month in range(1, 13):
        for item in generate_day_schedule(year, month, work_days, on_call_days):
            records.append(EmployeeYearlySchedule(
                employee=employee,
                year=year,
                month=month,
                date=item['date'],
                type=item['type']
            ))

    # Delete old schedule if it exists
    EmployeeYearlySchedule.objects.filter(employee=employee, year=year).delete()

    # Bulk create new schedule
    EmployeeYearlySchedule.objects.bulk_create(records)

