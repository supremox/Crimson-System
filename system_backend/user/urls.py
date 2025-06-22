from django.urls import path
from . import views

urlpatterns = [
    path('logout/', views.LogoutView.as_view()),
    path('userv2/me/', views.UserMeView.as_view(), name='user-me'),
]