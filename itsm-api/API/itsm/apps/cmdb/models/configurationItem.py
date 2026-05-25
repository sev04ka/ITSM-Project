from django.db import models
from .citype import CIType 
from django.conf import settings
from ...core.models.organization import TenantModel

"""
Конфигурационная единица 
"""
class ConfigurationItem(TenantModel):
    name = models.CharField(max_length=200)
    ci_type = models.ForeignKey(CIType, on_delete=models.CASCADE, related_name='configuration_items')
    
    status = models.CharField(max_length=20, choices=[
        ('active', 'Активен'),
        ('inactive', 'Неактивен'),
        ('maintenance', 'Обслуживание'),
        ('retired', 'Выведен'),
    ], default='active')
    
    serial_number = models.CharField(max_length=100, blank=True)
    asset_tag = models.CharField(max_length=100, blank=True, unique=True, null=True)
    
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='ci_owner')
    
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
        verbose_name = 'Конфигурационная единица'
        verbose_name_plural = 'Конфигурационные единицы'

    def __str__(self):
        return f"{self.name} ({self.ci_type.name})"