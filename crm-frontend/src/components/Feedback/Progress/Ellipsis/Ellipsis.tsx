import { IEllipsisProps } from './Ellipsis.interfaces';
import './Ellipsis.css';

const Ellipsis = ({ color }: IEllipsisProps): JSX.Element => {
  return (
    <div className={`lds-ellipsis`}>
      <div className={`bg-${color}` || ''}></div>
      <div className={`bg-${color}` || ''}></div>
      <div className={`bg-${color}` || ''}></div>
      <div className={`bg-${color}` || ''}></div>
    </div>
  );
};

export default Ellipsis;
