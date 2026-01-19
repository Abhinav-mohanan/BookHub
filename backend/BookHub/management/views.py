from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from authentication.models import CustomUser
from .serializers import StaffDisplaySerializer
from .permissions import IsAdmin

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
        