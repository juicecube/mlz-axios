import axios, {
  AxiosRequestConfig,
  CancelTokenSource,
  AxiosPromise,
  AxiosResponse,
  AxiosInstance,
} from 'axios';

type TokenConfig = {
  authorizationTypeKey:string;
  authorizationTokenKey:string;
  authorizationTypeValue:number;
  authorizationTokenValue:string;
}

interface ReqInterceptor {
  resolve:(config:AxiosRequestConfig) => AxiosRequestConfig;
  reject:(error:any) => void;
}

interface ResInterceptor {
  resolve:(res:AxiosResponse) => AxiosResponse;
  reject:(error) => any;
}

const DEFAULT_CONFIG:AxiosRequestConfig = {
  timeout: 0,
  withCredentials: true,
  validateStatus: (status) => status >= 200 && status < 599,
};

export class Http {
  private isSetInstancesToken:boolean = false;

  public axiosIns:AxiosInstance;
  public source:CancelTokenSource = axios.CancelToken.source();
  public instanceTokenConfig:TokenConfig = {
    authorizationTypeKey: 'Authorization',
    authorizationTokenKey: 'authorization_type',
    authorizationTypeValue: 0,
    authorizationTokenValue: '',
  }

  static globalTokenConfig:TokenConfig = {
    authorizationTypeKey: 'Authorization',
    authorizationTokenKey: 'authorization_type',
    authorizationTypeValue: 0,
    authorizationTokenValue: '',
  }

  static globalHeaders = {};

  static INSTANCES:{ [key:string]:AxiosInstance } = {};
  static INSTANCES_REQUEST_INTERCEPTORS:{ [key:string]:ReqInterceptor } = {};
  static INSTANCES_RESPONSE_INTERCEPTORS:{ [key:string]:ResInterceptor } = {};
  static GLOBAL_REQUEST_INTERCEPTORS:ReqInterceptor = null;
  static GLOBAL_RESPONSE_INTERCEPTORS:ResInterceptor = null;

  constructor(baseUrl:string, config:AxiosRequestConfig = {}) {
    const axiosIns = axios.create({
      baseURL: baseUrl,
      ...DEFAULT_CONFIG,
      ...config,
    });
    Http.INSTANCES[baseUrl] = axiosIns;
    this.axiosIns = axiosIns;

    // 设置拦截器
    const requestInterceptor = Http.INSTANCES_REQUEST_INTERCEPTORS[baseUrl] || Http.GLOBAL_REQUEST_INTERCEPTORS;
    const responseInterceptor = Http.INSTANCES_RESPONSE_INTERCEPTORS[baseUrl] || Http.GLOBAL_RESPONSE_INTERCEPTORS;
    if (requestInterceptor) {
      this.axiosIns.interceptors.request.use(requestInterceptor.resolve, requestInterceptor.reject);
    }
    if (responseInterceptor) {
      this.axiosIns.interceptors.response.use(responseInterceptor.resolve, responseInterceptor.reject);
    }
  }

  // 设置单个实例的token与tokenType
  public setInstanceTokenConfig( instanceTokenConfig:Partial<TokenConfig>) {
    this.isSetInstancesToken = true;
    this.instanceTokenConfig = {
      ...this.instanceTokenConfig,
      ...instanceTokenConfig,
    };
  }

  private request(opt:AxiosRequestConfig) {

    const _opt = Object.assign({}, opt);
    if (this.isSetInstancesToken) {
      const { authorizationTypeValue, authorizationTokenValue, authorizationTypeKey, authorizationTokenKey } = this.instanceTokenConfig;
      if (authorizationTypeKey && authorizationTypeValue && authorizationTokenKey && authorizationTokenValue){
        _opt.headers = {
          [authorizationTypeKey]: authorizationTypeValue,
          [authorizationTokenKey]: authorizationTokenValue,
          ..._opt.headers,
        };
      }
    } else {
      const { authorizationTypeValue, authorizationTokenValue, authorizationTypeKey, authorizationTokenKey } = Http.globalTokenConfig;
      if (authorizationTypeKey && authorizationTypeValue && authorizationTokenKey && authorizationTokenValue) {
        _opt.headers = {
          [authorizationTypeKey]: authorizationTypeValue,
          [authorizationTokenKey]: authorizationTokenValue,
          ..._opt.headers,
        };
      }
      if (Http.globalHeaders) {
        console.log(_opt.headers);
        _opt.headers = { ..._opt.headers, ...Http.globalHeaders };
      }
    }
    _opt.cancelToken = this.source.token;
    return this.axiosIns.request(_opt);
  }

  public abort() {
    this.source.cancel('API abort.');
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
    });
  }
  public put(url:string, data?:any, configs?:AxiosRequestConfig):AxiosPromise {
    return this.request({
      method: 'put',
      url,
      data,
      ...configs,
    });
  }
  public patch(url:string, data?:any, configs?:AxiosRequestConfig):AxiosPromise {
    return this.request({
      method: 'patch',
      url,
      data,
      ...configs,
    });
  }
  public delete(url:string, configs?:AxiosRequestConfig):AxiosPromise {
    return this.request({
      method: 'delete',
      url,
      ...configs,
    });
  }

  static setGlobalHeaders(data:{[key:string]:any}) {
    Http.globalHeaders = data;
  }

  // 全局设置token与tokenType
  static setGlobalTokenConfig(globalTokenConfig:Partial<TokenConfig>) {
    Http.globalTokenConfig = {
      ...Http.globalTokenConfig,
      ...globalTokenConfig,
    };
  }

  // 获取相对应的实例
  static getInstances(key:string):AxiosInstance {
    return Http.INSTANCES[key];
  }

  // 设置请求拦截器
  static setReqInterceptor(
    resolve?:(config:AxiosRequestConfig) => AxiosRequestConfig,
    reject?:(error:any) => void,
    url?:string,
  ) {
    if (url) {
      // 单个实例
      Http.INSTANCES_REQUEST_INTERCEPTORS[url] = {
        resolve,
        reject,
      };
    } else {
      // 全局
      Http.GLOBAL_REQUEST_INTERCEPTORS = {
        resolve,
        reject,
      };
    }
  }

  // 设置响应拦截器
  static setResInterceptor(
    resolve?:(res:AxiosResponse) => AxiosResponse,
    reject?:(error) => any,
    url?:string,
  ) {
    if (url) {
      // 实例
      Http.INSTANCES_RESPONSE_INTERCEPTORS[url] = {
        resolve,
        reject,
      };
    } else {
      // 全局
      Http.GLOBAL_RESPONSE_INTERCEPTORS = {
        resolve,
        reject,
      };
    }
  }
}
