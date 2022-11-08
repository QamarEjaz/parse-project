import { useState } from "react"
import * as Yup from "yup"
import { Form, FormikProvider, useFormik } from "formik"
import Assets from "../../../constants/AssetsConstants"
import Button from "../../../components/Inputs/Button"

export default function Reset() {
  const [loading] = useState(false)
  interface MyFormValues {
    password: string
    confirmPassword: string
  }
  const loginUserSchema = Yup.object().shape({
    password: Yup.string()
      .required("Please enter password")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.,<>&^%(){}:"])(?=.{8,})/, "Must Contain 8 Characters,  One Uppercase, One Lowercase, One Number and one special case Character"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  })

  const initialValues: MyFormValues = {
    confirmPassword: "",
    password: "",
  }
  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: loginUserSchema,
    onSubmit: async () => {
      // await dispatch(
      // );
    },
  })
  console.log("formik", formik)

  return (
    <>
      <div>
        <img className="mx-auto h-16 w-auto" src={Assets.APP_LOGO} alt="Total Health Dental Care" />
        <h2 className="mt-14 text-xl font-bold text-gray-900">Create New Password</h2>
      </div>
      <div className="mt-8">
        <div className="mt-6">
          <FormikProvider value={formik}>
            <Form noValidate onSubmit={formik.handleSubmit}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1 mb-3">
                  <input
                    name="password"
                    type="password"
                    autoComplete="password"
                    value={formik.values && formik.values.password}
                    onChange={formik.handleChange}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                  />
                  {formik.touched.password && formik.errors.password ? <span className="text-sm text-red-500">{formik.errors.password}</span> : null}
                </div>
              </div>
              <div className="mb-5">
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
                <Button type="submit" variant="contained" color="gray" className="w-full" loading={loading}>
                  Reset
                </Button>
              </div>
            </Form>
          </FormikProvider>
        </div>
      </div>
    </>
  )
}
