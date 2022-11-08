import Parse from "parse"
import React, { useEffect, useState } from "react"
import { Switch, Route, Redirect } from "react-router-dom"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer, Slide } from "react-toastify"
import { useSelector, useDispatch } from "react-redux"
import { history } from "./Store/index"
import Phone from "./pages/phone"
import Question from "./pages/question"
import Details from "./pages/details"
import Insurance from "./pages/insurance"
import Patients from "./pages/patients"
import Location from "./pages/location"
import currentlocation from "./pages/current-location"
import Confirmation from "./pages/confirmation"
import { parseConfig } from "./utils/ParseConfig"
import { push, ConnectedRouter } from "connected-react-router"
import AddNewFamilyMember from "./pages/AddNewFamilyMember"
import ChooseDate from "./pages/choose-date"
import Notes from "./pages/notes"
import Reserve from "./pages/reserve"
import CardDetails from "./pages/CardDetails"
import {
  getMainPatient,
  getMainPatientSuccess,
  getSelectedPatientSuccess,
  LoginSuccess,
} from "./Store/Auth/actions"
import Helmet from "react-helmet"
import { config } from "./utils/config"
import WelcomeCenterLocations from "./pages/welcomeCenterLocation"
import InsurancePublicPage from "./pages/insurancePublicPage"

