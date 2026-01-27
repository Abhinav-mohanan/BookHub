import React from 'react';
import Pagination from '../shared/Pagination';

const UserTable = ({
  users,
  onActionClick,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const getStatusStyle = (isActive) =>
    isActive
      ? 'bg-green-100 text-green-700'
      : 'bg-red-100 text-red-700';

  const getAvatarColor = (index) => {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-orange-100 text-orange-600',
      'bg-gray-100 text-gray-600',
      'bg-purple-100 text-purple-600',
    ];
    return colors[index % colors.length];
  };


return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Full Name</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Email</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Toggle Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4}
                  className="px-6 py-10 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
            users.map((user, index) => (
              <tr key={user.user_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getAvatarColor(index)}`}>
                      {user.first_name[0]}{user.last_name[0]}
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {user.first_name} {user.last_name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusStyle(user.is_active)}`}>
                    {user.is_active ? 'Active' : 'Blocked'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onActionClick(user)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                      user.is_active 
                      ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {user.is_active ? 'Block User' : 'Unblock User'}
                  </button>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
      
      {totalItems > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default UserTable;
