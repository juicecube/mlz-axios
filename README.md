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
axios.defaults.timeout = 5000
axios.defaults.withCredentials = true
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status < 599; 
}
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
```
## 实例化
实例化可以传入baseUrl
```
import Http from 'mlz-axios'
const httpIns = new Http('https://www.example.com')
```
## 静态方法
### setToken(tokenType, tokenVal)
设置token，token信息存放在localstorage
```
import Http from 'mlz-axios'
Http.setToken(1, '123')
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
### setReqInterceptor(resolve, reject)
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
### get(url[, config])
```
import Http from 'mlz-axios'
const httpIns = new Http()
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
const httpIns = new Http()
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
const httpIns = new Http()
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
const httpIns = new Http()
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
const httpIns = new Http()
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


