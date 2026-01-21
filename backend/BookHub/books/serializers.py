from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import Category, Book,BookImage
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
    
class BookImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = BookImage
        fields = ['id', 'image_url']

    def get_image_url(self,obj):
        if obj.image:
            return obj.image.url
        


class BookManagementSerializer(serializers.ModelSerializer):
    images = BookImageSerializer(many=True, read_only=True)

    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False,
                                     write_only=True, required=False)
    )
    class Meta:
        model = Book
        fields = ['book_id','title','author','category','quantity','slug',
                  'available_quantity','description','is_delete','uploaded_images','images']
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
    
    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        book = Book.objects.create(**validated_data)
        
        for image in uploaded_images:
            BookImage.objects.create(book=book, image=image)

        return  book
    
    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        for image in uploaded_images:
            BookImage.objects.create(book=instance, image=image)

        return instance
    