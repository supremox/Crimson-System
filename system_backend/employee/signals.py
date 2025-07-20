# employee/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Employee
from user.models import Role  # Assuming you have a Role model

User = get_user_model()

@receiver(post_save, sender=Employee)
def assign_regular_employee_role(sender, instance, created, **kwargs):
    """
    Automatically assign 'Regular_employee' role when an Employee is created.
    """
    if created:
        user = instance.user
        # Ensure the Regular_employee role exists
        regular_role, _ = Role.objects.get_or_create(name="Regular_employee")
        user.roles.add(regular_role)  # Assuming User has a many-to-many 'roles' field
