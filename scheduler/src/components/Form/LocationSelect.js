import React, { useEffect, useState } from "react";
// import { useDispatch,useSelector } from "react-redux";
import { getLocation } from "../../Store/Patient/actions";
import { fetchLocations } from "../../services/location-service";
import SelectField from "./SelectField";
// import { parseConfig } from "../../utils/ParseConfig";

const LocationSelect = (props) => {
  const [locations, setLocations] = useState();

  useEffect(() => {
    const fetch = async () => {
      const response = await fetchLocations();

      if (response.data?.data) {
        setLocations(response.data.data);
      }
    };

    fetch();

    return () => {};
  }, []);


  return <SelectField {...props} options={locations} valueKey="name" />;
};

export default LocationSelect;
