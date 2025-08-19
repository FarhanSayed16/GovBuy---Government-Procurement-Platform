// src/AuthInitializer.jsx
import React, { useEffect } from 'react';
import { useGetCurrentUserQuery } from './features/api/user.api';
import { useDispatch } from 'react-redux';
import { setCredentials } from './features/auth/authSlice';
import Loader from './components/Loader';

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const { data, isLoading } = useGetCurrentUserQuery();
  console.log(data)
  useEffect(() => {
    if (data?.data) {
      dispatch(setCredentials(data.data));
    }
    // we do NOT dispatch(logout()) here on error
  }, [data, dispatch]);

  if (isLoading) {
    // show a full‑screen loader until we know who you are
    return <Loader fullScreen />;
  }

  return <>{children}</>;
}

