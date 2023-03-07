import { AxiosRequestConfig } from "axios";
import { AxiosObservable } from "axios-observable";
import { map, share } from "rxjs";
import { $Axios } from "./request";

class UserService {

  all(params: AxiosRequestConfig): AxiosObservable<any> {
    return $Axios.get(`https://jsonplaceholder.typicode.com/users`, {
      params
    })
    .pipe(
      map((res) => {
        return res.data
      }),
      share()
    )
  }

  show(id: number): AxiosObservable<any> {
    return $Axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
  }

  store(data: any): AxiosObservable<any> {
    return $Axios.post(`https://jsonplaceholder.typicode.com/users`, data);
  }

  update(id: number, data: any): AxiosObservable<any> {
    return $Axios.put(`https://jsonplaceholder.typicode.com/users/${id}`, data);
  }

  delete(id: number): AxiosObservable<any> {
    return $Axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
  }

}




export const $UserService = new UserService();