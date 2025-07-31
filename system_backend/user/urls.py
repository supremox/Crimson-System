from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('login/', views.CustomTokenObtainPairView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('userv2/me/', views.UserMeView.as_view(), name='user-me'),
    path('userv2/all/', views.AllUsersView.as_view(), name='user-all'),
]