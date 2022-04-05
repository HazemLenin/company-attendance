from rest_framework.permissions import BasePermission
from .models import Profile, Attendance
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

User = get_user_model()


class UserPermission(BasePermission):

    def has_permission(self, request, view, *args, **kwargs):

        if request.user.groups.first().name == 'managers':
            return True  # treated as superusers

        elif request.user.has_perm('attendance.view_user') and view.action in ['list', 'retrieve']:
            if request.user.groups.first().name == 'employees':
                view.queryset = User.objects.filter(id=request.user.id)
            return True

        elif request.user.has_perm('attendance.add_user') and view.action == 'create':
            return True

        elif request.user.has_perm('attendance.change_user') and view.action in ['update', 'partial_update']:
            return True

        elif request.user.has_perm('attendance.delete_user') and view.action == 'delete':
            return True

        else:
            return False


class ProfilePermission(BasePermission):

    def has_permission(self, request, view, *args, **kwargs):

        if request.user.groups.first().name == 'managers':
            return True

        elif request.user.has_perm('attendance.view_profile') and view.action in ['list', 'retrieve']:
            if request.user.groups.first().name == 'employees':
                view.queryset = Profile.objects.filter(user=request.user)
            return True

        elif request.user.has_perm('attendance.add_profile') and view.action == 'create':
            return True

        elif request.user.has_perm('attendance.change_profile') and view.action in ['update', 'partial_update']:
            return True

        elif request.user.has_perm('attendance.delete_profile') and view.action == 'delete':
            return True

        else:
            return False


class AttendancePermission(BasePermission):

    def has_permission(self, request, view, *args, **kwargs):

        if request.user.groups.first().name == 'managers':
            return True

        elif request.user.has_perm('attendance.view_user') and view.action in ['list', 'retrieve']:
            if request.user.groups.first().name == 'employee':
                view.queryset = Attendance.objects.filter(user=request.user)
            return True

        elif request.user.has_perm('attendance.add_attendance') and view.action == 'create':
            return True

        elif request.user.has_perm('attendance.change_attendance') and view.action in ['update', 'partial_update']:
            return True

        elif request.user.has_perm('attendance.delete_attendance') and view.action == 'delete':
            return True

        else:
            return False


class IsManager(BasePermission):

    def has_permission(self, request, view, *args, **kwargs):

        try:
            user_group = request.user.groups.first()

        except Group.DoesNotExist:
            raise Exception('User has problem with his role/group.')

        if user_group.name == 'managers':
            return True
        else:
            return False


class IsReceptionist(BasePermission):

    def has_permission(self, request, view, *args, **kwargs):

        try:
            user_group = request.user.groups.first()

        except Group.DoesNotExist:
            raise Exception('User has problem with his role/group.')

        user_group = request.user.groups.first()

        if user_group.name == 'receptionists':
            return True
        else:
            return False
