from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('name/', views.EmployeeListCreateView.as_view()),
    path('detailed/<int:id>/', views.EmployeeDetailedView.as_view(), name='employee_detail'),
    path('departments/names/', views.DepartmentListCreateView.as_view()),
    path('department/positions/', views.DepartmentPositionListView.as_view()),
    path('position/names/', views.PositionListCreateView.as_view()),
    path('shifts/names/', views.ShiftListCreateView.as_view()),
    path('incentives/name/', views.IncentiveListCreateView.as_view()),
    path('leave/<int:pk>/', views.TotalLeaveDetailView.as_view(), name='total_leave_detail'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)