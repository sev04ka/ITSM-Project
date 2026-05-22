from rest_framework import permissions, viewsets, mixins
from ..models.configurationItem import ConfigurationItem
from ..serializers.configurationitem import ConfigurationItemSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from itsm.apps.core.permissions import *

class ConfigurationItemViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, IsAdminOrSupport]
        elif self.action in ['partial_update']:
            permission_classes = [permissions.IsAuthenticated, IsAdminOrSupport]
        elif self.action == 'destroy':
            permission_classes = [permissions.IsAuthenticated, IsAdminOrSupport]
        else:
            permission_classes = [permissions.IsAuthenticated, IsMemberOfOrganization]
        
        return [permission() for permission in permission_classes]

    queryset = ConfigurationItem.objects.all().select_related('ci_type')
    serializer_class = ConfigurationItemSerializer

    search_fields = [
        'name', 
        'serial_number',
        'status',
        'ci_type__name'
    ]

    filterset_fields = {
        'status': ['exact'],
        'ci_type': ['exact']
    }

    ordering_fields = [
        'name', 
        'serial_number',
    ]

    ordering = ['-name']  
    
    def perform_create(self, serializer):
        serializer.save(
            organization = self.request.user.organization
        )

    @action(methods=['get'], detail=False, url_path='my', url_name='users_ci')
    def get_users_ci(self, request):
        queryset = ConfigurationItem.objects.filter(owner = request.user).select_related('ci_type')
        serializer = ConfigurationItemSerializer(queryset, many=True)
        return Response(serializer.data)
