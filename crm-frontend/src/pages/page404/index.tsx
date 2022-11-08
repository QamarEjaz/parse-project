import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Inputs/Button';

export default function Page404() {
  let navigate = useNavigate();
  const userToken = useSelector((state: any) => state.Auth);
  return (
    <section className="flex h-full min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden p-5 dark:bg-black-700 lg:order-last">
      <div className="flex items-center justify-between">
        <h2 className="hidden text-3xl font-bold  dark:text-white sm:block">
          Opss! - Not Found
        </h2>
      </div>
      <div className="mt-6">The screen you're looking for is not found.</div>
      <div>
        <Button
          variant="contained"
          color="gray"
          className="mt-4"
          onClick={() => {
            if (userToken.user == null) {
              navigate('/crm');
            } else {
              navigate('/people-management');
            }
          }}
        >
          Home
        </Button>
      </div>
    </section>
  );
}
