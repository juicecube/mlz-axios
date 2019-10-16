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
  private cancelToken: CancelTokenStatic = axios.CancelToken;
  private source: CancelTokenSource = this.cancelToken.source();
  private axiosIns: AxiosInstance;

  static authorizationTypeKey:string = 'Authorization';
  static authorizationTokenKey:string = 'authorization_type';
  static authorizationType:number = 3;
  static authorizationToken: string = "";
  static INSTANCES: { [key: string]: AxiosInstance } = {};

  constructor(baseUrl: string, config: AxiosRequestConfig = {}) {
    const axiosIns = axios.create({
      baseURL: baseUrl,
      ...DEFAULT_CONFIG,
      ...config
    });
    Http.INSTANCES[baseUrl] = axiosIns;
    this.axiosIns = axiosIns;
  }

  private request(opt: AxiosRequestConfig) {
    const _opt = Object.assign({}, opt);
    _opt.headers = {
      ..._opt.headers,
      [Http.authorizationTypeKey]: Http.authorizationType,
      [Http.authorizationTokenKey]: Http.authorizationToken
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
  static setAuthorizationTypeOrToken(typeKey:string, typeValue:number, tokenKey:string, tokenValue:string) {
    Http.authorizationTypeKey = typeKey;
    Http.authorizationTokenKey = tokenKey;
    Http.authorizationToken = tokenValue;
    Http.authorizationType = typeValue;
  }

  static getInstances(key:string) : AxiosInstance {
    return Http.INSTANCES[key];
  }

  static setReqInterceptor (resolve?:(config:AxiosRequestConfig) => AxiosRequestConfig, reject?:(error:any) => void, key?:string) {
    if(key) {
      const instance = Http.INSTANCES[key];
      instance.interceptors.request.use(resolve, reject);
    } else {
      for (let key in Http.INSTANCES) {
        const instance = Http.INSTANCES[key];
        instance.interceptors.request.use(resolve, reject);
      }
    }
  }

  static setResInterceptor (resolve?:(res:AxiosResponse) => AxiosResponse, reject?:(error) => any, key?:string) {
    if(key) {
      const instance = Http.INSTANCES[key];
      instance.interceptors.response.use(resolve, reject);
    } else {
      for (let key in Http.INSTANCES) {
        const instance = Http.INSTANCES[key];
        instance.interceptors.response.use(resolve, reject);
      }
    }
  }
}
