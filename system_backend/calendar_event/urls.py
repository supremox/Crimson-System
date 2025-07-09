from django.urls import path
from . import views

urlpatterns = [
    path('event/', views.CalendarEventListCreateView.as_view()),
    path('leave/all/', views.LeaveListView.as_view()),
    path('leave/detail/<int:pk>/', views.LeaveDetailedListView.as_view()),
    path('leave/update/<int:pk>/', views.LeaveUpdateListView.as_view()),
    path('leave/create/', views.LeaveCreateView.as_view()),
    path('shift/all/', views.ShiftChangeListView.as_view()),
    path('shift/detail/<int:pk>/', views.ShiftChangeDetailedListView.as_view()),
    path('shift/update/<int:pk>/', views.ShiftChangeUpdateListView.as_view()),
    path('shift/create/', views.ShiftChangeCreateView.as_view()),
]