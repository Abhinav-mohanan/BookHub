import { Bell, BookOpen, LogOut, Menu, Search } from 'lucide-react';
import React, { useState } from 'react'
import { handleApiError } from '../shared/ErrorHandler';
import { LogoutApi } from '../../Api/AuthenticationApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate()
  const [isLoading,setIsLoading] = useState(false)

  const handleLogout = async() =>{
    setIsLoading(true)
    try{
      const data = await LogoutApi()
      toast.success(data.message || "Logout successfully")
      navigate('/', {replace:true})
    }catch(error){
      handleApiError(error)
    }finally{
      setIsLoading(false)
    }

  }
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 lg:px-10 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 lg:gap-8">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:block relative">
            {/* <div className="flex items-center">
              <div className="absolute left-3 text-gray-500">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search books..."
                className="w-64 h-10 pl-10 pr-4 bg-gray-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div> */}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
          disabled={isLoading}
          onClick={handleLogout}
          className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg 
          hover:bg-gray-200 transition-colors cursor-pointer disabled:cursor-not-allowed">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar