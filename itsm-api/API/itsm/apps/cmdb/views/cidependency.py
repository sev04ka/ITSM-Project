from rest_framework import permissions, viewsets
from ..models.cidependency import CIDependency
from ..serializers.cidependency import CIDependencySerializer
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from itsm.apps.core.permissions import *

class LargeResultsPagination(PageNumberPagination):
    page_size = 1000 
    # page_size_query_param = 'page_size'
    max_page_size = 1000

class CIdependencyViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'delete', 'head', 'options']

    queryset = CIDependency.objects.all().select_related("parent", "child")
    serializer_class = CIDependencySerializer

    pagination_class = LargeResultsPagination

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated, IsAdminOrSupport]
        elif self.action == 'destroy':
            permission_classes = [permissions.IsAuthenticated, IsAdminOrSupport, IsMemberOfOrganization]
        elif self.action == 'get_ci_dependencies':
            permission_classes = [permissions.IsAuthenticated, IsAdminOrSupport, IsMemberOfOrganization]
        else:
            permission_classes = [permissions.IsAuthenticated, IsAdminOrSupport, IsMemberOfOrganization]

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
        url_path='for/(?P<pk>[^/.]+)', 
        url_name='ci-dependencies'
    )
    def get_ci_dependencies(self, request, pk):
        queryset = CIDependency.objects.filter(
            Q(parent__id = pk) |
            Q(child__id = pk)
        )
        self.pagination_class = LargeResultsPagination
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = CIDependencySerializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)
