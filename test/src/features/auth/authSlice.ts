import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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
    loginSuccess(state, action: PayloadAction<{ token: string; role: string }>) {
      const roleUpper = action.payload.role.toUpperCase();
      state.token = action.payload.token;
      state.user = { role: roleUpper };
      state.isAuth = true;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('role', roleUpper);
    },    
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