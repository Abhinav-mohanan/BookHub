from django.urls import path
from .views import (UserSignupView,AdminSignupView,ValidateOTPView,
                    LoginView,LogoutView,ProfileView,CustomRefreshView)

urlpatterns = [
    path('user/signup/', UserSignupView.as_view(), name='user-signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('verify/otp/', ValidateOTPView.as_view(), name='validate-otp'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('admin/signup/', AdminSignupView.as_view(), name='admin-signup'),
    path('token/refresh/', CustomRefreshView.as_view(), name='token-refresh'),
]