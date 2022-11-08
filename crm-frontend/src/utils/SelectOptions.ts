import { formatDate } from "./helpers"
import { ITimeOption } from "./SelectOptions.interface"

export const APPT_STATUS_OPTIONS = [
  {
    id: "1",
    value: "LATE",
    label: "Late",
  },
  { id: "2", label: "Here", value: "HERE" },
  { id: "3", label: "Ready", value: "READY" },
  { id: "4", label: "Chair", value: "CHAIR" },
  { id: "5", label: "Completed", value: "COMPLETED" },
  { id: "6", label: "Confirmed", value: "CONFIRMED" },
  { id: "7", label: "Unconfirmed", value: "UNCONFIRMED" },
  { id: "8", label: "No Show", value: "NO_SHOW" },
  { id: "9", label: "Broken", value: "BROKEN" },
  { id: "10", label: "Left Message", value: "Left_Message" },
  { id: "11", label: "Checkout", value: "CHECKOUT" },
]

export const PROVIDER_OPTIONS = [
  {
    id: "1",
    value: "9000000009380",
    label: "Mikhail Tsotsiashvili",
  },
  {
    id: "2",
    value: "9000000009381",
    label: "Lydia Bonner",
  },
  {
    id: "3",
    value: "9000000009382",
    label: "James Choi",
  },
  {
    id: "4",
    value: "9000000009383",
    label: "Ashleigh Areias",
  },
  {
    id: "5",
    value: "9000000009384",
    label: "Molly Weber",
  },
  {
    id: "6",
    value: "9000000009385",
    label: "Sepand Hokmabadi DDS",
  },
]

export const LOCATION_OPTIONS = [
  {
    id: "1",
    name: "15th Street",
    value: "1",
  },
  {
    id: "2",
    name: "Albany",
    value: "2",
  },
  {
    id: "3",
    name: "Berkeley Welcome Center",
    value: "3",
  },
  {
    id: "4",
    name: "Dana",
    value: "4",
  },
  {
    id: "5",
    name: "Emeryville",
    value: "5",
  },
  {
    id: "6",
    name: "Grand Avenue",
    value: "6",
  },
  {
    id: "7",
    name: "Hyde Street",
    value: "7",
  },
  {
    id: "8",
    name: "Marina",
    value: "8",
  },
  {
    id: "9",
    name: "Martinez",
    value: "9",
  },
  {
    id: "10",
    name: "Montclair",
    value: "10",
  },
  {
    id: "11",
    name: "Old Oakland",
    value: "11",
  },
  {
    id: "12",
    name: "Pill Hill",
    value: "12",
  },
  {
    id: "13",
    name: "Pleasant Valley",
    value: "13",
  },
  {
    id: "14",
    name: "San Ramon",
    value: "14",
  },
  {
    id: "15",
    name: "Summit St",
    value: "15",
  },
  {
    id: "16",
    name: "Teledentistry",
    value: "16",
  },
  {
    id: "17",
    name: "Telegraph",
    value: "17",
  },
  {
    id: "18",
    name: "Temescal",
    value: "18",
  },
]

export const CONTACT_METHOD_OPTIONS = [
  { id: "1", name: "Call me", value: "CALL ME" },
  { id: "2", name: "Text me", value: "TEXT ME" },
  { id: "3", name: "Email me", value: "EMAIL ME" },
]

