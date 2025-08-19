import { useLogoutMutation } from '../features/api/user.api';
import { logout } from '../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { apiSlice } from '../features/api/apiSlice'; // your baseApi
import Button from './Button';

function LogoutButton() {
  const [logoutApi] = useLogoutMutation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();      // clears cookie server‑side
    } catch (e) {
      console.error(e);
    }
    dispatch(logout());                // clear Redux auth state
    dispatch(apiSlice.util.resetApiState());  // clear all RTK query cache
    navigate('/login');                // send to login
  };


  return <Button className={`bg-red-800`} onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;