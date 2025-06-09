import { IUser } from '../../shared/types/index';

export interface AuthState {
  user: IUser | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface LoginPayload {
  login: string;
  password: string;
}

export interface AuthResponse {
  user: IUser;
  token: string;
}
