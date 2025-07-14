from django.urls import path
from . import views

urlpatterns = [
    path('generate/', views.PayrollGenerateAPIView.as_view()),
    path('sss/all/', views.SSSContributionListView.as_view()),
    path('sss/create/', views.SSSContributionCreateView.as_view()),
]