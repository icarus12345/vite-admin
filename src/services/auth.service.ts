import { AxiosObservable } from "axios-observable";
import { $Axios } from "./request";

class AuthService {

  identity(): AxiosObservable<any> {
    return $Axios.get(`/api/auth/current`);
  }

  login(username: string, password: string): AxiosObservable<any> {
    return $Axios.post(`/api/auth/login`);
  }

  logout(): AxiosObservable<any> {
    return $Axios.post(`/api/auth/logout`);
  }

  register(): AxiosObservable<any> {
    return $Axios.post(`/api/auth/register`);
  }

  updateProfile(): AxiosObservable<any> {
    return $Axios.put(`/api/auth/profile/update`);
  }

  changePassword(): AxiosObservable<any> {
    return $Axios.patch(`/api/auth/profile/change-password`);
  }
}
export const $AuthService = new AuthService();