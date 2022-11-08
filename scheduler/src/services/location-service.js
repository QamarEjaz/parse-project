import axios from '../lib/axios';

export const fetchLocations = async () =>
  await axios.getUrl('booking/location');