export const LANGUAGE_TYPE_OPTIONS = [
  {
    id: "1",
    name: "English",
    value: "ENGLISH",
  },
  {
    id: "2",
    name: "Spanish",
    value: "SPANISH",
  },
  {
    id: "3",
    name: "Arabic",
    value: "ARABIC",
  },
  {
    id: "4",
    name: "Armenian",
    value: "ARMENIAN",
  },
  {
    id: "5",
    name: "Bengali",
    value: "BENGALI",
  },
  {
    id: "6",
    name: "Bosnian",
    value: "BOSNIAN",
  },
  {
    id: "7",
    name: "Cambodian",
    value: "CAMBODIAN",
  },
  {
    id: "8",
    name: "Chinese_Mandarin",
    value: "CHINESE_MANADARIN",
  },
  {
    id: "9",
    name: "Chinese_Cantonese",
    value: "CHINESE_CANTONESE",
  },
  {
    id: "10",
    name: "French",
    value: "FRENCH",
  },
  {
    id: "11",
    name: "German",
    value: "GERMAN",
  },
  {
    id: "12",
    name: "Greek",
    value: "GREEK",
  },
  {
    id: "13",
    name: "Hebrew",
    value: "HEBREW",
  },
  {
    id: "14",
    name: "Hindi",
    value: "HINDI",
  },
  {
    id: "15",
    name: "Italian",
    value: "INTALIAN",
  },
  {
    id: "16",
    name: "Japanese",
    value: "JAPANESE",
  },
  {
    id: "17",
    name: "Korean",
    value: "KOREAN",
  },
  {
    id: "18",
    name: "Laotian",
    value: "LOATION",
  },
  {
    id: "19",
    name: "Polish",
    value: "POLISH",
  },
  {
    id: "20",
    name: "Portuguese",
    value: "PORTUGUESE",
  },
  {
    id: "21",
    name: "Russian",
    value: "RUSSIAN",
  },
  {
    id: "22",
    name: "Somali",
    value: "SOMALI",
  },
  {
    id: "23",
    name: "Tagalog",
    value: "TAGALOG",
  },
  {
    id: "24",
    name: "Vietnamese",
    value: "VIETNAMESE",
  },
  {
    id: "25",
    name: "Other",
    value: "OTHER",
  },
]

export const PATIENT_STATUS_OPTIONS = [
  {
    id: "1",
    name: "NEW",
    value: "NEW",
  },
  {
    id: "2",
    name: "ACTIVE",
    value: "ACTIVE",
  },
  {
    id: "3",
    name: "NON-PATIENT",
    value: "NON-PATIENT",
  },
  {
    id: "4",
    name: "INACTIVE",
    value: "INACTIVE",
  },
  {
    id: "5",
    name: "DUPLICATE",
    value: "DUPLICATE",
  },
]

