import React, { useEffect, useState } from 'react'
import VerificationTable from '../../compoenents/admin/VerificationTable';
import AdminLayout from '../../compoenents/admin/AdminLayout';
import { GetPendingAdminsApi, VerifyAdminApi } from '../../Api/AdminManagementApi';
import { data } from 'react-router-dom';

const AdminVerificationPage = () => {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 6; 

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const data = await GetPendingAdminsApi({ page: currentPage });
      
      setPendingAdmins(data.results);
      setTotalItems(data.count); 
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentPage]);

  const handleVerify = async (user_id) => {
    try {
      data = await VerifyAdminApi({user_id:user_id});
      toast.success(data.message);
      fetchRequests()
      if (pendingAdmins.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        fetchRequests(); 
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <AdminLayout activeItem={'staffs'}>
      <div className="max-w-7xl mx-auto px-8 py-8">        
        <div className="mb-8">
          <h2 className="text-gray-900 text-3xl font-black tracking-tight">Admin Approvals</h2>
          <p className="text-gray-500">Review pending staff registrations</p>
        </div>

        <VerificationTable 
          admins={pendingAdmins} 
          onVerify={handleVerify} 
          isLoading={isLoading}
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminVerificationPage