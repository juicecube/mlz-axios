import axios, { 
  AxiosRequestConfig, 
  CancelTokenStatic, 
  CancelTokenSource,
  AxiosPromise,
  AxiosResponse,
  AxiosInstance
} from 'axios';
import mergeConfig from './utils/merge_config'
// axios.defaults.timeout = 5000
// axios.defaults.withCredentials = true
// axios.defaults.validateStatus = function (status) {
//   return status >= 200 && status < 599; 
// }
export const axiosIns:AxiosInstance = axios.create({
  timeout: 5000,
  withCredentials: true,
  validateStatus: (status) => status >= 200 && status < 599
})
export default class Http {
  baseUrl?:string;
  static authorizationType:number|string = '';
  static readonly tokenKey:string = 'token';
  cancelToken:CancelTokenStatic = axios.CancelToken;
  source:CancelTokenSource = this.cancelToken.source();
  constructor(baseUrl?:string) {
    if (baseUrl) {
      this.baseUrl = baseUrl
    }
  }
  private request(opt:AxiosRequestConfig):AxiosPromise {
    const actualOpt = Object.assign({}, opt);
    let tokenObj = null
    if (this.baseUrl) {
      actualOpt.baseURL = this.baseUrl
    }
    try {
      tokenObj = JSON.parse(localStorage.getItem(Http.tokenKey) as string)
    } catch (err) {
      console.error(err)
    }
    if (tokenObj) {
      actualOpt.headers = Object.assign(
        {},
        tokenObj,
        opt.headers,
      )
    }
    actualOpt.cancelToken = this.source.token;
    return axiosIns.request(actualOpt)
  }
  public abort() {
    this.source.cancel('API abort.')
  }
  public get(url:string, configs?:AxiosRequestConfig) {
    return this.request({
      method: 'get',
      url,
      ...configs,
    });
  }
  public post(url:string, data?:any, configs?:AxiosRequestConfig):AxiosPromise {
    return this.request({
      method: 'post',
      url,
      data,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      ...configs,
    })
  }
  public put(url:string, data?:any, configs?:AxiosRequestConfig):AxiosPromise {
    return this.request({
      method: 'put',
      url,
      data,
      ...configs,
    })
  }
  public patch(url:string, data?:any, configs?:AxiosRequestConfig):AxiosPromise {
    return this.request({
      method: 'patch',
      url,
      data,
      ...configs,
    })
  }
  public delete(url:string, configs?:AxiosRequestConfig):AxiosPromise {
    return this.request({
      method: 'delete',
      url,
      ...configs,
    })
  }
  static setToken(authorizationType:string|number, authorization:string) {
    localStorage.setItem(this.tokenKey, JSON.stringify({
      authorizationType,
      authorization
    }));
  }
  static setDefaultConf (configs:AxiosRequestConfig = {}) {
    axiosIns.defaults = mergeConfig(axiosIns.defaults, configs)
  }
  static setReqInterceptor (resolve?:Function, reject?:Function) {
    // Add a request interceptor
    axiosIns.interceptors.request.use(function (config: AxiosRequestConfig) {
      // Do something before request is sent
      resolve && resolve(config);
      return config;
    }, function (error) {
      // Do something with request error
      reject && reject(error);
      return Promise.reject(error);
    });
  }
  static setResInterceptor (resolve?:Function, reject?:Function) {
    // Add a response interceptor
    axiosIns.interceptors.response.use(function (response:AxiosResponse) {
      // Do something with response data
      resolve && resolve(response);
      return response;
    }, function (error) {
      reject && reject(error);
      // Do something with response error
      return Promise.reject(error);
    });
  }
}