export const STATE_OPTIONS = [
  {
    id: "1",
    name: "AA",
    value: "AA",
  },
  {
    id: "2",
    name: "AE",
    value: "AE",
  },
  {
    id: "3",
    name: "AP",
    value: "AP",
  },
  {
    id: "4",
    name: "AL",
    value: "AL",
  },
  {
    id: "5",
    name: "AK",
    value: "AK",
  },
  {
    id: "6",
    name: "AS",
    value: "AS",
  },
  {
    id: "7",
    name: "AZ",
    value: "AZ",
  },
  {
    id: "8",
    name: "AR",
    value: "AR",
  },
  {
    id: "9",
    name: "CA",
    value: "CA",
  },
  {
    id: "10",
    name: "CO",
    value: "CO",
  },
  {
    id: "11",
    name: "CNMI",
    value: "CNMI",
  },
  {
    id: "12",
    name: "CT",
    value: "CT",
  },
  {
    id: "13",
    name: "DE",
    value: "DE",
  },
  {
    id: "14",
    name: "DC",
    value: "DC",
  },
  {
    id: "15",
    name: "FM",
    value: "FM",
  },
  {
    id: "16",
    name: "FL",
    value: "FL",
  },
  {
    id: "17",
    name: "FSM",
    value: "FSM",
  },
  {
    id: "18",
    name: "GA",
    value: "GA",
  },
  {
    id: "19",
    name: "GU",
    value: "GU",
  },
  {
    id: "20",
    name: "HI",
    value: "HI",
  },
  {
    id: "21",
    name: "ID",
    value: "ID",
  },
  {
    id: "22",
    name: "IL",
    value: "IL",
  },
  {
    id: "23",
    name: "IN",
    value: "IN",
  },
  {
    id: "24",
    name: "IA",
    value: "IA",
  },
  {
    id: "25",
    name: "KS",
    value: "KS",
  },
  {
    id: "26",
    name: "KY",
    value: "KY",
  },
  {
    id: "27",
    name: "LA",
    value: "LA",
  },
  {
    id: "28",
    name: "ME",
    value: "ME",
  },
  {
    id: "29",
    name: "ME",
    value: "ME",
  },
  {
    id: "30",
    name: "MH",
    value: "MH",
  },
  {
    id: "31",
    name: "MA",
    value: "MA",
  },
  {
    id: "32",
    name: "MI",
    value: "MI",
  },
  {
    id: "33",
    name: "MN",
    value: "MN",
  },
  {
    id: "34",
    name: "MS",
    value: "MS",
  },
  {
    id: "35",
    name: "MO",
    value: "MO",
  },
  {
    id: "36",
    name: "MT",
    value: "MT",
  },
  {
    id: "37",
    name: "NE",
    value: "NE",
  },
  {
    id: "38",
    name: "NV",
    value: "NV",
  },
  {
    id: "39",
    name: "NH",
    value: "NH",
  },
  {
    id: "40",
    name: "NJ",
    value: "NJ",
  },
  {
    id: "41",
    name: "NM",
    value: "NM",
  },
  {
    id: "42",
    name: "NY",
    value: "NY",
  },
  {
    id: "43",
    name: "NC",
    value: "NC",
  },
  {
    id: "44",
    name: "ND",
    value: "ND",
  },
  {
    id: "45",
    name: "MP",
    value: "MP",
  },
  {
    id: "46",
    name: "OH",
    value: "OH",
  },
  {
    id: "47",
    name: "OK",
    value: "OK",
  },
  {
    id: "48",
    name: "OR",
    value: "OR",
  },
  {
    id: "49",
    name: "PW",
    value: "PW",
  },
  {
    id: "50",
    name: "PA",
    value: "PA",
  },
  {
    id: "51",
    name: "PR",
    value: "PR",
  },
  {
    id: "52",
    name: "RI",
    value: "RI",
  },
  {
    id: "53",
    name: "SC",
    value: "SC",
  },
  {
    id: "54",
    name: "SD",
    value: "SD",
  },
  {
    id: "55",
    name: "TN",
    value: "TN",
  },
  {
    id: "56",
    name: "TX",
    value: "TX",
  },
  {
    id: "57",
    name: "UT",
    value: "UT",
  },
  {
    id: "58",
    name: "VT",
    value: "VT",
  },
  {
    id: "59",
    name: "VI",
    value: "VI",
  },
  {
    id: "60",
    name: "VA",
    value: "VA",
  },
  {
    id: "61",
    name: "WA",
    value: "WA",
  },
  {
    id: "62",
    name: "WV",
    value: "WV",
  },
  {
    id: "63",
    name: "WI",
    value: "WI",
  },
  {
    id: "64",
    name: "WY",
    value: "WY",
  },
]

export const OPERATORY_OPTIONS = [
  { id: "1", value: "1", label: "OP 1" },
  { id: "2", value: "2", label: "OP 2" },
  { id: "3", value: "3", label: "OP 3" },
]

export const GENDER_OPTIONS = [
  { id: "1", value: "M", name: "Male" },
  { id: "2", value: "F", name: "Female" },
  { id: "3", value: "O", name: "Other" },
]

export const TYPE_OPTIONS = [
  { id: "1", value: "1", label: "Type 1" },
  { id: "2", value: "2", label: "Type 2" },
  { id: "3", value: "3", label: "Type 3" },
]

// improve map inside loop
export const getTimeOptions = (): ITimeOption[] => {
  let time: ITimeOption[] = []
  let minutes = ["00", "10", "20", "30", "40", "50"]

  for (let counter = 0; counter < 24; counter++) {
    minutes.map((min, index) => {
      let format = `${counter < 10 ? `0${counter}` : counter}: ${min}`
      format = formatDate(`${format}`, "hh:mm A", "HH:mm")
      time.push({
        id: format.toString(),
        name: format.toString(),
        value: format.toString(),
      })

      return ""
    })
  }

  return time
}
