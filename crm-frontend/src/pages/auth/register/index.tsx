import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useFormik, Form, FormikProvider } from "formik"
import * as Yup from "yup"
import Assets from "../../../constants/AssetsConstants"
import { registerUser } from "../../../Store/Auth/actions"
import Button from "../../../components/Inputs/Button"

export default function Register() {
  const dispatch = useDispatch()
  let navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  interface MyFormValues {
    name: string
    email: string
    password: string
    confirmPassword: string
  }
  const loginUserSchema = Yup.object().shape({
    name: Yup.string().max(16, "Name should not exceed 16 characters").required("Please enter name").matches(/\S/, "Invalid name"),
    email: Yup.string().email("Please enter valid email address").required("Please enter email address").matches(/\S/, "Invalid email"),
    password: Yup.string()
      .required("Please enter password")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.,<>&^%(){}:"])(?=.{8,})/, "Must Contain 8 Characters,  One Uppercase, One Lowercase, One Number and one special case Character"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  })
  const initialValues: MyFormValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  }
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: loginUserSchema,
    onSubmit: async (values) => {
      dispatch(
        registerUser({
          name: values.name,
          email: values.email,
          password: values.password,
          navigate: navigate,
          setBtnDisable: setLoading,
          resetForm: formik.resetForm,
        })
      )
    },
  })

  return (
    <>
      <div>
        <img className="mx-auto h-16 w-auto" src={Assets.APP_LOGO} alt="Total Health Dental Care" />
        <h2 className="mt-14 text-xl font-bold text-gray-900">Register your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Or{" "}
          <Link to="/crm" className="font-medium text-gray-600 hover:text-gray-500">
            Sign in
          </Link>
        </p>
      </div>
      <div className="mt-8">
        <div className="mt-6">
          <FormikProvider value={formik}>
            <Form noValidate onSubmit={formik.handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <div className="mt-1 mb-3">
                  <input
                    name="name"
                    type="text"
                    value={formik.values && formik.values.name}
                    onChange={formik.handleChange}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                  />
                  {formik.touched.name && formik.errors.name ? <span className="text-sm text-red-500">{formik.errors.name}</span> : null}
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 mb-3">
                  <input
                    name="email"
                    type="email"
                    value={formik.values && formik.values.email}
                    onChange={formik.handleChange}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                  />
                  {formik.touched.email && formik.errors.email ? <span className="text-sm text-red-500">{formik.errors.email}</span> : null}
                </div>
              </div>

              <div className="mb-3 space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    name="password"
                    type="password"
                    value={formik.values && formik.values.password}
                    onChange={formik.handleChange}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                  />
                  {formik.touched.password && formik.errors.password ? <span className="text-sm text-red-500">{formik.errors.password}</span> : null}
                </div>
              </div>

              <div className="mb-5 space-y-1">
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formik.values && formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword ? <span className="text-sm text-red-500">{formik.errors.confirmPassword}</span> : null}
                </div>
              </div>

              <div>
                <Button type="submit" variant="contained" color="gray" className="w-full text-sm" loading={loading}>
                  Register
                </Button>
              </div>
            </Form>
          </FormikProvider>
        </div>
      </div>
    </>
  )
}
