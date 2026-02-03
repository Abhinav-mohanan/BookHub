import React, { useEffect, useState } from 'react';
import { GetAllTransactionsApi, UpdateTransactionStatusApi } from '../../Api/BookManagementApi';
import Pagination from '../../compoenents/shared/Pagination';
import AdminLayout from '../../compoenents/admin/AdminLayout';
import { BookOpen, Clock, CheckCircle, XCircle, RotateCcw, Loader2, AlertCircle, FileText } from 'lucide-react';
import formatDate from '../../compoenents/shared/formatDate';
import { handleApiError } from '../../compoenents/shared/ErrorHandler';
import default_img from '../../assets/default_book.jpg'

const statusConfig = {
  pending: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: Clock,
    label: 'Pending'
  },
  approved: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: CheckCircle,
    label: 'Approved'
  },
  returned: {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    icon: RotateCcw,
    label: 'Returned'
  }
};

const getStatusConfig = (status) =>
  statusConfig[status] || {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    icon: AlertCircle,
    label: status
  };



const BorrowTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState(0)
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all')
  const [stats, setStats] = useState({})
  const pageSize = 6; 

  const fetchTransactions = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await GetAllTransactionsApi(page, statusFilter);
      console.log(data)
      setTransactions(data.results?.results);
      setStats(data.results?.stats)
      setTotalItem(data.count)
    } catch (error) {
      handleApiError(error,setError) 
      setError('Failed to load transactions. Please try again.');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage, statusFilter]);

  const updateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      await UpdateTransactionStatusApi(id, { status: newStatus });
      await fetchTransactions(currentPage);
    } catch (error) {
      handleApiError(error, setError)
      setError('Failed to update transaction status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleFilterChange = (status) =>{
    setCurrentPage(1)
    setStatusFilter(status)
  }

  if (loading && transactions.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-slate-400 animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-500">Loading transactions...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeItem="transaction">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="mb-10">
          <h1 className="text-3xl font-light text-slate-900 mb-1 tracking-tight">
            Transaction History
          </h1>
          <p className="text-slate-500 text-sm">
            Monitor and manage all book borrowing transactions
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-rose-800 font-medium">Error</p>
              <p className="text-sm text-rose-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 ">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 cursor-pointer"
        onClick={()=>handleFilterChange('all')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.total}</p>
            </div>
            <div className="bg-gray-100 rounded-full p-3">
              <FileText className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-yellow-200 cursor-pointer"
        onClick={()=>handleFilterChange('pending')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold text-yellow-700 mt-1">{stats.pending}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-green-200 cursor-pointer"
        onClick={()=>handleFilterChange('approved')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Approved</p>
              <p className="text-3xl font-bold text-green-700 mt-1">{stats.approved}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-blue-200 cursor-pointer"
        onClick={()=>handleFilterChange('returned')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Returned</p>
              <p className="text-3xl font-bold text-blue-700 mt-1">{stats.returned}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <RotateCcw className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Requested
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Approved
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Returned
                  </th>
                  <th className="px-6 py-3.5 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <BookOpen className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="text-slate-600 font-medium mb-1">No transactions found</p>
                        <p className="text-sm text-slate-400">
                          Transactions will appear here once users start borrowing books
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transactions.map(tx => {
                    const statusInfo = getStatusConfig(tx.status);
                    const StatusIcon = statusInfo.icon;
                    const isReturned = tx.status === 'returned';
                    const isUpdating = updatingId === tx.id;

                    return (
                      <tr 
                        key={tx.id} 
                        className="hover:bg-slate-50/50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-900">
                            {tx.user_name || 'Unknown User'}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <img src={tx.book_image || default_img} className="w-8 h-8 text-slate-400 flex-shrink-0" />
                            <p className="text-sm text-slate-700 line-clamp-1">
                              {tx.book_title || 'Unknown Book'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusInfo.label}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-600">
                            {tx.request_date ? formatDate(tx.request_date) : '—'}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-600">
                            {tx.approval_date ? formatDate(tx.approval_date) : '—'}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-600">
                            {tx.return_date ? formatDate(tx.return_date) : '—'}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            {isReturned ? (
                              <span className="text-xs text-slate-400 font-medium">
                                No action available
                              </span>
                            ) : (
                              <div className="relative">
                                <select
                                  value={tx.status}
                                  onChange={(e) => updateStatus(tx.id, e.target.value)}
                                  disabled={isUpdating}
                                  className={`
                                    appearance-none bg-white border border-slate-300 
                                    rounded-md px-3 py-1.5 pr-8 text-sm text-slate-700
                                    hover:border-slate-400 focus:outline-none 
                                    focus:ring-2 focus:ring-slate-200 focus:border-slate-400
                                    transition-colors cursor-pointer
                                    ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}
                                  `}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="approved">Approved</option>
                                  <option value="returned">Returned</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                                  {isUpdating ? (
                                    <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                                  ) : (
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
          <div className="mt-6">
            <Pagination
            currentPage={currentPage}
            totalItems={totalItem}
            onPageChange={setCurrentPage}
            itemsPerPage={pageSize}
            />
          </div>
      </div>
    </AdminLayout>
  );
};

export default BorrowTransactions;