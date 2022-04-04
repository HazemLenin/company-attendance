from rest_framework.permissions import BasePermission
from .models import Profile, Attendance
from django.contrib.auth import get_user_model
User = get_user_model()

class UserPermission(BasePermission):

    def has_permission(self, request, view, *args, **kwargs):

        assert request.user.groups.first(), 'User has problem with his role/group.'

        user_group = request.user.groups.first()

        if user_group.name == 'managers':
            return True  # treated as superusers

        elif user_group.name == 'receptionists' and view.action in ['list', 'retrieve']:
            return True

        elif user_group.name == 'employees' and view.action in ['list', 'retrieve']:
            view.queryset = User.objects.filter(id=request.user.id)
            return True

        else:
            return False


class ProfilePermission(BasePermission):

    def has_permission(self, request, view, *args, **kwargs):

        assert request.user.groups.first(), 'User has problem with his role/group.'

        user_group = request.user.groups.first()

        if user_group.name == 'managers':
            return True

        elif user_group.name == 'receptionists' and view.action in ['list', 'retrieve']:
            return True

        elif user_group.name == 'employees' and view.action in ['list', 'retrieve']:
            view.queryset = Profile.objects.filter(user=request.user)
            return True

        else:
            return False


class AttendancePermission(BasePermission):

    def has_permission(self, request, view, *args, **kwargs):

        assert request.user.groups.first(), 'User has problem with his role/group.'

        user_group = request.user.groups.first()

        if user_group.name == 'managers':
            return True

        elif user_group.name == 'receptionists' and view.action in ['list', 'retrieve', 'create', 'update',
                                                                    'partial_update']:
            return True

        elif user_group.name == 'employees' and view.action in ['list', 'retrieve']:
            view.queryset = Attendance.objects.filter(user=request.user)
            return True

        else:
            return False


class IsManager(BasePermission):

    def has_permission(self, request, view, *args, **kwargs):

        assert request.user.groups.first(), 'User has problem with his role/group.'

        user_group = request.user.groups.first()

        if user_group.name == 'managers':
            return True
        else:
            return False


class IsReceptionist(BasePermission):

    def has_permission(self, request, view, *args, **kwargs):

        assert request.user.groups.first(), 'User has problem with his role/group.'

        user_group = request.user.groups.first()

        if user_group.name == 'receptionists':
            return True
        else:
            return False
