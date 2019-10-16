import mergeConfig from '../../src/utils/merge_config'
import axios from 'axios'

describe('mergeConfig', () => {
  const defaults = axios.defaults
  test('should accept undefined for second argument', () => {
    expect(mergeConfig(defaults, undefined)).toEqual(defaults)
  })
  test('should accept object for second argument', () => {
    expect(mergeConfig(defaults, {})).toEqual(defaults)
  })
  test('should not leave references', () => {
    const merged = mergeConfig(defaults, {})
    expect(merged).not.toBe(defaults)
    expect(merged.headers).not.toBe(defaults.headers)
  })
  test('should allow set request options', () => {
    const config = {
      url: '__sample url__',
      params: '__sample params__',
      data: { foo: true }
    }
    const merged = mergeConfig(defaults, config)
    expect(merged.url).toBe(config.url)
    expect(merged.params).toBe(config.params)
    expect(merged.data).toEqual(config.data)
  })
  test('should not inherit request options', () => {
    const localConfig = {
      url: '__sample url__',
      params: '__sample params__',
      data: { foo: true }
    }
    const merged = mergeConfig(localConfig, {})
    expect(merged.url).toBeUndefined()
    expect(merged.params).toBeUndefined()
    expect(merged.data).toBeUndefined()
  })
  test('should return default headers if pass config2 with undefined', () => {
    expect(mergeConfig(
      {
        headers: 'x-mock-header',
      },
      undefined
    )).toEqual({headers: 'x-mock-header'})
  })
  test('should return custom headers if pass config2 with not undefined', () => {
    expect(mergeConfig(
      {
        headers: 'x-mock-header',
      },
      {
        headers: 'x-mock-header1'
      }
    )).toEqual({headers: 'x-mock-header1'})
  })
  test('should return custom headers if pass config2 with plain object', () => {
    expect(mergeConfig(
      {
        headers: {
          methods: 'get',
          withCredentials: false
        },
      },
      {
        headers: {
          withCredentials: true
        }
      }
    )).toEqual({
      headers: {
        methods: 'get',
        withCredentials: true
      },
    })
  })
  test('should allow setting other options', () => {
    const merged = mergeConfig(defaults, {
      timeout: 123
    })
    expect(merged.timeout).toBe(123)
  })
})
