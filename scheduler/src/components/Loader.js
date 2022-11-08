import React from 'react';
import logo from '../assets/logo.png';
// import { config } from '../utils/config';
import Spinner from './Spinner';

const Loader = () => {
  return (
    <div className='ml-8 flex items-center justify-center inset-0 overlay-loader z-100'>
      <div className='relative w-40 h-40 flex items-center justify-center'>
        <div className='absolute left-0 top-0 w-full h-full'>
          <Spinner className='h-full w-full' />
        </div>

        <img src={logo} className='w-24' alt='logo' />
      </div>
    </div>
    // <div className='flex justify-center items-center py-6'>
    //   <div
    //     className={`${config.app.loader} ease-linear rounded-full border-8 border-t-8 border-mobile-grey-200 h-20 w-20`}
    //   />
    // </div>
  );
};

export default Loader;
