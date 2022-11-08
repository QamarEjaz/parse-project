import { config } from '../utils/config';
import Spinner from './Spinner';

const Button = ({
  className = `w-full flex text-white ${config.app.backgroundColor}`,
  type = 'button',
  title,
  loading,
  ...props
}) => {
  return (
    <button
      className={`relative justify-center items-center mt-auto p-3 md:p-3 border border-transparent text-sm font-light rounded-full shadow-sm transition ease-in duration-700 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        config.app.focusRingColor
      } focus:shadow-lg hover:shadow-lg md:text-base ${
        loading ? 'cursor-not-allowed opacity-90' : ''
      } ${className}`}
      type={type}
      disabled={loading}
      {...props}
    >
      {loading && (
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <div className='spinner-wrapper'>
            <Spinner />
          </div>
        </div>
      )}
      <span className={`${loading && 'opacity-0'}`}>{title ?? 'Next'}</span>
    </button>
  );
};

export default Button;
