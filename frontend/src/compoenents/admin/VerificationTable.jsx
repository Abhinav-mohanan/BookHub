import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import Pagination from '../shared/Pagination';

const VerificationTable = ({ 
  admins, 
  onVerify, 
  isLoading, 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange
}) => {
  const getInitials = (f, l) => `${f?.[0] || ''}${l?.[0] || ''}`.toUpperCase();

  if (isLoading) return <div className="text-center py-20 text-gray-400 font-medium">Loading requests...</div>;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Staff Member</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Email</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {admins.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                  <CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-400" />
                  <p>No pending requests</p>
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.user_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                        {getInitials(admin.first_name, admin.last_name)}
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        {admin.first_name} {admin.last_name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{admin.email}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onVerify(admin.user_id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all"
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default VerificationTable