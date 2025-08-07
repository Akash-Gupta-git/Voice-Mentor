// ✅ routes.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import Dashboard from '../pages/dashboard/Dashboard';
import Chat from '../pages/dashboard/Chat';
import LandingPage from '../pages/misc/LandingPage';
import PrivateRoute from '../components/PrivateRoute';
import MainLayout from '../layouts/MainLayout';
import NotFound from '../pages/misc/NotFound';
import Home from '../pages/static/Home';
import About from '../pages/static/About';
import Services from '../pages/static/Services';
import Contact from '../pages/static/Contact';

import ProtectedRoute from '../components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '../context/AuthContext';



const AppRoutes = () => {
  return (
    <>
    
    
      <AuthProvider>
       
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="services" element={<Services />} />
                <Route path="contact" element={<Contact />} />
                <Route path="login" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/chat/:domain" element={<Chat />} />
                <Route path="/dashboard" element={<Dashboard />} />             

                {/* Protected Dashboard Route */}
                <Route
                  path="dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                  />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/Dashboard/chat" element={<Chat />} />
                    <Route path="/Dashboard/chat/:chatId?" element={<Chat />} /> {/* Add dynamic route */}
                  </Route>
                  {/* <Route path="/dashboard/chat" element={<Chat />} /> */}
            </Routes>  
          <ToastContainer />
      </AuthProvider>
 
    
    
    </>
  );
};

export default AppRoutes;
