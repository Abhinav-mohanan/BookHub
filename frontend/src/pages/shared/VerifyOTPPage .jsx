import React, { useState } from 'react'
import {  useLocation, useNavigate } from 'react-router-dom';
import AuthFormContainer from '../../compoenents/shared/AuthFormContainer ';
import FormInput from '../../compoenents/shared/FormInput';
import SubmitButton from '../../compoenents/shared/SubmitButton';
import { toast } from 'react-toastify';
import { KeyRound, Mail } from 'lucide-react';
import { VerifyOTPApi } from '../../Api/AuthenticationApi';
import { handleApiError } from '../../compoenents/shared/ErrorHandler';

const VerifyOTPPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email:location?.state?.email || '',
    otp: ''
  });

  const handleSubmit = async () => {
    try {
      const data = VerifyOTPApi(formData)
      toast.success(data?.message)
      navigate('/',{ replace: true })
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

  const handleResendOTP = (e) =>{
    e.preventDefault()
    try{
      const data = ResendOTpApi()
      toast.success(data?.message)
    }catch(error){
      toast.error(error?.response?.error || 'something went wrong please try again later')
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

        <SubmitButton onClick={handleSubmit}>
          Verify OTP
        </SubmitButton>

        <button
        onClick={handleResendOTP}
        className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-sm transition-colors mt-1 
        disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'>
        Resend OTP
        </button>
      </div>
    </AuthFormContainer>
  );
};

export default VerifyOTPPage 