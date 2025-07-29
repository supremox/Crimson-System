# serializers.py
from rest_framework import serializers
from .models import Stamping

class StampingSerializer(serializers.ModelSerializer):
    stamping_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Stamping
        fields = ['id', 'stamping_image_url']

    def get_stamping_image_url(self, obj):
        request = self.context.get('request')
        if obj.stamping_image and hasattr(obj.stamping_image, 'url'):
            if request:
                return request.build_absolute_uri(obj.stamping_image.url)
            return obj.stamping_image.url
        return None