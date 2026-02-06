import React, { useState } from 'react'
import AuthFormContainer from '../../compoenents/shared/AuthFormContainer'
import FormInput from '../../compoenents/shared/FormInput'
import SubmitButton from '../../compoenents/shared/SubmitButton'
import { Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiError } from '../../compoenents/shared/ErrorHandler'
import { ForgotPasswordEmailAPI } from '../../Api/AuthenticationApi'

const ForgotPasswordEmail = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const validateForm = () =>{
        const new_erros = {}
        if(!email.trim()){
            new_erros.email= ['This field is required']
        }
        setErrors(new_erros)
        return Object.keys(new_erros).length === 0
    }

    const handleSubmit = async() =>{
        const isValid = validateForm()
        if(!isValid) return
        setIsLoading(true)
        try{
            const data = await ForgotPasswordEmailAPI({email:email})
            navigate('/forgot-password-otp',{state:{'email':email}})
        }catch(error){
            handleApiError(error,setErrors)
        }finally{
            setIsLoading(false)
        }
    }

    const handleChange = (name,setName,e) =>{
        setName(e.target.value)
        if (errors[name]){
            setErrors((prev)=>({...prev,[name]:null}))
        }
    }
  return (
    <AuthFormContainer title='Forgot Password'>
        <div className="space-y-4">
        <FormInput
        label='Email'
        type='email'
        name='email'
        value={email}
        placeholder="Enter your email.."
        icon={Mail}
        onChange={(e)=>handleChange('email',setEmail,e)}
        error={errors?.email?.[0]}/>

        <SubmitButton onClick={handleSubmit} loading={isLoading}>
            Send OTP
        </SubmitButton>
        </div>
    </AuthFormContainer>
  )
}

export default ForgotPasswordEmail