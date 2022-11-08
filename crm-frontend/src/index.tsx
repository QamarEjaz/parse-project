import React from "react"
import ReactDOM from "react-dom/client"
import { store, persistor } from "./Store/index"
import { Provider } from "react-redux"
import { ToastContainer } from "react-toastify"
import { PersistGate } from "redux-persist/integration/react"
import "./assets/css/main.css"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import "react-toastify/dist/ReactToastify.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
// import { ConnectedRouter } from "connected-react-router"
// import { history } from "./Store/index"

const queryClient = new QueryClient()
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        {/* <ConnectedRouter history={history}> */}
        <ToastContainer autoClose={8000} />
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
        {/* </ConnectedRouter> */}
      </PersistGate>
    </Provider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
