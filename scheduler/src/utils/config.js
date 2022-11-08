// Total Health Dental Care
const thdc = {
  mainUrl: "https://totalhealthdentalcare.com",
  appUrl: "https://schedule.totalhealthdentalcare.com",
  apiUrl: "https://api.totalhealthdentalcare.com",
  title: "Schedule | Total Health Dental Care",
  favicon: "faviconTHDC.ico",
  namePrefix: "Total Health Dental Care",
  insuranceBrand: "THDC",
  headerIconSrc: "../../assets/imgs/image0.png",
  rightImageSrc: "../../assets/imgs/girl.png",
  backgroundColor: "bg-mobile-green-50",
  textColor: "text-mobile-green-50",
  focusRingColor: "focus:ring-mobile-green-50",
  loader: "loaderTHDC",
  welcomeCenter: "Berkeley Welcome Center",
  welcomeCenters: [
    "Berkeley Welcome Center",
    "Martinez",
    "San Ramon",
    "Marina",
    "Dana",
    "Emeryville",
    "Summit St",
    "Pill Hill",
    "Hyde Street",
  ],
  skipHomeOffices: [
    "Berkeley Welcome Center",
    "THDC - Remote",
    // 'Hyde Street',
    // 'Summit St',
    "Telehealth",
    "Rotunda",
  ],
  brandColor: "#5FAA46",
};

// Dr. H. & Co.
export const drhco = {
  mainUrl: "https://hellodrh.com",
  appUrl: "https://schedule.hellodrh.com",
  apiUrl: "https://api.hellodrh.com",
  title: "Schedule | Dr. H. & CO.",
  favicon: "faviconDrHCo.ico",
  namePrefix: "Dr. H. & CO.",
  insuranceBrand: "Dr. H. & Co.",
  headerIconSrc: "../../assets/imgs/Dr_H_Logo-01.png",
  rightImageSrc: "../../assets/imgs/dr-h-and-co-dentistry-53.jpeg",
  backgroundColor: "bg-black",
  textColor: "text-black",
  focusRingColor: "focus:ring-black",
  loader: "loaderDrHCo",
  welcomeCenter: "",
  welcomeCenters: [
    "Hyde Street",
    "Summit St",
    "Marina",
    "Dana",
    "Emeryville",
    "Martinez",
    "San Ramon",
    "Pill Hill",
  ],
  skipHomeOffices: [],
  brandColor: "#000",
};

// Squareup
const squareProduction = {
  appId: "sq0idp-sQmtzq0oc7oN5p9oOhfRRg",
  paymentUrl: "https://js.squareup.com/v2/paymentform",
};

const squareSandbox = {
  appId: "sandbox-sq0idb-B0RaF2HhIRtTd31WIl-E1Q",
  paymentUrl: "https://js.squareupsandbox.com/v2/paymentform",
};

// export const config = {
//   app: process.env.REACT_APP_BRAND === "thdc" ? thdc : drhco,
//   square:
//     process.env.REACT_APP_SQAURE_PRODUCTION.toUpperCase() === "TRUE"
//       ? squareProduction
//       : squareSandbox,

//   insChk: "ins-chk",
//   cardCheck: "crd-chk",
//   sentry: {
//     dsn: "https://326f0f3b1bfc4ca28965023e403db674@o1195511.ingest.sentry.io/6573494",
//     env: process.env.REACT_APP_SENTRY_ENV ?? "production",
//   },
// };

export const config = {
  app: process.env.REACT_APP_BRAND === "thdc" ? thdc : drhco,
  insChk: "ins-chk",
  cardCheck: "crd-chk",
  sentry: {
    dsn: process.env.REACT_APP_SENTRY_DSN,
    env: process.env.REACT_APP_SENTRY_ENV ?? "production",
  },
};
