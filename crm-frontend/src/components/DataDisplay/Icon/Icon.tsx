import { IIconProps } from './Icon.interfaces'

const Icon = ({ fontSize, classNames, onClick, onMouseEnter,  ...props }: IIconProps): JSX.Element => {
  return (
    <span className={`icon inline-block ${fontSize} ${classNames}`} onClick={onClick} onMouseEnter={onMouseEnter}>
      <props.icon style={{ width: '1em', height: '1em', color: 'inherit' }} />
    </span>
  )
}

export default Icon
