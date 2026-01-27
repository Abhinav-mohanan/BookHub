import React, { useEffect, useState } from 'react';
import AdminLayout from '../../compoenents/admin/AdminLayout';
import { handleApiError } from '../../compoenents/shared/ErrorHandler';
import Pagination from '../../compoenents/shared/Pagination';
import { Edit, Plus, Trash2, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AdminBookListApi } from '../../Api/BookManagementApi';

const BookListPage = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 6;
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const data = await AdminBookListApi(currentPage);
      setBooks(data.results);
      setTotalItems(data.count);
      console.log(data.results)
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  const handleToggleStatus = async (slug) => {
    try {
      const response = await AdminBookToggleDeleteApi(slug);
      toast.success(response.message);
      setBooks(prev => prev.map(book => 
        book.slug === slug ? { ...book, is_delete: !book.is_delete } : book
      ));
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <AdminLayout activeItem={'books'}>
      <div className="max-w-7xl mx-auto px-8 py-8">        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-gray-900 text-3xl font-black tracking-tight">Library Catalog</h2>
            <p className="text-gray-500">Manage all titles, quantities, and availability</p>
          </div>
          <button 
            onClick={() => navigate('/add/book')}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-md"
          >
            <Plus className="w-5 h-5" /> Add New Book
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Book Info</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {books.map((book) => (
                <tr key={book.book_id} className={`hover:bg-gray-50 ${book.is_delete ? 'opacity-60 bg-gray-50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={book.images[0]?.image_url || '/placeholder-book.png'} 
                        className="w-12 h-16 object-cover rounded shadow-sm"
                        alt={book.title}
                      />
                      <div>
                        <div className="text-sm font-bold text-gray-900">{book.title}</div>
                        <div className="text-xs text-gray-500">{book.author}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{book.category_name}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold">Available: {book.available_quantity}</div>
                    <div className="text-xs text-gray-400">Total: {book.quantity}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => navigate(`/admin/books/edit/${book.slug}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit Book"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(book.slug)}
                        className={`p-2 rounded-lg ${book.is_delete ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`}
                        title={book.is_delete ? "Restore Book" : "Delete Book"}
                      >
                        {book.is_delete ? <RefreshCcw className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <Pagination 
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default BookListPage;