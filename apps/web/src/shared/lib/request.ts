import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const request = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

export interface GenericDto<Req, Res> {
  req: Req;
  res: Res;
}
