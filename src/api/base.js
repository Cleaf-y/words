import { fetch, ResponseType, Body } from '@tauri-apps/api/http'

// https://tauri.app/zh-cn/v1/api/js/http#fetch
export const httpRequest = (opts = {}) => {
    return new Promise((resolve, reject) => {
        const { url, method, query, data, headers, callback } = opts
        fetch(url, {
            method: method || 'GET',
            headers: {
                'content-type': 'application/json',
                ...headers,
            },
            responseType: ResponseType.JSON,
            timeout: 60000,
            query: query,
            body: Body.json({
                ...data,
            }),
        })
            .then((res) => {
                callback && callback(res)
                resolve(res)
            })
            .catch((e) => {
                reject(e)
            })
    })
}
