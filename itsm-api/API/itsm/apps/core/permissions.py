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
        try:
            org = obj.organization
            return request.user.organization == obj.organization
        except:
            return False

class IsAdmin(permissions.BasePermission):
    message = 'Only organization admins allowed'

    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.role.name == 'admin'
        )
    
class IsSupport(permissions.BasePermission):
    message = 'Only organization supports allowed'

    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.role.name == 'support'
        )
    
class IsAdminOrSupport(permissions.BasePermission):
    message = 'Only organization supports or admins allowed'

    def has_permission(self, request, view):
        return (
            request.user and 
            (request.user.role.name == 'support' or request.user.role.name == 'admin')
        )

class IsSuperAdmin(permissions.BasePermission):
    message = 'Only super admins allowed'

    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.role.name == 'super-admin'
        )
    
class IsSuperAdminOrAdmin(permissions.BasePermission):
    message = 'Only super admins or admins allowed'

    def has_permission(self, request, view):
        return (
            request.user and 
            (request.user.role.name == 'super-admin' or request.user.role.name == 'admin')
        )
    
class IsSelfOrAdmin(permissions.BasePermission):
    message = 'Only owner or admin allowed'

    def has_object_permission(self, request, view, obj):
        if request.user.role.name == 'admin' or request.user.role.name == 'super-admin':
            return True
        
        return obj.pk == request.user.pk