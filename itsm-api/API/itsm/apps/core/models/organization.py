from django.db import models

"""
Организация
"""
class Organization(models.Model):
    name = models.CharField(max_length=100)
    
    class Meta:
        verbose_name = 'Организация'
        verbose_name_plural = 'Организации'

    def __str__(self):
        return self.name
    
class TenantModel(models.Model):
    organization = models.ForeignKey("core.Organization", on_delete=models.CASCADE, related_name='%(class)s_set', db_index=True)

    class Meta:
        abstract = True
