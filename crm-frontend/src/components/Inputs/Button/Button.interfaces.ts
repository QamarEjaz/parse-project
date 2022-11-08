export interface IButtonProps {
  type?: "button" | "submit" | "reset" | undefined
  rounded?: boolean
  className?: string
  loading?: boolean
  variant?: "text" | "contained" | "outlined"
  color?:
    | "primary"
    | "indigo"
    | "indigo-light"
    | "red"
    | "gray"
    | "gray-light"
    | "gray-dark"
    | "white"
  disabled?: boolean
  onClick?: () => void
  style?: {}
  children?: React.ReactNode
}
