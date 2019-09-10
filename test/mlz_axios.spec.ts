import Http from '../src/index'
import {axiosIns} from '../src/mlz_axios'
describe('class Http', () => {
  test('baseUrl', () => {
    const http = new Http('https://www.example.com')
    expect(http.baseUrl).toBe('https://www.example.com')
  })
  test('setToken', () => {
    Http.setToken(1, '123')
    expect(localStorage.__STORE__[Http.tokenKey]).toBe(JSON.stringify({
      'authorizationType': 1,
      'authorization': '123'
    }))
  })
  test('axios instance default config', () => {
    const defaultConfig = axiosIns.defaults
    expect(defaultConfig.timeout).toBe(5000)
    expect(defaultConfig.withCredentials).toBeTruthy()
    expect(defaultConfig.validateStatus(199)).toBeFalsy()
    expect(defaultConfig.validateStatus(600)).toBeFalsy()
    expect(defaultConfig.validateStatus(400)).toBeTruthy()
    expect(defaultConfig.headers.post['Content-Type']).toBe('application/x-www-form-urlencoded')
  })
  test('setDefaultConfig', () => {
    Http.setDefaultConf({
      timeout: 6000,
      validateStatus: (status) => status < 200,
      headers: {
        post: {
          'Content-Type': 'application/json'
        }
      }
    })
    const defaultConfig = axiosIns.defaults
    expect(defaultConfig.timeout).toBe(6000)
    expect(defaultConfig.withCredentials).toBeTruthy()
    expect(defaultConfig.validateStatus(200)).toBeFalsy()
    expect(defaultConfig.validateStatus(199)).toBeTruthy()
    expect(defaultConfig.headers.post['Content-Type']).toBe('application/json')
  })
  test('request:post', (done) => {
    Http.setReqInterceptor((config) => {
      expect.assertions(4);
      expect(config.url).toBe('/abc')
      expect(config.method).toBe('post')
      expect(config.data).toEqual({
        name: 'mlz-axios'
      })
      expect(config.headers.post['Content-Type']).toBe('application/x-www-form-urlencoded')
      done()
    }, (error) => {
      console.error(error)
    })
    const http = new Http('https://www.abc.com')
    http.post('/abc', {
      name: 'mlz-axios'
    })
  })
})