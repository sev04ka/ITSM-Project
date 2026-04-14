from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions, viewsets
from rest_framework.response import Response
from ..serializers.user import UserSerializer
from ..models.user import User
from rest_framework.decorators import action

    
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().select_related('role')
    serializer_class = UserSerializer
    #permission_classes = [permissions.IsAuthenticated]

    # @action(methods=['get'], detail=False, url_path='me', url_name='current_user')
    # def get_current_user(self, request):
    #     serializer = UserSerializer(request.user)
    #     return Response(serializer.data)
