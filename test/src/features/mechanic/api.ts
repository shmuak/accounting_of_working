import $api from "../../shared/api/axios";
import { CreateAjasterRequestParams, CreateManualRequestParams, CreateOrderParams, IConsumable, IConsumableRequest, IRequestMechanic } from "../../shared/types";

export const fetchRequestsMechabnic = async (): Promise<IRequestMechanic[]> => {
  const response = await $api.get('/mechanic/requests');
  return response.data.requests;
};

export const completeRequestMechanic = async (requestId: string) => {
  const response = await $api.patch(`/request-mechanic/${requestId}`, {
    status: 'Completed'
  });
  return response.data.request;
};

export const fetchInventory = async (): Promise<IConsumable[]> => {
    const response = await $api.get('/mechanic/warehouse');
    return response.data.consumable;
}

export const createConsumableOrder = async (orderData: CreateOrderParams) => {
  const response = await $api.post('/mechanic/request-stokekeeper', orderData);
  return response.data;
};
export interface FetchConsumableRequestsParams {
  masterId: string;
  status?: 'pending' | 'approved' | 'rejected' | 'completed';
}
export const fetchConsumableRequests = async (
  params: FetchConsumableRequestsParams
): Promise<IConsumableRequest[]> => {
  const response = await $api.get('/mechanic/consumable-requests', { params });
  return response.data.requests;
};

export const cancelConsumableRequest = async (requestId: string) => {
  const response = await $api.delete(`/mechanic/consumable-requests/${requestId}`);
  return response.data;
};

export const createManualConsumableRequest = async (
  requestData: CreateManualRequestParams // Используем новый интерфейс
): Promise<IConsumableRequest> => {
  const response = await $api.post('/mechanic/manual-consumable-request', requestData);
  return response.data.request; // Бекенд возвращает { message, request }
};

export const createAjasterRequest = async (requestData: CreateAjasterRequestParams) => {
  const response = await $api.post('/mechanic/create-ajaster-request', requestData);
  return response.data.request;
};