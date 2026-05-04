from django.core.management.base import BaseCommand
from itsm.apps.cmdb.models import CIType

class Command(BaseCommand):
    help = 'Create initial ci types'

    def handle(self, *args, **options):
        if CIType.objects.count() != 0:
            self.stdout.write(self.style.WARNING('CI types already exists'))
            return
        
        CIType.objects.bulk_create([
            CIType(name = 'Сервер'),
            CIType(name = 'Рабочая станция'),
            CIType(name = 'Сетевое оборудование'),
            CIType(name = 'Принтер'),
            CIType(name = 'Программное обеспечение'),
            CIType(name = 'Переферия'),
        ])
        
        self.stdout.write(self.style.SUCCESS(f'CI types created'))