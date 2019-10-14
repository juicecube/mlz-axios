## 介绍
对axios做了二次封装，统一axios的配置
## 安装
使用npm
```
npm install mlz-axios
```
使用yarn
```
yarn add mlz-axios
```
## 默认axios配置
```
timeout: 5000
withCredentials: true
validateStatus: status => status >= 200 && status < 599
```
## 实例化
实例化可以传入baseUrl和默认配置
```
import Http from 'mlz-axios'
const httpIns = new Http(baseUrl:string, config:AxiosRequestConfig)
```
## 静态方法
### getInstances(key)
获取对应的实例
```
import Http from 'mlz-axios'
Http.getInstances('https://www.example.com')
```
### setReqInterceptor(resolve, reject)
设置全局请求拦截器
```
import Http from 'mlz-axios'
Http.setReqInterceptor((config) => {
  console.log(config)
}, (err) => {
  console.log(err)
})
```
### setResInterceptor(resolve, reject)
设置全局响应拦截器
```
import Http from 'mlz-axios'
Http.setResInterceptor((response) => {
  console.log(response)
}, (err) => {
  console.log(err)
})
```
## 实例方法
### setAuthorizationTypeOrToken(type, token)
设置authorizationToken和authorizationType
```
import Http from 'mlz-axios'
const httpIns = new Http('https://www.example.com')
httpIns.setAuthorizationTypeOrToken(1, 'token')
```
### get(url[, config])
```
import Http from 'mlz-axios'
const httpIns = new Http('https://www.example.com')
httpIns.get('/user')
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
```
### delete(url[, config])
```
import Http from 'mlz-axios'
const httpIns = new Http('https://www.example.com')
httpIns.delete('/user')
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
```
### post(url[, data[, config]])
```
import Http from 'mlz-axios'
const httpIns = new Http('https://www.example.com')
httpIns.post('/user', {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
```
### put(url[, data[, config]])
```
import Http from 'mlz-axios'
const httpIns = new Http('https://www.example.com')
httpIns.put('/user', {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
```
### patch(url[, data[, config]])
```
import Http from 'mlz-axios'
const httpIns = new Http('https://www.example.com')
httpIns.patch('/user', {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
```


