from django.contrib.auth.models import User
from seadssite.models import UserProfile
from rest_framework import serializers

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('user', 'phone', 'cell_provider')