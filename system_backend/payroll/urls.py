from django.urls import path
from . import views

urlpatterns = [
    path('generate/', views.PayrollGenerateAPIView.as_view()),
    path('sss/all/', views.SSSContributionListView.as_view()),
    path('sss/create/', views.SSSContributionCreateView.as_view()),
    path('pagibig/all/', views.PagibigContributionListView.as_view()),
    path('pagibig/create/', views.PagibigContributionCreateView.as_view()),
    path('philhealth/all/', views.PhilhealthContributionListView.as_view()),
    path('philhealth/create/', views.PhilhealthContributionCreateView.as_view()),
    path('bir/all/', views.TaxContributionListView.as_view()),
    path('bir/create/', views.TaxContributionCreateView.as_view()),
]