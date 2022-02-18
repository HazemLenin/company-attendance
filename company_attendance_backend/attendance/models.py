from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class CustomModel():
	"""
	Default Model class with (created, modified, created_by, modified_by) fields
	"""
	created = models.DateTimeField(auto_now_add=True)
	modified = models.DateTimeField(auto_now=True)
	created_by = models.ForeignKey(User, on_delete=models.RESTRICT, related_name='created_attendances')
	modified_by = models.ForeignKey(User, on_delete=models.RESTRICT, related_name='modified_attendances')


class Profile(models.Model, CustomModel):
	user = models.OneToOneField(User, on_delete=models.RESTRICT, related_name='profile')
	birth_date = models.DateField()
	address = models.CharField(max_length=20)
	phone = models.CharField(max_length=20)
	in_company = models.BooleanField(default=False)

	def __str__(self):
		return self.user.username


class Attendance(models.Model, CustomModel):
	user = models.ForeignKey(User, on_delete=models.RESTRICT, related_name='attendances')
	time_in = models.DateTimeField()
	time_out = models.DateTimeField(blank=True, null=True)

	def __str__(self):
		return self.user.username