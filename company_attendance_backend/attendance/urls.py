from django.urls import path, include
from rest_framework import routers
from .api import UserViewSet, ProfileViewSet, AttendanceViewSet

router = routers.SimpleRouter()

router.register('users', UserViewSet)
router.register('profiles', ProfileViewSet)
router.register('attendances', AttendanceViewSet)

urlpatterns = router.urls