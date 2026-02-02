import { BookOpen } from 'lucide-react';
import React from 'react'

const AuthFormContainer = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg border border-gray-200 p-8">
          <div className="flex text-center items-center justify-center mb-6">
            <BookOpen className="w-6 h-6 mr-2" />
            <h2 className="text-3xl font-bold text-gray-900 mb-1">BookHub</h2>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">{title}</h3>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthFormContainer 