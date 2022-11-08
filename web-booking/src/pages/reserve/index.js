import Parse from "parse";
import React, { useState } from "react";
import { useHistory } from "react-router";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { config } from "../../utils/config";
import PageContainer from "../../components/PageContainer";
import Button from "../../components/Button";
import PageTitle from "../../components/PageTitle";
import BackButton from "../../components/BackButton";
import StickyContainer from "../../components/StickyContainer";
import { toast } from "react-toastify";
import { addAppointmentNote } from "../../Store/Auth/actions";
import { timeSlotAndLocationSuccess } from "../../Store/Location/actions";

import axios from 'axios';
axios.defaults.withCredentials = false;

export default function Reserve() {
  let history = useHistory();
  const dispatch = useDispatch();
  const selectedPatient = useSelector(
    (state) => state?.AuthRed?.selectedPatient
  );
  const note = useSelector((state) => state?.AuthRed?.appointmentNote);
  const slotState = useSelector(
    (state) => state?.Location.timeSloteAndLocation
  );
  const [isLoading, setInLoading] = useState(false);

  const goNext = async () => {
    setInLoading(true);
    try {
      await Parse.Cloud.run("bookingAppointmentCreate", {
        patientId: selectedPatient?.objectId,
        locationId: slotState?.location?.objectId,
        date: moment(slotState?.date).format("YYYY-MM-DD"),
        start: slotState?.timeSlot?.start,
        generatedBy: "web",
        note: note,
      });
      history.push("/confirmation");
      dispatch(timeSlotAndLocationSuccess(null));
      dispatch(addAppointmentNote(""));
      setInLoading(false);

      // Log Success
      const { preferredLocation } = selectedPatient;

      axios
        .post(`${process.env.REACT_APP_GOOGLE_SHEET_URL}/log/patient/success`, {
          brand: 'THDC',
          origin: 'WEB',
          type: selectedPatient.hasCompletedAppointment ? 'EXISTING' : 'NEW',
          first_name: selectedPatient.firstName,
          last_name: selectedPatient.lastName,
          phone: selectedPatient.phones?.length
            ? selectedPatient.phones[0]?.number
            : '',
          email: selectedPatient.emailAddress,
          location: preferredLocation.name,
          reason: '',
          date: moment(slotState?.date).format('YYYY-MM-DD'),
          time: slotState?.timeSlot?.start,
          appointment_uid: '',
          appointment_id: '',
        })
        .then(() => console.log('Attempt Success'))
        .catch(() => console.log('Attempt Error'));
    } catch (error) {
      setInLoading(false);
      toast.error(JSON.stringify(error.message));
    }
  };

  return (
    <PageContainer
      step={6}
      leftContent={
        <>
          <PageTitle title="Please confirm">
            Review your appointment info and tap 'confirm' to proceed.
          </PageTitle>
          <div className="flex items-center bg-gray-50 p-3 rounded-lg shadow-sm">
            <div
              className={`flex flex-col items-center justify-center w-20 h-20 mr-3 ${config.app.backgroundColor} text-white rounded-lg`}
            >
              <span className="text-xl">
                {moment(slotState?.date).format("DD")}
              </span>
              <span className="text-xs">
                {moment(slotState?.date).format("MMM")}
              </span>
              <span className="text-xs">{slotState?.timeSlot?.start}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg mb-2">
                {selectedPatient?.firstName + " " + selectedPatient?.lastName}
              </span>
              <span className="text-xs text-mobile-grey-600">
                {moment(slotState?.date).format("DD, MMMM YYYY")}
              </span>
            </div>
          </div>
          <StickyContainer>
            <BackButton />
            <Button onClick={goNext} loading={isLoading} title="Confirm" />
          </StickyContainer>
          <a
            href={config.app.mainUrl}
            className={`w-full flex justify-center items-center mt-8 px-6 py-3 border border-transparent uppercase text-sm font-light rounded-full shadow-sm text-mobile-white-100 ${config.app.backgroundColor} transition ease-in duration-700  focus:outline-none md:text-base`}
          >
            Quit
          </a>
          {/* )} */}
        </>
      }
      // rightContent={<DefaultRightContent showAppointmentDetails={!isCard} />}
    />
  );
}
