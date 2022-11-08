import React from 'react';

const Spinner = () => {
  return (
    <div className={`lds-ellipsis`}>
      <div className='bg-white'></div>
      <div className='bg-white'></div>
      <div className='bg-white'></div>
      <div className='bg-white'></div>
    </div>
  );
};

export default Spinner;
