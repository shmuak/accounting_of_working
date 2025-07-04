  import $api from "../../shared/api/axios";
  import { IConsumable, IConsumableRequest, IUser } from "../../shared/types";

  export const fetchInventory = async (): Promise<IConsumable[]> => {
      const response = await $api.get('/stokekeeper/consumables');
      return response.data.consumable;
  }

  export const createInventory = async (data: Omit<IConsumable, '_id'>): Promise<IConsumable> => {
    const response = await $api.post('/consumables', data);
      console.log('Created consumable:', response.data); 
    return response.data ;
  }

  export const updateInventory = async (id: string, data: Partial<IConsumable>) => {
    const res = await $api.patch(`/consumables/${id}`, data)
    return res.data.consumable
  }
    
  export const deleteInventory = async (id: string) => {
    const res = await $api.delete(`/consumables/${id}`)
    return res.data
  }

export const fetchRequests = async (): Promise<IConsumableRequest[]> => {
  try {
    const response = await $api.get('/stokekeeper/requests'); 
    return response.data.requests;
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw error; 
  }
};
export const updateRequestStatus = async (
  id: string, 
  status: 'Принято' | 'Отменено' | 'Прибыло' | 'Выполнено'
): Promise<IConsumableRequest> => {
  try {
    const response = await $api.patch(`/request-stokekeeper/${id}`, { status });
    return response.data.request;
  } catch (error) {
    console.error(`Error updating request ${id} status to ${status}:`, error);
    throw error;
  }
};
export const fetchUsersForStorekeeper = async (): Promise<IUser[]> => {
  try {
    const response = await $api.get('/stokekeeper/mechanics');
    return response.data || [];
  } catch (err) {
    console.error('Error fetching mechanics:', err);
    return [];
  }
};

