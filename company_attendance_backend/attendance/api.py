from rest_framework import viewsets
from .models import Profile, Attendance
from .serializers import ProfileSerializer, AttendanceSerializer
from .permissions import UserPermission, ProfilePermission, AttendancePermission
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from djoser.serializers import UserSerializer # if in the first release there is no need for djoser, djoser will be removed

class UserViewSet(viewsets.ModelViewSet):
	queryset = User.objects.all()
	serializer_class = UserSerializer
	permission_classes =  (IsAuthenticated, UserPermission)


class ProfileViewSet(viewsets.ModelViewSet):
	queryset = Profile.objects.all()
	serializer_class = ProfileSerializer
	permission_classes = (IsAuthenticated, ProfilePermission)


class AttendanceViewSet(viewsets.ModelViewSet):
	queryset = Attendance.objects.all()
	serializer_class = AttendanceSerializer
	permission_classes = (IsAuthenticated, AttendancePermission)