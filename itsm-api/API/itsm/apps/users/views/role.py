from rest_framework.decorators import api_view, permission_classes
from rest_framework import mixins, permissions, viewsets
from rest_framework.response import Response
from ..serializers.role import RoleSerializer
from ..models.role import Role

    
class RoleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer


