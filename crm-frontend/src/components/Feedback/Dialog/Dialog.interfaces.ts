import { Variant } from "./Dialog.enum"

export interface IDialogProps {
  variant: Variant
  title?: string
  open: boolean
  setOpen: (value: boolean) => void
  description?: string
  onClose?: () => void
  onClick?: () => void
  primaryButtonText?: string
  secondaryButtonText?: string
  onClickPrimaryButton?: () => void
  onClickSecondaryButton?: () => void
  primaryButtonLoading?: boolean
}