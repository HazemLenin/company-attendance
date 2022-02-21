from django.contrib import admin
from .models import User, Profile, Attendance

# Register your models here.

admin.site.register(User)
admin.site.register(Profile)


class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'time_in', 'time_out']


admin.site.register(Attendance, AttendanceAdmin)
