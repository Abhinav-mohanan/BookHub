import { ArrowLeftRight, Book, BookOpen, Edit, UserCircle, Users, X } from 'lucide-react';
import React from 'react'

const Sidebar = ({ isOpen, onClose, activeItem = 'profile' }) => {
  const menuItems = [
    { id: 'profile', label: 'Profile', icon: UserCircle, href: '/admin/dashboard' },
    { id: 'category', label: 'Category', icon: Edit, href: '/admin/category' },
    { id: 'books', label: 'Books', icon: Book, href: '/admin/books' },
    { id: 'users', label: 'Users', icon: Users, href: '/admin/user/management' },
    { id: 'staffs', label: 'Staff Approvals', icon: UserCircle, href: '/admin/staff/management' },
    { id: 'transaction', label: 'Transactions', icon: ArrowLeftRight, href: '/admin/transactions' },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen
        w-64 bg-white border-r border-gray-200 
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 ">
            <div className="flex items-center gap-3 text-blue-600">
              <BookOpen className="w-6 h-6" />
              <h2 className="text-lg font-bold text-gray-900">BookHub</h2>
            </div>
            <button 
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600 font-semibold' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar