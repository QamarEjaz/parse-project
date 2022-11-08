import React from "react";
import ReactDOM from "react-dom";
// import { BrowserTracing } from "@sentry/tracing";
import { Provider } from "react-redux";
import { store } from "./Store/index";

import "./index.css";
import App from "./App";

// Sentry.init({
//   dsn: config.sentry.dsn,
//   environment: config.sentry.env,
//   integrations: [new BrowserTracing()],

//   // We recommend adjusting this value in production, or using tracesSampler
//   // for finer control
//   tracesSampleRate: 1.0,
// });

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// ReactDOM.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         <StateProvider>
//           <Router>
//             {/* <ConnectedRouter history={history}> */}
//             {/* <PersistGate persistor={persistor}> */}
//             <App />
//             {/* </PersistGate> */}
//             {/* </ConnectedRouter> */}
//           </Router>
//         </StateProvider>
//       </PersistGate>
//     </Provider>
//   </React.StrictMode>,
//   document.getElementById("root")
// );
