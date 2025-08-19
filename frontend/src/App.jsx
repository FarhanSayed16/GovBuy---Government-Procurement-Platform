import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { ErrorBoundary, Loader } from './components';
import { useGetCurrentUserQuery } from './features/api/user.api';
import { setCredentials, logout } from './features/auth/authSlice';
import { store } from './store/store';

export default function App() {
  return (
    <>
    <RouterProvider router={router} />
  </>
  );
}
