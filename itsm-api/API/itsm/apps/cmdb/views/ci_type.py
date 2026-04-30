from rest_framework import permissions, viewsets
from ..models.citype import CIType
from ..serializers.ci_type import CITypeSerializer
from rest_framework.pagination import PageNumberPagination

class CustomPageNumberPagination(PageNumberPagination):
    page_size = 100  
    # page_size_query_param = 'page_size'  
    # max_page_size = 10000 

class CITypeViewSet(viewsets.ModelViewSet):
    queryset = CIType.objects.all()
    serializer_class = CITypeSerializer
    #permission_classes = [permissions.IsAuthenticated]

    pagination_class = CustomPageNumberPagination