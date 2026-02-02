import axiosInstance from "./axiosInstance"

export const GetCategoriesApi = async(page,status) =>{
    const response = await axiosInstance.get('admin/category/',{
        params:{page,status}
    })
    return response.data
}
export const AdminBookCreateApi = async(data) =>{
    const response = await axiosInstance.post('admin/books/',data)
    return response.data
}

export const AdminBookListApi = async(page,status,search) =>{
    const response = await axiosInstance.get('admin/books/',{
        params:{page,status,search}
    })
    return response.data
}

export const PublicBookListApi = async(page) =>{
    const response = await axiosInstance.get('books/',{
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
export const BorrowBookApi = async(slug) =>{
    const response = await axiosInstance.post(`books/${slug}/borrow/`)
    return response.data
}
export const GetMyTransactionsApi = async() =>{
    const response = await axiosInstance.get('transactions/')
    return response.data
}
export const GetAllTransactionsApi = async(page,status) =>{
    const response = await axiosInstance.get('admin/transactions/',{
        params:{page,status}
    })
    return response.data
}
export const UpdateTransactionStatusApi  = async(transaction_id,data) =>{
    const response = await axiosInstance.patch(`transactions/${transaction_id}/update/`,data)
    return response.data
}