from django.urls import path
from .views import BorrowTransactionView,ListTransactionsView

urlpatterns = [
    path('books/<slug:slug>/borrow/', BorrowTransactionView.as_view(),name='borrow-book'),
    path('transactions/', ListTransactionsView.as_view(), name='transaction-details'),
    

]