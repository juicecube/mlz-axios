import axios, { AxiosRequestConfig } from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.timeout = 5000;
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status < 599; 
}
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
const TOKEN = 'authorization'
const cancel_token = axios.CancelToken;
const source = cancel_token.source();
export class Http {
  private base_url?:string;
  private authorization_type:number;
  private authorization?:string;
  constructor(base_url?:string) {
    this.base_url = base_url
  }
  private request(opt:AxiosRequestConfig) {
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
    actual_opt.cancelToken = source.token;
    return axios.request(actual_opt)
  }
  public abort() {
    source.cancel('API abort.')
  }
  public get(url, configs?:AxiosRequestConfig) {
    return this.request({
      method: 'get',
      url,
      ...configs,
    });
  }
  public post(url, data, configs?:AxiosRequestConfig) {
    return this.request({
      method: 'post',
      url,
      data,
      ...configs,
    })
  }
  public put(url, data, configs?:AxiosRequestConfig) {
    return this.request({
      method: 'put',
      url,
      data,
      ...configs,
    })
  }
  public patch(url, data, configs?:AxiosRequestConfig) {
    return this.request({
      method: 'patch',
      url,
      data,
      ...configs,
    })
  }
  public delete(url, configs?:AxiosRequestConfig) {
    return this.request({
      method: 'delete',
      url,
      ...configs,
    })
  }
  public setToken(authorization_type:number, authorization:string = TOKEN) {
    this.authorization_type = authorization_type;
    this.authorization = authorization;
  }
  public req_interceptors = (resolve?:Function, reject?:Function) => {
    // Add a request interceptor
    axios.interceptors.request.use(function (config) {
      // Do something before request is sent
      resolve && resolve(config);
      return config;
    }, function (error) {
      // Do something with request error
      reject && reject(error);
      return Promise.reject(error);
    });
  }
  public res_interceptors = (resolve?:Function, reject?:Function) => {
    // Add a response interceptor
    axios.interceptors.response.use(function (response) {
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
