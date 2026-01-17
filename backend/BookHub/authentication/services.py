from .models import OTP
from .utils import generate_random_otp,send_email_generic

def create_otp_for_user(user):
    otp_code = generate_random_otp()

    OTP.objects.update_or_create(
        user=user,
        defaults={'otp':otp_code}
    )
    return otp_code

def send_signup_otp(user):
    otp_code = create_otp_for_user(user)

    subject = "Welcome to BookHub - Verify Account"
    message = f"Hi {user.get_full_name()},\n\nYour signup verification code is: {otp_code} \n\nThank you"
    email = user.email

    send_email_generic(subject,message,[email])
