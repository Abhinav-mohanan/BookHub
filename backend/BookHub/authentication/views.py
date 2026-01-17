from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import (SignupSerializer,ValidateOTPSerializer)
from .services import send_signup_otp


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
