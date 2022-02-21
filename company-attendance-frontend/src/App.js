import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import { Navbar } from './components';
import {
  Home,
  Login,
  Logout,
  Profile,
  ManagerDashboard,
  PageNotFound,
  Employees,
  NewEmployee,
  Employee,
  EditEmployee,
} from './pages';
import PrivateRoute from './PrivateRoute';
import { useDispatch, useSelector } from 'react-redux';
import { load_user } from './actions';
import useAxios from './hooks/useAxios';

function App() {
  // once authentication status is true, setup profile without using localState
  const isAuthenticated = useSelector(state => state.isAuthenticated);
  const [ isLoading, setIsLoading ] = useState(true);
  const dispatch = useDispatch();
  const api = useAxios();
  
  useEffect(() => {
    /*
      if user is authenticated, setup profile, and setup profile function will handle loading state
      but if user isn't authenticated, turn off loading state to show the app
    */
    if (isAuthenticated) {
      api.get('/api/me/')
      .then(response => {
          dispatch(load_user(response.data));
          setIsLoading(false);
      })
      .catch(err => {
          console.log(err)
      })
    } else {
      setIsLoading(false);
    }
  
  }, [isAuthenticated, api, dispatch]);

  if (isLoading) {
    return (
      <div className="loading-wrapper">
        <h1>Loading...</h1>
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
            <PrivateRoute roles={["managers", "receptionists"]}>
              < EditEmployee />
            </PrivateRoute>
          } />

          <Route exact path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />

          <Route path="*" element={<PageNotFound />} />
          </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
