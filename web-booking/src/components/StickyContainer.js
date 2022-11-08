import React from 'react';

const StickyContainer = ({ children }) => {
  return (
    <div className='flex mt-auto fixed bottom-4 left-4 right-4 md:relative md:bottom-0 md:left-0 md:right-0'>
      {children}
    </div>
  );
};

export default StickyContainer;
