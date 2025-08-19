import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header, Loader } from '../components';
import Footer from '../components/Footer';

const MainLayout = () => {

  return (
    <div className="min-h-screen flex flex-col bg-mainBg">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet/>
      </main>

      {/* Footer */}
      <Footer/>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default MainLayout;
