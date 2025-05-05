import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser } from '../../shared/types';

interface AuthState {
  user: { role: string } | null;
  token: string | null;
  isAuth: boolean;
}

const initialState: AuthState = {
  user: localStorage.getItem('role') ? { role: localStorage.getItem('role')!.toUpperCase() } : null,
  token: localStorage.getItem('token'),
  isAuth: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string; user: IUser }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuth = true;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    }
    ,    
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuth = false;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
  },
});


export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer