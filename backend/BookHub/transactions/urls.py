from django.urls import path
from .views import BorrowTransactionView

urlpatterns = [
    path('books/<slug:slug>/borrow/',BorrowTransactionView.as_view(),name='borrow-book'),

]