/* eslint-disable @typescript-eslint/camelcase */
import Http from '../src/index';
const token = 'xxxxx';
const type = 3;

// Http.setAuthorizationTypeOrToken("authorization_type", type, "Authorization", token);
Http.setReqInterceptor(
  (config) => {
    config.headers.Authorization = 'xxxx_token';
    config.headers.authorization_type = 4;
    return config;
  },
  (err) => Promise.reject(err),
  'https://xxx-xxx-xxxx-xxxxx.xxxx.xx',
);

Http.setReqInterceptor(
  (config) => {
    config.headers.Authorization = token;
    config.headers.authorization_type = 3;
    return config;
  },
  (err) => Promise.reject(err),
);

console.log('INSTANCES_REQUEST_INTERCEPTORS', Http.INSTANCES_REQUEST_INTERCEPTORS);
console.log('GLOBAL_REQUEST_INTERCEPTORS', Http.GLOBAL_REQUEST_INTERCEPTORS);

// Http.setResInterceptor(
//   res => {
//     console.log("https://xxx-xxx-xxxx-xxxxx.xxxx.xx");
//   },
//   err => {
//     return Promise.reject(err);
//   },
//   "https://xxx-xxx-xxxx-xxxxx.xxxx.xx"
// );

// Http.setResInterceptor(
//   res => {
//     console.log("common");
//   },
//   err => {
//     return Promise.reject(err);
//   }
// );

console.log(Http.INSTANCES_RESPONSE_INTERCEPTORS);

const httpIns = new Http('https://xxx-xxx.xxx.xx');
const httpIns2 = new Http('https://xxx-xxx-xxxx-xxxxx.xxxx.xx');
const httpIns3 = new Http('https://xxx-xxx-xxxx-xxxxx.xxxx.xx');

httpIns
  .post('/xxx/xxx/xxx/xxx', {
    amount: '1',
    student_id: '1000824602',
    ticket_type: '101',
  })
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  .then((res) => {})
  .catch((err) => {
    console.log(err);
  });

// httpIns2.setInstancesAuthorizationTypeOrToken("type", 4, "token", "Bearer");

// eslint-disable-next-line promise/catch-or-return
httpIns2
  .get('/xxxx/xxxx/xxx/xxx/xxx', { params: { card_type: 4 } })
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  .then((res) => {});

// httpIns3.setInstancesAuthorizationTypeOrToken("type", 1, "token", "xxx");
httpIns3
  .get('/xxx/xxx')
  .then((res) => {
    console.log('res: ', res);
    if (/^2/.test(res.status)) {
      console.log('object');
    } else {
      console.log(res.data.error_code);
    }
  })
  .catch((err) => {
    console.log(err);
  });
