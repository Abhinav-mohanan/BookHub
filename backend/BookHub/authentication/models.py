from django.db import models
from django.contrib.auth.models import AbstractUser,BaseUserManager
from django.utils import timezone
from django.conf import settings
from datetime import timedelta
import uuid
                                        

class CustomUserManager(BaseUserManager):
    def create_user(self,email,password=None,**extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email,**extra_fields)
        user.set_password(password)
        user.save()
        return user
    
    def create_superuser(self,email,password=None,**extra_fields):
        extra_fields.setdefault('is_staff',True)
        extra_fields.setdefault('is_superuser',True)
        extra_fields.setdefault('is_active',True)

        extra_fields.setdefault('role','admin')
        extra_fields.setdefault('is_verified',True)
        
        if extra_fields.get('is_staff') is not True:
            raise('Super user must have is_staff is True.')
        if extra_fields.get('is_superuser') is not True:
            raise('Super user must have is_superuser is True.')
        
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('admin','Admin'),
        ('user','User')
    ]
    user_id = models.UUIDField(default=uuid.uuid4,primary_key=True,editable=True)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=25,choices=ROLE_CHOICES)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email
    

class OTP(models.Model):
    user = models.OneToOneField(CustomUser,on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        expiration_time = self.created_at + timedelta(minutes=settings.OTP_EXPIRY_MIN)
        return timezone.now() > expiration_time