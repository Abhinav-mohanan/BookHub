import React, { useEffect, useState } from 'react';
import { GetMyTransactionsApi } from '../../Api/BookManagementApi';
import Pagination from '../../compoenents/shared/Pagination';
import Layout from '../../compoenents/user/Layout';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  Calendar,
  FileText,
  Loader2
} from 'lucide-react';
import formatDate from '../../compoenents/shared/formatDate';

const statusConfig = {
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-300',
    icon: Clock
  },
  approved: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-300',
    icon: CheckCircle
  },
  rejected: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-300',
    icon: XCircle
  },
  returned: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-300',
    icon: RotateCcw
  },
};

const MyTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const pageSize = 6;

  const fetchTransactions = async (page) => {
    try {
      setLoading(true);
      const data = await GetMyTransactionsApi(page);
      setTransactions(data.results);
      setTotalItems(data.count);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  const getStatusStats = () => {
    const stats = {
      total: transactions.length,
      pending: transactions.filter(t => t.status === 'pending').length,
      approved: transactions.filter(t => t.status === 'approved').length,
      returned: transactions.filter(t => t.status === 'returned').length,
    };
    return stats;
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-spin" />
            <p className="text-gray-600 font-medium">Loading transactions...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout  activeItem='history'>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          My Transactions
        </h1>
        <p className="text-gray-600">
          Track your borrowing history and current requests
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{totalItems}</p>
            </div>
            <div className="bg-gray-100 rounded-full p-3">
              <FileText className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-yellow-200">
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

        <div className="bg-white rounded-xl p-6 shadow-md border border-green-200">
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

        <div className="bg-white rounded-xl p-6 shadow-md border border-blue-200">
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

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Book Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Requested
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Approved
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Returned
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12">
                    <div className="text-center">
                      <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-1">No Transactions Found</h3>
                      <p className="text-gray-500 text-sm">You haven't borrowed any books yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map(tx => {
                  const StatusIcon = statusConfig[tx.status].icon;
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 rounded-lg p-2">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                          </div>
                          <span className="font-semibold text-gray-800">{tx.book_title}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusConfig[tx.status].bg} ${statusConfig[tx.status].text} ${statusConfig[tx.status].border}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {tx.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {tx.request_date ? formatDate(tx.request_date) : '-'}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {tx.approval_date ? formatDate(tx.approval_date) : '-'}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {tx.return_date ? formatDate(tx.return_date) : '-'}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-gray-200">
          {transactions.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-1">No Transactions Found</h3>
              <p className="text-gray-500 text-sm">You haven't borrowed any books yet</p>
            </div>
          ) : (
            transactions.map(tx => {
              const StatusIcon = statusConfig[tx.status].icon;
              return (
                <div key={tx.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="bg-blue-100 rounded-lg p-2 flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-800">{tx.book_title}</h3>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig[tx.status].bg} ${statusConfig[tx.status].text}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {tx.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Requested:
                      </span>
                      <span className="text-gray-700 font-medium">
                        {tx.request_date ? formatDate(tx.request_date) : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Approved:
                      </span>
                      <span className="text-gray-700 font-medium">
                        {tx.approval_date ? formatDate(tx.approval_date) : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Returned:
                      </span>
                      <span className="text-gray-700 font-medium">
                        {tx.returne_date ? formatDate(tx.returne_date) : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
      </div>
    </Layout>
  );
};

export default MyTransactions;