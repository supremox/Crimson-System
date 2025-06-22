from django.urls import path
from . import views

urlpatterns = [
    path('name/', views.EmployeeListCreateView.as_view()),
    path('departments/names/', views.DepartmentListCreateView.as_view()),
    path('departments/dropdown/', views.DepartmentListCreateView.as_view()),
    path('shifts/names/', views.ShiftListCreateView.as_view()),
    path('incentives/name/', views.IncentiveListCreateView.as_view()),
]