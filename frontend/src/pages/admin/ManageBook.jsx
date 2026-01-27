import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../compoenents/shared/Breadcrumb';
import PageHeader from '../../compoenents/admin/PageHeader';
import ImageUpload from '../../compoenents/admin/ImageUpload';
import { Book, Save, User } from 'lucide-react';
import FormTextarea from '../../compoenents/admin/FormTextArea';
import { toast } from 'react-toastify';
import { handleApiError } from '../../compoenents/shared/ErrorHandler';
import { AdminBookCreateApi, AdminBookUpdateApi, GetCategoriesApi } from '../../Api/BookManagementApi';
import FormInput from '../../compoenents/shared/FormInput';
import SelectDropdown from '../../compoenents/shared/SelectDropdown';

const ManageBook = ({ isEdit = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category:'',
    description: '',
    quantity:1,
    available_quantity:1,
  });
  const [errors,setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const [images, setImages] = useState([]);
  const [categories,setcategories] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        title: initialData.title,
        author: initialData.author,
        category: initialData.category,
        description: initialData.description,
        quantity: initialData.quantity,
        available_quantity: initialData.available_quantity,
      });
      if (initialData.images) {
        setImagePreviews(initialData.images.map(img => img.image_url));
      }
    }
  }, [isEdit, initialData]);

  const resetForm = () => {
    if (!isEdit){
      setFormData({
        title: '',
        author: '',
        category: '',
        description: '',
        quantity: 1,
        available_quantity: 1,
      });
      
      setImages([]);
      setImagePreviews([]);
      setErrors({});
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

      if (errors[name]){
        setErrors((prev)=>({
          ...prev,[name]:null
        }))
    };
  }

  const getCategories = async() =>{
    try{
      const data = await GetCategoriesApi()
      setcategories(data.results)
    }catch(error){
      handleApiError(error,setErrors)
    }
  }

  useEffect(()=>{
    getCategories()
  },[])

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev=>[...prev,...files])
    
    const previews = files.map(file =>URL.createObjectURL(file));
    setImagePreviews(prev=>[...prev,...previews])
  };

  const handleImageRemove = (index) => {
    setImages(prev => prev.filter((_, i)=> i !== index));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));

  };

  const handlePublish = async() => {
    setIsLoading(true)
    try{
      const data = new FormData()
      data.append('title',formData.title);
      data.append('author', formData.author);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('quantity', formData.quantity)
      data.append('available_quantity', formData.available_quantity)

      images.forEach((file)=> {
        data.append('uploaded_images',file)
      })
      if (isEdit){
      await AdminBookUpdateApi(initialData.slug, data)
      toast.success("Book updated")
    }else{
      await AdminBookCreateApi(data)
      toast.success("Book published successfully")
      resetForm()
    }
    }catch(error){
      handleApiError(error,setErrors)
    }finally{
      setIsLoading(false)
    }
  };

  const handleDiscard = () => {
    resetForm()
    }

  useEffect(() => {
      return () => imagePreviews.forEach(URL.revokeObjectURL);
  }, []);


  const breadcrumbItems = [
    { label: 'Books', href: '/admin/books' ,icon:Book},
    { label: isEdit ? 'Edit book':'Add New Entry' }
  ];

  return (
    <div className="flex justify-center py-8">
      <div className="w-full max-w-6xl px-6">
        <Breadcrumb items={breadcrumbItems} />
        <PageHeader
          title={isEdit?"Edit book":"Add New Book"}
          description="Populate the fields below to register a new title in the digital catalog."
          actions={
            <>
              <button
                onClick={handleDiscard}
                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-900 font-semibold text-sm hover:bg-gray-50 transition-all"
              >
                Discard
              </button>
              <button
                disabled={isLoading}
                onClick={handlePublish}
                className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-bold text-sm shadow-md 
                hover:bg-blue-700 transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isEdit ?"Save Book" :"Publish to Catalog"}
              </button>
            </>
          }
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="space-y-6">
                <FormInput
                  label="Book Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter the full official title"
                  required
                  error={errors.title?.[0]}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Name of author"
                    icon={User}
                    error={errors.author?.[0]}
                  />
                  <SelectDropdown
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Select category"
                    options={categories.map(cat => ({
                      value: cat.id,
                      label: cat.category_name,
                    }))}
                    error={errors.category?.[0]}
                  />
                </div>

                <FormTextarea
                  label="Book Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide a brief summary of the book..."
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ImageUpload
              images={imagePreviews}
              onUpload={handleImageUpload}
              onRemove={handleImageRemove}
            />

            <FormInput
            label='Quantity'
            name='quantity'
            type='number'
            value={formData.quantity}
            onChange={handleChange}
            error={errors.quantity?.[0]}
            />

            <FormInput
            label='Available Quantity'
            name='available_quantity'
            type='number'
            value={formData.available_quantity}
            onChange={handleChange}
            error={errors.available_quantity?.[0]}
            />
          </div>
        </div>

        <div className="lg:hidden bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4 flex justify-between items-center z-50">
          <button
            onClick={handleDiscard}
            className="text-gray-500 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold"
          >
            Save Book
          </button>
        </div>
      </div>
    </div>
  );
};


export default ManageBook