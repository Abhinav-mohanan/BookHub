from django.urls import path
from .views import (UserSignupView,AdminSignupView,ValidateOTPView,
                    LoginView,LogoutView,ProfileView,CustomRefreshView,ResendOTPView,
                    ForgotPasswordView,ForgotPasswordOTPView,ResetPasswordView)

urlpatterns = [
    path('user/signup/', UserSignupView.as_view(), name='user-signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('verify/otp/', ValidateOTPView.as_view(), name='validate-otp'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('admin/signup/', AdminSignupView.as_view(), name='admin-signup'),
    path('token/refresh/', CustomRefreshView.as_view(), name='token-refresh'),
    path('otp/resend/', ResendOTPView.as_view(), name='resend-otp'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('forgot/password/otp/', ForgotPasswordOTPView.as_view(), name='forgot-password-otp'),
    path('reset/password/', ResetPasswordView.as_view(), name='reset-password'),
]