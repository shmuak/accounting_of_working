import $api from '../../shared/api/axios'
import { IRequest } from '../../shared/types'

export const createRequest = async (data: Partial<IRequest>) => {
    const res = await $api.post('requests', data)
    return res.data.request
  }

  export const fetchRequests = async (): Promise<IRequest[]> => {
    const res = await $api.get('/requests');
    console.log("Ответ от сервера:", res.data); 

    return res.data.requests;
  }

  export const deleteRequest = async (id:string) => {
    const res = await $api.delete(`/requests/${id}`)
    return res.data
  }

