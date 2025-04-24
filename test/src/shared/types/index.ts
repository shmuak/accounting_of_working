export interface IUser {
    _id: string
    login: string
    role: string
  }
  
export interface ITokenPayload {
    id: string;
    role: string;
    exp: number; 
}