export default function App() {
  const dispatch = useDispatch()

  const currentUser = useSelector((state) => state?.AuthRed.user)
  const mainPatient = useSelector((state) => state?.AuthRed.mainPatient)
  const selectedPatient = useSelector((state) => state?.AuthRed.selectedPatient)
  const verifynumber = useSelector((state) => state?.AuthRed.verifyNumber)

  const [currentUserEventsSubscription, setCurrentUserEventsSubscription] =
    useState(null)
  const [isNewPatient, setIsNewPatient] = useState()

  useEffect(() => {
    if (
      isNewPatient ||
      (mainPatient?.emailAddress === selectedPatient?.emailAddress &&
        // mainPatient?.gender === selectedPatient?.gender &&
        // mainPatient?.dateOfBirth === selectedPatient?.dateOfBirth &&
        mainPatient?.lastName === selectedPatient?.lastName &&
        mainPatient?.firstName === selectedPatient?.firstName &&
        mainPatient?.createdAt === selectedPatient?.createdAt)
    ) {
      dispatch(getSelectedPatientSuccess(mainPatient))
    }
  }, [mainPatient])

  useEffect(() => {
    if (isNewPatient !== (!mainPatient?.dateOfBirth || !mainPatient?.gender)) {
      setIsNewPatient(!mainPatient?.dateOfBirth || !mainPatient?.gender)
      if (
        window.location.pathname === "/chk-ins" ||
        window.location.pathname === "/chk-cc"
      ) {
      } else {
        if (currentUser?.objectId) {
          if (!mainPatient?.dateOfBirth || !mainPatient?.gender) {
            history.push("/details")
          }
        } else {
          history.push("/")
        }
      }
    }
  }, [selectedPatient])

  useEffect(async () => {
    parseConfig()

    if (currentUser?.objectId && Parse.User.current()) {
      if (currentUserEventsSubscription === null) {
        try {
          currentUserEventsSubscription?.unsubscribe()
        } catch (error) {
          console.log(error)
          toast.error(JSON.stringify(error.message))
        }
        let query = new Parse.Query("_User")
        query.equalTo("objectId", currentUser.objectId)
        let subscription = await query.subscribe()
        setCurrentUserEventsSubscription(subscription)

        subscription.on("update", (currentUser) => {
          dispatch(LoginSuccess(currentUser.toJSON()))
          dispatch(getMainPatient())
        })
      }
    } else {
      if (currentUserEventsSubscription) {
        try {
          currentUserEventsSubscription?.unsubscribe()
        } catch (error) {
          toast.error(JSON.stringify(error.message))
          console.log(error)
        }
        setCurrentUserEventsSubscription(null)
      }
    }
  }, [currentUser])

  useEffect(() => {
    dispatch(getMainPatient())
  }, [])

  if (verifynumber) {
    return (
      <>
        <Helmet>
          <title>{config.app.title}</title>
          <link
            rel="icon"
            type="image/png"
            href={config.app.favicon}
            sizes="16x16"
          />
        </Helmet>

        <React.Fragment>
          <ConnectedRouter history={history}>
            {isNewPatient ? (
              <Switch>
                <Route exact path="/" component={Details} />
                <Route path="/details" component={Details} />
                <Route path="/patients" component={Details} />
                <Route
                  path="/addNewFamilyMember"
                  component={AddNewFamilyMember}
                />
                <Route path="/chk-ins" component={InsurancePublicPage} exact />
                <Route path="/chk-cc" component={CardDetails} exact />
                <Route path="/location" component={Location} />
                <Route
                  path="/welcomeCenterLocations"
                  component={WelcomeCenterLocations}
                />
                <Route path="/currentlocation" component={currentlocation} />
                <Route path="/chooseDate" component={ChooseDate} />
                <Route path="/notes" component={Notes} />
                <Route path="/insurance" component={Insurance} />
                <Route path="/reserve" component={Reserve} />
                <Route path="/confirmation" component={Confirmation} />
                <Route path="/cardDetails" component={CardDetails} />
                <Route path="/question" component={Question} exact />
              </Switch>
            ) : (
              <Switch>
                <Route exact path="/" component={Patients} />
                <Route path="/details" component={Patients} />
                <Route path="/patients" component={Patients} />
                <Route
                  path="/addNewFamilyMember"
                  component={AddNewFamilyMember}
                />
                <Route path="/chk-ins" component={InsurancePublicPage} exact />
                <Route path="/chk-cc" component={CardDetails} exact />
                <Route path="/location" component={Location} />
                <Route
                  path="/welcomeCenterLocations"
                  component={WelcomeCenterLocations}
                />
                <Route path="/currentlocation" component={currentlocation} />
                <Route path="/chooseDate" component={ChooseDate} />
                <Route path="/notes" component={Notes} />
                <Route path="/insurance" component={Insurance} />
                <Route path="/reserve" component={Reserve} />
                <Route path="/confirmation" component={Confirmation} />
                <Route path="/cardDetails" component={CardDetails} />
                <Route path="/question" component={Question} exact />
              </Switch>
            )}

            <ToastContainer
              transition={Slide}
              position="top-center"
              autoClose={2000}
              hideProgressBar
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </ConnectedRouter>
        </React.Fragment>
      </>
    )
  } else {
    return (
      <>
        <Helmet>
          <title>{config.app.title}</title>
          <link
            rel="icon"
            type="image/png"
            href={config.app.favicon}
            sizes="16x16"
          />
        </Helmet>

        <React.Fragment>
          <ConnectedRouter history={history}>
            <Switch>
              <Route path="/" component={Phone} exact />
              <Route path="/chk-ins" component={InsurancePublicPage} exact />
              <Route path="/chk-cc" component={CardDetails} exact />
              <Route exact path="/details" render={() => <Redirect to="/" />} />
              <Route
                exact
                path="/insurance"
                render={() => <Redirect to="/" />}
              />
              <Route exact path="/verify" render={() => <Redirect to="/" />} />
              <Route
                exact
                path="/patients"
                render={() => <Redirect to="/" />}
              />
              <Route
                exact
                path="/addNewFamilyMember"
                render={() => <Redirect to="/" />}
              />
              <Route
                exact
                path="/location"
                render={() => <Redirect to="/" />}
              />
              <Route
                exact
                path="/currentlocation"
                render={() => <Redirect to="/" />}
              />
              <Route
                exact
                path="/question"
                render={() => <Redirect to="/" />}
              />
              <Route
                exact
                path="/confirmation"
                render={() => <Redirect to="/" />}
              />
              <Route
                exact
                path="/chooseDate"
                render={() => <Redirect to="/" />}
              />
              <Route
                exact
                path="/cardDetails"
                render={() => <Redirect to="/" />}
              />
              <Route
                exact
                path="/welcomeCenterLocations"
                render={() => <Redirect to="/" />}
              />
              <Route exact path="/reserve" render={() => <Redirect to="/" />} />
              <Route exact path="/notes" render={() => <Redirect to="/" />} />
            </Switch>
            <ToastContainer
              transition={Slide}
              position="top-center"
              autoClose={2000}
              hideProgressBar
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </ConnectedRouter>
        </React.Fragment>
      </>
    )
  }
}
