from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.conf import settings
from .models import BorrowTransaction


class BorrowRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = BorrowTransaction
        fields = ['book']
    
    def validate(self, attrs):
        user = self.context['request'].user
        book = attrs.get('book')

        if book.available_quantity < 1:
            raise ValidationError({"error":"This book is currently out of stock."})
        
        if BorrowTransaction.objects.filter(
            user=user,
            book=book,
            status__in=['pending','approved']
        ).exists():
            raise ValidationError({"error":"You have already requested or borrowed this book."})
        
        current_active_books = BorrowTransaction.objects.filter(
            user=user,
            status__in=['pending','approved']
        ).count()

        if current_active_books >= settings.MAX_BORROW_LIMIT:
            raise ValidationError(
                {"error":f"You have reached the limit of {settings.MAX_BORROW_LIMIT} borrowed books. Return one to borrow more."})
        
        return attrs
    
    def create(self, validated_data):
        user = self.context['request'].user
        return BorrowTransaction.objects.create(user=user, **validated_data)


class ListTransactionsSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name')
    book_title = serializers.CharField(source='book.title')

    class Meta:
        model = BorrowTransaction
        fields = ['id','user_name','book_title','status',
                  'request_date','approval_date','returne_date']

    