from django.urls import path
from . import views

urlpatterns = [
    path('all/', views.AttendanceAPIView.as_view()),
    path('import/', views.AttendanceImportAPIView.as_view()),
    path('day/record/<str:employee_id>/<str:date>/', views.AttendanceRetrieveAPIView.as_view())
]