from django.urls import path, include
from rest_framework import routers
from . import api

router = routers.SimpleRouter()

router.register('users', api.UserViewSet)
router.register('profiles', api.ProfileViewSet)
router.register('attendances', api.AttendanceViewSet)

urlpatterns = [
	path('me/', api.Me.as_view()),
	path('dashboard/', api.ManagerDashboard.as_view()),
]

urlpatterns += router.urls