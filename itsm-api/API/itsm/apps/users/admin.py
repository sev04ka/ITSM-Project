from django.contrib import admin
from .models import *

@admin.register(User)
class TicketAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name']

