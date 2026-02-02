import React from 'react'
import { useNavigate } from 'react-router-dom';

const FormLink = ({ text, linkText, href, onClick }) => {
  const navigate = useNavigate()
  return (
    <div className="text-center pt-2">
      <p className="text-sm text-gray-600">
        {text}{' '}
        <a 
          href={href || '#'} 
          onClick={onClick}
          className="text-blue-600 font-semibold hover:underline cursor-pointer"
        >
          {linkText}
        </a>
      </p>
    </div>
  );
}

export default FormLink