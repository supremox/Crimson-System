from django.urls import path
from . import views

urlpatterns = [
    path('event/', views.CalendarEventListCreateView.as_view()),
    path('leave/', views.LeaveCreateView.as_view()),
    path('shift/request/', views.ShiftChangeCreateView.as_view()),
]