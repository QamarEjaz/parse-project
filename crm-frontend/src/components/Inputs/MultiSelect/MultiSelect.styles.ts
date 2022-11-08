import { IMultiSelectProps } from "./MultiSelect.interfaces"

export const customStyles = ({
  variant,
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
  valueContainerType
}: IMultiSelectProps): Object => {
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
      fontSize: variant === "transparent" ? "12px" : "14px",
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
      borderColor:
        borderColor &&
        (isDark
          ? variant === "transparent"
            ? "#fff"
            : "#202225"
          : borderColor),
      borderTopColor:
        borderTopColor &&
        (isDark
          ? variant === "transparent"
            ? "#fff"
            : "#202225"
          : borderTopColor),
      borderRightColor:
        borderRightColor &&
        (isDark
          ? variant === "transparent"
            ? "#fff"
            : "#202225"
          : borderRightColor),
      borderBottomColor:
        borderBottomColor &&
        (isDark
          ? variant === "transparent"
            ? "#fff"
            : "#202225"
          : borderBottomColor),
      borderLeftColor:
        borderLeftColor &&
        (isDark
          ? variant === "transparent"
            ? "#fff"
            : "#202225"
          : borderLeftColor),
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
      fontSize: variant === "transparent" ? "12px" : "14px",
      color: isDark || variant === "transparent" ? "#fff" : "#000",
      fontWeight: 400,
    }),
    valueContainer: (provided: any, state: any) => ({
      ...provided,
      fontSize: variant === "transparent" ? "12px" : "14px",
      color: isDark || variant === "transparent" ? "#fff" : "#000",
      padding: variant === "transparent" ? "0" : "2px 8px",
      textOverflow: "ellipsis",
      maxWidth: valueContainerType === "default" ? "70%" : "95%",
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
