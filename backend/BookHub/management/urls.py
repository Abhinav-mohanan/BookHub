from django.urls import path
from .views import AdminVerificationRequestsView,AdminTransactionUpdateView,UserManagementView

urlpatterns = [
    path('admin/staff/management/',AdminVerificationRequestsView.as_view(),name='manage-staff'),
    path('admin/user/management/',UserManagementView.as_view(),name='manage-user'),
    path('admin/transactions/',AdminTransactionUpdateView.as_view(),name='manage-transactions'),
    path('transactions/<int:transaction_id>/update/',AdminTransactionUpdateView.as_view(),name='manage-transactions')
]