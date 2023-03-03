import Axios, { AxiosObservable } from "axios-observable";

class TaskService {

  indexTask(): AxiosObservable<any> {
    return Axios.get(`/api/index`);
  }

  showTask(id: number): AxiosObservable<any> {
    return Axios.get(`/api/show/${id}`);
  }

  storeTask(data: any): AxiosObservable<any> {
    return Axios.post(`/api/store`, data);
  }

  updateTask(id: number, data: any): AxiosObservable<any> {
    return Axios.put(`/api/update/${id}`, data);
  }

  deleteTask(id: number): AxiosObservable<any> {
    return Axios.delete(`/api/delete/${id}`);
  }

}




export const $TaskService = new TaskService();