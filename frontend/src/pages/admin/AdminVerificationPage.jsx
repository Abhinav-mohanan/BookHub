import React, { useEffect, useState } from 'react'
import VerificationTable from '../../compoenents/admin/VerificationTable';
import AdminLayout from '../../compoenents/admin/AdminLayout';
import { GetPendingAdminsApi, VerifyAdminApi } from '../../Api/AdminManagementApi';
import ConfirmationModal from '../../compoenents/shared/ConfirmationModal';

const AdminVerificationPage = () => {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOPen, setIsModalOpen] = useState(false)
  const [confirmId, setConfirmId] = useState(null)
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
    if (!user_id) return
    try {
      const data = await VerifyAdminApi({user_id:user_id});
      toast.success(data.message);
      setIsModalOpen(false)
      setConfirmId(null)
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
  
  const handleModalOpen = (user_id) =>{
    setConfirmId(user_id)
    setIsModalOpen(true)
  }

  const handleCloseModal = () =>{
    setConfirmId(null)
    setIsModalOpen(false)
  } 

  return (
    <AdminLayout activeItem={'staffs'}>
      <div className="max-w-7xl mx-auto px-8 py-8">        
        <div className="mb-8">
          <h2 className="text-gray-900 text-3xl font-black tracking-tight">Admin Approvals</h2>
          <p className="text-gray-500">Review pending staff registrations</p>
        </div>

        <VerificationTable 
          admins={pendingAdmins} 
          onVerify={handleModalOpen} 
          isLoading={isLoading}
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
      <ConfirmationModal
      open={isModalOPen}
      title='Confirm Staff Verification'
      message="Are you sure you want to approve this Staff account ? Once approved, this user will have administrative privileges."
      onClose={handleCloseModal}
      onConfirm={()=>handleVerify(confirmId)}
      confirmText='Approve'/>
    </AdminLayout>
  );
};

export default AdminVerificationPage