import React, { useState } from 'react'
import { Book, BookOpen, Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { SignupApi } from '../../Api/AuthenticationApi';

const RegistrationPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({})
    const [formData, setFormData] = useState({
        first_name: '',
        last_name:'',
        email: '',
        password: '',
        confirm_password:'',
        role: 'user'
    });

    const handleSubmit = async() => {
        try{
          const data = await SignupApi(formData,formData.role)
          alert(data.message)
        }catch(error){
          if (error.response && error.response.data) {
            setErrors(error.response.data);
          } else {
            alert('Something went wrong. Try again.');
          }
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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg border border-gray-200 p-8">
          <div className="flex text-center items-center justify-center mb-8">
                <BookOpen className="w-6 h-6 mr-2" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">BookHub</h2>
            </div>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}     
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="John"
                        required
                    />
                    {errors.first_name && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.first_name[0]}
                      </p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Doe"
                        required
                    />
                    {errors.last_name && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.last_name[0]}
                      </p>
                    )}
                </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="name@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.email[0]}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Create a password"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.password[0]}
                  </p>
                )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm password"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirm_password && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.confirm_password[0]}
                  </p>
                )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Account Type
              </label>
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={formData.role === 'user'}
                    onChange={handleChange}
                    className="hidden peer"
                  />
                  <div className="text-center py-2.5 rounded-md text-sm font-medium transition-all peer-checked:bg-white peer-checked:text-blue-600 peer-checked:shadow-sm text-gray-600">
                    Reader
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === 'admin'}
                    onChange={handleChange}
                    className="hidden peer"
                  />
                  <div className="text-center py-2.5 rounded-md text-sm font-medium transition-all peer-checked:bg-white peer-checked:text-blue-600 peer-checked:shadow-sm text-gray-600">
                    Admin
                  </div>
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Admin accounts may require additional verification.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-sm transition-colors mt-1"
            >
              Register Now
            </button>

            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a href="#" className="text-blue-600 font-semibold hover:underline">
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RegistrationPage

