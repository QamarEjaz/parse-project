import moment from "moment";

export const e = function (selector) {
  let element = document.querySelector(selector);
  if (element === null) {
    let s = `Element not found, selector ${selector} is wrong or js is not in the body`;
    console.log(s);
    return null;
  } else {
    return element;
  }
};

export const formatSSN = (ssn) => {
  var x = ssn.replace(/\D/g, "").match(/(\d{0,3})(\d{0,2})(\d{0,4})/);

  return (ssn = !x[2]
    ? x[1]
    : "" + x[1] + "-" + x[2] + (x[3] ? "-" + x[3] : ""));
};

export const getRandomString = () => {
  return (
    (Math.random() + 1).toString(36).substring(7) +
    "-" +
    (Math.random() + 1).toString(36).substring(7)
  );
};

export function validateEmail(inputText) {
  var email_filter = new RegExp(
    /^([+\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
  );
  if (email_filter.test(inputText)) {
    return true;
  } else {
    return false;
  }
}
export const validatePhone = (inputText) => {
  const phoneInput = window.intlTelInput(inputText, {
    nationalMode: false,
    utilsScript: "/assets/js/intlTelInput.min.js",
  });
  return phoneInput.isValidNumber();
};
export const formatDate = (val, format = "MM.DD.YYYY", formatFrom = "") => {
  if (!val) return "";

  if (format === "diffForHumans") return moment(val).fromNow();

  return moment(val, formatFrom).format(format);
};
export const cleanPhoneNumber = (phone_number) => {
  return phone_number
    .replace("(", "")
    .replace(")", "")
    .replace(" ", "")
    .replace("-", "");
};

export const formatPhoneNumber = (phone_number) => {
  if (!phone_number) return "";
  var x = phone_number.replace(/\D/g, "").match(/(\d{0,3})(\d{0,3})(\d{0,4})/);

  return (phone_number = !x[2]
    ? x[1]
    : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : ""));
};

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const getFormErrors = (error) => {
  if (!error?.data?.message) return null;

  const err = {};
  err.message = error?.data?.message;

  if (error?.data?.errors)
    // err.errors = Object.keys(error?.data?.errors).map((err) => ({
    //   [err]: error?.data?.errors[err],
    // }));
    err.errors = Object.values(error?.data?.errors);

  return err;
};

export const getCentralPoint = (arr) =>
  (Math.min(...arr) + Math.max(...arr)) / 2;
