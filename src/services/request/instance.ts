import Axios from  'axios-observable';
import { AxiosError, AxiosResponse, AxiosInstance, AxiosRequestConfig, HttpStatusCode } from 'axios';
import { $Token, Typeof } from '@/utils';
import { CONTENT_TYPE } from '@/enum';
import qs from 'qs';
import FormData from 'form-data';

type RequestMethod = 'get' | 'post' | 'put' | 'delete';

interface RequestParam {
  url: string;
  method?: RequestMethod;
  data?: any;
  axiosConfig?: AxiosRequestConfig;
}



export default class CustomAxiosInstance {
  instance: Axios
  constructor(config?: AxiosRequestConfig) {
    console.log(import.meta.env)
    this.instance = Axios.create({
      baseURL: import.meta.env.APP_BASE_API,
      timeout: 5000,
      headers: { 
        'X-Custom-Header': 'foobar',
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
    },
      withCredentials: true,
    });
    this.instance.interceptors.request.use(
      async (config: AxiosRequestConfig) => {
        console.log('interceptors.request', config)
        const handleConfig = { ...config };
        if (handleConfig.headers) {
          const contentType = handleConfig.headers['Content-Type'] as string;
          handleConfig.data = await this.transformRequest(handleConfig.data, contentType);
          handleConfig.headers.Authorization = `Bearer ${$Token.get()}`;
        }
        return handleConfig;
      },
      (axiosError: AxiosError) => {
        console.log('instance.interceptors.request.error')
        return this.handleServiceError(axiosError);
      }
    );
    this.instance.interceptors.response.use(
      async (response: AxiosResponse<any, any>) => {
        console.log('interceptors.response', response)
        const { status, data } = response;
        return Promise.reject({xxx: 111});
        if (status === HttpStatusCode.Ok || status < HttpStatusCode.MultipleChoices || status === HttpStatusCode.NotModified) {
          return this.handleServiceResult(data);
        }
        // return Promise.reject({xxx: 111});
        // if (REFRESH_TOKEN_CODE.includes(data[codeKey])) {
        //   const config = await handleRefreshToken(response.config);
        //   if (config) {
        //     return this.instance.request(config);
        //   }
        // }

        // const error = this.handleResponseError(response);
        // return this.handleServiceError(error);
      },
      (axiosError: AxiosError) => {
        console.log('instance.interceptors.response.error')
        return Promise.reject({xxx: 111});
        return axiosError;//this.handleServiceError(axiosError);
      }
    );
  }

  handleAxiosError(axiosError: AxiosError) {
    return {
      type: 'Axios-Error',
      error: null,
      data: null
    }
  }

  handleResponseError(response: any) {
    return {
      type: 'ResponseError',
      error: null,
      data: null
    }
  }

  async transformFormData(data: Record<string, any>) {
    const formData = new FormData();
    const entries = Object.entries(data);

    entries.forEach(async ([key, value]) => {
      const isFileType = Typeof.isFile(value) || (Typeof.isArray(value) && value.length && Typeof.isFile(value[0]));

      if (isFileType) {
        await this.transformFile(formData, key, value);
      } else {
        formData.append(key, value);
      }
    });

    return formData;
  }

  async transformFile(formData: FormData, key: string, file: File[] | File) {
    if (Typeof.isArray(file)) {
      // 多文件
      await Promise.all(
        (file as File[]).map(item => {
          formData.append(key, item);
          return true;
        })
      );
    } else {
      formData.append(key, file);
    }
  }

  async transformRequest(requestData: any, contentType: string) {
    let data = requestData;
    if (contentType === CONTENT_TYPE.FORM_URLENCODED) {
      data = qs.stringify(requestData);
    }
    if (contentType === CONTENT_TYPE.FORM_DATA) {
      data = await this.transformFormData(requestData);
    }
    return data;
  }

  async handleServiceResult<T = any>(data: any) {
    return {
      type: 'Service-Result',
      error: null,
      data: data
    }
  }

  async handleServiceError<T = any>(axiosError: AxiosError) {
    return {
      type: 'Service-Error',
      error: axiosError,
      data: axiosError.response?.data
    }
  }

  get<T>(url: string, config?: AxiosRequestConfig) {
    return this.instance.get(url, config);
  }

  post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.post(url, data, config);
  }

  put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.put(url, data, config);
  }

  handleDelete<T>(url: string, config: AxiosRequestConfig) {
    return this.instance.delete(url, config);
  }
}

export const $Axios = new CustomAxiosInstance()