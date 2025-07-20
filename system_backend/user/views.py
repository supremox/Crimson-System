from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from django.core.exceptions import ObjectDoesNotExist

from .serializer import CustomTokenObtainPairSerializer, CustomUserSerializer
from employee.serializers import EmployeeUserSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        print(f"Login Credentials: {request.data}")
        if response.status_code == 200:
            access_token = response.data.get("access")
            refresh_token = response.data.get("refresh")
            # Set HttpOnly cookies
            # response.set_cookie(
            #     key="accessToken",
            #     value=access_token,
            #     httponly=True,
            #     secure=False,  # Set to True in production!
            #     samesite="Lax",
            #     max_age=60 * 5,  # 5 minutes, adjust as needed
            #     path="/"
            # )
            # response.set_cookie(
            #     key="refreshToken",
            #     value=refresh_token,
            #     httponly=True,
            #     secure=False,  # Set to True in production!
            #     samesite="Lax",
            #     max_age=60 * 60 * 24 * 7,  # 7 days, adjust as needed
            #     path="/"
            # )

        return response
    
class LogoutView(APIView):
    permission_classes = (AllowAny,)
    authentication_classes = ()

    def post(self, request):
        try:
            # Blacklist the refresh token if provided
            refresh_token = request.COOKIES.get("refreshToken") or request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            response = Response(status=status.HTTP_200_OK)
            # Clear cookies
            response.delete_cookie("accessToken", path="/")
            response.delete_cookie("refreshToken", path="/")
            return response
        except (ObjectDoesNotExist, TokenError):
            return Response(status=status.HTTP_400_BAD_REQUEST)

class UserMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)