import React from 'react'
import AdminLayout from '../../compoenents/admin/AdminLayout'
import ManageBook from './ManageBook'

const AddBookPage = () => {
  return (
    <AdminLayout activeItem={'books'}>
        <ManageBook/>
    </AdminLayout>
  )
}

export default AddBookPage