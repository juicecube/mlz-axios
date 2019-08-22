"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
axios_1.default.defaults.withCredentials = true;
axios_1.default.defaults.timeout = 5000;
axios_1.default.defaults.validateStatus = function (status) {
    return status >= 200 && status < 599;
};
axios_1.default.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
var TOKEN = 'authorization';
var cancel_token = axios_1.default.CancelToken;
var source = cancel_token.source();
var Http = (function () {
    function Http(base_url) {
        this.req_interceptors = function (resolve, reject) {
            axios_1.default.interceptors.request.use(function (config) {
                resolve(config);
                return config;
            }, function (error) {
                reject(error);
                return Promise.reject(error);
            });
        };
        this.res_interceptors = function (resolve, reject) {
            axios_1.default.interceptors.response.use(function (response) {
                resolve(response);
                return response;
            }, function (error) {
                reject(error);
                return Promise.reject(error);
            });
        };
        this.base_url = base_url;
    }
    Http.prototype.request = function (opt) {
        var actual_opt = Object.assign({}, opt);
        if (this.base_url) {
            actual_opt.baseURL = this.base_url;
        }
        if (this.authorization && this.authorization_type) {
            actual_opt.headers = __assign({ authorization_type: this.authorization_type, authorization: this.authorization }, actual_opt.headers);
        }
        actual_opt.cancelToken = source.token;
        return axios_1.default.request(actual_opt);
    };
    Http.prototype.abort = function () {
        source.cancel('API abort.');
    };
    Http.prototype.get = function (url, configs) {
        return this.request(__assign({ method: 'get', url: url }, configs));
    };
    Http.prototype.post = function (url, data, configs) {
        return this.request(__assign({ method: 'post', url: url,
            data: data }, configs));
    };
    Http.prototype.put = function (url, data, configs) {
        return this.request(__assign({ method: 'put', url: url,
            data: data }, configs));
    };
    Http.prototype.patch = function (url, data, configs) {
        return this.request(__assign({ method: 'patch', url: url,
            data: data }, configs));
    };
    Http.prototype.delete = function (url, configs) {
        return this.request(__assign({ method: 'delete', url: url }, configs));
    };
    Http.prototype.setToken = function (authorization_type, authorization) {
        if (authorization === void 0) { authorization = TOKEN; }
        this.authorization_type = authorization_type;
        this.authorization = authorization;
    };
    return Http;
}());
exports.Http = Http;
