from rest_framework import serializers
from ..models.configurationItem import ConfigurationItem
from ..models.cidependency import CIDependency
from .configurationitem import ConfigurationItemSerializer


class CIDependencySerializer(serializers.ModelSerializer):
    parent = ConfigurationItemSerializer(read_only = True)
    child = ConfigurationItemSerializer(read_only = True)

    class Meta:
        model = CIDependency
        fields = [
            "id", 
            "label",
            "parent",
            "parent_id",
            "child",
            "child_id"
        ]

        extra_kwargs = {
        'parent_id': {'source': 'parent', 'write_only': True},
        'child_id': {'source': 'child', 'write_only': True},
        }


