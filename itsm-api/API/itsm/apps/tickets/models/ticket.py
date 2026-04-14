from django.db import models
from django.conf import settings
from itsm.apps.cmdb.models.configurationItem import ConfigurationItem
from django.utils import timezone
from ...core.models.organization import TenantModel

class TicketType(models.TextChoices):
    INCIDENT = 'incident', 'Инцидент'
    SERVICE_REQUEST = 'service_request', 'Запрос на обслуживание'
    PROBLEM = 'problem', 'Проблема'

class TicketPriority(models.TextChoices):
    LOW = 'low', 'Низкий'
    MEDIUM = 'medium', 'Средний'
    HIGH = 'high', 'Высокий'
    CRITICAL = 'critical', 'Критический'

class TicketStatus(models.TextChoices):
    NEW = 'new', 'Новый'
    IN_PROGRESS = 'in_progress', 'В работе'
    WAITING = 'waiting', 'Ожидание'
    RESOLVED = 'resolved', 'Решено'
    CLOSED = 'closed', 'Закрыто'
    CANCELLED = 'cancelled', 'Отменено'

"""
Базовая заявка (Инцидент/Запрос)
"""
class Ticket(TenantModel):
    ticket_number = models.CharField(max_length=20, unique=True, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField()
    
    ticket_type = models.CharField(max_length=20, choices=TicketType.choices, default=TicketType.INCIDENT)
    priority = models.CharField(max_length=10, choices=TicketPriority.choices, default=TicketPriority.MEDIUM)
    status = models.CharField(max_length=15, choices=TicketStatus.choices, default=TicketStatus.NEW)

    requester = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='requested_tickets')
    assignee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tickets')
    
    configuration_item = models.ForeignKey('cmdb.ConfigurationItem', on_delete=models.SET_NULL, null=True, blank=True, related_name='tickets')
    parent_problem = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, limit_choices_to={'ticket_type': 'problem'}, related_name='related_incidents')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Заявка'
        verbose_name_plural = 'Заявки'

    def __str__(self):
        return f"{self.ticket_number} - {self.title}"

    def save(self, *args, **kwargs):
        if not self.ticket_number:
            prefix = 'INC' if self.ticket_type == 'incident' else 'REQ'
            last_ticket = Ticket.objects.filter(
                ticket_number__startswith=prefix
            ).order_by('-ticket_number').first()
            
            if last_ticket:
                last_number = int(last_ticket.ticket_number.split('-')[-1])
                new_number = last_number + 1
            else:
                new_number = 1
            
            year = self.created_at.year if self.created_at else timezone.now().year
            self.ticket_number = f"{prefix}-{year}-{new_number:04d}"
        
        super().save(*args, **kwargs)
