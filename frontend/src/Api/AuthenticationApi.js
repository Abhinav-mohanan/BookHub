import axios from "axios"
import CONFIG from "./config"

export const SignupApi = async(data,role) =>{
    const response = await axios.post(`${CONFIG.BACKEND_URL}/${role}/signup/`,data)
    return response.data
}
export const VerifyOTPApi = async(data) =>{
    const response = await axios.post(`${CONFIG.BACKEND_URL}/verify/otp/`,data)
    return response.data
}
export const LoginApi = async(data) =>{
    const response = await axios.post(`${CONFIG.BACKEND_URL}/login/`,data)
    return response.data
}
