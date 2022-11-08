import React from 'react';
import { useNavigate } from 'react-router-dom';

import { getRandomString } from '../utils/helpers';
import { useUser } from '../hooks/useUser';

import Logo from '../assets/Dr_H_Logo-01.png';

import Error from '../components/Error';
import Loader from '../components/Loader';
import Button from '../components/Button';

const Home = () => {
  const navigate = useNavigate();

  const { user, isLoading, isError } = useUser();
  if (isLoading) return <Loader />;
  if (isError) return <Error />;

  const handleStartMeet = () => navigate(`/${getRandomString()}`);

  return (
    <div className='flex justify-center items-center flex-col h-screen bg-gray-50'>
      {user && (
        <div className='absolute top-5 right-5'>
          <img
            src={user?.profile_photo_url}
            alt='user avatar'
            className='w-16 h-16 rounded-full border-gray-200 border'
          />
        </div>
      )}

      <h1 className='w-96'>
        <img src={Logo} alt='Logo' />
      </h1>

      <Button title='Start Meet' onClick={handleStartMeet} />
    </div>
  );
};

export default Home;
