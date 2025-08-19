// features/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
// features/auth/authSlice.js
// features/authSlice.js
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    }
  },
});
export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;