from django.contrib.auth.models import AbstractUser
from django.db import models
from ..managers import CustomUserManager
from .role import Role
from ...core.models.organization import TenantModel

class User(AbstractUser, TenantModel):
    email = models.EmailField(unique=True)
    role = models.ForeignKey(Role, on_delete=models.PROTECT)
    
    username = None
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  
    
    def __str__(self):
        return self.email
    
    objects = CustomUserManager()