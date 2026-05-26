from rest_framework import permissions, viewsets, status
from ..models.configurationItem import ConfigurationItem
from ..serializers.configurationitem import ConfigurationItemSerializer
from itsm.apps.users.models import User
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from itsm.apps.core.permissions import *

class LargeResultsPagination(PageNumberPagination):
    page_size = 1000 
    # page_size_query_param = 'page_size'
    max_page_size = 1000

class ConfigurationItemViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, IsAdminOrSupport]
        elif self.action in ['partial_update']:
            permission_classes = [permissions.IsAuthenticated, IsAdminOrSupport, IsMemberOfOrganization]
        elif self.action == 'destroy':
            permission_classes = [permissions.IsAuthenticated, IsAdminOrSupport, IsMemberOfOrganization]
        elif self.action in ['set_owner', 'remove_owner']:
            permission_classes = [permissions.IsAuthenticated, IsMemberOfOrganization, IsAdminOrSupport]
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

    def list(self, request, *args, **kwargs):
        if request.user.role.name == "super-admin":
            queryset = ConfigurationItem.objects.all()
        else:
            queryset = ConfigurationItem.objects.filter(organization__id = request.user.organization.id)

        queryset = self.filter_queryset(queryset)

        get_all = request.query_params.get('all', False)
        
        if get_all and str(get_all).lower() == 'true':
            self.pagination_class = LargeResultsPagination

            
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = ConfigurationItemSerializer(paginated_queryset, many=True)
            
        return self.get_paginated_response(serializer.data)
    
    def perform_create(self, serializer):
        serializer.save(
            organization = self.request.user.organization
        )

    @action(methods=['get'], detail=False, url_path='my', url_name='users_ci')
    def get_users_ci(self, request):
        queryset = ConfigurationItem.objects.filter(owner = request.user).select_related('ci_type')
        page = self.paginate_queryset(queryset)
        serializer = ConfigurationItemSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    @action(
        methods=['patch'], 
        detail=True, 
        url_path='set-owner', 
        url_name='set-owner'
    )
    def set_owner(self, request, pk=None):
        ci = self.get_object()

        owner_id = request.data.get('owner_id')
        if not owner_id:
            raise ValidationError({"owner_id": "ID required"})
        
        try:
            owner_id = int(owner_id)
        except (ValueError, TypeError):
            raise ValidationError({"owner_id": "Incorrect ID"})
        
        try:
            owner = User.objects.select_related('organization', 'role').get(
                id=owner_id
            )
        except User.DoesNotExist:
            raise ValidationError({"owner_id": "No user with this id"})
        
        ci.owner = owner
        ci.save(update_fields=['owner'])
        
        
        return Response(status=status.HTTP_200_OK)
    
    @action(
        methods=['patch'], 
        detail=True, 
        url_path='remove-owner', 
        url_name='remove-owner'
    )
    def remove_owner(self, request, pk=None):
        ci = self.get_object()

        if not ci.owner:
            return Response(
                {'detail': 'This ci does not have owner'},
                status=status.HTTP_400_BAD_REQUEST
            )

        ci.owner = None
        ci.save(update_fields=['owner'])
        
        return Response(status=status.HTTP_200_OK)