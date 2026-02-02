import React from 'react'

const Breadcrumb = ({ items }) => {
  return (
    <div className="flex flex-wrap gap-2 items-center mb-4">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-gray-500 text-sm">/</span>}
          {item.href ? (
            <a
              href={item.href}
              className="text-gray-500 text-sm font-medium hover:text-blue-600 flex items-center gap-1"
            >
              {item.icon && <item.icon className="w-4 h-4" />}
              {item.label}
            </a>
          ) : (
            <span className="text-gray-900 text-sm font-semibold">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb