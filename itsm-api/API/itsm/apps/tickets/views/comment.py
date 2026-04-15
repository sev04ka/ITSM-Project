from rest_framework import permissions, viewsets
from ..models.comment import Comment
from ..serializers.comment import CommentSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.decorators import action
from rest_framework.response import Response



class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    #permission_classes = [permissions.IsAuthenticated]


    @action(
            methods=['get'], 
            detail=False, 
            url_path='for/(?P<pk>[^/.]+)', 
            url_name='ticket-comments'
    )
    def get_ticket_comments(self, request, pk):
        is_internal = True if request.user.role.name == "user" else False

        filter_kwargs = {
            'ticket_id': pk,
            'is_internal': is_internal,
        }
        queryset = Comment.objects.filter(**filter_kwargs)

        paginated_queryset = self.paginate_queryset(queryset)
        serializer = CommentSerializer(paginated_queryset, many=True)
        return self.get_paginated_response(serializer.data)

    
    