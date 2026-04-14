from django.db import models
from django.conf import settings
from .ticket import Ticket
from ...core.models.organization import TenantModel

"""
Комментарии к заявкам
"""
class Comment(TenantModel):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    is_internal = models.BooleanField(default=False) 
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'

    def __str__(self):
        return f"Comment by {self.author.username} on {self.ticket.ticket_number}"