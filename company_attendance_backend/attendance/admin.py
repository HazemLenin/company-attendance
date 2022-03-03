from django.contrib import admin
from .models import Profile, Attendance
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model
# Register your models here.

User = get_user_model()
admin.site.register(User, UserAdmin)
admin.site.register(Profile)


class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'time_in', 'time_out']


admin.site.register(Attendance, AttendanceAdmin)
