import { MultiValue, PropsValue } from "react-select"

export interface IOPTION {
  value: string
  label: string
}

export interface IPracticeProcedureProps {
  onChange?: (newValue: MultiValue<string>) => void
  value?: PropsValue<string> | undefined
  selected?: string | undefined
  isDark?: boolean
  menuBorderRadius?: string
  border?: string
  borderWidth?: string
  borderTopWidth?: string
  borderRightWidth?: string
  borderLeftWidth?: string
  borderBottomWidth?: string
  borderColor?: string
  borderTopColor?: string
  borderRightColor?: string
  borderLeftColor?: string
  borderBottomColor?: string
  borderStyle?: string
  borderTopStyle?: string
  borderRightStyle?: string
  borderLeftStyle?: string
  borderBottomStyle?: string
  borderRadius?: string
  backgroundColor?: string
}

export interface PracticeProcedure {
  id: string
  uid: string
  adaCode: string
  description: string
  //   aliasCode?: any
  //   abbreviatedDescription: string
  //   category: string
  //   treatmentArea: string
  //   hasProsthesis: boolean
  //   codeExtension?: any
  //   codeVersion: number
  //   defaultTeethRange?: any
  //   chartingSymbol?: any
  //   favorite: boolean
  //   billToInsurance: boolean
  //   active: boolean
  //   fee: number
  //   codeType?: any
  //   procedures?: any
  //   recareTemplate?: any
  //   ponticProcedure?: any
  //   retainerProcedure?: any
  //   lastModified: Date
  //   created_at: Date
  //   updated_at: Date
}
