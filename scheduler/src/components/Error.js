import React from 'react';
import { useParams } from 'react-router-dom';

const Error = () => {
  let params = useParams();
  console.log(params);

  return (
    <div className='h-screen w-screen flex items-center justify-center'>
      <h1 className='text-8xl border-r-4 border-gray-300 pr-4'>Oops!</h1>
      <p className='text-2xl w-96 pl-4'>
        It seems you're not logged in. Please go to{' '}
        <a
          href={`${process.env.REACT_APP_CRM_URL}/login?callback=${
            process.env.REACT_APP_APP_URL
          }/${params.token ?? ''}`}
          className='text-blue-500'
        >
          CRM
        </a>{' '}
        to login.
      </p>
    </div>
  );
};

export default Error;
