from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from .models import CustomUser
from .serializers import (SignupSerializer,ValidateOTPSerializer,LoginSerializer,
                          ProfileSerializer)
from .services import (send_signup_otp,get_tokens_for_user)
from .utils import set_auth_cookie
import logging

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
    

class BaseLoginView(APIView):
    role = ''

    def post(self,request):
        serializer = LoginSerializer(
            data=request.data,
            context={'request':request},
            role_restriction=self.role
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


class UserLoginView(BaseLoginView):
    role = 'user'


class AdminLoginView(BaseLoginView):
    role = 'admin'


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
