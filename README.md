[![Build Status](https://travis-ci.org/juicecube/mlz-axios.svg?branch=master)](https://travis-ci.org/juicecube/mlz-axios)
[![codecov](https://codecov.io/gh/juicecube/mlz-axios/branch/master/graph/badge.svg)](https://codecov.io/gh/juicecube/mlz-axios)

## 介绍

对 axios 做了二次封装，统一 axios 的配置

## 安装

使用 npm

```
npm install mlz-axios
```

使用 yarn

```
yarn add mlz-axios
```

## 默认 axios 配置

```js
timeout: 5000;
withCredentials: true;
validateStatus: status => status >= 200 && status < 599;
```

## 实例化

实例化可以传入 baseUrl 和默认配置

```js
import Http from 'mlz-axios'
const httpIns = new Http(baseUrl:string, config:AxiosRequestConfig)
```

## 静态方法

```js
getInstances(key:string)
```

获取对应的实例

```js
import Http from "mlz-axios";
Http.getInstances("https://www.example.com");
```

全局设置token与tokenType
```js
setAuthorizationTypeOrToken(typeKey:string, typeValue:number, tokenKey:string, tokenValue:string)
```

```js
setReqInterceptor (resolve?:(config:AxiosRequestConfig) => AxiosRequestConfig, reject?:(error:any) => void, url?:string)
```

设置全局请求拦截器

```js
import Http from "mlz-axios";
Http.setReqInterceptor(
  config => {
    console.log(config);
  },
  err => {
    console.log(err);
  }
);
```

设置单个实例请求拦截器

```js
Http.setReqInterceptor(
  config => {
    console.log("请求前config", config);
    return config;
  },
  err => {
    console.log("请求前err", err);
    return Promise.reject(err);
  },
  "https://xxx.xxx.com"
);
```

```js
setResInterceptor (resolve?:(res:AxiosResponse) => AxiosResponse, reject?:(error) => any, url?:string)
```

设置全局响应拦截器

```js
Http.setResInterceptor(
  res => {
    console.log("请求后res", res);
    return res;
  },
  err => {
    console.log("请求后err", err);
    return Promise.reject(err);
  }
);
```

设置单个实例响应拦截器

```js
Http.setResInterceptor(
  res => {
    console.log("请求后res", res);
    return res;
  },
  err => {
    console.log("请求后err", err);
    return Promise.reject(err);
  },
  "https://xxx.xxx.com"
);
```

## 实例方法

```js
setInstancesAuthorizationTypeOrToken(typeKey:string, typeValue:number, tokenKey:string, tokenValue:string)
```

设置实例的 authorizationTokenToken 和 authorizationType

```js
import Http from "mlz-axios";
const httpIns = new Http('https://xxx.xxx.com')
const token = "xxx";
const type = 3;
httpIns.setInstancesAuthorizationTypeOrToken("authorization_type", type, "Authorization", token);
```

### get(url[, config])

```js
import Http from "mlz-axios";
const httpIns = new Http("https://www.example.com");
httpIns
  .get("/user")
  .then(function(response) {
    // handle success
    console.log(response);
  })
  .catch(function(error) {
    // handle error
    console.log(error);
  })
  .finally(function() {
    // always executed
  });
```

### delete(url[, config])

```js
import Http from "mlz-axios";
const httpIns = new Http("https://www.example.com");
httpIns
  .delete("/user")
  .then(function(response) {
    // handle success
    console.log(response);
  })
  .catch(function(error) {
    // handle error
    console.log(error);
  })
  .finally(function() {
    // always executed
  });
```

### post(url[, data[, config]])

```js
import Http from "mlz-axios";
const httpIns = new Http("https://www.example.com");
httpIns
  .post("/user", {
    firstName: "Fred",
    lastName: "Flintstone"
  })
  .then(function(response) {
    // handle success
    console.log(response);
  })
  .catch(function(error) {
    // handle error
    console.log(error);
  })
  .finally(function() {
    // always executed
  });
```

### put(url[, data[, config]])

```js
import Http from "mlz-axios";
const httpIns = new Http("https://www.example.com");
httpIns
  .put("/user", {
    firstName: "Fred",
    lastName: "Flintstone"
  })
  .then(function(response) {
    // handle success
    console.log(response);
  })
  .catch(function(error) {
    // handle error
    console.log(error);
  })
  .finally(function() {
    // always executed
  });
```

### patch(url[, data[, config]])

```js
import Http from "mlz-axios";
const httpIns = new Http("https://www.example.com");
httpIns
  .patch("/user", {
    firstName: "Fred",
    lastName: "Flintstone"
  })
  .then(function(response) {
    // handle success
    console.log(response);
  })
  .catch(function(error) {
    // handle error
    console.log(error);
  })
  .finally(function() {
    // always executed
  });
```

## 例子
```js
import Http from "mlz-axios";

const token = localStorage.getItem('authorization')
const AUTHORIZATION_TYPE = 3

// 全局设置token与tokenType
Http.setAuthorizationTypeOrToken('authorization_type', AUTHORIZATION_TYPE, 'Authorization', token)

const httpIns = new Http('https://xxx.aaa.com');
const httpIns2 = new Http('https://xxx.bbb.com');
const httpIns3 = new Http('https://xxx.ccc.com');

const httpIns2Token = localStorage.getItem('authorization_httpIns2')
const AUTHORIZATION_HTTPINS_2_TYPE = 4

// 设置单个实例的token与tokenType
httpIns2.setInstancesAuthorizationTypeOrToken('authorization_type', AUTHORIZATION_HTTPINS_2_TYPE, 'Authorization', httpIns2Token)

//对单个实例设置请求拦截器
Http.setReqInterceptor(
  config => {
    console.log(config)
  },
  err => {
    return Promise.reject(err);
  },
  'https://xxx.aaa.com'
);

httpIns
  .post("/xxx/xxx/xxx", {
    id: "xxx",
  })
  .then(res => {})
  .catch(err => {
    console.log(err);
  });

httpIns2
  .get("/xxx/xxx/xxx", { params: { id: 1 } })
  .then(res => {});

httpIns3
  .get("/xxx/xxxx")
  .then(res => {
    if (/^2/.test(res.status)) {
      console.log(res.data);
    } else {
      console.log(res.data.error_code);
    }
  })
  .catch(err => {
    console.log(err);
  });
```