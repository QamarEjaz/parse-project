import { config } from '../utils/config';

const RadioInput = ({ onChange, name, value, option, selectedOption }) => {
  return (
    <label className='relative flex flex-col cursor-pointer pr-8 focus:outline-none'>
      <div className='flex space-x-3'>
        <input
          type='radio'
          className={`h-4 w-4 ${config.app.textColor} border-mobile-grey-200 ${config.app.focusRingColor} aria-labelledby="pricing-plans-0-label aria-describedby="pricing-plans-0-description-0 pricing-plans-0-description-1`}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          checked={value === selectedOption}
        />
        <div className='flex flex-col -mt-1'>
          <span id='pricing-plans-0-label' className=''>
            {option.title}
          </span>
          <span className='text-sm text-mobile-grey-600'>{option.text}</span>
        </div>
      </div>
    </label>
  );
};

export default RadioInput;
