from rest_framework.decorators import api_view, permission_classes
from rest_framework import mixins, permissions, viewsets
from rest_framework.response import Response
from ..serializers.organization import OrganizationSerializer
from ..models.organization import Organization
from ..permissions import *
from rest_framework.exceptions import PermissionDenied

    
class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer

    search_fields = [
        'name',
    ]

    def perform_destroy(self, instance):
        if self.request.user.organization == instance:
            raise PermissionDenied("Cannot delete current org")
        
        from ...users.models.user import User
        if User.objects.filter(organization = instance).count() != 0:
            raise PermissionDenied("Cannot delete not empty org")

        return super().perform_destroy(instance)
    

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, IsSuperAdmin]
        elif self.action in ['update', 'partial_update']:
            permission_classes = [permissions.IsAuthenticated, IsSuperAdmin]
        elif self.action == 'destroy':
            permission_classes = [permissions.IsAuthenticated, IsSuperAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated, IsMemberOfOrganization]
        
        return [permission() for permission in permission_classes]
