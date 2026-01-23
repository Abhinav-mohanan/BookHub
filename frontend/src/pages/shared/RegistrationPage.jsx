import React, { useState } from 'react'
import { Lock, Mail } from 'lucide-react'
import { SignupApi } from '../../Api/AuthenticationApi';
import AuthFormContainer from '../../compoenents/shared/AuthFormContainer ';
import FormInput from '../../compoenents/shared/FormInput';
import RadioGroup from '../../compoenents/shared/RadioGroup';
import SubmitButton from '../../compoenents/shared/SubmitButton';
import FormLink from '../../compoenents/shared/FormLink';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RegistrationPage = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState({password:false,confirm:false});
    const [errors, setErrors] = useState({})
    const [formData, setFormData] = useState({
        first_name: '',
        last_name:'',
        email: '',
        password: '',
        confirm_password:'',
        role: 'user'
    });

    const validateForm = (values) => {
      const newErrors = {};

      if (!values.first_name.trim()) {
        newErrors.first_name = ['This field is required'];
      }

      if (!values.last_name.trim()) {
        newErrors.last_name = ['This field is required'];
      }

      if (!values.email.trim()) {
        newErrors.email = ['This field is required'];
      }

      if (!values.password.trim()) {
        newErrors.password = ['This field is required'];
      }

      if (!values.confirm_password.trim()) {
        newErrors.confirm_password = ['Confirm your password'];
      } else if (values.password !== values.confirm_password) {
        newErrors.confirm_password = ['Passwords do not match'];
      }

      setErrors(newErrors);

      return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async() => {
        const isValid  = validateForm(formData)
        if (!isValid ) return
        try{
          const data = await SignupApi(formData,formData.role)
          toast.success(data?.message)
          navigate('/verify-otp', {state:{'email':formData.email}})
        }catch(error){
          if (error.response && error.response.data) {
            setErrors(error.response.data);
          } else {
            toast.error('Something went wrong. Try again.');
          }
      }    
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
        if (errors[name]){
          setErrors(prev=> ({
            ...prev,
            [name]:null
          }))
        }
    };

  return (
    <AuthFormContainer title="Create Account">
      <div className='space-y-2'>
        <div className='grid grid-cols-2 gap-4'>
          <FormInput
          label="First Name"
          type='text'
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="John"
          error={errors.first_name?.[0]}
          />

          <FormInput
          label="Last Name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Doe"
          error={errors.last_name?.[0]}
          />
          </div>
          <FormInput
          label="Email Address"
          type='email'
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="name@example.com"
          icon={Mail}
          error={errors.email?.[0]}
          />

          <FormInput
          label="Password"
          type='password'
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="create password"
          icon={Lock}
          showPasswordToggle={true}
          showPassword={showPassword.password}
          onTogglePassword={()=> 
            setShowPassword(p=>({...p,password:!p.password}))}
          error={errors.password?.[0]}
          />

          <FormInput
          label="Confirm Password"
          type='password'
          name="confirm_password"
          value={formData.confirm_password}
          onChange={handleChange}
          placeholder="confirm password"
          icon={Lock}
          showPasswordToggle={true}
          showPassword={showPassword.confirm}
          onTogglePassword={()=>
            setShowPassword(p=>({...p, confirm:!p.confirm}))
          }
          error={errors.confirm_password?.[0]}
          />

          <RadioGroup
          label="Account Type"
          name="role"
          value={formData.role}
          onChange={handleChange}
          options={[
            {value:'user',label:'Reader'},
            {value:'admin',label:'Admin'}
          ]}
          hint="Admin accounts may require additional verification."
          />

          <SubmitButton onClick={handleSubmit}>
            Register Now
          </SubmitButton>

          <FormLink
          text="Already have an account"
          linkText="Login here"
          href='/login'/>
          
      </div>
    </AuthFormContainer>
  );
}

export default RegistrationPage

