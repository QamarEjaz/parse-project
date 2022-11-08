import DialogPeople from "./DialogPeople"
import DialogPeopleSet from "./DialogPeopleSet"
import DialogNotification from "./DialogNotification"
import DialogWarning from "./DialogWarning"
import { Variant } from "./Dialog.enum"
import { IDialogProps } from "./Dialog.interfaces"

import "../../../index.css"

const Dialog = (props: IDialogProps): JSX.Element => {
  switch (props.variant) {
    case Variant.PEOPLE:
      return <DialogPeople {...props} />
    case Variant.PEOPLESET:
      return <DialogPeopleSet {...props} />
    case Variant.NOTIFICATION:
      return <DialogNotification {...props} />
    case Variant.WARNING:
      return <DialogWarning {...props} />
    default:
      return <DialogPeople {...props} />
  }
}

Dialog.variant = Variant

export default Dialog
