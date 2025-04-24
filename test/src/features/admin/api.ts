import $api from '../../shared/api/axios'

export const fetchUsers = async () => {
    const response = await $api.get('/admin/users')
    return response.data
  }
  