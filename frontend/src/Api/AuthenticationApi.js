import axios from "axios"
import CONFIG from "./config"
import axiosInstance from "./axiosInstance"

export const SignupApi = async(data,role) =>{
    const response = await axios.post(`${CONFIG.BACKEND_URL}/${role}/signup/`,data)
    return response.data
}
export const VerifyOTPApi = async(data) =>{
    const response = await axios.post(`${CONFIG.BACKEND_URL}/verify/otp/`,data)
    return response.data
}
export const LoginApi = async(data) =>{
    const response = await axiosInstance.post('/login/',data)
    return response.data
}
export const getProfileApi = async() =>{
    const response = await axiosInstance.get('/profile/')
    return response.data
}
export const updateProfileApi = async(data) =>{
    const response = await axiosInstance.patch('/profile/',data)
    return response.data
}
export const LogoutApi = async() =>{
    const response = await axiosInstance.post('logout/')
    return response.data
}
