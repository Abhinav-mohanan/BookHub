from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from authentication.models import CustomUser
from transactions.models import BorrowTransaction
from .serializers import (StaffDisplaySerializer,TransactionStatusSerializer,
                          TransactionDetailSerializer)
from .permissions import IsAdmin
from .services import update_transaction_status

# Create your views here.

class AdminVerificationRequestsView(APIView):

    permission_classes = [IsAdmin]

    def get(self,request):
        pending_admins = CustomUser.objects.filter(role='admin', is_verified=False)
        serializer = StaffDisplaySerializer(pending_admins, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self,request):
        user_id = request.data.get('user_id')

        if not user_id:
            return Response({"error":"user_id is required"},status=status.HTTP_400_BAD_REQUEST)
        
        user = get_object_or_404(CustomUser, user_id=user_id)

        if user.role != 'admin':
            return Response(
                {"error":"Cannot verify non-admin users"},
                status=status.HTTP_400_BAD_REQUEST
                )
        
        user.is_verified = True
        user.save(update_fields=['is_verified'])

        return Response(
            {"message": "Admin verified successfully"},
            status=status.HTTP_200_OK
        )


class AdminTransactionUpdateView(APIView):
    permission_classes = [IsAdmin]

    def get(self,request):
        transactions = BorrowTransaction.objects.select_related('book','user').all().order_by('-request_at')
        serializer = TransactionDetailSerializer(transactions,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

    def patch(self,request,transaction_id):
        input_serializer = TransactionStatusSerializer(data=request.data)

        if not input_serializer.is_valid():
            return Response(input_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        new_status = input_serializer.validated_data['status']

        try:
            updated_transaction = update_transaction_status(transaction_id,new_status)
            output_serializer = TransactionDetailSerializer(updated_transaction)
            return Response(output_serializer.data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error":str(e)}, status=status.HTTP_400_BAD_REQUEST)


