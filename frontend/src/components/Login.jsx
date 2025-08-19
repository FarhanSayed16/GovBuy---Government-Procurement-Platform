import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoginMutation } from '../features/api/user.api';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials, logout} from '../features/auth/authSlice';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [login, { isLoading}] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  const [serverError, setServerError] = useState('')
  const location = useLocation();
  const from = location.state?.from || '/';

  // Login.jsx
  const onSubmit = async (data) => {
    try {

      const response = await login(data).unwrap();
      // Only store user data, not tokens
      const user = response.data.user;
      dispatch(setCredentials(user));
      
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err?.data?.message || 'Login failed');
      dispatch(logout());
    }
  };

  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-full max-w-md bg-white shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {serverError && (
          <p className="text-red-500 text-center text-sm mb-4">{serverError}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register('email', { required: 'Email is required' })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register('password', { required: 'Password is required' })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 transition duration-200"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
