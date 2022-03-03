from rest_framework import serializers
from .models import Profile, Attendance
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source="groups.first.id")

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'role', 'profile')
        depth = 1
        required_fields = [
            'username',
            'email',
            'first_name',
            'last_name',
            'role'
        ]

    # Update and create methods are checking for role input and assign it for the user because ModelSerializer doesn't support that

    def create(self, validated_data):
        group_id = int(validated_data['groups']['first']['id'])

        del validated_data["groups"]

        instance = super().create(validated_data)

        group = Group.objects.get(id=group_id)

        group.user_set.add(instance)

        return instance

    def update(self, instance, validated_data):
        if 'groups' in validated_data:
            group_id = int(validated_data['groups']['first']['id'])

            del validated_data["groups"]

            group = Group.objects.get(id=group_id)

            group.user_set.add(instance)

        instance = super().update(instance, validated_data)

        return instance


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'


class AttendanceSerializer(serializers.ModelSerializer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.Meta.depth = self.context.get('depth', 0)

    class Meta:
        model = Attendance
        fields = '__all__'
