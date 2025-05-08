import $api from "../../shared/api/axios"
import { IRequestMechanic, IWorkshop } from "../../shared/types";

export const fetchUsers = async () => { 
    try {
      const response = await $api.get('/dispatcher/mechanics');
      return response.data.users || []; 
    } catch (err) { 
      console.error('Error fetching users:', err);
      return []; 
    }
  }

export const fetchWorkshops = async (): Promise<IWorkshop[]> => {
  const res = await $api.get('/dispatcher/workshops');
  return res.data;
}

export const createRequestsMechanic = async (data: Partial<IRequestMechanic>) => {
  const res = await $api.post('request-mechanic', data)
  return res.data.request
}

export const fetchRequestsMechabnic = async () => {
  try {
    const response = await $api.get('/dispatcher/requests-mechanic');
    return response.data.requests
  } catch (err) {
    console.error('Error fetching users:', err);
      return []; 
    }
}