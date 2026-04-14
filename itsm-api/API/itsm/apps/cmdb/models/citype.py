from django.db import models

"""
Тип конфигурационной единицы
"""
class CIType(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    class Meta:
        verbose_name = 'Тип конфигурационной единицы'
        verbose_name_plural = 'Типы конфигурационной единицы'

    def __str__(self):
        return self.name
