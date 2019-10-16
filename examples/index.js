import Http from "../src/index";
const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0NTAsInVzZXJfdHlwZSI6ImFkbWluIiwianRpIjoiNjVlMTY1NzEtOTliNy00YzBiLTg0ODktYjhiYzNkNTE2ZGY3IiwiaWF0IjoxNTcxMDQyNzM2fQ.cHA8rBDMZFj7P1a6UWKjINtsYOOt77ROAhK0kKZBx6Y'
const type = 3;
const httpIns = new Http("https://backend-dev.codemao.cn");
const httpIns2 = new Http("https://dev-api-crm-codemaster.codemao.cn");

Http.setAuthorizationTypeOrToken("authorization_type", type, "Authorization", token);

Http.setReqInterceptor(
  config => {
    console.log("请求前config", config);
    return config;
  },
  err => {
    console.log("请求前err", err);
    return Promise.reject(err);
  },
  "https://backend-dev.codemao.cn"
);
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

httpIns
  .post("/tiger/lesson/ticket/give-out", {
    amount: "1",
    student_id: "1000824602",
    ticket_type: "101"
  })
  .then(res => {
    console.log(res.data);
  })
  .catch(err => {
    console.log(err);
  });

httpIns2.get("/admin/crm/head-teachers/statistics/card", { params: { card_type: 4 } }).then(res => {
  console.log(res.data);
});
