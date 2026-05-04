from django.core.management.base import BaseCommand
from itsm.apps.core.models import Organization
import os

class Command(BaseCommand):
    help = 'Create initial admin org'

    def handle(self, *args, **options):
        if Organization.objects.filter(name= 'admin-org').exists():
            self.stdout.write(self.style.WARNING('Admin org already exists'))
            return
        
        Organization.objects.create(
            name= 'admin-org'
        )
        
        self.stdout.write(self.style.SUCCESS(f'Admin org created'))