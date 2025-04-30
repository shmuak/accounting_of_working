import $api from '../../shared/api/axios'
import { IRole, IUser, IWorkshop } from '../../shared/types'

export const fetchUsers = async () => {
    const response = await $api.get('/admin/users')
    console.log(response.data) 
    return response.data
  }
  
export const createUser = async (data: Partial<IUser>) => {
  const res = await $api.post('/users/', data)
  return res.data.user
}
  
export const updateUser = async (id: string, data: Partial<IUser>) => {
  const res = await $api.patch(`/users/${id}`, data)
  return res.data.user
}
  
export const deleteUser = async (id: string) => {
  const res = await $api.delete(`/users/${id}`)
  return res.data
}
  
export const fetchRoles = async (): Promise<IRole[]> => {
  const res = await $api.get('/roles');
  return res.data;
};

export const fetchWorkshops = async (): Promise<IWorkshop[]> => {
  const res = await $api.get('/admin/workshops');
  return res.data;
}

export const createWorkshop = async (data: Partial<IWorkshop>) => {
  const res = await $api.post('/workshops/', data)
  return res.data.workshop
}
  
export const updateWorkshop = async (id: string, data: Partial<IWorkshop>) => {
  const res = await $api.patch(`/workshops/${id}`, data)
  return res.data.workshop
}
  
export const deleteWorkshop = async (id: string) => {
  const res = await $api.delete(`/workshops/${id}`)
  return res.data
}