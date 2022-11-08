export interface IIconProps {
  fontSize?: string
  classNames?: string
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
  onClick?: () => void
  onMouseEnter?: () => void
}
