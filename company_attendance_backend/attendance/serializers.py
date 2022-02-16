from rest_framework import serializers
from .models import Profile, Attendance

class ProfileSerializer(serializers.ModelSerializer):
	class Meta:
		model = Profile
		fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
	class Meta:
		model = Attendance
		fields = '__all__'