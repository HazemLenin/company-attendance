import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import { Navbar, ToastContainer } from './components';
import {
  Home,
  Login,
  Logout,
  PasswordReset,
  PasswordResetConfirm,
  Profile,
  ManagerDashboard,
  PageNotFound,
  Employees,
  NewEmployee,
  Employee,
  Attendances,
  NewAttendance,
  Attendance,
  EditAttendance,
  EditEmployee,
} from './pages';
import PrivateRoute from './PrivateRoute';
import { useDispatch, useSelector } from 'react-redux';
import { load_user } from './actions';
import useAxios from './hooks/useAxios';
import "react-datetime/css/react-datetime.css";


function App() {
  // once authentication status is true, setup profile without using localState
  const isAuthenticated = useSelector(state => state.isAuthenticated);
  const authTokens = useSelector(state => state.authTokens);
  const [ isLoading, setIsLoading ] = useState(true);
  const dispatch = useDispatch();
  const api = useAxios();
  const [ error, SetError ] = useState(null);
  
  useEffect(() => {
    if (isAuthenticated) {
      api.get('/api/users/me/')
      .then(response => {
          dispatch(load_user(response.data));
          setIsLoading(false);
      })
      .catch(err => {
          SetError(err.response?.data);
      })
    } else {
      setIsLoading(false);
    }
  
  }, [isAuthenticated]); // TODO not updated

  if (isLoading) {
    return (
      <div className="loading-wrapper">
        <div className={`loading-container ${!error && 'pulse'}`}>
          <h1 className="text-center">Loading...</h1>
          <p className="text-danger">{ error }</p>
        </div>
      </div>
    )
  }
  
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />

          <Route exact path="/login" element={<Login />} />
          
          <Route exact path="/password_reset" element={<PasswordReset />} />

          <Route exact path="/password_reset/confirm" element={<PasswordResetConfirm />} />

          <Route exact path="/logout" element={
            <PrivateRoute>
              <Logout />
            </PrivateRoute>
          } />


          <Route exact path="/dashboard" element={
            <PrivateRoute roles={["managers",]}>
              <ManagerDashboard />
            </PrivateRoute>
          } />


          <Route exact path="/employees" element={
            <PrivateRoute roles={["managers", "receptionists"]}>
              <Employees />
            </PrivateRoute>
          } />

          <Route exact path="/employees/new" element={
            <PrivateRoute roles={["managers"]}>
              < NewEmployee />
            </PrivateRoute>
          } />

          <Route exact path="/employees/:id" element={
            <PrivateRoute roles={["managers", "receptionists"]}>
              < Employee />
            </PrivateRoute>
          } />

          <Route exact path="/employees/:id/edit" element={
            <PrivateRoute roles={["managers"]}>
              < EditEmployee />
            </PrivateRoute>
          } />


          <Route exact path="/attendances" element={
            <PrivateRoute roles={["managers", "receptionists"]}>
              < Attendances />
            </PrivateRoute>
          } />

          <Route exact path="/attendances/new" element={
            <PrivateRoute roles={["managers", "receptionists"]}>
              < NewAttendance />
            </PrivateRoute>
          } />

          <Route exact path="/attendances/:id" element={
            <PrivateRoute roles={["managers", "receptionists"]}>
              < Attendance />
            </PrivateRoute>
          } />

          <Route exact path="/attendances/:id/edit" element={
            <PrivateRoute roles={["managers"]}>
              < EditAttendance />
            </PrivateRoute>
          } />


          <Route exact path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />

          <Route path="*" element={<PageNotFound />} />
          </Routes>
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}

export default App;
