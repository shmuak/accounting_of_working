import $api from "../../shared/api/axios";
import { IRequestMechanic } from "../../shared/types";

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