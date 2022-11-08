export interface LoginData {
  email: string;
  password: string;
  resetForm?: any;
  phone?: string;
  setBtnDisable?: any;
  navigate?: any;
  bookingPage?: boolean;
}
export interface LoginSuccessData {
  username?: string;
  code?: boolean;
}
export interface SignupData {
  name: string;
  email: string;
  password: string;
  navigate?: any;
  resetForm: any;
  setBtnDisable: any;
}