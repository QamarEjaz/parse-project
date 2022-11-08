import { useUser } from '../hooks/useUser';

import AgoraPlayer from '../features/agora-player/AgoraPlayer';

import Error from '../components/Error';
import Loader from '../components/Loader';

const Talk = () => {
  const { user, isLoading, isError } = useUser();
  if (isLoading) return <Loader />;
  if (isError) return <Error />;

  return (
    <div className='bg-gray-50'>
      <AgoraPlayer authUser={user} />
    </div>
  );
};

export default Talk;
