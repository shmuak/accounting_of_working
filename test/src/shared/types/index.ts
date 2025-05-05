export interface IRole {
  _id: string;
  value: string;
}

export interface IUser {
  _id: string;
  login: string;
  role: string;
  workshop: IWorkshop | string;
}

export interface IWorkshop {
  _id: string;
  name: string;
  location: string;
  description: string;
}

export interface ITokenPayload {
  _id: string;
  role: string;
  exp: number;
}

export interface IRequest {
  _id: string;
  title: string;
  description?: string;
  status: string;
  equipmentId: IEquipment | string;
}

export interface IEquipment {
  _id: string;
  name: string;
  type: string;
  description: string;
  status: string;
  workshopId: IWorkshop | string;
}
