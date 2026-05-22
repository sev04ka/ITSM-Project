from rest_framework import serializers
from ..models.ticket import Ticket
from ...users.serializers.user import UserSerializer
from django.utils.formats import date_format


class TicketSerializer(serializers.ModelSerializer):
    requester = UserSerializer(read_only = True)
    assignee = UserSerializer(read_only = True)

    class Meta:
        model = Ticket
        fields = [
            'id',
            'ticket_number',
            'title',
            'description',
            'ticket_type', 
            'priority',
            'status',
            'requester',
            'assignee',
            'assignee_id',
            'created_at', 
            'updated_at',
            'resolved_at',
            'closed_at',
        ]

        read_only_fields = [
            'id',
            'ticket_number',
            'requester',        
            'organization',     
            'created_at', 
            'updated_at',
            'resolved_at',
            'closed_at',
        ]

        extra_kwargs = {
        'assignee_id': {'source': 'assignee', 'write_only': True},
        }

