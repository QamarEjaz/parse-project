import { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, FormikProvider } from "formik";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { store } from "../../store";
import { useQuery } from "../../utils/hooks";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import { config } from "../../utils/config";
import TextareaField from "../../components/TextareaField";
import PageTitle from "../../components/PageTitle";
import StickyContainer from "../../components/StickyContainer";
import { cleanPhoneNumber, formatPhoneNumber } from "../../utils/helpers";
import { register } from "../../Store/Auth/actions";

export default function NewPatient(props) {
  const dispatchAction = useDispatch();
  let history = useHistory();
  const { state } = useContext(store);
  let query = useQuery();
  let pageTitle = "Book an appointment";
  if (query.get(config.insChk)) pageTitle = "Fill insurance info";
  if (query.get(config.cardCheck)) pageTitle = "Fill card info";
  const prevPhoneNumber =
    state?.patient?.phones?.find(Boolean).number.toString() ?? "";

  const [phoneNumber, setPhoneNumber] = useState(
    formatPhoneNumber(prevPhoneNumber)
  );
  const [isLoading, setIsLoading] = useState(false);

  const loginUserSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("Please enter first name")
      .matches(/\S/, "Invalid first name"),
    lastName: Yup.string()
      .required("Please enter last name")
      .matches(/\S/, "Invalid last name"),
    email: Yup.string()
      .email("Please enter valid email address")
      .required("Please enter email address")
      .matches(/\S/, "Invalid email"),
    note: Yup.string().matches(/\S/, "Invalid note"),
  });
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      note: "",
    },
    enableReinitialize: true,
    validationSchema: loginUserSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      dispatchAction(
        register({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: cleanPhoneNumber(phoneNumber),
          note: values.note,
          history: history,
          setVerifications: props.setVerifications,
          setIsLoading: setIsLoading,
        })
      );
    },
  });

  return (
    <>
      <PageTitle title={pageTitle}>
        We need a few details from you in order to book an appointment.
      </PageTitle>
      <FormikProvider value={formik}>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <div className="flex justify-between mb-5">
            <InputField
              placeholder="First name"
              name="firstName"
              value={formik.values && formik.values.firstName}
              onChange={formik.handleChange}
              className="mr-3"
              error={Boolean(
                formik.touched.firstName && formik.errors.firstName
              )}
              helpertext={formik.errors.firstName}
            />
            <InputField
              placeholder="Last name"
              name="lastName"
              value={formik.values && formik.values.lastName}
              onChange={formik.handleChange}
              error={Boolean(formik.touched.lastName && formik.errors.lastName)}
              helpertext={formik.errors.lastName}
            />
          </div>
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
              placeholder="Mobile Phone number"
              value={phoneNumber}
              onChange={(e) =>
                setPhoneNumber(formatPhoneNumber(e.target.value))
              }
              inputClass="pl-8 lg:pl-12"
              icon={
                <span className="absolute left-2 lg:left-3 text-mobile-grey-600 lg:text-3xl">
                  +1
                </span>
              }
            />
          </div>
          <div className="mb-10">
            <TextareaField
              placeholder="Reason for appointment / promo code (Optional)"
              name="note"
              value={formik.values && formik.values.note}
              onChange={formik.handleChange}
              rows="5"
              error={Boolean(formik.touched.note && formik.errors.note)}
              helpertext={formik.errors.note}
            />
          </div>
          <StickyContainer>
            <Button loading={isLoading} onClick={formik.handleSubmit} />
          </StickyContainer>
        </Form>
      </FormikProvider>
    </>
  );
}
