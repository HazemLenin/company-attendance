from django.urls import path, include
from rest_framework import routers
from . import api

router = routers.SimpleRouter()

router.register('users', api.UserViewSet, basename='users')
router.register('profiles', api.ProfileViewSet, basename='profiles')
router.register('attendances', api.AttendanceViewSet, basename='attendances')

urlpatterns = [
	# path('me/', api.Me.as_view()),
	path('dashboard/', api.ManagerDashboard.as_view()),
	path('user_with_code/', api.GetUserWithCode.as_view())
]

urlpatterns += router.urls