from django.urls import path
from .views import AdminVerificationRequestsView

urlpatterns = [
    path('admin/staff/management/',AdminVerificationRequestsView.as_view(),name='manage-staff'),
]