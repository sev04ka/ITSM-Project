from rest_framework import permissions, viewsets
from ..models.citype import CIType
from ..serializers.ci_type import CITypeSerializer


class CITypeViewSet(viewsets.ModelViewSet):
    queryset = CIType.objects.all()
    serializer_class = CITypeSerializer
    #permission_classes = [permissions.IsAuthenticated]