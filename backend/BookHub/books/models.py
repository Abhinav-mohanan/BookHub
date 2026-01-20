from django.db import models
from django.utils.text import slugify
import uuid
# Create your models here.


class Category(models.Model):
    category_name = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_delete = models.BooleanField(default=False)

    def __str__(self):
        return self.category_name


class Book(models.Model):
    book_id = models.UUIDField(default=uuid.uuid4,primary_key=True)
    title = models.CharField(max_length=250)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='books')
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    author = models.CharField(max_length=300)
    description = models.TextField(blank=True, null=True)
    quantity = models.PositiveIntegerField(default=0)
    available_quantity = models.PositiveBigIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_delete = models.BooleanField(default=False)
    

    class Meta:
        ordering = ['-created_at']
        unique_together = ['title', 'author']
    
    def __str__(self):
        return self.title
    
    def save(self,*args,**kwargs):
        if not self.slug:
            base_slug = slugify(f'{self.title}-{self.author}')
            self.slug = base_slug
        super().save(*args,**kwargs)

