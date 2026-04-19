from django.core.management.base import BaseCommand
from itsm.apps.users.models import User
import os

class Command(BaseCommand):
    help = 'Create initial admin user'

    def handle(self, *args, **options):
        
        if User.objects.filter(is_superuser=True).exists():
            self.stdout.write(self.style.WARNING('Admin user already exists'))
            return
        
        User.objects.create_superuser(
            first_name='admin',
            email='admin@email.com',
            password='1',
            is_staff=True,
            is_superuser=True,
            organization_id=1,
            role_id=1
        )
        
        self.stdout.write(self.style.SUCCESS(f'Admin user created'))