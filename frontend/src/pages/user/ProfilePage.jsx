import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getProfileApi, updateProfileApi } from '../../Api/AuthenticationApi';
import FormInput from '../../compoenents/shared/FormInput';
import Layout from '../../compoenents/user/Layout';
import { 
  User, 
  Mail, 
  Calendar, 
  Save, 
  Loader2,
  Edit3
} from 'lucide-react';
import { handleApiError } from '../../compoenents/shared/ErrorHandler';

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    date_joined: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setPageLoading(true);
      const data = await getProfileApi();
      setFormData(data);
    } catch {
      handleApiError(errors,setErrors)
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateProfileApi({
        first_name: formData.first_name,
        last_name: formData.last_name,
      });
      toast.success('Profile updated successfully');
      fetchProfile();
    } catch (error) {
      handleApiError(error, setErrors)
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-spin" />
            <p className="text-gray-600 font-medium">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeItem='profile'>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          My Profile
        </h1>
        <p className="text-gray-600">
          Manage your personal information and account settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="mb-6">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-5xl font-bold">
                {formData.first_name?.[0]?.toUpperCase() || 'U'}
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
                {formData.date_joined ? new Date(formData.date_joined).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                }) : '-'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-blue-600 font-semibold">Role</p>
                <p className="text-gray-700">Reader</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-green-600 font-semibold">Status</p>
                <p className="text-gray-700">Active</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
              <div className="flex items-center gap-2 text-white">
                <Edit3 className="w-5 h-5" />
                <h3 className="text-xl font-semibold">Edit Profile Information</h3>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      First Name
                      <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <FormInput
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    error={errors.first_name?.[0]}
                    required
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Last Name
                      <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <FormInput
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    error={errors.last_name?.[0]}
                    required
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </div>
                </label>
                <div className="relative">
                  <FormInput
                    value={formData.email}
                    disabled
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      Read-only
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Member Since
                  </div>
                </label>
                <FormInput
                  value={formData.date_joined ? new Date(formData.date_joined).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : '-'}
                  disabled
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-lg
                    hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={fetchProfile}
                  disabled={loading}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg
                    hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;