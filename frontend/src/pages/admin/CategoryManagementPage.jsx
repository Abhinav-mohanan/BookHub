import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import AdminLayout from '../../compoenents/admin/AdminLayout';
import Pagination from '../../compoenents/shared/Pagination';
import { GetCategoriesApi } from '../../Api/BookManagementApi';
import { CreateCategoryApi, ToggleCategoryDeleteApi, UpdateCategoryApi } from '../../Api/AdminManagementApi';
import FormInput from '../../compoenents/shared/FormInput';
import { handleApiError } from '../../compoenents/shared/ErrorHandler';
import ConfirmationModal from '../../compoenents/shared/ConfirmationModal';


const CategoryManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [statusFilter, setStatusFilter] = useState('listed');
  const [confirmData, setConfirmData] = useState(null);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false)
  const [catName, setCatName] = useState('');
  const [error,setError] = useState({})
  const pageSize = 8;

  const fetchCategories = async () => {
    try {
      const data = await GetCategoriesApi(currentPage,statusFilter)
      setCategories(data.results);
      setTotalItems(data.count);
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    setCurrentPage(1)
    fetchCategories();
  }, [currentPage, statusFilter]);

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCatName(category.category_name);
    } else {
      setEditingCategory(null);
      setCatName('');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await UpdateCategoryApi(editingCategory.id, { category_name: catName });
        toast.success("Category updated successfully");
      } else {
        await CreateCategoryApi({ category_name: catName });
        toast.success("New category created");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      handleApiError(error,setError);
    }
  };

  const handleChange = (e) => {
    setCatName(e.target.value);
    if (error.category_name) {
        setError({});
        }
    };


  const handleConfirmAction = async () => {
    try {
      const data = await ToggleCategoryDeleteApi(confirmData.id);
      toast.success(data.message);
      fetchCategories();
      setConfirmData(null)
      setIsOpenConfirmModal(false)
    } catch (error) {
      handleApiError(error);
    }
  };

  const openConfirmModal = (data) =>{
    setConfirmData(data)
    setIsOpenConfirmModal(true)
  }

  return (
    <AdminLayout activeItem={'category'}>
      <div className="max-w-5xl mx-auto px-8 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-light text-slate-900 mb-1 tracking-tightt">Categories</h2>
            <p className="text-slate-500 text-sm">Organize your books by genre or topic</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all cursor-pointer shadow-md"
          >
            <Plus className="w-5 h-5" /> Add Category
          </button>
        </div>
        <div className="flex gap-3 mb-6">
        <button
          onClick={() => setStatusFilter('listed')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm cursor-pointer ${statusFilter === 'listed'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          Listed
        </button>
        <button
          onClick={() => setStatusFilter('unlisted')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm cursor-pointer ${statusFilter === 'unlisted'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          Unlisted
        </button>
      </div>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Category ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {categories.length === 0 ? (
                <tr>
                    <td colSpan="3" className="text-center py-6 text-gray-500">
                    No categories found
                    </td>
                </tr>
                ) :(
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-400">#CAT-{cat.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 uppercase">{cat.category_name}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenModal(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer">
                        Edit
                      </button>
                      <button onClick={()=>openConfirmModal({
                        id:cat.id,
                        action:cat.is_delete?'restore':'unlist',
                        name:cat.category_name
                      })}
                      className={`p-2 rounded-lg cursor-pointer ${cat.is_delete 
                      ? 'text-green-600 hover:bg-green-50'
                      :'text-red-600 hover:bg-red-50'}`}>
                        {cat.is_delete ? 'Restore':'Unlist'}
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
          <Pagination 
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-900">
                  {editingCategory ? 'Edit Category' : 'New Category'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                label='Category Name'
                required
                value={catName}
                onChange={handleChange}
                placeholder='e.g. Science Fiction'
                error={error.category_name?.[0]}/>
                <button 
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 cursor-pointer transition-all shadow-lg"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <ConfirmationModal
      open={isOpenConfirmModal}
      title={confirmData?.action =='restore'?"Restore category":"Unlist Category"}
      message={confirmData?`Are you sure you want to ${confirmData.action} "${confirmData.name.toUpperCase()}"`:''}
      confirmText={confirmData?.action === 'restore'?'Restore':'Unlist'}
      onConfirm={handleConfirmAction}
      onClose={()=>{
        setConfirmData(null)
        setIsOpenConfirmModal(false)
      }}/>
    </AdminLayout>
  );
};

export default CategoryManagementPage;