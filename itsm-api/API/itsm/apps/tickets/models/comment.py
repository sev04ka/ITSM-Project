from django.db import models
from django.conf import settings
from .ticket import Ticket
from ...core.models.organization import TenantModel


class CommentType(models.TextChoices):
    BASE_COMMENT = 'comment', 'Комментарий'
    CLOSE_COMMENT = 'close_comment', 'Комментарий при закрытии'
    CANCEL_COMMENT = 'cancel_comment', 'Комментарий при отмене'
    RESOLVE_COMMENT = 'resolve_comment', 'Комментарий при решении'
    REOPEN_COMMENT = 'reopen_comment', 'Комментарий при возобновлении'

"""
Комментарии к заявкам
"""
class Comment(TenantModel):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    comment_type = models.CharField(max_length=15, choices=CommentType.choices, default=CommentType.BASE_COMMENT)
    text = models.TextField()
    is_internal = models.BooleanField(default=False) 
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'

    def __str__(self):
        return f"Comment by {self.author.username} on {self.ticket.ticket_number}"