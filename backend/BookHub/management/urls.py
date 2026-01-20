from django.urls import path
from .views import AdminVerificationRequestsView,AdminTransactionUpdateView

urlpatterns = [
    path('admin/staff/management/',AdminVerificationRequestsView.as_view(),name='manage-staff'),
    path('admin/transactions/',AdminTransactionUpdateView.as_view(),name='manage-transactions'),
    path('transactions/<int:transaction_id>/update/',AdminTransactionUpdateView.as_view(),name='manage-transactions')
]