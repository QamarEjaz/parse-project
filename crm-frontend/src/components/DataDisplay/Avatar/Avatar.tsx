import { IAvatarProps } from './Avatar.interfaces'

const sizeClasses = {
  xsmall: 'avatar-x-small',
  appointment: 'avatar-appointment',
  small: 'avatar-small',
  user: 'avatar-user',
  medium: 'avatar-medium',
  large: 'avatar-large',
  xlarge: 'avatar-x-large',
}

const Avatar = ({ image, style, firstName, size, border, bg, text, className }: IAvatarProps): JSX.Element => {
  return image ? (
    <>
      <div className={`${sizeClasses[size as keyof typeof sizeClasses]} rounded-full bg-cover bg-top bg-no-repeat ${className}`} style={{ backgroundImage: `url(${image})` }}></div>
    </>
  ) : (
    <div className={`${sizeClasses[size as keyof typeof sizeClasses]} flex items-center justify-center rounded-full ${border} ${bg} ${text} ${className}`} style={style}>
      <span className='capitalize'> {firstName ? firstName[0] : ''} </span>
    </div>
  )
}

export default Avatar