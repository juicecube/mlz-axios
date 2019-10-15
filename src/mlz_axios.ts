import axios, { 
  AxiosRequestConfig, 
  CancelTokenStatic, 
  CancelTokenSource,
  AxiosPromise,
  AxiosResponse,
  AxiosInstance
} from 'axios';

const DEFAULT_CONFIG:AxiosRequestConfig = {
  timeout: 5000,
  withCredentials: true,
  validateStatus: (status) => status >= 200 && status < 599,
}

export class Http {
  authorizationType;
  authorizationToken:string = '';
  cancelToken:CancelTokenStatic = axios.CancelToken;
  source:CancelTokenSource = this.cancelToken.source();
  public axiosIns:AxiosInstance;
  static INSTANCES:{[key:string]: AxiosInstance} = {};
  constructor(baseUrl:string, config:AxiosRequestConfig = {}) {
    const axiosIns = axios.create({
      baseURL: baseUrl,
      ...DEFAULT_CONFIG,
      ...config,
    });
    Http.INSTANCES[baseUrl] = axiosIns;
    this.axiosIns = axiosIns;
  }
  setAuthorizationTypeOrToken(type, token) {
    this.authorizationToken = token;
    this.authorizationType = type;
  }
  public request(opt:AxiosRequestConfig) {
    const _opt = Object.assign(null, opt);
    _opt.headers = {
      ..._opt.headers,
      authorization_type: this.authorizationType,
      authorization_token: this.authorizationToken,
    };
    _opt.cancelToken = this.source.token;
    return this.axiosIns.request(_opt);
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
  public post(url:string, data?:any, configs?:AxiosRequestConfig) : AxiosPromise {
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
  public put(url:string, data?:any, configs?:AxiosRequestConfig) : AxiosPromise {
    return this.request({
      method: 'put',
      url,
      data,
      ...configs,
    })
  }
  public patch(url:string, data?:any, configs?:AxiosRequestConfig) : AxiosPromise {
    return this.request({
      method: 'patch',
      url,
      data,
      ...configs,
    })
  }
  public delete(url:string, configs?:AxiosRequestConfig) : AxiosPromise {
    return this.request({
      method: 'delete',
      url,
      ...configs,
    })
  }
  // 下面是静态方法
  static getInstances(key:string) : AxiosInstance {
    return Http.INSTANCES[key];
  }
  static setReqInterceptor (resolve?:(config:AxiosRequestConfig) => AxiosRequestConfig, reject?:(error:any) => void) {
    for (let key in Http.INSTANCES) {
      const instance = Http.INSTANCES[key];
      instance.interceptors.request.use(resolve, reject);
    }
  }
  static setResInterceptor (resolve?:(res:AxiosResponse) => AxiosResponse, reject?:(error) => any) {
    for (let key in Http.INSTANCES) {
      const instance = Http.INSTANCES[key];
      instance.interceptors.response.use(resolve, reject);
    }
  }
}

