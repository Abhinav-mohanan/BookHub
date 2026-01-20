from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import Category, Book
import re


class CategoryManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ['is_delete']
    
    def validate(self, attrs):
        category_name = attrs.get('category_name', '').strip()

        if len(category_name) < 3:
            raise ValidationError({"category_name":"Category name must be at least 3 characters long"})
        
        if not re.fullmatch(r'[a-zA-Z\s]+',category_name):
            raise ValidationError({"category_name":"Category name contains invalid characters"})
        
        return attrs
    

class BookManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['book_id','title','author','category','quantity','slug',
                  'available_quantity','description','is_delete']
        read_only_fields = ['slug','book_id','is_delete']
    
    def validate(self, attrs):
        title = attrs.get('title','').strip()
        author = attrs.get('author','').strip()
        quantity = attrs.get('quantity')
        available_quantity = attrs.get('available_quantity')

        if available_quantity is not None and quantity is not None:
            if available_quantity > quantity:
                raise ValidationError({'available_quantity':"Cannot have more available books than total quantity."})
            
        if not re.fullmatch(r'^[a-zA-Z\s\-\.]+$',author):
            raise ValidationError({'author':"Author name contains invalid characters."})
        
        if len(author) < 3:
            raise ValidationError({"author":'Author name must be at least 3 characters long.'})
        if len(title) < 3:
            raise ValidationError({"title":"Book name must be at least 3 characters long"})
        
        return attrs
    