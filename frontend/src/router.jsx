// src/router.js
import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

import Home from './pages/HomePage';
import TendersList from './pages/TendersList';
import TenderCreate from './pages/TenderCreate';
import TenderDetails from './pages/TenderDetails';
import MyTenders from './pages/MyTenders';
import MyBids from './pages/MyBids';
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';

import { Login,Signup,NotFound } from './components';
import AdminUsers from './pages/AdminUsers';
import BidDetails from './pages/BidDetails';

export default createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      {/* Public */}
      <Route index element={<Home />} />
      <Route path="tenders" element={<TendersList />} />
      <Route path="tenders/:id" element={<TenderDetails />} />

      {/* Auth pages */}
      <Route
        path="login"
        element={
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        }
      />
      <Route
        path="signup"
        element={
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        }
      />

      {/* Protected */}
      <Route
        path="tenders/create"
        element={
          <AuthLayout authentication={true} roles={['procurement_officer', 'department_head']}>
            <TenderCreate />
          </AuthLayout>
        }
      />
      <Route
        path="tenders/mine"
        element={
          <AuthLayout authentication={true} roles={['procurement_officer', 'department_head']}>
            <MyTenders />
          </AuthLayout>
        }
      />
      <Route
        path="bids/my"
        element={
          <AuthLayout authentication={true} roles={['supplier']}>
            <MyBids />
          </AuthLayout>
        }
      />
      <Route
        path="dashboard"
        element={
          <AuthLayout authentication={true}>
            <Dashboard />
          </AuthLayout>
        }
      />
      <Route
        path="notifications"
        element={
          <AuthLayout authentication={true}>
            <Notifications />
          </AuthLayout>
        }
      />

<Route
  path="admin/users"
  element={
    <AuthLayout authentication={true} roles={['admin']}>
      <AdminUsers />
    </AuthLayout>
  }
/>

<Route
  path="bids/:bidId"
  element={
    <AuthLayout authentication={true} roles={['procurement_officer','department_head']}>
      <BidDetails />
    </AuthLayout>
  }
/>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);
