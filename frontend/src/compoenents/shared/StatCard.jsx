import { TrendingUp } from 'lucide-react';
import React from 'react'

const StatCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="p-6 bg-white  rounded-xl border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <Icon className="w-5 h-5 text-blue-600/60" />
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default StatCard