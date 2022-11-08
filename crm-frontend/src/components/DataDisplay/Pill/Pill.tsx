import { IPillProps } from './Pill.interfaces'

export default function Pill({ label, bgClass, textClass, variant, className }: IPillProps): JSX.Element {
  return variant !== 'transparent' ? (
    <span className={`inline-flex items-center px-4 py-1 float-left border border-transparent text-xs font-semibold cursor-pointer rounded-full ${textClass} ${bgClass} ${className}`}>{label}</span>
  ) : (
    <span className='text-xs text-black-700 px-1 mx-1 border dark:text-white inline-block'>{label}</span>
  )
}
