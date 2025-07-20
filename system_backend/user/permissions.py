from rest_framework import permissions

class HasCustomPermission(permissions.BasePermission):
    """
    Custom DRF permission check.
    """
    required_permissions = []

    def has_permission(self, request, view):
        return all(request.user.has_permission(perm) for perm in self.required_permissions)
