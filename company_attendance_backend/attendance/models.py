from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.crypto import get_random_string
from django.utils.translation import gettext_lazy as _
from django.core.mail import EmailMultiAlternatives
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created


# Create your models here.

class User(AbstractUser):
    email = models.EmailField(_('email address'), unique=True)

    REQUIRED_FIELDS = [
        'first_name',
        'last_name',
        'email'
    ]


def attending_code_generator():
    code = get_random_string(length=10, allowed_chars='0123456789')

    if Profile.objects.filter(
            attending_code=code).exists():  # if code already exists, enter the loop to generate another code that is unique

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


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    :param sender: View Class that sent the signal
    :param instance: View Instance that sent the signal
    :param reset_password_token: Token Model Object
    :param args:
    :param kwargs:
    :return:
    """
    print("{}?token={}".format(
            # instance.request.build_absolute_uri(reverse('password_reset:reset-password-confirm')),
            'localhost:3000/password_reset/confirm',
            reset_password_token.key
    ))
    # send an e-mail to the user
    context = {
        'current_user': reset_password_token.user,
        'username': reset_password_token.user.username,
        'email': reset_password_token.user.email,
        'reset_password_url': "{}?token={}".format(
            instance.request.build_absolute_uri(reverse('password_reset:reset-password-confirm')),
            reset_password_token.key)
    }

    # render email text
    email_html_message = render_to_string('email/user_reset_password.html', context)
    email_plaintext_message = render_to_string('email/user_reset_password.txt', context)

    msg = EmailMultiAlternatives(
        # title:
        "Password Reset for {title}".format(title="company-attendance"),
        # message:
        email_plaintext_message,
        # from:
        "noreply@somehost.local",
        # to:
        [reset_password_token.user.email]
    )
    msg.attach_alternative(email_html_message, "text/html")
    msg.send()
