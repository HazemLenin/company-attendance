from rest_framework import viewsets
from .models import Profile, Attendance
from .serializers import UserSerializer, ProfileSerializer, AttendanceSerializer
from .permissions import UserPermission, ProfilePermission, AttendancePermission, IsManager
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework.views import APIView, Response

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

class Me(APIView):
	def get(self, request, format=None):
		user = request.user
		user_serializer = UserSerializer(user)

		profile = Profile.objects.get(user=user)
		profile_serializer = ProfileSerializer(profile)

		return Response({'user': user_serializer.data, 'profile': profile_serializer.data})

class ManagerDashboard(APIView):

	permission_classes = [IsManager]

	def get(self, reequest, format=None):
		# attended_today = Attendance.objects.filter()
		attending = Profile.objects.filter(in_company=True)
		attendance_serializer = ProfileSerializer(attending, many=True)

		absent = Profile.objects.filter(in_company=False)
		absent_serializer = ProfileSerializer(absent, many=True)

		return Response({'attending': attending.count(), 'absent': absent.count()})