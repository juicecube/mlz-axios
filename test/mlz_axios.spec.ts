import Http from '../src/index'
// import {AxiosRequestConfig, AxiosResponse} from 'axios'
// import { getAjaxRequest } from './helper'

describe('instance', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('set_token', () => {
    const httpIns = new Http()
    httpIns.set_token_type('2')
    console.log(httpIns)
    expect(httpIns.authorization_type).toBe('2')

  })
  test('baseUrl', () => {
    const httpIns = new Http('https://api.example.com')
    expect(httpIns.base_url).toBe('https://api.example.com')
  })
})