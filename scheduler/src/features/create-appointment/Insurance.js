import Parse from "parse";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import moment from "moment";
import { FormikProvider, useFormik } from "formik";
import DatePicker from "react-date-picker";
import { formatSSN } from "../../utils/helpers";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import States from "../../components/States";
import { toast } from "react-toastify";
import { parseConfig } from "../../utils/ParseConfig";
import DentalProviders from "../../components/DentalProviders";

export default function InsuranceForm({ patientId, insuranceInfo }) {
  const [dateOfBirth, setDateOfBirth] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [insuranceProviderState, setInsuranceProviderState] = useState("");
  const [insuranceState, setInsuranceState] = useState("");
  const [insuranceStateValidation, setInsuranceStateValidation] = useState("");
  const [yesterdayDay, setYesterdayDay] = useState();
  const [insuranceProvidersWithState, setInsuranceProvidersWithState] =
    useState([]);

  let isState = insuranceProvidersWithState.includes(insuranceProviderState);
  let isShowId = insuranceProviderState === "Metlife Ship (UC Berkeley)";

  const insuranceSchema = Yup.object().shape({
    insuranceProvider: Yup.string().required(
      "Please select insurance provider"
    ),
    providerName: Yup.string().when("insuranceProvider", {
      is: "Other",
      then: Yup.string().required("Provider name is required."),
    }),
    insuranceStateValue: Yup.string().when("insuranceProvider", {
      is: insuranceStateValidation,
      then: Yup.string().required("State is required."),
    }),
    subscriberName: Yup.string()
      .required("Please enter subscriber name")
      .matches(/\S/, "Invalid subscriber name"),
    subscriberSsn: Yup.string().required("Please enter subscriber SSN"),
    subscriberId: Yup.string().when("insuranceProvider", {
      is: "Metlife Ship (UC Berkeley)",
      then: Yup.string().required("Subscriber Id is required."),
    }),
    membershipId: Yup.string().required("Please enter membership ID"),
  });
  const formik = useFormik({
    initialValues: {
      providerName: "",
      subscriberName: "",
      subscriberSsn: "",
      subscriberId: undefined,
      membershipId: "",
      insuranceProvider: "",
      insuranceStateValue: undefined,
    },
    enableReinitialize: true,
    validationSchema: insuranceSchema,
    onSubmit: async (values) => {
      if (!patientId) {
        toast.error("Please select patient first");
        return;
      }
      if (dateOfBirth) {
        setIsLoading(true);
        try {
          await Parse.Cloud.run("updatePatientInsurance", {
            patientId: patientId,
            insuranceProvider:
              values.insuranceProvider === "Other"
                ? values.providerName
                : values.insuranceProvider,
            state: values.insuranceStateValue,
            dateOfBirth: moment(dateOfBirth).format("YYYY-MM-DD"),
            subscriberName: values.subscriberName,
            subscriberSsn: values.subscriberSsn,
            subscriberId: values.subscriberId,
            membershipId: values.membershipId,
            generatedBy: "web",
          });
          toast.success("Insurance update successfully");
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          toast.error(JSON.stringify(error.message));
        }
      } else {
        toast.error("Please add date of birth");
      }
    },
  });
  parseConfig();

  useEffect(() => {
    setInsuranceProviderState(formik?.values?.insuranceProvider);
  }, [formik?.values?.insuranceProvider]);

  useEffect(() => {
    if (insuranceProviderState === "Delta Dental PPO") {
      setInsuranceStateValidation("Delta Dental PPO");
    } else if (insuranceProviderState === "Blue Cross") {
      setInsuranceStateValidation("Blue Cross");
    } else if (insuranceProviderState === "Blue Shield") {
      setInsuranceStateValidation("Blue Shield");
    } else setInsuranceStateValidation("");
  }, [insuranceProviderState]);

  useEffect(() => {
    const fetchConfigProviders = async () => {
      const config = await Parse.Config.get();
      const insuranceProvidersWithStates = config.get(
        "insuranceProvidersWithState"
      );
      setInsuranceProvidersWithState(insuranceProvidersWithStates);
    };
    fetchConfigProviders();
  }, []);

  function getPreviousDay(date = new Date()) {
    const previous = new Date(date.getTime());
    previous.setDate(date.getDate() - 1);
    setYesterdayDay(previous);
    return previous;
  }

  useEffect(() => {
    getPreviousDay();
  }, []);

  const insuranceCardComponent = (insuranceInfoItem) => {
    return (
      <div key={insuranceInfoItem.id} className="mt-3 mb-3 flex justify-center">
        <div className="relative w-full px-6 max-w-lg bg-white rounded-lg border border-gray-200 shadow-md dark:bg-white">
          <div className="flex justify-between">
            <h5 className="mt-2 text-xl font-bold capitalize tracking-tight text-gray-900 dark:text-black">
              {insuranceInfoItem.get("insuranceProvider")}
            </h5>
            {/* <div className="mt-3 text-mobile-gray-600">
              <span className="bg-green-300 text-green-900 text-xs font-semibold mr-2 px-3 py-1 dark:bg-green-300 dark:text-green-900 rounded-full">
                {insuranceInfoItem.get("state")}
              </span>
            </div> */}
          </div>
          <div className="grid grid-cols-2 mb-2 content-center">
            <p className="font-normal text-black dark:text-black">
              Subscriber Name:
            </p>
            <p className="font-normal text-gray-700 dark:text-black truncate hover:text-clip">
              {insuranceInfoItem.get("subscriberName")}
            </p>
            <p className="font-normal text-black dark:text-black">
              Membership Id:
            </p>
            <p className="font-normal text-gray-700 dark:text-black truncate hover:text-clip">
              {insuranceInfoItem.get("membershipId")}
            </p>
            <p className="font-normal text-gray-700 dark:text-black">
              Subscriber SSN#
            </p>
            <p className="font-normal text-gray-700 dark:text-black">
              {insuranceInfoItem.get("subscriberSsn")}
            </p>
            <p className="font-normal text-gray-700 dark:text-black">
              Date of birth:
            </p>
            <p className="font-normal text-gray-700 dark:text-black">
              {insuranceInfoItem.get("dateOfBirth")?.toDateString()}
            </p>
            {/* <p className="font-normal text-gray-700 dark:text-black">
              Subscriber Id:
            </p>
            <p className="font-normal text-gray-700 dark:text-black truncate hover:text-clip">
              {insuranceInfoItem.get("subscriberId")}
            </p> */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {insuranceInfo?.map((insuranceInfoItem) =>
        insuranceCardComponent(insuranceInfoItem)
      )}

      <FormikProvider value={formik}>
        <div className="mb-3">
          <DentalProviders
            name="insuranceProvider"
            title="Select Insurance Provider"
            value={insuranceProviderState}
            onChange={(e) => {
              setInsuranceProviderState(e.target.value);
              formik.setFieldValue("insuranceProvider", e.target.value);
            }}
            error={Boolean(
              formik.touched.insuranceProvider &&
                formik.errors.insuranceProvider
            )}
            helpertext={formik.errors.insuranceProvider}
          />
        </div>
        {insuranceProviderState === "Other" && (
          <div className="mb-3">
            <InputField
              title="Insurance Provider Name"
              placeholder="Enter Insurance Provider Name"
              name="providerName"
              value={formik.values && formik.values.providerName}
              onChange={formik.handleChange}
              error={Boolean(
                formik.touched.providerName && formik.errors.providerName
              )}
              helpertext={formik.errors.providerName}
            />
          </div>
        )}
        {isState && (
          <div className="mb-3">
            <States
              name="insuranceStateValue"
              title="Select State"
              value={insuranceState}
              onChange={(e) => {
                setInsuranceState(e.target.value);
                formik.setFieldValue("insuranceStateValue", e.target.value);
              }}
              error={Boolean(
                formik.touched.insuranceStateValue &&
                  formik.errors.insuranceStateValue
              )}
              helpertext={formik.errors.insuranceStateValue}
            />
          </div>
        )}
        <div className="mb-3">
          <div className="mb-1">
            <label>Date of Brith</label>
          </div>
          <DatePicker
            format="MM/dd/yyyy"
            value={dateOfBirth}
            maxDate={yesterdayDay}
            onChange={(date) => setDateOfBirth(date)}
            className={`w-full py-1 border border-gray-300 px-3 placeholder-mobile-grey-400 bg-white focus:outline-none text-2xl rounded-md `}
          />
        </div>
        <div className="mb-3">
          <InputField
            placeholder="Name of Subscriber"
            name="subscriberName"
            title="Subscriber Name"
            value={formik.values && formik.values.subscriberName}
            onChange={formik.handleChange}
            error={Boolean(
              formik.touched.subscriberName && formik.errors.subscriberName
            )}
            helpertext={formik.errors.subscriberName}
          />
        </div>
        <div className="mb-3">
          <InputField
            type="subscriberSsn"
            title="Subscriber SSN"
            placeholder="SSN of Subscriber"
            name="subscriberSsn"
            value={formatSSN(formik.values && formik.values.subscriberSsn)}
            onChange={formik.handleChange}
            error={Boolean(
              formik.touched.subscriberSsn && formik.errors.subscriberSsn
            )}
            helpertext={formik.errors.subscriberSsn}
          />
        </div>
        {isShowId && (
          <div className="mb-3">
            <InputField
              placeholder="ID of Subscriber"
              name="subscriberId"
              title="Subscriber ID"
              value={formik.values && formik.values.subscriberId}
              onChange={formik.handleChange}
              error={Boolean(
                formik.touched.subscriberId && formik.errors.subscriberId
              )}
              helpertext={formik.errors.subscriberId}
            />
          </div>
        )}
        <div className="mb-5">
          <InputField
            placeholder="Member ID"
            name="membershipId"
            title="Member ID"
            value={formik.values && formik.values.membershipId}
            onChange={formik.handleChange}
            error={Boolean(
              formik.touched.membershipId && formik.errors.membershipId
            )}
            helpertext={formik.errors.membershipId}
          />
        </div>
        <Button
          loading={isLoading}
          onClick={formik.handleSubmit}
          className="py-2 px-6 shadow-md mx-auto border-gray-300 bg-[#62B144] hover:bg-[#529638] font-bold text-white rounded-full relative"
          title="Submit Insurance Information"
        />
      </FormikProvider>
    </>
  );
}
