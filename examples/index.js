import Http from '../src/index'
Http.setToken(2, 'aaa')
// Http.setDefaultConf({
//   headers: {
//     post: 'application/json'
//   }
// })
Http.setReqInterceptor((config) => {
  console.log('请求前config', config)
}, (err) => {
  console.log('请求前err', err)
})
Http.setResInterceptor((res) => {
  console.log('请求后res', res)
}, (err) => {
  console.log('请求前err', err)
})
const httpIns = new Http('http://localhost:8080')
httpIns.post('/base/post',
  {
    a: 1,
    b: 2
  },
).then((res) => {
  console.log(res)
})

const httpIns1 = new Http('http://localhost:9000')
httpIns1.get('/error/timeout').then((res) => {
  console.log(res)
})
httpIns.post('/base/post',
  {
    a: 1,
    b: 2
  },
).then((res) => {
  console.log(res)
})