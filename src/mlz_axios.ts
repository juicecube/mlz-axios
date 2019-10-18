import axios, {
  AxiosRequestConfig,
  CancelTokenStatic,
  CancelTokenSource,
  AxiosPromise,
  AxiosResponse,
  AxiosInstance
} from "axios";

const DEFAULT_CONFIG: AxiosRequestConfig = {
  timeout: 5000,
  withCredentials: true,
  validateStatus: status => status >= 200 && status < 599
};

export class Http {
  private isSetInstancesToken: boolean = false;

  public cancelToken: CancelTokenStatic = axios.CancelToken;
  public axiosIns: AxiosInstance;
  public source: CancelTokenSource = this.cancelToken.source();
  public authorizationTypeKey: string = "Authorization";
  public authorizationTokenKey: string = "authorization_type";
  public authorizationTypeValue: number;
  public authorizationTokenValue: string = "";

  static authorizationTypeKey: string = "Authorization";
  static authorizationTokenKey: string = "authorization_type";
  static authorizationTypeValue: number;
  static authorizationTokenValue: string = "";
  static INSTANCES: { [key: string]: AxiosInstance } = {};
  static INSTANCES_REQUEST_INTERCEPTORS: { [key: string]: number } = {};
  static INSTANCES_RESPONSE_INTERCEPTORS: { [key: string]: number } = {};

  constructor(baseUrl: string, config: AxiosRequestConfig = {}) {
    const axiosIns = axios.create({
      baseURL: baseUrl,
      ...DEFAULT_CONFIG,
      ...config
    });
    Http.INSTANCES[baseUrl] = axiosIns;
    this.axiosIns = axiosIns;
  }

  // 设置单个实例的token与tokenType
  public setInstancesAuthorizationTypeOrToken(
    typeKey: string,
    typeValue: number,
    tokenKey: string,
    tokenValue: string
  ) {
    this.isSetInstancesToken = true;
    this.authorizationTypeKey = typeKey;
    this.authorizationTokenKey = tokenKey;
    this.authorizationTokenValue = tokenValue;
    this.authorizationTypeValue = typeValue;
  }

  private request(opt: AxiosRequestConfig) {
    const _opt = Object.assign({}, opt);
    if (this.isSetInstancesToken) {
      _opt.headers = {
        ..._opt.headers,
        [this.authorizationTypeKey]: this.authorizationTypeValue,
        [this.authorizationTokenKey]: this.authorizationTokenValue
      };
    } else {
      _opt.headers = {
        ..._opt.headers,
        [Http.authorizationTypeKey]: Http.authorizationTypeValue,
        [Http.authorizationTokenKey]: Http.authorizationTokenValue
      };
    }
    _opt.cancelToken = this.source.token;
    return this.axiosIns.request(_opt);
  }

  public abort() {
    this.source.cancel("API abort.");
  }
  public get(url: string, configs?: AxiosRequestConfig) : AxiosPromise {
    return this.request({
      method: "get",
      url,
      ...configs
    });
  }
  public post(url: string, data?: any, configs?: AxiosRequestConfig): AxiosPromise {
    return this.request({
      method: "post",
      url,
      data,
      ...configs
    });
  }
  public put(url: string, data?: any, configs?: AxiosRequestConfig): AxiosPromise {
    return this.request({
      method: "put",
      url,
      data,
      ...configs
    });
  }
  public patch(url: string, data?: any, configs?: AxiosRequestConfig): AxiosPromise {
    return this.request({
      method: "patch",
      url,
      data,
      ...configs
    });
  }
  public delete(url: string, configs?: AxiosRequestConfig): AxiosPromise {
    return this.request({
      method: "delete",
      url,
      ...configs
    });
  }

  // 全局设置token与tokenType
  static setAuthorizationTypeOrToken(
    typeKey: string,
    typeValue: number,
    tokenKey: string,
    tokenValue: string
  ) {
    Http.authorizationTypeKey = typeKey;
    Http.authorizationTokenKey = tokenKey;
    Http.authorizationTokenValue = tokenValue;
    Http.authorizationTypeValue = typeValue;
  }

  // 获取相对应的实例
  static getInstances(key: string): AxiosInstance {
    return Http.INSTANCES[key];
  }

  // 设置请求拦截器
  static setReqInterceptor(
    resolve?: (config: AxiosRequestConfig) => AxiosRequestConfig,
    reject?: (error: any) => void,
    url?: string
  ) {
    if (url) {
      const interceptorsId = Http.INSTANCES_REQUEST_INTERCEPTORS[url];
      const instance = Http.INSTANCES[url];
      if (interceptorsId !== undefined) {
        instance.interceptors.request.eject(interceptorsId);
      }
      const CreateInterceptorsId = instance.interceptors.request.use(resolve, reject);
      Http.INSTANCES_REQUEST_INTERCEPTORS[url] = CreateInterceptorsId;
    } else {
      for (let key in Http.INSTANCES) {
        if (Http.INSTANCES_REQUEST_INTERCEPTORS[key] === undefined) {
          const instance = Http.INSTANCES[key];
          const interceptorsId = instance.interceptors.request.use(resolve, reject);
          Http.INSTANCES_REQUEST_INTERCEPTORS[key] = interceptorsId;
        }
      }
    }
  }

  // 设置响应拦截器
  static setResInterceptor(
    resolve?: (res: AxiosResponse) => AxiosResponse,
    reject?: (error) => any,
    url?: string
  ) {
    if (url) {
      const interceptorsId = Http.INSTANCES_RESPONSE_INTERCEPTORS[url];
      const instance = Http.INSTANCES[url];
      if (interceptorsId !== undefined) {
        instance.interceptors.response.eject(interceptorsId);
      }
      const CreateInterceptorsId = instance.interceptors.response.use(resolve, reject);
      Http.INSTANCES_RESPONSE_INTERCEPTORS[url] = CreateInterceptorsId;
    } else {
      for (let key in Http.INSTANCES) {
        if (Http.INSTANCES_RESPONSE_INTERCEPTORS[key] === undefined) {
          const instance = Http.INSTANCES[key];
          const CreateInterceptorsId = instance.interceptors.response.use(resolve, reject);
          Http.INSTANCES_RESPONSE_INTERCEPTORS[key] = CreateInterceptorsId;
        }
      }
    }
  }
}
