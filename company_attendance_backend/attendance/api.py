from rest_framework import viewsets
from .models import Profile, Attendance
from .serializers import UserSerializer, ProfileSerializer, AttendanceSerializer
from .permissions import UserPermission, ProfilePermission, AttendancePermission, IsManager, IsReceptionist
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework.views import APIView, Response
from rest_framework.decorators import action
from rest_framework import status
from datetime import datetime, timedelta
from django.utils import timezone
from django.db.models import Q

User = get_user_model()


def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days)):
        yield start_date + timedelta(n)


class UserViewSet(viewsets.ModelViewSet):
    # queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated, UserPermission)

    @action(detail=False, methods=['GET'],
            permission_classes=[IsAuthenticated])  # to make router don't contain pk in the url
    def me(self, request, format=None):
        user = request.user
        serializer = UserSerializer(user)

        return Response(serializer.data)

    def get_queryset(self):
        if self.request.query_params.get('search', None):
            search_query = self.request.query_params['search']
            try:
                return User.objects.filter(
                    Q(id=search_query)
                )
            except ValueError:
                return User.objects.filter(
                    Q(username__icontains=search_query) |
                    Q(first_name__icontains=search_query) |
                    Q(last_name__icontains=search_query) |
                    Q(email__icontains=search_query)
                )
        return User.objects.all()


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = (IsAuthenticated, ProfilePermission)


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all().order_by('-time_in')
    serializer_class = AttendanceSerializer
    permission_classes = (IsAuthenticated, AttendancePermission)

    def get_serializer_context(self):
        """
        Thanks Mr. Marcel Neidinger for providing this way to make dynamic depth
        https://www.linkedin.com/pulse/friday-quick-tip-dynamic-depth-serialization-django-rest-neidinger/
        """
        context = super().get_serializer_context()
        depth = 0
        try:
            depth = int(self.request.query_params.get('depth', 0))
        except ValueError:
            pass  # Ignore non-numeric parameters and keep default 0 depth

        context['depth'] = depth

        return context

    def get_queryset(self):
        if self.request.query_params.get('search', None):
            search_query = self.request.query_params['search']
            try:
                return Attendance.objects.filter(
                    Q(id=search_query)
                ).order_by('-time_in')
            except ValueError:
                return Attendance.objects.filter(
                    Q(user__username__icontains=search_query) |
                    Q(user__first_name__icontains=search_query) |
                    Q(user__last_name__icontains=search_query) |
                    Q(user__email__icontains=search_query)
                ).order_by('-time_in')
        return Attendance.objects.all()


class ManagerDashboard(APIView):
    permission_classes = [IsManager]

    def get(self, request, format=None):
        attending_count = Profile.objects.filter(in_company=True).count()

        absent_count = Profile.objects.filter(in_company=False).count()

        today = timezone.now().date()

        all_attendances_in_last_30_days = Attendance.objects.filter(
            Q(time_in__date__gte=today - timedelta(days=30)) & Q(time_out__date__lte=today)
        ).order_by('time_in')
        # [attendance, attendance, attendance]

        last_30_days_attendances = [  # how many active attendances in each day
            # represents groups of attendances for each day
            all_attendances_in_last_30_days.filter(
                Q(time_in__date__lte=day) & Q(time_out__date__gte=day)
            ) for day in daterange(today - timedelta(days=30), today)
        ]
        # [attendances, attendances, attendances]

        attending_chart_labels = [day.strftime('%m/%d') for day in daterange(today - timedelta(days=30), today)]
        attending_chart_data = [attendance.count() for attendance in last_30_days_attendances]

        # for day in last 30 days:
        #   count attendances which /
        #   time_in.date() <= day
        #   time_out.date() >= day
        # started in the day
        # ended in the day

        avg_time_in_float = sum((attendance.time_in.hour + (attendance.time_in.minute / 60))  for attendance in # takes every time_in value from last 40 days attendances
                                all_attendances_in_last_30_days) / all_attendances_in_last_30_days.count()

        avg_time_in_timestamp = datetime.utcfromtimestamp(avg_time_in_float * 60 * 60)

        avg_time_out_float = sum((attendance.time_out.hour + (attendance.time_out.minute / 60)) for attendance in # takes every time_in value from last 40 days attendances
                                 all_attendances_in_last_30_days) / all_attendances_in_last_30_days.count()

        avg_time_out_timestamp = datetime.utcfromtimestamp(avg_time_out_float * 60 * 60)

        users_total_seconds = {}
        for user in User.objects.all():
            user_attendances = Attendance.objects.filter(user=user, time_in__date__gte=today - timedelta(days=30),
                                                         time_out__date__lte=today)
            seconds_attended = 0
            for attendance in user_attendances:
                seconds_attended += attendance.time_out.timestamp() - attendance.time_in.timestamp()
            users_total_seconds[user.id] = seconds_attended

        users_total_seconds = sorted(users_total_seconds.items(), key=lambda item: item[1], reverse=True)
        top_3_users_ids = []

        for user in users_total_seconds[:3]:
            top_3_users_ids.append(user[0])

        top_3_users = User.objects.filter(id__in=top_3_users_ids)

        top_3_users_serialized = UserSerializer(top_3_users, many=True).data
        for serialized_user in top_3_users_serialized:
            serialized_user['seconds'] = dict(users_total_seconds)[serialized_user['id']]



        return Response({
            'attending_chart_labels': attending_chart_labels,
            'attending_chart_data': attending_chart_data,
            'attending_count': attending_count,
            'absent_count': absent_count,
            'avg_attendance_per_day': f'{sum(attending_chart_data) / len(attending_chart_data):10.3f}',
            'avg_time_in_timestamp': avg_time_in_timestamp,
            'avg_time_out_timestamp': avg_time_out_timestamp,
            'top_3_users': top_3_users_serialized
        })


class GetUserWithCode(APIView):
    permission_classes = [IsReceptionist | IsManager]

    def post(self, request, format=None):
        code = request.data.get('code', '')

        if code == '':
            return Response({
                "code": [
                    "This field is required."
                ]
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            employee = User.objects.get(profile__attending_code=code, is_active=True)
            employee_serializer = UserSerializer(employee)

            last_attendance = Attendance.objects.filter(user=employee, time_out=None)

            if last_attendance.exists():
                attendance_serializer = AttendanceSerializer(instance=last_attendance.last())

                return Response({'employee': employee_serializer.data, 'attendance': attendance_serializer.data})

            else:
                return Response({'employee': employee_serializer.data, 'attendance': None})


        except User.DoesNotExist:
            return Response({
                "detail": [
                    "No such employee with this code."
                ]
            }, status=status.HTTP_400_BAD_REQUEST)
