// import { createAsyncThunk } from '@reduxjs/toolkit';
// import { authAPI, setAuthToken } from '../../app';
// import { LoginPayload } from './types';
// import { setCredentials, logout, setError } from './slice';

// export const loginUser = createAsyncThunk(
//   'auth/login',
//   async (payload: LoginPayload, { dispatch }) => {
//     try {
//       const response = await authAPI.login(payload);
//       const token = response.data.token;
//       setAuthToken(token);
      
//       // Здесь можно добавить запрос для получения данных пользователя
//       const user = {
//         _id: 'temp-id', // Замените на реальный ID из ответа сервера
//         login: payload.login,
//         role: 'USER' // Или другая роль из ответа сервера
//       };
      
//       dispatch(setCredentials({ user, token }));
//       return { user, token };
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : 'Login failed';
//       dispatch(setError(errorMessage));
//       throw error;
//     }
//   }
// );

// export const logoutUser = createAsyncThunk(
//   'auth/logout',
//   async (_, { dispatch }) => {
//     dispatch(logout());
//     setAuthToken(null);
//   }
// );