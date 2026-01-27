import axiosInstance from "./axiosInstance"

export const GetCategoriesApi = async() =>{
    const response = await axiosInstance.get('admin/category/')
    return response.data
}
export const AdminBookCreateApi = async(data) =>{
    const response = await axiosInstance.post('admin/books/',data)
    return response.data
}

export const AdminBookListApi = async(page) =>{
    const response = await axiosInstance.get('admin/books/',{
        params:{page}
    })
    return response.data
}

export const AdminGetSingleBookApi = async(slug) =>{
    const response = await axiosInstance.get(`admin/books/${slug}/`)
    return response.data
}
export const AdminBookUpdateApi = async(slug,data) =>{
    const response = await axiosInstance.put(`admin/books/${slug}/`,data)
    return response.data
}

export const AdminBookToggleDeleteApi = async(slug,data) =>{
    const response = await axiosInstance.patch(`admin/books/${slug}/`,data)
    return response.data
}