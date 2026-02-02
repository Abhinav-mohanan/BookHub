import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AdminGetSingleBookApi } from '../../Api/BookManagementApi';
import ManageBook from './ManageBook';
import AdminLayout from '../../compoenents/admin/AdminLayout';


const EditBookPage = () => {
  const { slug } = useParams();
  const [bookData, setBookData] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await AdminGetSingleBookApi(slug);
        setBookData(data);
      } catch (error) {
        console.error("Error fetching book");
      }
    };
    fetchBook();
  }, [slug]);

  if (!bookData) return <div className="text-center py-20">Loading Book Details...</div>;

  return (
    <AdminLayout activeItem={'books'}>
      <ManageBook isEdit={true} initialData={bookData} />
    </AdminLayout>
  );
};

export default EditBookPage;