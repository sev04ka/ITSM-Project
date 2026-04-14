from rest_framework import permissions, viewsets
from ..models.ticket import Ticket
from ..serializers.ticket import TicketSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.decorators import action
from rest_framework.response import Response



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
        print('a')
        serializer.save(
            requester = self.request.user,
            organization = self.request.user.organization
        )

    @action(methods=['get'], detail=False, url_path='my', url_name='user-tickets')
    def get_user_tickets(self, request):
        queryset = Ticket.objects.filter(owner = request.user)
        serializer = TicketSerializer(queryset, many=True)
        return Response(serializer.data)
    