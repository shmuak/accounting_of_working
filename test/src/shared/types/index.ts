export interface IUser {
    _id: string;
    login: string;
    role: string;
    password: string;
    workshop: string | IWorkshop;
  }
  
export interface ITokenPayload {
    _id: string;
    role: string;
    exp: number; 
}

export interface IRole {
  _id: string;
  value: string;
  
}

export interface IWorkshop {
  _id: string;
  name: string;
  location: string;
  description: string;
}
