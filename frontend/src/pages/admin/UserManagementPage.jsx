import React, { useEffect, useState } from 'react'
import FilterBar from '../../compoenents/admin/FilterBar';
import UserTable from '../../compoenents/admin/UserTable';
import { handleApiError } from '../../compoenents/shared/ErrorHandler';
import { GetUserDetailsApi, ToggleUserStatusApi } from '../../Api/AdminManagementApi';
import { toast } from 'react-toastify';
import AdminLayout from '../../compoenents/admin/AdminLayout';

const UserManagementPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0); 
  const pageSize = 6;

  const fetchUsers = async () => {
    try {
      const data = await GetUserDetailsApi({
        search: searchValue,
        status: activeFilter,
        page: currentPage 
      });
      setUsers(data.results);
      setTotalItems(data.count);
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchValue, activeFilter, currentPage]);

  const handleActionClick = async (user) => {
    try {
      const response = await ToggleUserStatusApi(user.user_id);
      toast.success(response.message);
      
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.user_id === user.user_id ? { ...u, is_active: !u.is_active } : u
        )
      );
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <AdminLayout activeItem={'users'}> 
      <div className="max-w-7xl mx-auto px-8 py-8">
        
        <div className="mb-8">
          <h2 className="text-gray-900 text-3xl font-black tracking-tight">User Management</h2>
          <p className="text-gray-500">Manage system access for BookHub users</p>
        </div>

        <FilterBar
          searchValue={searchValue}
          onSearchChange={(val) => { setSearchValue(val); setCurrentPage(1); }}
          activeFilter={activeFilter}
          onFilterChange={(val) => { setActiveFilter(val); setCurrentPage(1); }}
        />

        <UserTable 
          users={users} 
          onActionClick={handleActionClick}
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
    </AdminLayout>
  );
};

export default UserManagementPage

