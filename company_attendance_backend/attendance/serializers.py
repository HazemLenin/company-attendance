from rest_framework import serializers
from .models import Profile, Attendance
from django.contrib.auth.models import User
from django.conf import settings

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = tuple(User.REQUIRED_FIELDS) + (
            'id',
            'username',
        )
        read_only_fields = ('username',)

class ProfileSerializer(serializers.ModelSerializer):
	class Meta:
		model = Profile
		fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
	class Meta:
		model = Attendance
		fields = '__all__'