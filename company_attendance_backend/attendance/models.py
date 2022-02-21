from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.crypto import get_random_string
from django.utils.translation import gettext_lazy as _


# Create your models here.

class User(AbstractUser):
    REQUIRED_FIELDS = [
        'first_name',
        'last_name',
        'email'
    ]


def attending_code_generator():
    code = get_random_string(length=10, allowed_chars='0123456789')

    if Profile.objects.filter(
            attending_code=code).exists(): # if code already exists, enter the loop to generate another code that is unique

        for i in range(Profile.objects.count()):

            code = get_random_string(length=10, allowed_chars='0123456789')

            if Profile.objects.filter(attending_code=code).exists():

                continue

            else:

                return code

        raise Exception('Cannot generate employee code. No possible combinations left!')

    return code


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    birth_date = models.DateField()
    address = models.CharField(max_length=20)
    phone = models.CharField(max_length=20)
    in_company = models.BooleanField(default=False)
    attending_code = models.CharField(max_length=10, blank=True, default=attending_code_generator, unique=True)

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    # created_by = models.ForeignKey(User, on_delete=models.RESTRICT, related_name='created_profiles')
    # modified_by = models.ForeignKey(User, on_delete=models.RESTRICT, related_name='modified_profiles')

    def __str__(self):
        return self.user.username


class Attendance(models.Model):
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name='attendances')
    time_in = models.DateTimeField()
    time_out = models.DateTimeField(blank=True, null=True)

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    # created_by = models.ForeignKey(User, on_delete=models.RESTRICT, related_name='created_attendances')
    # modified_by = models.ForeignKey(User, on_delete=models.RESTRICT, related_name='modified_attendances')

    def __str__(self):
        return self.user.username
