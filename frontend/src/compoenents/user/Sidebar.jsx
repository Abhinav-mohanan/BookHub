import { Book, History, UserCircle } from 'lucide-react';
import React, { act } from 'react';

const Sidebar = ({ isOpen, onClose, activeItem}) => {
  const menuItems = [
    {id:'home', name: 'Home', icon: Book, href: '/user/dashboard' },
    {id:'profile', name: 'Profile', icon: UserCircle, href: '/user/profile' },
    {id:'history', name: 'History', icon: History, href: '/user/transactions' },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 w-64 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <span className="text-lg font-semibold text-gray-800">Menu</span>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 px-3">
            <ul className="space-y-2">
              {menuItems.map((item, index) => {
                const isActive = activeItem === item.id;
                  
                return(
                <li key={item.id}>
                  <a
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lgtransition group
                      ${isActive
                        ?'bg-blue-50 text-blue-600 font-semibold' 
                        :'text-gray-700 hover:bg-gray-100'}`}>
                    <item.icon/>
                    <span className="font-medium">{item.name}</span>
                  </a>
                </li>
                )})}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;