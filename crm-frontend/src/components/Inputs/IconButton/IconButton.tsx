import { IIconButtonProps } from "./IconButton.interfaces"

const IconButton = ({ children, size, onClick, type = "button", className }: IIconButtonProps): JSX.Element => {
  const getSize = (): string => {
    if (size === "sm") return "icon-btn-sm"
    else if (size === "md") return "icon-btn-md"
    else if (size === "lg") return "icon-btn-lg"
    else if (size === "xl") return "icon-btn-xl"
    else if (size === "2xl") return "icon-btn-2xl"
    else return "icon-btn-sm"
  }

  return (
    <button type={type} onClick={onClick} className={`${getSize()} ${className} icon-btn`}>
      {children}
    </button>
  )
}
export default IconButton
