import { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, FormikProvider } from "formik";
import { useDispatch } from "react-redux";
import { Tab } from "@headlessui/react";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import { store } from "../../store";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import PageTitle from "../../components/PageTitle";
import StickyContainer from "../../components/StickyContainer";
import { cleanPhoneNumber, formatPhoneNumber, notify } from "../../utils/helpers";
import { register } from "../../Store/Auth/actions";
import { config } from "../../utils/config";

export default function ReturningPatient(props) {
  const dispatchAction = useDispatch();
  let history = useHistory();
  const { state } = useContext(store);
  let pageTitle = "Book an appointment";
  const prevPhoneNumber =
    state?.patient?.phones?.find(Boolean).number.toString() ?? "";

  const [phoneNumber, setPhoneNumber] = useState(
    formatPhoneNumber(prevPhoneNumber)
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loginUserSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter valid email address")
      .matches(/\S/, "Invalid email"),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    enableReinitialize: true,
    validationSchema: loginUserSchema,
    onSubmit: async (values) => {
      if (!values.email && !phoneNumber) return notify("Please fill the form to continue.", 'error')
      
      setIsLoading(true);
      await dispatchAction(
        register({
          email: values.email,
          phone: cleanPhoneNumber(phoneNumber),
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
          <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <Tab.List className="flex space-x-8">
              <Tab
                key={"PHONE"}
                className={({ selected }) =>
                  classNames(
                    selected
                      ? `${config.app.borderColor} ${config.app.textColor} tabFocus`
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                    "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-md"
                  )
                }
              >
                PHONE
              </Tab>
              <Tab
                key={"EMAIL"}
                className={({ selected }) =>
                  classNames(
                    selected
                      ? `${config.app.borderColor} ${config.app.textColor} tabFocus`
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                    "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-md"
                  )
                }
              >
                EMAIL
              </Tab>
            </Tab.List>
            <Tab.Panels className="mb-10 mt-5">
              <Tab.Panel>
                <div className="mb-10 mt-5">
                  <InputField
                    placeholder="Mobile Phone number"
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(formatPhoneNumber(e.target.value))
                    }
                    error={Boolean(formik.touched.email && formik.errors.email)}
                    helpertext={formik.errors.email}
                    inputClass="pl-8 lg:pl-12"
                    icon={
                      <span className="absolute left-2 lg:left-3 text-mobile-grey-600 lg:text-3xl">
                        +1
                      </span>
                    }
                  />
                </div>
              </Tab.Panel>
              <Tab.Panel>
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
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
          <StickyContainer>
            <Button loading={isLoading} onClick={formik.handleSubmit} />
          </StickyContainer>
        </Form>
      </FormikProvider>
    </>
  );
}
