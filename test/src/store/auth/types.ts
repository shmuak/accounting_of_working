import { User } from '../../app/types';

export interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface LoginPayload {
  login: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}