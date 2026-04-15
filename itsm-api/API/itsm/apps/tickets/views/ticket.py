from rest_framework import permissions, viewsets, status
from ..models.ticket import Ticket
from ..models.comment import Comment
from ..serializers.ticket import TicketSerializer
from ..serializers.comment import CommentSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.utils import timezone



class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().select_related('requester')
    serializer_class = TicketSerializer
    #permission_classes = [permissions.IsAuthenticated]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    filterset_fields = {
        'status': ['exact'],
        'priority': ['exact'],
        # 'requester': ['exact'],
        # 'assignee': ['exact'],
        # 'ci_type': ['exact'],
        'created_at': ['gte', 'lte'],
    }

    search_fields = ['title', 'description', 'ticket_number']

    #ordering_fields = ['created_at', 'priority', 'status', 'title']
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
        queryset = Ticket.objects.filter(owner = request.user)
        serializer = TicketSerializer(queryset, many=True)
        return Response(serializer.data)
    

    
    @action(
        methods=['PATCH'], 
        detail=True, 
        url_path='close', 
        url_name='close-ticket'
        )
    def close_ticket(self, request, pk=None):
        ticket = self.get_object()

        if ticket.requester != request.user and not request.user.is_staff:
            raise PermissionDenied()
        
        if ticket.status == 'closed':
            return Response(
                {'detail': 'Ticket is already closed.'},
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

        if ticket.requester != request.user and not request.user.is_staff:
            raise PermissionDenied()
        
        if ticket.status == 'cancelld':
            return Response(
                {'detail': 'Ticket is already cancelled.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        cancel_comment_text = request.data.get('comment', 'Тикет отменён')

        with transaction.atomic():
            ticket.status = 'cancel'
            ticket.closed_at = timezone.now()
            ticket.save(update_fields=['status', 'closed_at'])

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

        if ticket.requester != request.user and not request.user.is_staff:
            raise PermissionDenied()
        
        if ticket.status == 'resolved':
            return Response(
                {'detail': 'Ticket is already resolved.'},
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

        if ticket.requester != request.user and not request.user.is_staff:
            raise PermissionDenied()
        
        if not ticket.status in ['resolved', 'closed', 'cancelled']:
            return Response(
                {'detail': 'Ticket cannot be reopened, cause it`s still is`nt resolved/cancelled/closed'},
                status=status.HTTP_400_BAD_REQUEST
            )

        reopen_comment_text = request.data.get('comment', 'Тикет открыт заново')

        with transaction.atomic():
            ticket.status = 'waiting'
            ticket.closed_at = None
            ticket.save(update_fields=['status', 'closed_at'])

            comment = Comment.objects.create(
                ticket = ticket,
                author = request.user,
                comment_type = 'reopen_comment',
                text = reopen_comment_text_comment_text,
                is_internal = False,
                organization = ticket.organization
            )


        ticket_serializer = self.get_serializer(ticket)
        comment_serializer = CommentSerializer(comment)

        return Response({
            'ticket': ticket_serializer.data,
            'comment': comment_serializer.data,
        }, status=status.HTTP_200_OK)