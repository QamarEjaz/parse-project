export interface IIconButtonProps {
  children?: JSX.Element
  size?: "sm" | "md" | "lg" | "xl" | "2xl"
  type?: "button" | "submit" | "reset" | undefined
  onClick?: () => void
  className?: string
}
