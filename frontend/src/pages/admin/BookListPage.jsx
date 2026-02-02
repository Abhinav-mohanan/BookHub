import React, { useEffect, useState } from 'react';
import AdminLayout from '../../compoenents/admin/AdminLayout';
import { handleApiError } from '../../compoenents/shared/ErrorHandler';
import Pagination from '../../compoenents/shared/Pagination';
import { Edit, Plus, Trash2, RefreshCcw, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AdminBookListApi, AdminBookToggleDeleteApi } from '../../Api/BookManagementApi';
import default_img from '../../assets/default_book.jpg'
import ConfirmationModal from '../../compoenents/shared/ConfirmationModal';


const BookListPage = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState('listed')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [confirmData, setConfirmData] = useState(null)
  const [searchValue, setSearchValue] = useState('')
  const pageSize = 6;
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const data = await AdminBookListApi(currentPage,statusFilter,searchValue);
      setBooks(data.results);
      setTotalItems(data.count);
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [currentPage, statusFilter,searchValue]);

  const handleToggleStatus = async () => {
    if (!confirmData) return
    try {
      const response = await AdminBookToggleDeleteApi(confirmData.slug);
      toast.success(response.message);
      fetchBooks()
      setIsModalOpen(false)
      setConfirmData(null)
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleOpenModal = (data) =>{
    setConfirmData(data)
    setIsModalOpen(true)
  }

  const handleSearch = (e) =>{
    setSearchValue(e.target.value)
    setCurrentPage(1)
  }

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
        <div className="flex gap-3 mb-6">
        <button
          onClick={() => setStatusFilter('listed')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm cursor-pointer ${statusFilter === 'listed'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          Listed
        </button>
        <button
          onClick={() => setStatusFilter('unlisted')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm cursor-pointer ${statusFilter === 'unlisted'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          Unlisted
        </button>
         <div className="flex-1 w-full relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={(e)=>handleSearch(e)}
            placeholder="Search books by title, author..."
            className="w-full h-11 pl-12 pr-4 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
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
              {books.length === 0 ? (
                <tr>
                  <td colSpan="4" className='text-center py-6 text-gray-500'>No books found</td>
                </tr>
              ):(
              books.map((book) => (
                <tr key={book.book_id} className={`hover:bg-gray-50 ${book.is_delete ? 'opacity-60 bg-gray-50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={book.images[0]?.image_url || default_img} 
                        className="w-12 h-16 object-cover rounded shadow-sm"
                        alt={book.title}
                      />
                      <div>
                        <div className="text-sm font-bold text-gray-900">{book.title}</div>
                        <div className="text-xs text-gray-500">{book.author}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 uppercase">{book.category_name}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold">Available: {book.available_quantity}</div>
                    <div className="text-xs text-gray-400">Total: {book.quantity}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => navigate(`/admin/books/edit/${book.slug}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 cursor-pointer rounded-lg"
                        title="Edit Book"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleOpenModal({
                          slug:book.slug,
                          action:book.is_delete?'restore':'unlist',
                          book_name:book.title
                        })}
                        className={`p-2 rounded-lg cursor-pointer ${book.is_delete ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`}
                        title={book.is_delete ? "Restore Book" : "Delete Book"}
                      >
                        {book.is_delete ? 'Restore'  : 'Unlist'}
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
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
      <ConfirmationModal
      open={isModalOpen}
      title={confirmData?.action =='restore'?"Restore Book":"Unlist Book"}
      message={confirmData?`Are you sure you want to ${confirmData.action} "
      ${confirmData.book_name.toUpperCase()}"`:''}
      confirmText={confirmData?.action === 'restore'?"Restore":"Unlist"}
      onConfirm={handleToggleStatus}
      onClose={()=>{
        setConfirmData(null)
        setIsModalOpen(false)
      }}
      />
    </AdminLayout>
  );
};

export default BookListPage;