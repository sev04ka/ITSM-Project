from rest_framework import serializers
from ..models.ticket import Ticket
from ...users.serializers.user import UserSerializer
from django.utils.formats import date_format


class TicketSerializer(serializers.ModelSerializer):
    requester = UserSerializer(read_only = True)
    assignee = UserSerializer(read_only = True)

    impact = serializers.ChoiceField(
        choices=[('1', '1'), ('2', '2'), ('3', '3'), ('4', '4'), ('5', '5')],
        write_only=True,
        required=False
    )

    urgency = serializers.ChoiceField(
        choices=[('1', '1'), ('2', '2'), ('3', '3'), ('4', '4'), ('5', '5')],
        write_only=True,
        required=False
    )

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
            'impact',  
            'urgency', 
        ]

        read_only_fields = [
            'id',
            'ticket_number',
            'requester',        
            'organization',     
            'priority',
            'status',
            'created_at', 
            'updated_at',
            'resolved_at',
            'closed_at',
        ]


        extra_kwargs = {
        'assignee_id': {'source': 'assignee', 'write_only': True},
        }

    def create(self, validated_data):
        impact = validated_data.pop('impact', None)
        urgency = validated_data.pop('urgency', None)

        errors = {}
        if not impact:
            errors['impact'] = ['Это поле обязательно для заполнения']
        if not urgency:
            errors['urgency'] = ['Это поле обязательно для заполнения']
    
        if errors:
            raise serializers.ValidationError(errors)
        
        ticket = super().create(validated_data)

        if impact and urgency:
            priority_value = self.calculate_priority(impact, urgency)
            ticket.priority = priority_value
            ticket.save(update_fields=['priority'])
        
        return ticket
    
    def calculate_priority(self, impact, urgency):
        matrix = {
            # Критический приоритет (5)
            ('5', '5'): '5',  

            # Высокий приоритет (4)
            ('5', '1'): '4', 
            ('4', '2'): '4', 

            # Средний приоритет (3)
            ('5', '3'): '3',    
            ('4', '4'): '3',    
            ('3', '5'): '3',    

            # Обычный приоритет (2)
            ('4', '2'): '2',   
            ('5', '2'): '2',          
            ('3', '3'): '2',   
            ('4', '3'): '2',            
            ('2', '4'): '2',   
            ('3', '4'): '2',  
            ('1', '5'): '2',  
            ('2', '5'): '2',   

            # Низкий приоритет (1) 
            ('2', '1'): '1',  
            ('3', '1'): '1',  
            ('4', '1'): '1',  
            ('5', '1'): '1',  
            ('1', '1'): '1',  
            ('1', '2'): '1',  
            ('2', '2'): '1',  
            ('3', '2'): '1',  
            ('1', '3'): '1',  
            ('2', '3'): '1',  
            ('1', '4'): '1',  
        }
        return matrix.get((impact, urgency), '2')

