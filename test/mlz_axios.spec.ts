import Http from '../src/index'

describe('class Http', () => {
  test('default config', () => {
    const httpIns = new Http('https://www.example.com')
    expect(httpIns.axiosIns.defaults.timeout).toBe(5000)
    expect(httpIns.axiosIns.defaults.withCredentials).toBeTruthy()
    expect(httpIns.axiosIns.defaults.validateStatus(199)).toBeFalsy()
    expect(httpIns.axiosIns.defaults.validateStatus(200)).toBeTruthy()
    expect(httpIns.axiosIns.defaults.validateStatus(599)).toBeFalsy()
  })
  test('baseUrl', () => {
    const httpIns = new Http('https://www.example.com')
    expect(httpIns.axiosIns.defaults.baseURL).toBe('https://www.example.com')
  })
  test('baseUrl can overwrite by custom config', () => {
    const httpIns = new Http('https://www.example.com', {
      baseURL: 'https://www.baidu.com'
    })
    expect(httpIns.axiosIns.defaults.baseURL).toBe('https://www.baidu.com')
  })
  test('custom config', () => {
    const httpIns = new Http('https://www.example.com', {
      timeout: 6000,
      withCredentials: false
    })
    expect(httpIns.axiosIns.defaults.timeout).toBe(6000)
    expect(httpIns.axiosIns.defaults.withCredentials).toBeFalsy()
  })
  test('setAuthorizationTypeOrToken', (done) => {
    Http.setAuthorizationTypeOrToken('authorization_type', 3 , 'Authorization', 'token')

    const httpIns = new Http('https://www.example.com')
    httpIns.axiosIns.interceptors.request.use((config:any) => {
      expect(config.headers.authorization_type).toBe(3)
      expect(config.headers.Authorization).toBe('token')
      done()
      return config
    })
    httpIns.post('/abc', {
      name: 'mlz-axios'
    })
    expect(Http.authorizationTokenValue).toBe('token')
    expect(Http.authorizationTypeValue).toBe(3)
  })
  test('setInstancesAuthorizationTypeOrToken', (done) => {
    Http.setAuthorizationTypeOrToken('authorization_type', 3 , 'Authorization', 'token')
    const httpIns = new Http('https://www.example.com')
    httpIns.setInstancesAuthorizationTypeOrToken('authorization_type', 4 , 'Authorization', 'instances_token')

    httpIns.axiosIns.interceptors.request.use((config:any) => {
      expect(config.headers.authorization_type).toBe(4)
      expect(config.headers.Authorization).toBe('instances_token')
      done()
      return config
    })
    httpIns.post('/abc', {
      name: 'mlz-axios'
    })
    expect(httpIns.authorizationTokenValue).toBe('instances_token')
    expect(httpIns.authorizationTypeValue).toBe(4)
  })
  test('getInstances', () => {
    const httpIns1 = new Http('https://www.example.com')
    const httpIns2 = new Http(('https://www.baidu.com'))
    expect(Http.getInstances('https://www.example.com').defaults.baseURL).toBe('https://www.example.com')
    expect(Http.getInstances('https://www.baidu.com').defaults.baseURL).toBe('https://www.baidu.com')
  })
  test('setReqInterceptor', async (done) => {
    jest.setTimeout(10000)
    const httpIns = new Http('https://www.baidu.com')
    const httpIns1 = new Http('https://www.qq.com')

    Http.setReqInterceptor((config:any) => {
      config.headers.Authorization = 'test_token'
      return config
    })
    Http.setReqInterceptor(
      (config: any) => {
        config.headers.Authorization = "codemao_token";
        return config;
      },
      err => {
        return Promise.reject(err);
      },
      'https://www.qq.com'
    );
    Http.setReqInterceptor(
      (config: any) => {
        config.headers.Authorization = "codemao_token1";
        return config;
      },
      err => {
        return Promise.reject(err);
      },
      'https://www.aa.com'
    );
    Http.setReqInterceptor((config:any) => {
      config.headers.Authorization = 'test_token'
      return config
    })
    const res = await httpIns.get('/')
    const res1 = await httpIns1.get('/')

    expect(res.config.headers.Authorization).toBe('test_token')
    expect(res1.config.headers.Authorization).toBe('codemao_token')
    done()
  })
  test("setResInterceptor", async done => {
    jest.setTimeout(10000)
    const httpIns = new Http("https://www.baidu.com");
    const httpIns1 = new Http("https://www.qq.com");

    Http.setResInterceptor((res: any) => {
      res = {
        data: {
          name: "helloWorld"
        }
      };
      return res;
    });
    Http.setResInterceptor(
      (res: any) => {
        res = {
          data: {
            name: "hello"
          }
        };
        return res;
      },
      err => {
        return Promise.reject(err);
      },
      "https://www.qq.com"
    );
    Http.setResInterceptor(
      (res: any) => {
        res = {
          data: {
            name: "hello world 1"
          }
        };
        return res;
      },
      err => {
        return Promise.reject(err);
      },
      "https://www.aa.com"
    );
    Http.setResInterceptor((res: any) => {
      res = {
        data: {
          name: "helloWorld"
        }
      };
      return res;
    });
    const res = await httpIns.get("/");
    const res1 = await httpIns1.get("/");

    expect(res.data).toEqual({ name: "helloWorld" });
    expect(res1.data).toEqual({ name: "hello" });

    done();
  });
  test('post', (done) => {
    const httpIns = new Http('https://www.example.com')
    httpIns.axiosIns.interceptors.request.use((config:any) => {
      expect(config.method).toBe('post')
      done()
      return config
    })
    httpIns.post('/abc', {
      name: 'mlz-axios'
    })
  })
  test('put', (done) => {
    const httpIns = new Http('https://www.example.com')
    httpIns.axiosIns.interceptors.request.use((config:any) => {
      expect(config.method).toBe('put')
      done()
      return config
    })
    httpIns.put('/abc', {
      name: 'mlz-axios'
    })
  })
  test('patch', (done) => {
    const httpIns = new Http('https://www.example.com')
    httpIns.axiosIns.interceptors.request.use((config:any) => {
      expect(config.method).toBe('patch')
      done()
      return config
    })
    httpIns.patch('/abc', {
      name: 'mlz-axios'
    })
  })
  test('delete', (done) => {
    const httpIns = new Http('https://www.example.com')
    httpIns.axiosIns.interceptors.request.use((config:any) => {
      expect(config.method).toBe('delete')
      done()
      return config
    })
    httpIns.delete('/abc')
  })
  test('get', (done) => {
    const httpIns = new Http('https://www.example.com')
    httpIns.axiosIns.interceptors.request.use((config:any) => {
      expect(config.method).toBe('get')
      done()
      return config
    })
    httpIns.get('/abc')
  })
  test('abort', () => {
    const httpIns = new Http('https://www.baidu.com')
    httpIns.get('/')
    httpIns.abort()
    expect(httpIns.source.token.reason.message).toBe('API abort.')
  })
})