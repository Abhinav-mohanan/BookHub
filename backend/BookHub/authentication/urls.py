from django.urls import path
from .views import (UserSignupView,AdminSignupView,ValidateOTPView,AdminLoginView,
                    UserLoginView,LogoutView,ProfileView)

urlpatterns = [
    path('user/signup/', UserSignupView.as_view(), name='user-signup'),
    path('user/login/', UserLoginView.as_view(), name='user-login'),
    path('verify/otp/', ValidateOTPView.as_view(), name='validate-otp'),
    path('admin/signup/', AdminSignupView.as_view(), name='admin-signup'),
    path('admin/login/', AdminLoginView.as_view(), name='admin-login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),
]