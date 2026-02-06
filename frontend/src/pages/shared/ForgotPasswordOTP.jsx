import React, { useEffect, useState } from 'react'
import {  useLocation, useNavigate } from 'react-router-dom';
import AuthFormContainer from '../../compoenents/shared/AuthFormContainer';
import FormInput from '../../compoenents/shared/FormInput';
import SubmitButton from '../../compoenents/shared/SubmitButton';
import { toast } from 'react-toastify';
import { KeyRound, Mail } from 'lucide-react';
import { handleApiError } from '../../compoenents/shared/ErrorHandler';
import { ForgotPasswordVerifyOTPAPI, ResendOTPApi } from '../../Api/AuthenticationApi';

const ForgotPasswordOTP = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email:location?.state?.email || '',
    otp: ''
  });
  const RESEND_INTERVAL = 60;
  const lastResendTime = localStorage.getItem("OTP_last_send_time")
  const getInitialSeconds = () =>{
    if (!lastResendTime) return 0
    const diff = Math.floor((Date.now() - parseInt(lastResendTime)) / 1000)
    return diff < RESEND_INTERVAL ? RESEND_INTERVAL - diff : 0;

  }
  const [secondsLeft, setSecondsLeft] = useState(getInitialSeconds)
  const [isDisabled, setIsDisabled] = useState(getInitialSeconds() > 0)


  useEffect(()=>{
    if (secondsLeft <= 0){
      setIsDisabled(false)
      return
    }
    const timer = setInterval(() => {
      setSecondsLeft(prev =>prev - 1)
    }, 1000);

    return ()=> clearInterval(timer)
  },[secondsLeft])

  const handleSubmit = async () => {
    try {
      const data = await ForgotPasswordVerifyOTPAPI(formData)
      toast.success(data?.message)
      navigate('/reset-password',{
        state:{'email':formData.email},
        replace: true 
      })
      console.log(formData)
      localStorage.removeItem('OTP_last_send_time')
    } catch (error) {
      handleApiError(error,setErrors)
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResendOTP = async(e) =>{
    e.preventDefault()
    setIsLoading(true)
    try{
      const data = await ResendOTPApi({email:formData.email})
      toast.success(data?.message)
      localStorage.setItem('OTP_last_send_time', Date.now())
      setSecondsLeft(60)
      setIsDisabled(true)
    }catch(error){
      toast.error(error?.response?.error || 'something went wrong please try again later')
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <AuthFormContainer title="Verify OTP">
      <p className="text-sm text-gray-600 mb-6 text-center">
        We've sent a verification code to your email address.
      </p>
      <div className="space-y-4">
        <FormInput
          label="Email"
          type="email"
          name="email"
          disabled={true}
          value={formData.email}
          onChange={handleChange}
          icon={Mail}
          error={errors.otp?.[0]}
        />
        <FormInput
          label="Enter OTP"
          type="number"
          name="otp"
          value={formData.otp}
          onChange={handleChange}
          placeholder="Enter 4-digit code"
          icon={KeyRound}
          error={errors.otp?.[0]}
        />

        <SubmitButton onClick={handleSubmit} loading={isLoading}>
          Verify OTP
        </SubmitButton>

        <button
        disabled={isDisabled || isLoading}
        onClick={handleResendOTP}
        className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-sm transition-colors mt-1 
        disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'>
        {isDisabled?`Resend OTP in ${secondsLeft} `:"Resend OTP"}
        </button>
      </div>
    </AuthFormContainer>
  );
};

export default ForgotPasswordOTP 