from rest_framework.permissions import BasePermission
from .models import Profile, Attendance
from django.contrib.auth.models import User

class UserPermission(BasePermission):
	def has_permission(self, request, view, *args, **kwargs):

		assert request.user.groups.first(), 'User has problem with his category/group.'

		if request.user.groups.first().name == 'managers':
			return True # treated as superusers

		elif request.user.groups.first().name == 'receptionists' and view.action in ['list', 'retrieve']:
			return True

		elif request.user.groups.first().name == 'employees' and view.action in ['list', 'retrieve']:
			view.queryset = User.objects.filter(id=request.user.id)
			return True
			
		else:
			return False

class ProfilePermission(BasePermission):
	def has_permission(self, request, view, *args, **kwargs):

		assert request.user.groups.first(), 'User has problem with his category/group.'

		if request.user.groups.first().name == 'managers':
			return True

		elif request.user.groups.first().name == 'receptionists' and view.action in ['list', 'retrieve']:
			return True

		elif request.user.groups.first().name == 'employees' and view.action in ['list', 'retrieve']:
			view.queryset = Profile.objects.filter(user=request.user)
			return True
			
		else:
			return False



class AttendancePermission(BasePermission):
	def has_permission(self, request, view, *args, **kwargs):

		assert request.user.groups.first(), 'User has problem with his category/group.'

		if request.user.groups.first().name == 'managers':
			return True

		elif request.user.groups.first().name == 'receptionists' and view.action in ['list', 'retrieve', 'create', 'update', 'partial_update']:
			return True

		elif request.user.groups.first().name == 'employees' and view.action in ['list', 'retrieve']:
			view.queryset = Attendance.objects.filter(user=request.user)
			return True

		else:
			return False