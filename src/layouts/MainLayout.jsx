import React from 'react';
import { Outlet } from 'react-router-dom';
import NavbarComponent from '../components/Navbar';
import FooterComponent from '../components/Footer';

const MainLayout = () => {
  return (
    <>
      <NavbarComponent />
      <main className="container my-4">
        <Outlet />
      </main>
      <FooterComponent />
    </>
  );
};

export default MainLayout;
