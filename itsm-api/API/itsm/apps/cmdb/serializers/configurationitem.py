from rest_framework import serializers
from ..models.configurationItem import ConfigurationItem
from ..models.citype import CIType
from .ci_type import CITypeSerializer

class ConfigurationItemSerializer(serializers.ModelSerializer):
    ci_type = CITypeSerializer(read_only=True)

    class Meta:
        model = ConfigurationItem
        fields = ["id", "name", "ci_type", "ci_type_id", "status",  "serial_number"]

        extra_kwargs = {
        'ci_type_id': {'source': 'ci_type', 'write_only': True},
        }


