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
    const httpIns = new Http('https://www.example.com')
    
    httpIns.setAuthorizationTypeOrToken('mlz', 'token')
    httpIns.axiosIns.interceptors.request.use((config:any) => {
      expect(config.headers.authorization_type).toBe('mlz')
      expect(config.headers.authorization_token).toBe('token')
      done()
      return config
    })
    httpIns.post('/abc', {
      name: 'mlz-axios'
    })
    expect(httpIns.authorizationToken).toBe('token')
    expect(httpIns.authorizationType).toBe('mlz')
  })
  test('getInstances', () => {
    const httpIns1 = new Http('https://www.example.com')
    const httpIns2 = new Http(('https://www.baidu.com'))
    expect(Http.getInstances('https://www.example.com').defaults.baseURL).toBe('https://www.example.com')
    expect(Http.getInstances('https://www.baidu.com').defaults.baseURL).toBe('https://www.baidu.com')
  })
  test('setReqInterceptor', async (done) => {
    const httpIns = new Http('https://www.baidu.com')
    Http.setReqInterceptor((config:any) => {
      config.headers.authorization_token = 'test_token'
      return config
    })
    const res = await httpIns.get('/')
    expect(res.config.headers.authorization_token).toBe('test_token')
    done()
  })
  test('setResInterceptor', async (done) => {
    const httpIns = new Http('https://www.baidu.com')
    Http.setResInterceptor((res:any) => {
      res = {
        data: {
          name: 'helloWorld'
        }
      }
      return res
    })
    const res = await httpIns.get('/')
    expect(res.data).toEqual({name: 'helloWorld'})
    done()
  })
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