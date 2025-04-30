import $api from '../../shared/api/axios'

export const loginRequest = async (login: string, password: string): Promise<{ token: string }> => {
  const response = await $api.post('/auth/login', { login, password })
  return response.data
}

