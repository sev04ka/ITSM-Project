from rest_framework import serializers
from ..models.citype import CIType

class CITypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = CIType
        fields = ["id", "name", "description"]
