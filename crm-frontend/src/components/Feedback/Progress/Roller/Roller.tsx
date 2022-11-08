import { IColorClasses, IRollerProps } from './Roller.interfaces';
import './Roller.css';

const Roller = ({ color }: IRollerProps): JSX.Element => {
  let colorClasses: IColorClasses = {
    white: 'white',
    primary: 'primary',
  };
  return (
    <div
      className={`lds-roller lds-color-${
        colorClasses[color as keyof typeof colorClasses]
      }`}
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Roller;
