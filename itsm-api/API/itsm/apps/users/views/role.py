from rest_framework.decorators import api_view, permission_classes
from rest_framework import mixins, permissions, viewsets
from rest_framework.response import Response
from ..serializers.role import RoleSerializer
from ..models.role import Role

    
class RoleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer

    def get_queryset(self):
        all_users = self.queryset

        if self.request.user.role.name == "super-admin":
            return all_users
        else:
            return all_users.exclude(name = "super-admin")


