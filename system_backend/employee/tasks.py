from celery import shared_task
from datetime import date
from .models import Employee
from .utils import generate_and_store_yearly_schedule

@shared_task
def regenerate_all_employee_schedules(year=None):
    if year is None:
        year = date.today().year

    for employee in Employee.objects.all():
        generate_and_store_yearly_schedule(employee, year)
