import React from 'react'
import AdminLayout from '../../compoenents/admin/AdminLayout'
import AdminProfilePage from './AdminProfilePage'

const AdminDashboard = () => {
  return (
    <AdminLayout>
        <AdminProfilePage/>
    </AdminLayout>
  )
}

export default AdminDashboard