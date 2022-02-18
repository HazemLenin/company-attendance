import React, { useEffect } from 'react';
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
  Employees
} from './pages';
import PrivateRoute from './PrivateRoute';
import { useDispatch, useSelector } from 'react-redux';
import { setup_user_and_profile } from './services';

function App() {
  // once authentication status is true, setup profile without using localState
  const isAuthenticated = useSelector(state => state.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      setup_user_and_profile();
    }
  
  }, [isAuthenticated])
  
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
