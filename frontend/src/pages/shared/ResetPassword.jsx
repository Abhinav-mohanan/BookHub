import { Lock } from 'lucide-react'
import React, { useState } from 'react'
import AuthFormContainer from '../../compoenents/shared/AuthFormContainer'
import FormInput from '../../compoenents/shared/FormInput'
import SubmitButton from '../../compoenents/shared/SubmitButton'
import { replace, useLocation, useNavigate } from 'react-router-dom'
import { ResetPasswordAPI } from '../../Api/AuthenticationApi'
import { toast } from 'react-toastify'
import { handleApiError } from '../../compoenents/shared/ErrorHandler'

const ResetPassword = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [formData, setFormData] = useState({
      email:location?.state?.email || '',
      password:'',
      confirm_password:''
    })

    const handleChange = (e) =>{
      const {name,value} = e.target
      setFormData(prev =>({...prev,[name]:value}))
      if(errors[name]){
        setErrors(prev=>({...prev,[name]:''}))
      }
    }

    const validateForm = () =>{
      const newErros = {}
      if (!formData.password.trim()){
        newErros.password = ['This field is required']
      } else if  (formData.password.trim().length < 6){
        newErros.password = ['Password must be atleast 6 characters']
      }
      if (!formData.confirm_password.trim()){
        newErros.confirm_password = ['Confirm your password']
      } else if   (formData.password !== formData.confirm_password){
        newErros.confirm_password = ["Passwords do not match"]
      }
      setErrors(newErros)
      return Object.keys(newErros).length === 0
    }

    const handleSubmit = async () =>{
      const valid = validateForm()
      if (!valid) return
      try{
        setIsLoading(true)
        const data = await ResetPasswordAPI(formData)
        toast.success(data?.message||"Reset password sucessfully")
        navigate('/',{replace:true})
      }catch(error){
        handleApiError(error,setErrors)
      }finally{
        setIsLoading(true)
      }
    }
  return (
    <AuthFormContainer title='Reset Password'>
        <div className="space-y-4">
        <FormInput
        label='Email'
        type='email'
        name='email'
        value={formData.email}
        placeholder="name@example.com"
        icon={Lock}
        disabled={true}
        onChange={(e)=>handleChange(e)}
        error={errors?.email?.[0]}/>

        <FormInput
        label='New Password'
        type='password'
        name='password'
        value={formData.password}
        placeholder="Enter your password"
        icon={Lock}
        onChange={(e)=>handleChange(e)}
        error={errors?.password?.[0]}/>

        <FormInput
        label='Confirm password'
        type='password'
        name='confirm_password'
        value={formData.confirm_password}
        placeholder="confirm your password"
        icon={Lock}
        onChange={(e)=>handleChange(e)}
        error={errors?.confirm_password?.[0]}/>

        <SubmitButton onClick={handleSubmit} loading={isLoading}>
            Reset Password
        </SubmitButton>
        </div>
    </AuthFormContainer>
  )
}

export default ResetPassword