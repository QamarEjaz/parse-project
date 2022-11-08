import React from 'react';

const Avatar = ({
  className = 'text-gray-900 text-3xl sm:text-4xl md:text-5xl bg-gray-50 w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20',
  user = 'Z',
}) => {
  return (
    <span
      className={`rounded-full flex justify-center items-center cursor-default ${className}`}
    >
      {user}
    </span>
  );
};

export default Avatar;
