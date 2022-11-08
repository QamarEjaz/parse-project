import DropdownNavDesktop from "./DropdownNavDesktop"
import DropdownNavMobile from "./DropdownNavMobile"
import { IDropdownProps } from "./Dropdown.interfaces"

const Dropdown = ({ variant, label, items, children, menuStyles, onChange, ...props }: IDropdownProps): JSX.Element => {
  switch (variant) {
    case "nav-desktop":
      return <DropdownNavDesktop variant={variant} label={label} items={items} children={children} menuStyles={menuStyles} onChange={onChange} {...props} />
    case "nav-mobile":
      return <DropdownNavMobile variant={variant} label={label} items={items} children={children} menuStyles={menuStyles} onChange={onChange} {...props} />
    default:
      return <DropdownNavDesktop variant={variant} label={label} items={items} children={children} menuStyles={menuStyles} onChange={onChange} {...props} />
  }
}

export default Dropdown
