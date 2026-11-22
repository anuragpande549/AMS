import { createSlice } from '@reduxjs/toolkit';

const storedUser = localStorage.getItem('ams_user');
const storedToken = localStorage.getItem('ams_token');

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isAuthenticated: Boolean(storedToken),
  role: storedUser ? JSON.parse(storedUser).role : null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.role = user.role;

      localStorage.setItem('ams_user', JSON.stringify(user));
      localStorage.setItem('ams_token', token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;

      localStorage.removeItem('ams_user');
      localStorage.removeItem('ams_token');
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
