import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../compoenents/user/Layout';
import { BorrowBookApi, GetAllCategoriesApi, PublicBookListApi } from '../../Api/BookManagementApi';
import { handleApiError } from '../../compoenents/shared/ErrorHandler';
import default_img from '../../assets/default_book.jpg'
import Pagination from '../../compoenents/shared/Pagination';
import { Book, BookOpen, ChevronLeft, ChevronRight, MoveLeft, Search, X, XCircle } from 'lucide-react';


const UserDashboard = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentpage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const pageSize = 6;

  const fetchBooks = async (page = currentpage, search = searchQuery, category = selectedCategory) => {
    try {
      if (books.length == 0) setLoading(true);
      const data = await PublicBookListApi(page,search,category);
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
  }, [currentpage,searchQuery,selectedCategory]);

  const handleBorrow = async (slug) => {
    try {
      await BorrowBookApi(slug);
      toast.success("Book borrowed successfully");
      setSelectedBook(null);
      fetchBooks();
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const data = await GetAllCategoriesApi()
      setCategories(data);
    } catch (error) {
      handleApiError(error)
    }
  };
  
  fetchCategories();
}, []);

  const openModal = (book) => {
    setSelectedBook(book);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedBook(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedBook?.images) {
      setCurrentImageIndex((prev) => 
        prev === selectedBook.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedBook?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedBook.images.length - 1 : prev - 1
      );
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); 
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); 
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setCurrentPage(1);
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Books
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XCircle className='w-5 h-5'/>
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(searchQuery || selectedCategory) && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  Search: "{searchQuery}"
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  Category: {categories.find(c => c.id === parseInt(selectedCategory))?.category_name}
                </span>
              )}
            </div>
            <button
              onClick={handleClearFilters}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium cursor-pointer flex items-center gap-1"
            >
             <XCircle/>
              Clear All
            </button>
          </div>
        )}
      </div>
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {books.map(book => (
            <div
              key={book.slug}
              className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer group"
              onClick={() => openModal(book)}
            >
              <div className="relative overflow-hidden bg-gray-50 aspect-[3/4]">
                <img
                  src={book.images?.[0]?.image_url || default_img}
                  alt={book.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium backdrop-blur-sm ${
                    book.available_quantity > 0 
                      ? 'bg-emerald-500/90 text-white' 
                      : 'bg-gray-800/90 text-white'
                  }`}>
                    {book.available_quantity > 0 ? `${book.available_quantity} Available` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="mb-3">
                  <h3 className="font-semibold text-base text-gray-900 line-clamp-2 mb-1.5 leading-snug">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {book.author}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                    {book.category_name}
                  </span>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(book);
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 transition-colors"
                  >
                    View Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Pagination
          totalItems={totalItems}
          currentPage={currentpage}
          itemsPerPage={pageSize}
          onPageChange={setCurrentPage}
        />
      </>

      {books.length === 0 && !loading && (
        <div className="text-center py-16">
          <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Books Available</h3>
          <p className="text-gray-500">Check back later for new additions to our library.</p>
        </div>
      )}

      {selectedBook && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
              <div className="md:w-2/5 bg-gray-50 relative flex items-center justify-center p-8">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 cursor-pointer transition-all shadow-lg"
                  title='close'
                >
                  <X className='w-5 h-5'/>
                </button>

                <div className="relative w-full">
                  <img
                    src={selectedBook.images?.[currentImageIndex]?.image_url || default_img}
                    alt={selectedBook.title}
                    className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-lg"
                  />

                  {selectedBook.images && selectedBook.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 
                        hover:bg-white text-gray-700 shadow-lg cursor-pointer transition-all"
                      >
                        <ChevronLeft className='w-5 h-5'/>
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white 
                        text-gray-700 shadow-lg cursor-pointer transition-all"
                      >
                        <ChevronRight className='w-5 h-5'/>
                      </button>

                      <div className="flex justify-center gap-2 mt-4">
                        {selectedBook.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentImageIndex 
                                ? 'bg-blue-600 w-6' 
                                : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="md:w-3/5 flex flex-col">
                <div className="flex-1 overflow-y-auto p-8">
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedBook.title}
                    </h2>
                    <p className="text-lg text-gray-600">
                      by {selectedBook.author}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {selectedBook.category_name}
                    </span>
                    <span className={`inline-flex items-center  py-1.5 rounded-lg text-sm font-medium ${
                      selectedBook.available_quantity > 0
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-gray-50 text-gray-700 border border-gray-200'
                    }`}>
                      <BookOpen className='w-5 h-5 mr-1'/>
                      {selectedBook.available_quantity} {selectedBook.available_quantity === 1 ? 'copy' : 'copies'} available
                    </span>
                  </div>

                  {selectedBook.description && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {selectedBook.description}
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <button
                    disabled={selectedBook.available_quantity === 0}
                    onClick={() => handleBorrow(selectedBook.slug)}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      selectedBook.available_quantity > 0
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md  cursor-pointer hover:shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {selectedBook.available_quantity > 0 ? (
                      <>
                        <BookOpen className='w-5 h-5 mr-1'/>
                        Borrow This Book
                      </>
                    ) : (
                      'Currently Unavailable'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default UserDashboard;