from django.core.management.base import BaseCommand
from itsm.apps.users.models import Role

class Command(BaseCommand):
    help = 'Create initial roles'

    def handle(self, *args, **options):
        
        
        Role.objects.bulk_create([
            Role(name = 'admin'),
            Role(name = 'support'),
            Role(name = 'user')
        ])
        
        self.stdout.write(self.style.SUCCESS(f'Roles created'))