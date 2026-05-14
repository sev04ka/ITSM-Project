from rest_framework import permissions

class IsSameOrganization(permissions.BasePermission):
    message = 'Not the same organization'

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return obj.organization == request.user.organization
    
class IsMemberOfOrganization(permissions.BasePermission):
    message = 'Not member of this organziation'

    def has_object_permission(self, request, view, obj):
        return request.user.organization == obj

class IsOrganizationAdmin(permissions.BasePermission):
    message = 'Only organization admins allowed'

    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and
            request.user.role.name == 'admin'
        )

class IsSelfOrAdmin(permissions.BasePermission):
    message = 'Only owner or admin allowed'

    def has_object_permission(self, request, view, obj):
        if request.user.role.name == 'admin':
            return True
        
        return obj.pk == request.user.pk

class IsSuperUser(permissions.BasePermission):
    message = 'Only super users allowed'

    def has_permission(self, request, view):
        return request.user.is_superuser and request.user.is_staff