import axiosInstance from "./axiosInstance";

export const GetUserDetailsApi = async({search, status, page}) =>{
    const response = await axiosInstance.get('admin/user/management/',{
        params:{
            search,
            status_filter:status,
            page
        }
    })
    return response.data
}

export const ToggleUserStatusApi = async (userId) => {
  const response = await axiosInstance.post('/admin/user/management/', { user_id: userId });
  return response.data
};

export const GetPendingAdminsApi = async (page) => {
  const response = await axiosInstance.get('/admin/staff/management/',{
    params:{
        page
    }
  });
  return response.data
};

export const VerifyAdminApi = async (data) => {
  const response = await axiosInstance.post('/admin/staff/management/',data);
  return response.data
};

export const CreateCategoryApi = async (data) => {
  const response = await axiosInstance.post('/admin/category/',data)
  return response.data
};

export const UpdateCategoryApi = async (category_id,data) => {
  const response = await axiosInstance.put(`/admin/category/${category_id}/`,data)
  return response.data
};

export const ToggleCategoryDeleteApi = async (category_id,) => {
  const response = await axiosInstance.patch(`/admin/category/${category_id}/`)
  return response.data
};
