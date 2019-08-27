import axios, { 
  AxiosRequestConfig, 
  CancelTokenStatic, 
  CancelTokenSource,
  AxiosPromise,
  AxiosResponse
} from 'axios';
import mergeConfig from './utils/merge_config'
export default class Http {
  baseUrl?:string;
  authorizationType:number|string = '';
  readonly authorizationKey:string = 'authorization';
  authorizationVal:string | null = this.getToken();
  cancelToken:CancelTokenStatic = axios.CancelToken;
  source:CancelTokenSource = this.cancelToken.source();
  defaultConfig:AxiosRequestConfig = {
    withCredentials: true,
    timeout: 5000,
    validateStatus: function (status) {
      return status >= 200 && status < 599; 
    },
    headers: {
      post: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    },
  }
  constructor(baseUrl?:string) {
    if (baseUrl) {
      this.baseUrl = baseUrl
    }
    this.setDefaultConf(this.defaultConfig)
  }
  private request(opt:AxiosRequestConfig):AxiosPromise {
    const actualOpt = Object.assign({}, opt);
    if (this.baseUrl) {
      actualOpt.baseURL = this.baseUrl
    }
    if (this.authorizationVal && this.authorizationType) {
      actualOpt.headers = {
        authorizationType: this.authorizationType,
        authorization: this.authorizationVal,
        ...actualOpt.headers
      }
    }
    actualOpt.cancelToken = this.source.token;
    return axios.request(actualOpt)
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
  public setDefaultConf (configs:AxiosRequestConfig = {}) {
    axios.defaults = mergeConfig(axios.defaults, configs)
  }
  public setTokenType(authorizationType:number|string) {
    this.authorizationType = authorizationType;
  }
  public setToken(token:string) {
    localStorage.setItem(this.authorizationKey, token);
  }
  public getToken() {
    return localStorage.getItem(this.authorizationKey)
  }
  public setReqInterceptor (resolve?:Function, reject?:Function) {
    // Add a request interceptor
    axios.interceptors.request.use(function (config: AxiosRequestConfig) {
      // Do something before request is sent
      resolve && resolve(config);
      return config;
    }, function (error) {
      // Do something with request error
      reject && reject(error);
      return Promise.reject(error);
    });
  }
  public setResInterceptor (resolve?:Function, reject?:Function) {
    // Add a response interceptor
    axios.interceptors.response.use(function (response:AxiosResponse) {
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
