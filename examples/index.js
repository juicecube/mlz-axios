import Http from "../src/index";
const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0NTAsInVzZXJfdHlwZSI6ImFkbWluIiwianRpIjoiNjVlMTY1NzEtOTliNy00YzBiLTg0ODktYjhiYzNkNTE2ZGY3IiwiaWF0IjoxNTcxMDQyNzM2fQ.cHA8rBDMZFj7P1a6UWKjINtsYOOt77ROAhK0kKZBx6Y";
const type = 3;
const httpIns = new Http("https://backend-dev.codemao.cn");
const httpIns2 = new Http("https://dev-api-crm-codemaster.codemao.cn");
const httpIns3 = new Http("https://dev-api-teaching-codemaster.codemao.cn");

// Http.setAuthorizationTypeOrToken("authorization_type", type, "Authorization", token);
Http.setReqInterceptor(
  config => {
    config.headers.Authorization = "codemao_token";
    config.headers.authorization_type = 4;
    return config;
  },
  err => {
    return Promise.reject(err);
  },
  "https://dev-api-teaching-codemaster.codemao.cn"
);

Http.setReqInterceptor(
  config => {
    config.headers.Authorization = token;
    config.headers.authorization_type = 3;
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

console.log(Http.INSTANCES_REQUEST_INTERCEPTORS);

Http.setResInterceptor(
  res => {
    console.log("https://dev-api-teaching-codemaster.codemao.cn");
  },
  err => {
    return Promise.reject(err);
  },
  "https://dev-api-teaching-codemaster.codemao.cn"
);

Http.setResInterceptor(
  res => {
    console.log("common");
  },
  err => {
    return Promise.reject(err);
  }
);

console.log(Http.INSTANCES_RESPONSE_INTERCEPTORS);

httpIns
  .post("/tiger/lesson/ticket/give-out", {
    amount: "1",
    student_id: "1000824602",
    ticket_type: "101"
  })
  .then(res => {})
  .catch(err => {
    console.log(err);
  });

// httpIns2.setInstancesAuthorizationTypeOrToken("type", 4, "token", "Bearer");

httpIns2
  .get("/admin/crm/head-teachers/statistics/card", { params: { card_type: 4 } })
  .then(res => {});

// httpIns3.setInstancesAuthorizationTypeOrToken("type", 1, "token", "xxx");
httpIns3.get("/teachers/track").then(res => {});
