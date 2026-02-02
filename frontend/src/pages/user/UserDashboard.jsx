import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../compoenents/user/Layout';
import { BorrowBookApi, PublicBookListApi } from '../../Api/BookManagementApi';
import { handleApiError } from '../../compoenents/shared/ErrorHandler';
import default_img from '../../assets/default_book.jpg'


const UserDashboard = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentpage,setCurrentPage] = useState(1)
  const [totlaItmes, setTotalItems] = useState(0)

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await PublicBookListApi(currentpage);
      setBooks(data.results);
      setTotalItems(data.count)
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleBorrow = async (slug) => {
    try {
      await BorrowBookApi(slug);
      toast.success("Book borrowed successfully");
      fetchBooks();
    } catch (error) {
      handleApiError(error)
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">Loading books...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeItem='home'>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Explore Our Collection
        </h1>
        <p className="text-gray-600">
          Discover and borrow from our vast library of books
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map(book => (
          <div
            key={book.slug}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            <div className="relative overflow-hidden bg-gray-100">
              <img
                src={book.images?.[0]?.image_url || default_img}
                alt={book.title}
                className="h-64 w-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  book.available_quantity > 0 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {book.available_quantity > 0 ? 'Available' : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="p-5">
              <div className="mb-3">
                <h3 className="font-bold text-lg text-gray-800 line-clamp-2 mb-1">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 font-medium">
                  {book.author}
                </p>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {book.category_name}
                </span>
              </div>

              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  <span className="font-semibold text-gray-800">
                    {book.available_quantity}
                  </span>
                  <span>copies</span>
                </div>
              </div>

              <button
                disabled={book.available_quantity === 0}
                onClick={() => handleBorrow(book.slug)}
                className={`w-full py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                  book.available_quantity > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {book.available_quantity > 0 ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Borrow Now
                  </span>
                ) : (
                  'Out of Stock'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {books.length === 0 && !loading && (
        <div className="text-center py-16">
          <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Books Available</h3>
          <p className="text-gray-500">Check back later for new additions to our library.</p>
        </div>
      )}
    </Layout>
  );
};

export default UserDashboard;