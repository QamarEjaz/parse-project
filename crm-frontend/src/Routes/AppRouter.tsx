import React, { FC, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { URLS } from "./Urls"
import { useDispatch, useSelector } from "react-redux"
import AuthLayout from "../layouts/AuthLayout"
import AppLayout from "../layouts/AppLayout"
import { setDate } from "../Store/Schedule/actions"

export const PublicRoute = ({ userToken, children }: any) => {
  if (userToken.user) {
    return <Navigate to="/people-management" />
  } else if (window.location.pathname == "/") {
    return <Navigate to="/crm" />
  }
  return children
}

export const PrivateRoute = ({ userToken, children }: any) => {
  if (!userToken.user) {
    return <Navigate to="/crm" />
  }
  return children
}

const AppRouter: FC = () => {
  const userToken = useSelector((state: any) => state.Auth)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setDate(new Date()))
  }, [])

  return (
    <>
      <Router>
        <Routes>
          {URLS.map((obj: any) => {
            return obj.isPublic ? (
              <React.Fragment key={obj.path}>
                {obj.path == "*" ? (
                  <Route path={obj.path} element={<obj.component />} />
                ) : (
                  <Route element={<AuthLayout />}>
                    <Route
                      path={obj.path}
                      element={
                        <PublicRoute userToken={userToken}>
                          <obj.component />
                        </PublicRoute>
                      }
                    />
                  </Route>
                )}
              </React.Fragment>
            ) : (
              <Route element={<AppLayout />} key={obj.path}>
                <Route
                  path={obj.path}
                  element={
                    <PrivateRoute userToken={userToken}>
                      <obj.component />
                    </PrivateRoute>
                  }
                />
              </Route>
            )
          })}
        </Routes>
      </Router>
    </>
  )
}

export default AppRouter
