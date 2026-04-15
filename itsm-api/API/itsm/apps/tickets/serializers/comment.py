from rest_framework import serializers
from ..models.comment import Comment
from ...users.serializers.user import UserSerializer


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only = True)

    class Meta:
        model = Comment
        fields = [
            'id',
            'author',
            'comment_type',
            'text',
            'is_internal',
            'created_at'
        ]

        read_only_fields = [
            'id',
            'comment_type',
            'author',
            'created_at'
        ]


