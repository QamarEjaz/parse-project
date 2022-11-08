import Parse from "parse";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { removeTotalHeathCareName } from "../../utils/helpers";
import BackButton from "../../components/BackButton";
import Button from "../../components/Button";
import Map from "../../components/Map";
import PageContainer from "../../components/PageContainer";
import PageTitle from "../../components/PageTitle";
import RadioInput from "../../components/RadioInput";
import StickyContainer from "../../components/StickyContainer";
import { useDispatch, useSelector } from "react-redux";
import { getPatient } from "../../Store/Auth/actions";
import { selectedLocationSuccess } from "../../Store/Location/actions";

export default function CurrentLocation() {
  let history = useHistory();
  const dispatch = useDispatch();
  
  const selectedPatient = useSelector((state) => state?.AuthRed?.selectedPatient);
  
  const [preferredLocation, setPreferredLocation] = useState();
  const [selectedOption, setSelectedOption] = useState("home");
  
  const [isLoading] = useState(false);

  const goNext = async () => {
    if (selectedOption === "home") {
      history.push("/chooseDate");
    } else {
      history.push("/location");
    }
  };

  return (
    <PageContainer
      step={3}
      leftContent={
        <>
          <PageTitle title="Where would you like to schedule?">
            Please pick a convenient location from below.
          </PageTitle>

          <div className="flex flex-col space-y-5 my-3">
            {selectedPatient && (
              <RadioInput
                onChange={setSelectedOption}
                name="location"
                value="home"
                option={{
                  title: removeTotalHeathCareName(
                    selectedPatient?.preferredLocation?.name
                  ),
                  // text: `Your Home office, book as soon as ${formatDate(
                  //   location.next_available_slot?.date,
                  //   "MMMM D"
                  // )}`,
                }}
                selectedOption={selectedOption}
              />
            )}

            <RadioInput
              onChange={setSelectedOption}
              name="location"
              value="choose"
              option={{
                title: "Choose a different office",
                text: "See all our locations and choose a new one for this visit.",
              }}
              selectedOption={selectedOption}
            />
          </div>

          <StickyContainer>
            <BackButton />
            <Button onClick={goNext} loading={isLoading} />
          </StickyContainer>
        </>
      }
      rightContent={
        preferredLocation && (
          <Map
            locations={preferredLocation}
            initialZoom={13}
            hideOnMobile={true}
          />
        )
      }
    />
  );
}