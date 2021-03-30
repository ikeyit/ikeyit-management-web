import axios from "axios";
import {productUrl} from "./apiConfig";

export function callApi(params) {
    params.authorize = params.authorize === undefined || params.authorize;
    return axios(params)
        .then(response => params.rawResponse ? response : response.data, error => {
            if (axios.isCancel(error))
                return Promise.reject({errCode: 'CANCEL', errMsg: '取消请求'});
            if (error.response) {
                error = error.response.data;
                if (error.errCode === 'AUTH_NOT_FOUND' || error.errCode === 'UNAUTHORIZED') {
                    window.location = '/login.html?from=' + encodeURIComponent(window.location.href);
                }
                return Promise.reject(error);
            }

            return Promise.reject({errCode: 'NETWORK_ERROR', errMsg: '网络错误'});
        });
}

const pathVar = /\{(.+?)\}/g;

function resolveUrl(url, params) {
    const usedKeys = [];
    const result = url.replace(pathVar, (group, key) => {
        if (params && params.hasOwnProperty(key)){
            usedKeys.push(key);
            return params[key];
        }
        return group;
    });
    //自动删除用过的key
    if (params && usedKeys.length > 0) {
        usedKeys.forEach(key => {
            delete params[key];
        })
    }
    return result;
}

export function callGet(url) {
    return arg => {
        const params = {...arg};
        return callApi({
            url: resolveUrl(url, params),
            params
        })
    };
}

export function callPost(url) {
    return arg => {
        const params = {...arg};
        return callApi({
            method: "post",
            url: resolveUrl(url, params),
            data: params
        })
    };
}

export function callPut(url) {
    return arg => {
        const params = {...arg};
        return callApi({
            method: "put",
            url: resolveUrl(url, params),
            data: params
        })
    };
}



export function callDelete(url) {
    return arg => {
        const params = {...arg};
        return callApi({
            method: "delete",
            url: resolveUrl(url, params),
            data: params
        })
    };
}
