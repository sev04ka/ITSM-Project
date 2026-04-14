from rest_framework import serializers
from django.contrib.auth import get_user_model
from .role import RoleSerializer
from ...core.serializers.organization import OrganizationSerializer
from dj_rest_auth.serializers import UserDetailsSerializer

User = get_user_model()
 
class UserSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)
    organization = OrganizationSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'role', 'organization']


class CustomUserDetailsSerializer(UserDetailsSerializer):
    role = RoleSerializer(read_only=True)
    organization = OrganizationSerializer(read_only=True)

    class Meta(UserDetailsSerializer.Meta):
        fields = (
            'id', 'first_name', 'last_name', 'role', 'organization'
        )
