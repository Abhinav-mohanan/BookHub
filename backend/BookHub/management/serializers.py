from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from authentication.models import CustomUser
from transactions.models import BorrowTransaction



class StaffDisplaySerializer(serializers.ModelSerializer):  
    class Meta:
        model = CustomUser
        fields = ['user_id', 'first_name', 'last_name', 'email', 
                  'role', 'is_verified']


class TransactionDetailSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name')
    book_title = serializers.CharField(source='book.title')

    class Meta:
        model =  BorrowTransaction
        fields = ['id', 'user_name', 'book_title', 'status', 'request_date', 'return_date','approval_date']


class TransactionStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = BorrowTransaction
        fields = ['status']