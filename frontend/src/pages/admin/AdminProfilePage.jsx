import React, { useEffect, useState } from 'react'
import { BookMarked, Shield, Users } from 'lucide-react';
import StatCard from '../../compoenents/shared/StatCard';
import FormInput from '../../compoenents/shared/FormInput';
import { getProfileApi, updateProfileApi } from '../../Api/AuthenticationApi';
import { handleApiError } from '../../compoenents/shared/ErrorHandler';
import formatDate from '../../compoenents/shared/formatDate';
import { toast } from 'react-toastify';

const AdminProfilePage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name:'',
    email: '',
    join_date:''
  });

  const [isLoading,setIsLoading] = useState(false)

  const fetchProfile = async() =>{
    setIsLoading(true)
    try{
      const data = await getProfileApi()
      setFormData({
        first_name:data.first_name || 'Super',
        last_name:data.last_name || 'Admin',
        email:data.email || '',
        join_date:formatDate(data.date_joined || '')
      })
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
    fetchProfile()
    toast.info('Changes cancelled');
  };

  // const stats = [
  //   { title: 'Total Books Cataloged', value: '1,240', icon: BookMarked },
  //   { title: 'Active Users Managed', value: '850', icon: Users },
  //   { title: 'Active Admins', value: '4', icon: Shield }
  // ];

  return (
    <div className="flex justify-center py-4">
      <div className="w-full max-w-6xl px-4">

        {/* <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div> */}

        <div className="mt-8 bg-white  rounded-xl border border-gray-200  overflow-hidden">
          <h2 className="text-xl font-bold px-8 pt-8 pb-4">Account Details</h2>
          
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

          <div className="px-8 py-6 bg-gray-50  border-t border-gray-200  flex justify-end gap-3">
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
        </div>
      </div>
    </div>
  );
};


export default AdminProfilePage