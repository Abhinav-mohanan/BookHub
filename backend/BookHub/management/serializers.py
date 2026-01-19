from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from authentication.models import CustomUser



class StaffDisplaySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CustomUser
        fields = ['user_id', 'first_name', 'last_name', 'email', 
                  'role', 'is_verified']
        
    