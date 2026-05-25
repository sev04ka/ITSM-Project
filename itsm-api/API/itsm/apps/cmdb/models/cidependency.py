from django.db import models
from .citype import CIType 
from django.conf import settings
from ...core.models.organization import TenantModel
from .configurationItem import ConfigurationItem

"""
Зависимость между конфигурационными единицами 
"""
class CIDependency(TenantModel):
    parent = models.ForeignKey(ConfigurationItem, on_delete=models.CASCADE, related_name='dependency_parent')
    child = models.ForeignKey(ConfigurationItem, on_delete=models.CASCADE, related_name='dependency_child')

    label = models.CharField(max_length=20)
    
    class Meta:
        verbose_name = 'Зависимость конфигурационных единиц'
        verbose_name_plural = 'Зависимости конфигурационных единиц'

    def __str__(self):
        return f"{self.child.name} {self.label} {self.parent.name}"
    