from django.db import models
from authentication.models import CustomUser
from books.models import Book


class BorrowTransaction(models.Model):
    STATUS_CHOICES = [
        ('pending','Pending'),
        ('approved','Approved'),
        ('rejected','Rejected'),
        ('returned','Returned'),
    ]

    user = models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name='transactons')
    book = models.ForeignKey(Book,on_delete=models.CASCADE,related_name='active_transactions')
    status = models.CharField(max_length=25,choices=STATUS_CHOICES,default='pending')
    request_date = models.DateTimeField(auto_now_add=True)
    approval_date = models.DateTimeField(null=True,blank=True)
    return_date = models.DateTimeField(null=True,blank=True)

    def __str__(self):
        return f'{self.user.get_full_name()} - {self.book.title} ({self.status})'