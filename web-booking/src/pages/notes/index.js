import { useState } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import BackButton from "../../components/BackButton";
import Button from "../../components/Button";
import PageContainer from "../../components/PageContainer";
import PageTitle from "../../components/PageTitle";
import { addAppointmentNote } from "../../Store/Auth/actions";

export default function Notes() {
  const dispatch = useDispatch();
  let history = useHistory();
  const note = useSelector((state) => state?.AuthRed?.appointmentNote);
  const [noteState, setNoteState] = useState(note ? note : "");

  const insurance = () => {
    dispatch(addAppointmentNote(noteState));
    history.push("/cardDetails");
  };

  return (
    <PageContainer
      step={5}
      leftContent={
        <>
          <PageTitle title="Would you like to add a note?">
            Add your chief concern or if you have a promo code enter here.
          </PageTitle>

          <div className="flex flex-col">
            <textarea
              className="w-full mb-8 bg-transparent placeholder-mobile-grey-300 border-0 bg-mobile-grey-50 md:text-lg rounded"
              rows="5"
              onChange={(e) => setNoteState(e.target.value)}
              value={noteState}
              autoFocus
            />
          </div>

          <div className="flex mt-auto">
            <BackButton />
            <Button onClick={insurance} isLoading={false} />
          </div>
        </>
      }
    />
  );
}
