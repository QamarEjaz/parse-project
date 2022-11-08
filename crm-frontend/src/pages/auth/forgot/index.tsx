import { useState } from "react"
import { Link } from "react-router-dom"
import * as Yup from "yup"
import { Form, FormikProvider, useFormik } from "formik"
import Assets from "../../../constants/AssetsConstants"
import Button from "../../../components/Inputs/Button"

export default function Forgot() {
  const [loading] = useState(false)

  interface MyFormValues {
    email: string
  }
  const loginUserSchema = Yup.object().shape({
    email: Yup.string().email("Please enter valid email address").required("Please enter email address").matches(/\S/, "Invalid email"),
  })

  const initialValues: MyFormValues = {
    email: "",
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

  return (
    <>
      <div>
        <img className="mx-auto h-16 w-auto" src={Assets.APP_LOGO} alt="Total Health Dental Care" />
        <h2 className="mt-14 text-xl font-bold text-gray-900">Forgot Your Password?</h2>
      </div>

      <div className="mt-8">
        <div className="mt-6">
          <FormikProvider value={formik}>
            <Form noValidate onSubmit={formik.handleSubmit}>
              <div className="mb-5">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
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

              <div className="mb-5">
                <Button type="submit" variant="contained" color="gray" className="w-full" loading={loading}>
                  Submit
                </Button>
              </div>

              <div className="text-right text-sm">
                <Link to="/crm" className="font-medium text-gray-600 hover:text-gray-500">
                  Back to Sign In
                </Link>
              </div>
            </Form>
          </FormikProvider>
        </div>
      </div>
    </>
  )
}
