from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from django.core.exceptions import ObjectDoesNotExist

from .serializer import CustomTokenObtainPairSerializer, CustomUserSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
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
    
# class CookieTokenRefreshView(TokenRefreshView):
#     """
#     Custom view to refresh JWT using refresh token from HttpOnly cookie.
#     """
#     def post(self, request, *args, **kwargs):
#         # Get refresh token from cookie
#         refresh_token = request.COOKIES.get("refreshToken")
#         if not refresh_token:
#             return Response({"detail": "Refresh token missing."}, status=status.HTTP_401_UNAUTHORIZED)
        
#         # Inject refresh token into request data for serializer
#         request.data._mutable = True  # Only needed if request.data is QueryDict
#         request.data["refresh"] = refresh_token
#         request.data._mutable = False

#         response = super().post(request, *args, **kwargs)
#         if response.status_code == 200 and "access" in response.data:
#             # Set new access token as HttpOnly cookie
#             response.set_cookie(
#                 key="accessToken",
#                 value=response.data["access"],
#                 httponly=True,
#                 secure=False,  # Set to True in production!
#                 samesite="Lax",
#                 max_age=60 * 5,
#                 path="/"
#             )
#             # Optionally remove access from response body
#             # del response.data["access"]
#         return response

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