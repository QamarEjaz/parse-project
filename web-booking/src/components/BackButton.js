import { useHistory } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/outline';

import Button from './Button';

const BackButton = () => {
  const history = useHistory();

  return (
    <Button
      onClick={() => history.goBack()}
      className='flex md:hidden w-16 h-full mr-2 bg-mobile-grey-200 text-black'
      title={<ArrowLeftIcon className='h-5' />}
    />
  );
};

export default BackButton;
