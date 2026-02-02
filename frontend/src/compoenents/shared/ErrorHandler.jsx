import { toast } from 'react-toastify';

export const handleApiError = (error, setErrors) => {
  if (error.response && error.response.data) {
    const errorData = error.response.data;
    const newFieldErrors = {};

    const generalErrorKeys = ['error', 'detail', 'non_field_errors'];

    Object.keys(errorData).forEach((key) => {
      if (generalErrorKeys.includes(key)) {
        const message = Array.isArray(errorData[key]) ? errorData[key][0] : errorData[key];
        toast.error(message);
      } 
      else {
        newFieldErrors[key] = Array.isArray(errorData[key]) 
          ? errorData[key] 
          : [errorData[key]];
      }
    });

    if (Object.keys(newFieldErrors).length > 0) {
      setErrors(newFieldErrors);
    }
  } 
  else if (error.request) {
    toast.error("Network error. Please check your connection.");
  } else {
    toast.error("An unexpected error occurred.");
  }
};