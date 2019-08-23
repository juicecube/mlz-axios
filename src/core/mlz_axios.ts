import axios, { 
  AxiosRequestConfig, 
  CancelTokenStatic, 
  CancelTokenSource,
  AxiosPromise,
  AxiosResponse
} from 'axios';
import mergeConfig from './merge_config'

export default class Http {
  private base_url?:string;
  private authorization_type:number|string = '';
  private readonly authorization:string = 'authorization';
  private cancel_token:CancelTokenStatic = axios.CancelToken;
  private source:CancelTokenSource = this.cancel_token.source();
  private default_config:AxiosRequestConfig = {
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
  constructor(base_url?:string) {
    if (base_url) {
      this.base_url = base_url
    }
    this.set_default_conf(this.default_config)
  }
  private request(opt:AxiosRequestConfig):AxiosPromise {
    const actual_opt = Object.assign({}, opt);
    if (this.base_url) {
      actual_opt.baseURL = this.base_url
    }
    if (this.authorization && this.authorization_type) {
      actual_opt.headers = {
        authorization_type: this.authorization_type,
        authorization: this.authorization,
        ...actual_opt.headers
      }
    }
    actual_opt.cancelToken = this.source.token;
    return axios.request(actual_opt)
  }
  public abort() {
    this.source.cancel('API abort.')
  }
  public get(url:string, configs?:AxiosRequestConfig):AxiosPromise {
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
  public set_default_conf (configs:AxiosRequestConfig = {}) {
    mergeConfig(axios.defaults, configs)
  }
  public set_token(authorization_type:number|string) {
    this.authorization_type = authorization_type;
  }
  public set_req_interceptor (resolve?:Function, reject?:Function) {
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
  public set_res_interceptor (resolve?:Function, reject?:Function) {
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
