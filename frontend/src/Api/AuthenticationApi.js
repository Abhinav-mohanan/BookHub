import axios from "axios"
import { BASE_URL } from "./BaseURl"

export const SignupApi = async(data,role) =>{
    const response = await axios.post(`${BASE_URL}/${role}/signup/`,data)
    return response.data
}