export interface IDropdownNavDesktop {
  id: number
  name: string
  icon?: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
  url: string
  current: boolean
  menuStyles?: IDropdownMenuStyles
  count?: any
  onClick?: () => void
}

export interface IDropdownMenuStyles {
  left?: string
  right?: string
  top?: string
  bottom?: string
  transformOrigin?: string
}
