import { useHistory } from "react-router";
import Button from "../../components/Button";
import PageContainer from "../../components/PageContainer";
import PageTitle from "../../components/PageTitle";
import StickyContainer from "../../components/StickyContainer";
import AppointmentDetails from "../../components/AppointmentDetails";

export default function Confirmation() {
  let history = useHistory();

  return (
    <PageContainer
      step={7}
      leftContent={
        <>
          <PageTitle title="Appointment Booked">
            Your appointment has been booked.
          </PageTitle>
          <div
            id="form-container"
            className="bg-mobile-grey-50 my-4 p-4 pb-2 rounded-lg"
          >
            <AppointmentDetails />
          </div>
          <StickyContainer>
            <Button
              title="Step 2 (optional): Enter your insurance info"
              onClick={() => history.push("/insurance")}
            />
          </StickyContainer>
        </>
      }
    />
  );
}
