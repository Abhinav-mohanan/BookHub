from django.db import transaction
from rest_framework.exceptions import ValidationError
from transactions.models import BorrowTransaction
from django.utils import timezone

def update_transaction_status(transaction_id, new_status):

    ALLOWED_TRANSITIONS = {
        'pending': ['approved','rejected'],
        'approved': ['returned'],
        'rejected': [],
        'returned':[]
    }
    try:
        with transaction.atomic():

            borrow_request = BorrowTransaction.objects.select_related('book').select_for_update().get(id=transaction_id)

            book = borrow_request.book
            old_status = borrow_request.status

            if old_status == new_status:
                return borrow_request

            allowed_next_steps = ALLOWED_TRANSITIONS.get(old_status,[])

            if new_status not in allowed_next_steps:
                raise ValidationError({
                    "error": f"Invalid transaction. Cannot move from '{old_status}' to '{new_status}'."
                })
            
            if new_status == 'approved':
                if book.available_quantity  < 1:
                    raise ValidationError({"error":"Cannot approve. Book is out of stock."})
                
                book.available_quantity -= 1
                borrow_request.approval_date = timezone.now()
                book.save()
            
            elif new_status =='returned':
                book.available_quantity += 1    
                borrow_request.return_date = timezone.now()
                book.save()    

            borrow_request.status = new_status
            borrow_request.save()
            
        return borrow_request

    except BorrowTransaction.DoesNotExist:
        raise ValidationError({"error":"Transaction not found."})     
