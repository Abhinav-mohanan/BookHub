import React from 'react'

const PageHeader = ({ title, description, actions }) => {
  return (
    <div className="flex flex-wrap justify-between items-end gap-3 mb-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-gray-900 text-4xl font-black tracking-tight">{title}</h1>
        <p className="text-gray-500 text-base">{description}</p>
      </div>
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>
  );
};

export default PageHeader