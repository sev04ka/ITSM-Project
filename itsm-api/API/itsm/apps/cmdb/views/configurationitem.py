from rest_framework import permissions, viewsets
from ..models.configurationItem import ConfigurationItem
from ..serializers.configurationitem import ConfigurationItemSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class ConfigurationItemViewSet(viewsets.ModelViewSet):
    queryset = ConfigurationItem.objects.all().select_related('ci_type')
    serializer_class = ConfigurationItemSerializer
    #permission_classes = [permissions.IsAuthenticated]

    search_fields = ['name', 'serial_number']

    filterset_fields = {
        'status': ['exact'],
    }

    def perform_create(self, serializer):
        serializer.save(
            organization = self.request.user.organization
        )

    @action(methods=['get'], detail=False, url_path='my', url_name='users_ci')
    def get_current_user(self, request):
        queryset = ConfigurationItem.objects.filter(owner = request.user).select_related('ci_type')
        serializer = ConfigurationItemSerializer(queryset, many=True)
        return Response(serializer.data)
