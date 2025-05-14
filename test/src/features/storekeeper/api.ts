import $api from "../../shared/api/axios";
import { IConsumable } from "../../shared/types";

export const fetchInventory = async (): Promise<IConsumable[]> => {
    const response = await $api.get('/stokekeeper/inventory');
    return response.data.consumable;
}

export const createInventory = async (data: Omit<IConsumable, '_id'>): Promise<IConsumable> => {
  const response = await $api.post('/consumables', data);
  return response.data;
}