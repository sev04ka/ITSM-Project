from rest_framework.decorators import api_view, permission_classes
from rest_framework import mixins, permissions, viewsets
from rest_framework.response import Response
from ..serializers.organization import OrganizationSerializer
from ..models.organization import Organization
from ..permissions import *
from rest_framework.exceptions import PermissionDenied
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class LargeResultsPagination(PageNumberPagination):
    page_size = 1000 
    # page_size_query_param = 'page_size'
    max_page_size = 1000
    
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

    def list(self, request, *args, **kwargs):
        if request.user.role.name == "super-admin":
            queryset = Organization.objects.all()
        else:
            queryset = Organization.objects.filter(id = request.user.organization.id)

        queryset = self.filter_queryset(queryset)

        get_all = request.query_params.get('all', False)
        
        if get_all and str(get_all).lower() == 'true':
            self.pagination_class = LargeResultsPagination


        paginated_queryset = self.paginate_queryset(queryset)
        serializer = OrganizationSerializer(paginated_queryset, many=True)
            
        return self.get_paginated_response(serializer.data)