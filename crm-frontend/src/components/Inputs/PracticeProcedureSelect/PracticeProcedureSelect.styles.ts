import { IPracticeProcedureProps } from "./PracticeProcedureSelect.interfaces"

export const customStyles = ({
  isDark,
  menuBorderRadius,
  border,
  borderWidth,
  borderTopWidth,
  borderRightWidth,
  borderLeftWidth,
  borderBottomWidth,
  borderColor,
  borderTopColor,
  borderRightColor,
  borderLeftColor,
  borderBottomColor,
  borderStyle,
  borderTopStyle,
  borderRightStyle,
  borderLeftStyle,
  borderBottomStyle,
  borderRadius,
  backgroundColor,
}: IPracticeProcedureProps): Object => {
  return {
    menu: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: isDark ? "#36393f" : "#fff",
      borderRadius: menuBorderRadius ? menuBorderRadius : "none",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? isDark
          ? "#202225"
          : "#4b5563"
        : isDark
        ? "#36393f"
        : "#fff",
      color: state.isFocused ? "#fff" : "#000",
      fontSize: "14px",
      opacity: state.isFocused ? "1" : isDark ? "0.5" : "1",
    }),
    control: (provided: any, state: any) => ({
      ...provided,
      "*": {
        boxShadow: "none !important",
      },
      "&:hover": "none",
      boxShadow: "none",
      border: border && (isDark ? "#202225" : border),
      borderWidth: borderWidth && borderWidth,
      borderTopWidth: borderTopWidth && borderTopWidth,
      borderRightWidth: borderRightWidth && borderRightWidth,
      borderBottomWidth: borderBottomWidth && borderBottomWidth,
      borderLeftWidth: borderLeftWidth && borderLeftWidth,
      borderColor: borderColor && (isDark ? "#202225" : borderColor),
      borderTopColor: borderTopColor && (isDark ? "#202225" : borderTopColor),
      borderRightColor:
        borderRightColor && (isDark ? "#202225" : borderRightColor),
      borderBottomColor:
        borderBottomColor && (isDark ? "#202225" : borderBottomColor),
      borderLeftColor:
        borderLeftColor && (isDark ? "#202225" : borderLeftColor),
      borderStyle: borderStyle && borderStyle,
      borderTopStyle: borderTopStyle && borderTopStyle,
      borderRightStyle: borderRightStyle && borderRightStyle,
      borderBottomStyle: borderBottomStyle && borderBottomStyle,
      borderLeftStyle: borderLeftStyle && borderLeftStyle,
      borderRadius: borderRadius && borderRadius,
      backgroundColor: backgroundColor
        ? isDark
          ? "#202225"
          : backgroundColor
        : "#F3F4F6",
    }),
    placeholder: (base: any) => ({
      ...base,
      fontSize: "14px",
      color: isDark ? "#fff" : "#000",
      fontWeight: 400,
    }),
    valueContainer: (provided: any, state: any) => ({
      ...provided,
      fontSize: "14px",
      color: isDark ? "#fff" : "#000",
      padding: "2px 8px",
      textOverflow: "ellipsis",
      maxWidth: "70%",
      whiteSpace: "nowrap",
      overflow: "hidden",
      display: "flex",
      input: {
        position: "absolute",
      },
    }),
    input: (provided: any, state: any) => ({
      ...provided,
      position: "relative",
    }),
  }
}
