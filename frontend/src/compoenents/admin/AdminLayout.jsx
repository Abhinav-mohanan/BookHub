import React, { useState } from 'react'
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const AdminLayout = ({ children ,activeItem}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          activeItem={activeItem}
        />
        <div className="flex-1 flex flex-col min-h-screen">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout