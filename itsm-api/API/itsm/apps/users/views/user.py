from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions, viewsets
from rest_framework.response import Response
from ..serializers.user import UserSerializer
from ..models.user import User
from rest_framework.decorators import action
from itsm.apps.core.permissions import *

    
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().select_related('role', 'organization')
    serializer_class = UserSerializer

    search_fields = [
        'first_name',
        'last_name',
        'role__name',
        'organization__name'
    ]

    filterset_fields = {
        'role': ['exact'],
        'organization': ['exact'],
    }

    def get_queryset(self):
        all_users = self.queryset

        if (self.request.user.is_superuser):
            filtered_users = all_users
        else:
            filtered_users = all_users.filter(organization = self.request.user.organization) 

        return filtered_users.exclude(id = self.request.user.id)
    
    
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, IsOrganizationAdmin]
        elif self.action in ['update', 'partial_update']:
            permission_classes = [permissions.IsAuthenticated, IsSelfOrAdmin]
        elif self.action == 'destroy':
            permission_classes = [permissions.IsAuthenticated, IsOrganizationAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated]
        
        return [permission() for permission in permission_classes]

