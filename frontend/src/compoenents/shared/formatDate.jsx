import React from 'react'

const formatDate = (isoString) => {
  if (!isoString) return '';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year:'numeric'
  })
    .format(new Date(isoString))
    .replace(',', '')
    .replace(' ', '-');
};


export default formatDate
