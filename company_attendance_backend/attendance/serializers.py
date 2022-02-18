from rest_framework import serializers
from .models import Profile, Attendance
from django.contrib.auth.models import User
from django.conf import settings

class UserSerializer(serializers.ModelSerializer):
	role = serializers.CharField(source="groups.first")
	class Meta:
		model = User
		fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role')

class ProfileSerializer(serializers.ModelSerializer):
	class Meta:
		model = Profile
		fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
	class Meta:
		model = Attendance
		fields = '__all__'