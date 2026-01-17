from django.urls import path
from .views import (UserSignupView,AdminSignupView,ValidateOTPView)

urlpatterns = [
    path('user/signup/',UserSignupView.as_view(),name='user-signup'),
    path('verify/otp/',ValidateOTPView.as_view(),name='validate-otp'),
    path('admin/signup/',AdminSignupView.as_view(),name='admin-signup'),
]