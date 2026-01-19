from django.core.mail import send_mail
from django.conf import settings
import random
import logging

logger = logging.getLogger(__name__)

def generate_random_otp(length=4):
    range_start = 10**(length-1)
    range_end = (10**length) - 1
    return str(random.randint(range_start,range_end))

def send_email_generic(subject,message,recipient_list):
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=recipient_list,
            fail_silently=False
        )
    except Exception:
        logger.error("Failed to send email",exc_info=True)

def set_auth_cookie(response,tokens):
    response.set_cookie(
        key='access_token',
        value=tokens['access'],
        httponly=True,
        secure=False,
        samesite='Lax',
        max_age=15*60,
    )

    response.set_cookie(
        key='refresh_token',
        value=tokens['refresh'],
        httponly=True,
        secure=False,
        samesite='Lax',
        max_age=15*60
    )
    
    return response