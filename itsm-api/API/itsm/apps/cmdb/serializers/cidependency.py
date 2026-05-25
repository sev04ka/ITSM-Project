from rest_framework import serializers
from ..models.configurationItem import ConfigurationItem
from ..models.cidependency import CIDependency
from .configurationitem import ConfigurationItemSerializer


class CIDependencySerializer(serializers.ModelSerializer):
    parent = ConfigurationItemSerializer(read_only=True)
    child = ConfigurationItemSerializer(read_only=True)

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

    def validate(self, attrs):
        parent_id = attrs.get('parent_id')
        child_id = attrs.get('child_id')

        if self.instance:
            parent_id = parent_id or self.instance.parent_id
            child_id = child_id or self.instance.child_id

        if not parent_id or not child_id:
            return attrs

        if parent_id == child_id:
            raise serializers.ValidationError({
                'child_id': 'Родитель и потомок не могут быть одинаковыми'
            })

        if self._has_path(child_id, parent_id):
            raise serializers.ValidationError({
                'child_id': 'Создание зависимости приведет к циклической зависимости'
            })

        return attrs

    def _has_path(self, start_id, target_id, exclude_dep_id=None):
        visited = set()
        queue = [start_id]

        while queue:
            current = queue.pop(0)
            if current == target_id:
                return True
            if current in visited:
                continue
            visited.add(current)

            qs = CIDependency.objects.filter(parent_id=current).values_list('child_id', flat=True)
            if exclude_dep_id:
                qs = qs.exclude(id=exclude_dep_id)
            
            queue.extend(qs)

            if len(visited) > 5000:
                break

        return False


