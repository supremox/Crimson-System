from django.urls import path
from . import views

urlpatterns = [
    path('name/', views.EmployeeListCreateView.as_view()),
    path('departments/names/', views.DepartmentListCreateView.as_view()),
    path('department/positions/', views.DepartmentPositionListView.as_view()),
    path('position/names/', views.PositionListCreateView.as_view()),
    path('shifts/names/', views.ShiftListCreateView.as_view()),
    path('incentives/name/', views.IncentiveListCreateView.as_view()),
]