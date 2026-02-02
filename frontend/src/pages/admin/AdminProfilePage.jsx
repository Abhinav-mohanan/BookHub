import React, { useEffect, useState } from 'react'
import FormInput from '../../compoenents/shared/FormInput';
import { getProfileApi, updateProfileApi } from '../../Api/AuthenticationApi';
import { handleApiError } from '../../compoenents/shared/ErrorHandler';
import formatDate from '../../compoenents/shared/formatDate';
import { toast } from 'react-toastify';
import { Calendar, Edit3 } from 'lucide-react';

const AdminProfilePage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name:'',
    email: '',
    join_date:''
  });

  const [isLoading,setIsLoading] = useState(false)
  const [initialData, setInitialData] = useState({});


  const fetchProfile = async() =>{
    setIsLoading(true)
    try{
      const data = await getProfileApi()
      const profile = {
        first_name:data.first_name || 'Super',
        last_name:data.last_name || 'Admin',
        email:data.email || '',
        join_date:formatDate(data.date_joined || '')
      }
      setFormData(profile)
      setInitialData(profile)

    }catch(error){
      handleApiError(error)
    }finally{
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    fetchProfile()
  },[])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async() => {
    setIsLoading(true)
    try{
      const data = await updateProfileApi({
        first_name:formData.first_name,
        last_name:formData.last_name,
      })
      toast.success("Profile update successfully")
      fetchProfile()
    }
    catch(error){
      handleApiError(error)
    }finally{
      setIsLoading(false)
    }
  };

  const handleCancel = () => {
    setFormData(initialData)
    toast.info('Changes cancelled');
  };

  const isChanged = initialData && 
  (formData.first_name !== initialData.first_name) ||
  (formData.last_name !== initialData.last_name)


  return (
    <div className="flex justify-center py-4">
      <div className="w-full max-w-6xl px-4">
        <div className="mt-8 bg-white  rounded-xl border border-gray-200  overflow-hidden">
          <h2 className="text-xl font-bold px-8 pt-8 pb-4">Account Details</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="mb-6">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-5xl font-bold">
                {formData.first_name?.[0]?.toUpperCase() || 'A'}
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              {formData.first_name} {formData.last_name}
            </h2>
            <p className="text-gray-500 text-sm mb-4">{formData.email}</p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Member since</span>
              </div>
              <p className="text-gray-800 font-semibold mt-1">
                {formData.join_date ? new Date(formData.join_date).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                }) : '-'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-blue-600 font-semibold">Role</p>
                <p className="text-gray-700">Admin</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-green-600 font-semibold">Status</p>
                <p className="text-gray-700">Active</p>
              </div>
            </div>
          </div>
        </div>
          <div className='lg:col-span-2'>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 mb-8">
              <div className="flex items-center gap-2 text-white">
                <Edit3 className="w-5 h-5" />
                <h3 className="text-xl font-semibold">Edit Profile Information</h3>
              </div>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 px-8 pb-8">
            <FormInput
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              />
            <FormInput
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              />
            <FormInput
              label="Admin Email"
              type="email"
              name="email"
              value={formData.email}
              disabled={true}   
              />
            <FormInput
              label="Join Date"
              type="text"
              name="join_date"
              value={formData.join_date}
              disabled={true}   
              />
          </div>
             {isChanged && (
              <div className="px-8 pb-8 flex justify-end gap-3">
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="min-w-[120px] h-11 px-5 bg-white  text-gray-900  border border-gray-200 
                rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                Cancel
              </button>
              <button
              disabled={isLoading}
              onClick={handleSave}
                className="min-w-[120px] h-11 px-5 bg-blue-600 text-white rounded-lg font-bold text-sm 
                shadow-md hover:bg-blue-700 transition-all cursor-pointer disabled:cursor-not-allowed "
                >
                Save Changes
              </button>
            </div>
            )}
          </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AdminProfilePage