from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from books.models import Book
from .serializers import (BorrowRequestSerializer,ListTransactionsSerializer)
from .models import BorrowTransaction


class BorrowTransactionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request,slug):
        book = get_object_or_404(Book,slug=slug)
        serializer_data = {'book':book.book_id}
        serializer = BorrowRequestSerializer(
            data=serializer_data,
            context={'request':request})
        
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message":"Borrow request sent successfully"},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class ListTransactionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        user = request.user
        transactions = BorrowTransaction.objects.filter(user=user)\
        .select_related('book')\
        .order_by('-request_date')
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(transactions,request)
        serializer = ListTransactionsSerializer(page,many=True)
        return paginator.get_paginated_response(serializer.data)
    