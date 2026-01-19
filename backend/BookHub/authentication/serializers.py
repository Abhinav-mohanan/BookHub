from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate
from .models import CustomUser,OTP
import re


class SignupSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'email','role',
                  'password', 'confirm_password']
    
    def validate(self, attrs):
        first_name = attrs.get('first_name','').strip()
        last_name = attrs.get('last_name','').strip()
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')
        email = attrs.get('email')

        if len(first_name) < 3 or not re.fullmatch(r"[a-zA-Z]+", first_name):
            raise ValidationError(
                {"first_name":"First name must be at least 3 letters and contain only alphabets"}
            )
        
        if len(last_name) == 0 or not re.fullmatch(r"[a-zA-Z]+", last_name):
            raise ValidationError(
                {"last_name":"Last name cannot be empty and must contain only alphabets"}
            )
        
        if len(password) < 6:
            raise ValidationError(
                {"password":"Password must be at least 6 characters long"}
            )
        
        if password != confirm_password:
            raise ValidationError(
                {"confirm_password":"Passwords do not match"}
            )
        attrs['username'] = email

        return attrs
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user


class ValidateOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, attrs):
        email = attrs.get('email')
        otp = attrs.get('otp')

        try:
            user = CustomUser.objects.get(email=email)
            otp_instance = OTP.objects.get(user=user)
        except (CustomUser.DoesNotExist, OTP.DoesNotExist):
            raise ValidationError("Invalid Email or OTP")
        
        if otp_instance.otp != otp:
            raise ValidationError("Invalid OTP")
        
        if otp_instance.is_expired():
            otp_instance.delete()
            raise ValidationError("OTP has expired. Please request a new one.")
        
        attrs['user'] = user
        attrs['otp_instance'] = otp_instance
        return attrs
    
    def verify_user(self):
        user = self.validated_data['user']
        otp_instance = self.validated_data['otp_instance']

        user.is_email_verified = True
        user.save(update_fields=['is_email_verified'])
        otp_instance.delete()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def __init__(self, *args, **kwargs):
        self.excepted_role = kwargs.pop('role_restriction',None)
        super().__init__(*args, **kwargs)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        requested_user = self.context.get('request')

        user = authenticate(request=requested_user,email=email,password=password)

        if not user:
            raise AuthenticationFailed({"error":"Invalid email or password"})
        
        if not user.is_email_verified:
            raise AuthenticationFailed({"error":"Please verify your email address first.",
                                        "is_email_verified":user.is_email_verified,
                                        "email":user.email})
        
        if self.excepted_role and self.excepted_role != user.role:
            raise AuthenticationFailed({"error":f"Access denied. You are not a {self.excepted_role}."})
        
        if not user.is_active:
            raise AuthenticationFailed({'error':'This account has been disabled.'})
        
        if self.excepted_role == 'admin' and not user.is_verified:
            raise AuthenticationFailed({"error":"You want to verify by admin to countinue"})
        
        attrs['user_obj'] = user
        
        return attrs
    