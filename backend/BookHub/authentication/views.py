from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from .models import CustomUser
from .serializers import (SignupSerializer,ValidateOTPSerializer,LoginSerializer,ForgotPasswordOTPSerializer,
                          ProfileSerializer, ForgotPasswordSerializer, ResetPasswordSerializer)
from .services import (send_signup_otp, get_tokens_for_user, send_resend_otp, send_reset_password_otp)
from .utils import set_auth_cookie
import logging
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

logger = logging.getLogger(__name__)


class BaseSignupView(APIView):
    role = ''

    def post(self,request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save(role=self.role)
            send_signup_otp(user)
            return Response(
                {"message":"Signup completed successfully completed",},
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class UserSignupView(BaseSignupView):
    role = 'user'


class AdminSignupView(BaseSignupView):
    role = 'admin'


class ValidateOTPView(APIView):

    def post(self,request):
        serializer = ValidateOTPSerializer(data=request.data)
        if serializer.is_valid():
            serializer.verify_user()
            return Response({"message":"Account verified successfully."},
                            status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

class LoginView(APIView):
    authentication_classes = []
    permission_classes=[AllowAny]
    
    def post(self,request):
        serializer = LoginSerializer(
            data=request.data,
            context={'request':request},
        )

        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user_obj']

        tokens = get_tokens_for_user(user)

        response = Response(
            {"message":"Login successful","role":user.role},
            status=status.HTTP_200_OK
        )

        set_auth_cookie(response,tokens)

        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
        except Exception:
            logger.warning("Logout blacklist failed:",exc_info=True)
        
        response = Response({
                "message":'Logout successfully'
            },status=status.HTTP_200_OK)

        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')

        return response


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def patch(self,request):
        user = request.user
        serializer = ProfileSerializer(user,request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@method_decorator(csrf_exempt, name='dispatch')
class CustomRefreshView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            raise AuthenticationFailed("Refresh token missing")
        
        try:
            refresh = RefreshToken(refresh_token)
        except Exception:
            raise AuthenticationFailed("Invalid or expired refresh token")

        new_access_token = str(refresh.access_token)

        response = Response(
            {"message": "Access token refreshed"},
            status=status.HTTP_200_OK
        )

        response.set_cookie(
            key='access_token',
            value=new_access_token,
            httponly=True,
            secure=False,      
            samesite='Lax',
            max_age=15 * 60, 
            path='/'
        )

        return response

class ResendOTPView(APIView):
    def post(self,request):
        email = request.data.get('email')
        user = get_object_or_404(CustomUser, email=email)
        send_resend_otp(user)
        return Response({"message":"OTP resended to your email"},
                        status=status.HTTP_200_OK)

class ForgotPasswordView(APIView):
    def post(self,request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            send_reset_password_otp(user)
            return Response({"message":"OTP sent to your email for password reset"},
                            status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordOTPView(APIView):
    def post(self,request):
        serializer = ForgotPasswordOTPSerializer(data=request.data)
        if serializer.is_valid():
            return Response({"message":"Email Verified Successfully"},
                            status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    def post(self,request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Password reset successfully"},
                            status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
