import React, { useState } from 'react'
import AuthFormContainer from '../../compoenents/shared/AuthFormContainer ';
import FormInput from '../../compoenents/shared/FormInput';
import { Lock, Mail } from 'lucide-react';
import SubmitButton from '../../compoenents/shared/SubmitButton';
import FormLink from '../../compoenents/shared/FormLink';

const LoginPage = ({ onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async () => {
    try {
      const data = LoginApi(formData,)
    } catch (error) {
      setErrors(error.response?.data || {});
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

        <SubmitButton onClick={handleSubmit}>
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