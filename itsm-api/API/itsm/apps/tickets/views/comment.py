from rest_framework import permissions, viewsets
from ..models.comment import Comment
from ..serializers.comment import CommentSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

class CustomPageNumberPagination(PageNumberPagination):
    page_size = 15  
    # page_size_query_param = 'page_size'  
    # max_page_size = 10000 

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    #permission_classes = [permissions.IsAuthenticated]

    pagination_class = CustomPageNumberPagination

    def perform_create(self, serializer):
        ticket_id = self.request.query_params.get('ticket')
        if not ticket_id:
            raise serializer.ValidationError({'ticket': 'Ticket ID is required'})
        
        serializer.save(
            author = self.request.user,
            ticket_id = ticket_id,
            organization = self.request.user.organization
        )


    @action(
            methods=['get'], 
            detail=False, 
            url_path='for/(?P<pk>[^/.]+)', 
            url_name='ticket-comments'
    )
    def get_ticket_comments(self, request, pk):

        filter_kwargs = {
            'ticket_id': pk,
        }

        if request.user.role.name == "user":
            filter_kwargs['is_internal'] = False

        queryset = Comment.objects.filter(**filter_kwargs)

        paginated_queryset = self.paginate_queryset(queryset)
        serializer = CommentSerializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)

    
    