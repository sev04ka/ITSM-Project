from django.db import models

"""
Роль пользователя
"""
class Role(models.Model):
    name = models.CharField(max_length=50)
    
    class Meta:
        verbose_name = 'Роль пользвователя'
        verbose_name_plural = 'Роли пользователя'

    def __str__(self):
        return self.name
