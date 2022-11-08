import { IDropdownNavDesktop } from "./DropdownNavDesktop.interfaces"
import { IDropdownMenuStyles } from "./DropdownNavDesktop.interfaces"

export interface IDropdownProps {
  variant?: string
  label?: string
  defaultValue?: number
  items: any
  value?: string
  onChange?: (val: IDropdownNavDesktop) => void
  dividerAfter?: number
  children: JSX.Element
  buttonRef?: string
  styles?: {}
  menuStyles?: IDropdownMenuStyles
  notesMenu?: boolean
  setNotesMenu?: (notesMenu: boolean) => {}
}
