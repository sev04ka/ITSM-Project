from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions, viewsets
from rest_framework.response import Response
from ..serializers.user import UserSerializer
from django.db.models import Q
from ..models.user import User
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import action
from itsm.apps.core.permissions import *

class LargeResultsPagination(PageNumberPagination):
    page_size = 1000  
    # page_size_query_param = 'page_size'
    max_page_size = 1000
    
class UserViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']


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

        exclude_self = self.request.query_params.get('exclude', True)

        if (self.request.user.is_superuser):
            filtered_users = all_users
        else:
            filtered_users = all_users.filter(organization = self.request.user.organization) 

        if exclude_self:
            return filtered_users
        else:
            return filtered_users.exclude(id = self.request.user.id)
    
    
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, IsSuperAdminOrAdmin]
        elif self.action in ['update', 'partial_update']:
            permission_classes = [permissions.IsAuthenticated, IsSelfOrAdmin]
        elif self.action == 'destroy':
            permission_classes = [permissions.IsAuthenticated, IsSelfOrAdmin]
        elif self.action == 'staff':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated, IsSelfOrAdmin]
        
        return [permission() for permission in permission_classes]

    def list(self, request, *args, **kwargs):
        get_all = request.query_params.get('all', False)
        
        if get_all and str(get_all).lower() == 'true':
            self.pagination_class = LargeResultsPagination
            
        return super().list(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        serializer.save(
            organization = self.request.user.organization
        )

    @action(
            methods=['get'], 
            detail=False, 
            url_path='staff', 
            url_name='staff'
    )
    def get_staff(self, request):
        queryset = User.objects.filter(
            Q(organization = request.user.organization),
            Q(role__name = "support") |
            Q(role__name = "admin")
        ).select_related('role', 'organization')

        page = self.paginate_queryset(queryset)

        serializer = UserSerializer(page, many=True)

        return self.get_paginated_response(serializer.data)