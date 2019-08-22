const { Http, req_interceptors, res_interceptors } = require('./index')
let api = new Http()
api.req_interceptors(() => {
  console.log('请求前')
})
api.res_interceptors(() => {
  console.log('响应前')
}, (err) => {
  console.error('响应出错', err)
} )
api.get('https://www.baidu.com').then((res) => {
  // console.log(res)
}).catch(err => {
  console.log(err)
} );

