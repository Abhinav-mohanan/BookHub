from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q
from management.permissions import IsAdmin
from .models import Book, Category
from .serializers import (CategoryManagementSerializer, BookManagementSerializer,
                          PublicBookListSerializer,CategoriesListSerializer)


class AdminCategoryListView(APIView):
    permission_classes = [IsAdmin]

    def get(self,request):
        status = request.query_params.get('status')
        categories = Category.objects.all().order_by('created_at')
        
        if status == 'listed':
            categories = categories.filter(is_delete=False)
        elif status == 'unlisted':
            categories = categories.filter(is_delete=True)

        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(categories,request)
        serializer = CategoryManagementSerializer(page,many=True)
        return paginator.get_paginated_response(serializer.data)
        
    def post(self,request):
        serializer = CategoryManagementSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class AdminCategoryDetailView(APIView):
    permission_classes = [IsAdmin]

    def put(self,request,category_id):
        category = get_object_or_404(Category,id=category_id)
        serializer = CategoryManagementSerializer(category,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    def patch(self,request,category_id):
        category = get_object_or_404(Category,id=category_id)

        category.is_delete = not category.is_delete
        category.save()

        status_msg = "Deleted" if category.is_delete else "Restored"
        return Response({"message":f"Category {status_msg} sucessfully"},
                        status=status.HTTP_200_OK)
    

class AdminBookListCreateView(APIView):
    permission_classes = [IsAdmin]
    parser_classes = [MultiPartParser, FormParser]

    def get(self,request):
        status = request.query_params.get('status')
        search = request.query_params.get('search')
        books = Book.objects.all().prefetch_related('images')
        if status == 'listed':
            books = books.filter(is_delete=False)
        elif status == 'unlisted':
            books = books.filter(is_delete=True)
        if search:
            books = books.filter(Q(title__icontains=search)|
                         Q(author__icontains=search))
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(books,request)
        serializer = BookManagementSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
    def post(self,request):
        serializer = BookManagementSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    
class AdminBookDetailView(APIView):
    permission_classes = [IsAdmin]
    parser_classes = [MultiPartParser, FormParser]

    def get(self,request,slug):
        book = get_object_or_404(Book,slug=slug)
        serializer = BookManagementSerializer(book)
        return Response(serializer.data,status=status.HTTP_200_OK)
        
    def put(self,request,slug):
        book = get_object_or_404(Book,slug=slug)
        serializer = BookManagementSerializer(book, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)    
    
    def patch(self,request,slug):
        book = get_object_or_404(Book,slug=slug)

        book.is_delete = not book.is_delete
        book.save()
        
        status_msg = "Deleted" if book.is_delete else "Restored"
        return Response(
            {"message":f"Book {status_msg} Successfully","is_active": not book.is_delete},
            status=status.HTTP_200_OK
        )

class PublicBookView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        search = request.query_params.get('search')
        category = request.query_params.get('category')
        books = Book.objects.filter(is_delete=False,category__is_delete=False
                                    ).order_by('-created_at').prefetch_related('images','category')
        if category:
            books = books.filter(category=category)
        if search:
            books = books.filter(
                Q(title__icontains=search) |
                Q(author__icontains=search)
            )
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(books,request)
        serializer = PublicBookListSerializer(page,many=True)
        return paginator.get_paginated_response(serializer.data)

class CategoriesListView(APIView):
    def get(self,request):
        categories = Category.objects.filter(is_delete=False
                                         ).order_by('created_at')
        serializer = CategoriesListSerializer(categories,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
        
    