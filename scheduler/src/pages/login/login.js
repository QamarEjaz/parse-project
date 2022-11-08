import { /* useContext, */ useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, FormikProvider } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { store } from "../../store";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import PageTitle from "../../components/PageTitle";
import StickyContainer from "../../components/StickyContainer";
import { Login } from "../../Store/Auth/actions";
import { parseConfig } from "../../utils/ParseConfig";

export default function LoginComp(props) {
  const dispatchAction = useDispatch();
  let navigate = useNavigate();
  //   const { state } = useContext(store);
  let pageTitle = "Login";

  const [isLoading, setIsLoading] = useState(false);

  parseConfig();

  const loginUserSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter valid email address")
      .required("Please enter email address")
      .matches(/\S/, "Invalid email"),
    password: Yup.string().required("Please enter password"),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    enableReinitialize: true,
    validationSchema: loginUserSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      dispatchAction(
        Login({
          email: values.email,
          password: values.password,
          navigate: navigate,
          setVerifications: props.setVerifications,
          setIsLoading: setIsLoading,
        })
      );
    },
  });

  return (
    <>
      <PageTitle title={pageTitle}>
        Please login to create a Patient or book an Appointment.
      </PageTitle>
      <FormikProvider value={formik}>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <div className="mb-5">
            <InputField
              type="email"
              placeholder="Email"
              name="email"
              value={formik.values && formik.values.email}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.email && formik.errors.email)}
              helpertext={formik.errors.email}
            />
          </div>
          <div className="mb-5">
            <InputField
              placeholder="Password"
              type="password"
              name="password"
              value={formik.values && formik.values.password}
              onChange={formik.handleChange}
              className="mr-3"
              error={Boolean(formik.touched.password && formik.errors.password)}
              helpertext={formik.errors.password}
            />
          </div>

          <StickyContainer>
            <Button
              loading={isLoading}
              onClick={formik.handleSubmit}
              title="Login"
            />
          </StickyContainer>
        </Form>
      </FormikProvider>
    </>
  );
}
