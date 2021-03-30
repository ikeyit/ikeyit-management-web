import {passportUrl, appId} from './apiConfig';
import axios from "axios";
import jwt_decode from 'jwt-decode';

export const authManager = {
    auth:null, //{status: ?, accessToken: ?, refreshToken: ?, authorities: ?, user: ?}
    refreshJob: null,
    onAuthChange(auth) {
    },
    //保存认证数据
    doSaveAuth(authData) {
        localStorage.setItem("auth", authData);
    },
    //加载认证数据
    doLoadAuth() {
        // TODO FIX 多网页有可能同时刷新token，实现只允许一个刷新
        window.addEventListener("storage", function (e) {
            if(e.key === "auth") {
                const old =  authManager.auth;
                let auth = undefined;
                if (e.newValue) {
                    auth = JSON.parse(e.newValue);
                }
                authManager.auth = auth;
                authManager.onAuthChange(auth, old);
            }
        });
        return localStorage.getItem('auth');
    },
    doRemoveAuth() {

        localStorage.removeItem('auth');
    },
    //使用refreshtoken刷新认证
    doRefresh(refreshToken) {
        return axios({
            url: `${passportUrl}/auth/refresh_token`,
            method: 'POST',
            authorize: false,
            data: new URLSearchParams({token: refreshToken}),
        });
    },
    //登录
    doLogin(params) {
        return axios({
            url: `${passportUrl}/auth/login`,
            method: 'POST',
            authorize: false,
            data: new URLSearchParams(params)
        });
    },

    doDecode(res) {
        return {
            accessToken: res.headers["authorization"],
            refreshToken: res.headers["refresh-token"],
            user: res.data,
        };
    },

    setAuth(auth) {
        const old =  authManager.auth;
        if (auth) {
            //更新
            authManager.doSaveAuth(JSON.stringify(auth));
        } else {
            //删除
            authManager.doRemoveAuth();
        }
        authManager.auth = auth;
        authManager.onAuthChange(auth, old);
    },

    decode(res) {
        const auth = authManager.doDecode(res);
        const jwt = jwt_decode(auth.accessToken.substr("Bearer ".length));
        auth.authorities = jwt.scp;
        auth.status = "success";
        authManager.setAuth(auth);
    },

    refresh() {
        if (authManager.refreshJob != null)
            return authManager.refreshJob;
        authManager.refreshJob = authManager.doRefresh(authManager.auth.refreshToken)
            .then(res => {
                authManager.refreshJob = null;
                authManager.decode(res);
                return res;
            }, error => {
                authManager.refreshJob = null;
                authManager.logout();
                return error;
            });
        return authManager.refreshJob;
    },

    load() {
        const authData = authManager.doLoadAuth();
        if (authData) {
            authManager.auth = JSON.parse(authData);
        }

        return authManager.auth;
    },

    login(params) {
        authManager.setAuth({
            ...authManager.auth,
            status:"loading",
        });

        return authManager.doLogin(params)
            .then(res => {
                authManager.decode(res);
                return res;
            }, error => {
                authManager.setAuth({
                    ...authManager.auth,
                    status:"error",
                    error: error,
                });
                return Promise.reject(error);
            });
    },

    logout() {
        authManager.setAuth(undefined);
    },
    hasAuthority(authority) {
        const auth = authManager.auth;
        return auth && auth.authorities && auth.authorities.includes(authority);
    },

    hasAnyAuthority(...authorities) {
        return authorities.some(authority => authManager.hasAuthority(authority));
    },
    authenticated() {
        const auth = authManager.auth;
        return auth && auth.status === "success";
    },
}

axios.interceptors.request.use(config => {
    if (config.authorize) {
        const accessToken = authManager.auth && authManager.auth.accessToken;
        //没有token，直接返回错误
        if (!accessToken) {
            return Promise.reject({errCode: "AUTH_NOT_FOUND", errMsg: "需要登录"});
        }
        config.headers['authorization'] = accessToken;
    }

    return config;
}, result => Promise.reject(result));



axios.interceptors.request.use(config => {
    if (config.authorize) {
        //正在刷新token，等待
        if (authManager.refreshJob != null)
            return authManager.refreshJob.then(res => config);
    }
    return config;
}, result => Promise.reject(result));


axios.interceptors.response.use(response => response, error => {
    if (error.response) {
        const {config, status} = error.response;
        if (config.authorize && status === 401) {
            return authManager.refresh().then(res => {
                return axios(config);
            });
        }
    }
    return Promise.reject(error);
});