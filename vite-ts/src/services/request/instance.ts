import Axios from  'axios-observable';
import type { AxiosError, AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Token } from '../../utils';

type RequestMethod = 'get' | 'post' | 'put' | 'delete';

interface RequestParam {
  url: string;
  method?: RequestMethod;
  data?: any;
  axiosConfig?: AxiosRequestConfig;
}



export default class CustomAxiosInstance {
  instance: Axios
  constructor() {
    this.instance = Axios.create({
      baseURL: 'https://some-domain.com/',
      timeout: 1000,
      headers: { 'X-Custom-Header': 'foobar' }
    });
    this.instance.interceptors.request.use(
      async config => {
        const handleConfig = { ...config };
        if (handleConfig.headers) {
          // 数据转换
          const contentType = handleConfig.headers['Content-Type'] as string;
          handleConfig.data = await transformRequestData(handleConfig.data, contentType);
          // 设置token
          handleConfig.headers.Authorization = `Bearer ${Token.get()}`;
        }
        return handleConfig;
      },
      (axiosError: AxiosError) => {
        const error = this.handleAxiosError(axiosError);
        return this.handleServiceError(error);
      }
    );
  }

  private setInterceptor(): void {
    this.instance.interceptors.response.use(
      async (response) => {
        const { status, data } = response;
        if (status === 200 || status < 300 || status === 304) {
          // 请求成功
          if (true) {
            return this.handleServiceResult(data);
          }

          // // token失效, 刷新token
          // if (REFRESH_TOKEN_CODE.includes(data[codeKey])) {
          //   const config = await handleRefreshToken(response.config);
          //   if (config) {
          //     return this.instance.request(config);
          //   }
          // }

          const error = this.handleBackendError(data);
          return this.handleServiceError(error);
        }
        const error = this.handleResponseError(response);
        return this.handleServiceError(error);
      },
      (axiosError: AxiosError) => {
        const error = this.handleAxiosError(axiosError);
        return this.handleServiceError(error);
      }
    );
  }

  handleAxiosError(axiosError: AxiosError): void {

  }

  handleResponseError(response: any) {

  }

  handleBackendError(response: any) {

  }

  async handleServiceResult<T = any>(data: any): AxiosResponse {
    return {
      error: null,
      data: null
    }
  }

  async handleServiceError<T = any>(data: any): AxiosResponse {
    return {
      error: null,
      data: null
    }
  }
}