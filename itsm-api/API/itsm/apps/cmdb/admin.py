from django.contrib import admin
from .models import *

@admin.register(ConfigurationItem)
class ConfigurationItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'ci_type', 'status',  'serial_number', 'owner']

@admin.register(CIType)
class CITypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']