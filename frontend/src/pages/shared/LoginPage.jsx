import React, { useState } from 'react'
import AuthFormContainer from '../../compoenents/shared/AuthFormContainer';
import FormInput from '../../compoenents/shared/FormInput';
import { ColumnsSettings, Lock, Mail } from 'lucide-react';
import SubmitButton from '../../compoenents/shared/SubmitButton';
import FormLink from '../../compoenents/shared/FormLink';
import { LoginApi } from '../../Api/AuthenticationApi';
import { handleApiError } from '../../compoenents/shared/ErrorHandler';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onNavigate }) => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading,setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const validateForm = (data) =>{
    const new_erros = {}
    if (!data.email.trim()){
      new_erros.email = ["This field is required"]
    }
    if (!data.password.trim()){
      new_erros.password = ['This field is required']
    }
    setErrors(new_erros)

    return  Object.keys(new_erros).length === 0
  }

  const handleSubmit = async () => {
    const isValid = validateForm(formData)
    if (!isValid) return 
    try {
      setIsLoading(true)
      const data = await LoginApi(formData)
      if (data.role === 'admin'){
        navigate('/admin/dashboard')
      }else{
        navigate('/user/dashboard')
      }

    } catch (error) {
      handleApiError(error,setErrors,navigate) 
      console.log(error)
    }finally{
      setIsLoading(false)
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]){
      setErrors((prev)=>({
        ...prev,[name]:null
      }))
    }
  };

  return (
    <AuthFormContainer title="Welcome Back">
      <div className="space-y-4">
        <FormInput
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="name@example.com"
          icon={Mail}
          error={errors.email?.[0]}
        />

        <FormInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          icon={Lock}
          showPasswordToggle={true}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          error={errors.password?.[0]}
        />

        <div className="text-right">
          <a 
            href="#" 
            onClick={() => onNavigate('forgot-password')}
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot password?
          </a>
        </div>

        <SubmitButton onClick={handleSubmit} loading={isLoading}>
          Login
        </SubmitButton>

        <FormLink
          text="Don't have an account?"
          linkText="Register here"
          href='/signup'
          onClick={() => onNavigate('register')}
        />
      </div>
    </AuthFormContainer>
  );
};

export default LoginPage