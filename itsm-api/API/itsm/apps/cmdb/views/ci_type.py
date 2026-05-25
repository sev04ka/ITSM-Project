from rest_framework import permissions, viewsets
from ..models.citype import CIType
from ..serializers.ci_type import CITypeSerializer
from rest_framework.pagination import PageNumberPagination

class LargeResultsPagination(PageNumberPagination):
    page_size = 1000  
    # page_size_query_param = 'page_size'
    max_page_size = 1000

class CITypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CIType.objects.all()
    serializer_class = CITypeSerializer

    pagination_class = LargeResultsPagination