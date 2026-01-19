from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
import logging

logger = logging.getLogger(__name__)

class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get('access_token')
        
        if access_token:
            try:
                validated_token = self.get_validated_token(access_token)
                return self.get_user(validated_token),validated_token
            except AuthenticationFailed as e:
                logger.warning(f"JWT Authentication failed : {e}")
                return None
        logger.warning('JWT Authentication failed : access token not found')
        return None
        