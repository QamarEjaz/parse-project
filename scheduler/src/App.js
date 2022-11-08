import { Routes, Route } from 'react-router-dom';
import PageContainer from './components/PageContainer';
import Appointment from './pages/appointment';
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify"
// import LoginComp from './pages/login/login';
import { useSelector } from "react-redux"
import { useEffect } from 'react'
const App = () => {
  const currentUser = useSelector((state) => state?.AuthRed.user)
  let navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      return navigate("/");
    } else {
      navigate('/login')
    }
  }, []) 
  if (currentUser) {
    return (
      <>
        <ToastContainer autoClose={8000} />
        <Routes>
          <Route exact path='/' element={<Appointment />}></Route>
        </Routes>
      </>
    );
  } else {
    return (
      <>
        <ToastContainer autoClose={8000} />
        <Routes>
          <Route exact path='/login' element={<PageContainer />}></Route>
        </Routes>
      </>
    )
  }
};

export default App;
