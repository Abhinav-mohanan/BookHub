import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import AdminLayout from '../../compoenents/admin/AdminLayout';
import Pagination from '../../compoenents/shared/Pagination';
import { GetCategoriesApi } from '../../Api/BookManagementApi';
import { CreateCategoryApi, ToggleCategoryDeleteApi, UpdateCategoryApi } from '../../Api/AdminManagementApi';
import FormInput from '../../compoenents/shared/FormInput';
import { handleApiError } from '../../compoenents/shared/ErrorHandler';


const CategoryManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [catName, setCatName] = useState('');
  const [error,setError] = useState({})
  const pageSize = 8;

  const fetchCategories = async () => {
    try {
      const data = await GetCategoriesApi({ page: currentPage });
      setCategories(data.results);
      setTotalItems(data.count);
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

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


  const handleToggleDelete = async (id) => {
    try {
      const res = await ToggleCategoryDeleteApi(id);
      toast.success(res.message);
      fetchCategories();
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <AdminLayout activeItem={'category'}>
      <div className="max-w-5xl mx-auto px-8 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-gray-900 text-3xl font-black tracking-tight">Categories</h2>
            <p className="text-gray-500">Organize your books by genre or topic</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-md"
          >
            <Plus className="w-5 h-5" /> Add Category
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
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{cat.category_name}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenModal(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleToggleDelete(cat.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
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
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
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
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CategoryManagementPage;