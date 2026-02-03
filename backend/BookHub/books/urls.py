from django.urls import path
from .views import (AdminCategoryListView,AdminCategoryDetailView,AdminBookDetailView,
                    AdminBookListCreateView,PublicBookView,CategoriesListView)

urlpatterns = [
    path('admin/category/',AdminCategoryListView.as_view(),name='create-category'),
    path('admin/category/<int:category_id>/',AdminCategoryDetailView.as_view(),name='manage-category'),
    path('admin/books/',AdminBookListCreateView.as_view(),name='create-book'),
    path('admin/books/<slug:slug>/',AdminBookDetailView.as_view(),name='manage-book'),
    path('books/',PublicBookView.as_view(),name='book-view'),
    path('categories/',CategoriesListView.as_view(),name='list-categories'),
]