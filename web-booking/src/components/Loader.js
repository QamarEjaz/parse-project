import React from 'react';
import { config } from '../utils/config';

export default function Loader() {
  return (
    <div className='flex justify-center items-center py-6'>
      <div
        className={`${config.app.loader} ease-linear rounded-full border-8 border-t-8 border-mobile-grey-200 h-20 w-20`}
      />
    </div>
  );
}
