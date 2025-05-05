import $api from '../../shared/api/axios'
import { AuthResponse } from '../../store/auth/types'

export const loginRequest = async (login: string, password: string): Promise<AuthResponse> => {
  const response = await $api.post('/auth/login', { login, password });
  return response.data;
};
