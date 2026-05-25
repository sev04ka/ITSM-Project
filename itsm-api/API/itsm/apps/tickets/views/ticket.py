from rest_framework import permissions, viewsets, status
from rest_framework.exceptions import PermissionDenied, MethodNotAllowed, ValidationError
from ..models.ticket import Ticket
from ..models.comment import Comment
from itsm.apps.users.models import User
from ..serializers.ticket import TicketSerializer
from ..serializers.comment import CommentSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.utils import timezone
from itsm.apps.core.permissions import *


class TicketViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'patch', 'head', 'options']

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.IsAuthenticated]
        elif self.action == 'partial_update':
            permission_classes = [permissions.IsAuthenticated, IsSuperAdmin, IsMemberOfOrganization]
        elif self.action in ['close_ticket', 'cancel_ticket', 'resolve_ticket', 'reopen_ticket']:
            permission_classes = [permissions.IsAuthenticated, IsMemberOfOrganization]
        elif self.action in ['assign', 'remove_assignee']:
            permission_classes = [permissions.IsAuthenticated, IsMemberOfOrganization, IsAdminOrSupport]
        else:
            permission_classes = [permissions.IsAuthenticated, IsMemberOfOrganization]
        
        return [permission() for permission in permission_classes]

    def partial_update(self, request, *args, **kwargs):

        raise MethodNotAllowed(
            method='PATCH',
            detail='Прямое обновление тикета запрещено.'
        )

    queryset = Ticket.objects.all().select_related('requester')
    serializer_class = TicketSerializer
    

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    filterset_fields = {
        'status': ['exact'],
        'priority': ['exact'],
        'ticket_type': ['exact'],
        # 'requester': ['exact'],
        # 'assignee': ['exact'],
        'created_at': ['gte', 'lte'],
    }

    search_fields = ['title', 'description', 'ticket_number']

    ordering_fields = [
        'created_at', 
        'priority',
    ]
    ordering = ['-created_at']  

    def perform_create(self, serializer):
        serializer.save(
            requester = self.request.user,
            organization = self.request.user.organization
        )

    


    @action(
        methods=['get'], 
        detail=False, 
        url_path='my', 
        url_name='user-tickets'
    )
    def get_user_tickets(self, request):
        queryset = Ticket.objects.filter(
            requester = request.user, 
            organization=request.user.organization
        ).select_related('requester', 'organization')

        page = self.paginate_queryset(queryset)

        serializer = self.get_serializer(page, many=True)

        return self.get_paginated_response(serializer.data)
    
    @action(
        methods=['patch'], 
        detail=True, 
        url_path='assign', 
        url_name='assign'
    )
    def assign(self, request, pk=None):
        ticket = self.get_object()

        assignee_id = request.data.get('assignee_id')
        if not assignee_id:
            raise ValidationError({"assignee_id": "ID required"})
        
        try:
            assignee_id = int(assignee_id)
        except (ValueError, TypeError):
            raise ValidationError({"assignee_id": "Incorrect ID"})
        
        try:
            assignee = User.objects.select_related('organization', 'role').get(
                id=assignee_id
            )
        except User.DoesNotExist:
            raise ValidationError({"assignee_id": "No user with this id"})
        
        if ticket.status in ['closed', 'cancelled', 'resolved']:
            raise ValidationError({
                "detail": f"Cannot assign to ticket with status: '{ticket.status}'"
            })
        
        with transaction.atomic():
            ticket.status = 'in_progress'
            ticket.updated_at = timezone.now()
            ticket.assignee = assignee
            ticket.save(update_fields=['status', 'updated_at', 'assignee'])

            comment = Comment.objects.create(
                ticket = ticket,
                author = request.user,
                comment_type = 'assign_comment',
                text = f"{request.user.first_name} {request.user.last_name} назначает исполнителем оператора {assignee.first_name} {assignee.last_name}.",
                is_internal = False,
                organization = ticket.organization
            )
        
        return Response(status=status.HTTP_200_OK)
    
    @action(
        methods=['patch'], 
        detail=True, 
        url_path='remove-assignee', 
        url_name='remove-assignee'
    )
    def remove_assignee(self, request, pk=None):
        ticket = self.get_object()

        if not ticket.assignee:
            return Response(
                {'detail': 'This ticket does not have assignee'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if ticket.status in ['closed', 'cancelled', 'resolved', 'new', 'waiting']:
            raise ValidationError({
                "detail": f"Cannot remove assignee from ticket with status: '{ticket.status}'"
            })
        
        with transaction.atomic():
            prev_assignee = ticket.assignee

            ticket.status = 'waiting'
            ticket.updated_at = timezone.now()
            ticket.assignee = None
            ticket.save(update_fields=['status', 'updated_at', 'assignee'])

            comment = Comment.objects.create(
                ticket = ticket,
                author = request.user,
                comment_type = 'unassign_comment',
                text = f"Оператор {prev_assignee.first_name} {prev_assignee.last_name} снят с исполнения заявки",
                is_internal = False,
                organization = ticket.organization
            )
        
        return Response(status=status.HTTP_200_OK)
    

    
    @action(
        methods=['PATCH'], 
        detail=True, 
        url_path='close', 
        url_name='close-ticket'
        )
    def close_ticket(self, request, pk=None):
        ticket = self.get_object()

        if ticket.requester != request.user:
            raise PermissionDenied()
        
        if ticket.status != 'resolved':
            return Response(
                {'detail': 'Cannot close unresolved ticket'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        close_comment_text = request.data.get('comment', 'Тикет закрыт')

        with transaction.atomic():
            ticket.status = 'closed'
            ticket.closed_at = timezone.now()
            ticket.save(update_fields=['status', 'closed_at'])

            comment = Comment.objects.create(
                ticket = ticket,
                author = request.user,
                comment_type = 'close_comment',
                text = close_comment_text,
                is_internal = False,
                organization = ticket.organization
            )


        ticket_serializer = self.get_serializer(ticket)
        comment_serializer = CommentSerializer(comment)

        return Response({
            'ticket': ticket_serializer.data,
            'comment': comment_serializer.data,
        }, status=status.HTTP_200_OK)
    


    @action(
        methods=['PATCH'], 
        detail=True, 
        url_path='cancel', 
        url_name='cancel-ticket'
    )
    def cancel_ticket(self, request, pk=None):
        ticket = self.get_object()

        if ticket.requester != request.user:
            raise PermissionDenied()
        
        if ticket.status == 'cancelled':
            return Response(
                {'detail': 'Ticket is already cancelled.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if ticket.status == 'resolved':
            return Response(
                {'detail': 'Cannot cancel resolved ticket.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if ticket.status == 'closed':
            return Response(
                {'detail': 'Cannot cancel closed ticket.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        cancel_comment_text = request.data.get('comment', 'Тикет отменён')

        with transaction.atomic():
            ticket.status = 'cancelled'
            ticket.updated_at = timezone.now()
            ticket.save(update_fields=['status', 'updated_at'])

            comment = Comment.objects.create(
                ticket = ticket,
                author = request.user,
                comment_type = 'cancel_comment',
                text = cancel_comment_text,
                is_internal = False,
                organization = ticket.organization
            )

        ticket_serializer = self.get_serializer(ticket)
        comment_serializer = CommentSerializer(comment)

        return Response({
            'ticket': ticket_serializer.data,
            'comment': comment_serializer.data,
        }, status=status.HTTP_200_OK)
    


    @action(
        methods=['PATCH'], 
        detail=True, 
        url_path='resolve', 
        url_name='resolve-ticket'
    )
    def resolve_ticket(self, request, pk=None):
        ticket = self.get_object()

        if not ticket.assignee or ticket.assignee != request.user:
            raise PermissionDenied("Чтобы решить заявку, нужно быть назначенным как её исполнитель")
        
        if ticket.status == 'resolved':
            return Response(
                {'detail': 'Ticket is already resolved.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if ticket.status == 'cancelled':
            return Response(
                {'detail': 'Cancelled ticket cannot be resolved.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if ticket.status == 'closed':
            return Response(
                {'detail': 'Closed ticket cannot be resolved.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        resolve_comment_text = request.data.get('comment', 'Тикет решён')

        with transaction.atomic():
            ticket.status = 'resolved'
            ticket.closed_at = timezone.now()
            ticket.save(update_fields=['status', 'closed_at'])

            comment = Comment.objects.create(
                ticket = ticket,
                author = request.user,
                comment_type = 'resolve_comment',
                text = resolve_comment_text,
                is_internal = False,
                organization = ticket.organization
            )


        ticket_serializer = self.get_serializer(ticket)
        comment_serializer = CommentSerializer(comment)

        return Response({
            'ticket': ticket_serializer.data,
            'comment': comment_serializer.data,
        }, status=status.HTTP_200_OK)
    
    
    
    @action(
        methods=['PATCH'], 
        detail=True, 
        url_path='reopen', 
        url_name='reopen-ticket'
    )
    def reopen_ticket(self, request, pk=None):
        ticket = self.get_object()

        if ticket.requester != request.user:
            raise PermissionDenied()
        
        if not ticket.status in ['resolved', 'closed', 'cancelled']:
            return Response(
                {'detail': 'Ticket cannot be reopened, cause it`s still is`nt resolved/cancelled/closed'},
                status=status.HTTP_400_BAD_REQUEST
            )

        reopen_comment_text = request.data.get('comment', 'Тикет открыт заново')

        with transaction.atomic():
            ticket.status = 'waiting'
            ticket.assignee = None
            ticket.closed_at = None
            ticket.save(update_fields=['status', 'closed_at', 'assignee'])

            comment = Comment.objects.create(
                ticket = ticket,
                author = request.user,
                comment_type = 'reopen_comment',
                text = reopen_comment_text,
                is_internal = False,
                organization = ticket.organization
            )


        ticket_serializer = self.get_serializer(ticket)
        comment_serializer = CommentSerializer(comment)

        return Response({
            'ticket': ticket_serializer.data,
            'comment': comment_serializer.data,
        }, status=status.HTTP_200_OK)