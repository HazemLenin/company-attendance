from django.contrib import admin
from .models import Profile, Attendance

# Register your models here.

admin.site.register(Profile)

class AttendanceAdmin(admin.ModelAdmin):
	list_display = ['__str__', 'time_in', 'time_out']
admin.site.register(Attendance, AttendanceAdmin)
