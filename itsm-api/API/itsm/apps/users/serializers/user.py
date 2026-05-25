from rest_framework import serializers
from django.contrib.auth import get_user_model
from .role import RoleSerializer
from itsm.apps.core.serializers.organization import OrganizationSerializer
from dj_rest_auth.serializers import UserDetailsSerializer

User = get_user_model()
 
class UserSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)
    organization = OrganizationSerializer(read_only=True)

    role_id = serializers.IntegerField(write_only=True, required=True)
    organization_id = serializers.IntegerField(write_only=True, required=True)

    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8
    )

    # password_confirm = serializers.CharField(
    #     write_only=True,
    #     required=False,
    # )

    class Meta:
        model = User
        fields = [
            'id', 
            'first_name', 
            'last_name',
            'email',
            'password',
            # 'password_confirm', 
            'role', 
            'role_id',
            'organization',
            'organization_id',
        ]

    def validate(self, attrs):
        # if attrs.get('password') and attrs.get('password_confirm'):
        #     if attrs['password'] != attrs['password_confirm']:
        #         raise serializers.ValidationError({
        #             'password_confirm': 'Пароли не совпадают'
        #         })
        
        email = attrs.get('email')
        if email:
            if User.objects.filter(email=email).exists():
                raise serializers.ValidationError({
                    'email': 'Пользователь с таким email уже существует'
                })
        
        role_id = attrs.get('role_id')
        if role_id:
            from ..models.role import Role
            if not Role.objects.filter(id=role_id).exists():
                raise serializers.ValidationError({
                    'role_id': 'Роль не найдена'
                })
        
        organization_id = attrs.get('organization_id')
        if organization_id:
            from ...core.models.organization import Organization
            if not Organization.objects.filter(id=organization_id).exists():
                raise serializers.ValidationError({
                    'organization_id': 'Организация не найдена'
                })
        
        return attrs
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        # password_confirm = validated_data.pop('password_confirm', None)

        user = User(**validated_data)
        
        if password:
            user.set_password(password)
        
        user.save()
        
        return user

    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        validated_data.pop('organization_id', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance



