import { Operatory } from "../../../../Types/OperatoryTypes"

export interface IConfirmationModalProps {
    open: boolean
    operatories: Operatory[]
    oldOperatory:Operatory | null
    newOperatory:Operatory | null
    handleUpdate:() => void | null
    handleCancel:() => void | null
    newStartTime: Date | null
    newEndTime: Date | null
    oldStartTime: Date | null
    oldEndTime: Date | null
    updateBtnLoading: boolean
}