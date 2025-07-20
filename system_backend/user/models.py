from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)

from django.db import models
from django.utils import timezone
from django.utils.crypto import get_random_string
from django.conf import settings
from django.core.mail import send_mail

from company.models import Company

class CustomPermission(models.Model):
    """
    Atomic permissions like can_add_employee, can_update_employee
    """
    code = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.code


class Role(models.Model):
    """
    Roles like Admin, HR, Manager, etc.
    """
    name = models.CharField(max_length=100, unique=True)
    permissions = models.ManyToManyField(CustomPermission, related_name="roles", blank=True)

    def __str__(self):
        return self.name


class CustomUserManager(BaseUserManager):
    def create_user(self, email=None, password=None,  **extra_fields):
        # print("check email:", email)
        if not email:
            raise ValueError("You have not provided a valid e-mail")
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password,  **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=50, null=True, blank=True)
    suffix = models.CharField(max_length=50, null=True, blank=True)
    email = models.EmailField(unique=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='users', null=True, blank=True)
    roles = models.ManyToManyField(Role, related_name='users', blank=True)
    custom_permissions = models.ManyToManyField(CustomPermission, related_name='users', blank=True)
   
    is_authorized = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
    
    # Permission check
    def has_permission(self, perm_code):
        """
        Check if user has permission by either:
        - A direct custom_permission
        - A permission assigned via roles
        """
        if self.custom_permissions.filter(code=perm_code).exists():
            return True
        return self.roles.filter(permissions__code=perm_code).exists()

    def has_permissions(self, perm_codes):
        """
        Check multiple permissions
        """
        return all(self.has_permission(perm) for perm in perm_codes)