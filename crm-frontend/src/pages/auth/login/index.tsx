import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import * as Yup from "yup"
import { Form, FormikProvider, useFormik } from "formik"
import { loginUser } from "../../../Store/Auth/actions"
import Assets from "../../../constants/AssetsConstants"
import Button from "../../../components/Inputs/Button"

const Login = () => {
  const dispatch = useDispatch()
  let navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  interface MyFormValues {
    email: string
    password: string
  }
  const loginUserSchema = Yup.object().shape({
    email: Yup.string()
      // .email("Please enter valid email address")
      .required("Please enter email address"),
    password: Yup.string().required("Please enter password"),
  })

  const initialValues: MyFormValues = {
    email: "",
    password: "",
  }
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: loginUserSchema,
    onSubmit: async (values) => {
      await dispatch(
        loginUser({
          email: values.email,
          password: values.password,
          navigate: navigate,
          resetForm: formik.resetForm,
          setBtnDisable: setLoading,
        })
      )
    },
  })

  return (
    <>
      <div>
        <img className="mx-auto h-16 w-auto" src={Assets.APP_LOGO} alt="Total Health Dental Care" />
        <h2 className="mt-14 text-xl font-bold text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Or{" "}
          <Link to="/register" className="font-medium text-gray-600 hover:text-gray-500">
            Register your account?
          </Link>
        </p>
      </div>

      <div className="mt-8">
        <div className="mt-6">
          <FormikProvider value={formik}>
            <Form noValidate onSubmit={formik.handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 mb-3">
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
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

              <div className="mb-5 flex items-center justify-end">
                <div className="text-sm">
                  <Link to="/forgot" className="font-medium text-gray-600 hover:text-gray-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button type="submit" color="gray" className="w-full" loading={loading}>
                Sign in
              </Button>
            </Form>
          </FormikProvider>
        </div>
      </div>
    </>
  )
}

export default Login
