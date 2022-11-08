import moment from "moment";
import axios from "../lib/axios";

import { formatDate } from "../utils/helpers";

export const fetchSchedules = async (location, date, reason) =>
  await axios.getUrl(
    `booking/available-date?location_id=${location}&reason=${reason}&start_date=${formatDate(
      date,
      "YYYY-MM-DD"
    )}&end_date=${formatDate(date, "YYYY-MM-DD")}&showBy=disable`
  );

export const fetchDisabledScheduleOpening = (location, reason, date) => {
  let start_date = moment(date).startOf("month").format("YYYY-MM-DD");
  let end_date = moment(date).endOf("month").format("YYYY-MM-DD");

  return axios.getUrl(
    `booking/available-date?location_id=${location}&reason=${reason}&start_date=${start_date}&end_date=${end_date}&showBy=disable`
  );
};
