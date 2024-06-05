import { fetch, ResponseType, Body } from '@tauri-apps/api/http'

// https://tauri.app/zh-cn/v1/api/js/http#fetch
const httpRequest = (opts = {}) => {
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


function getObjectFromString(str) {
    let jsonStr = null

    // 尝试匹配 json object
    let match = str.match(/\{[\s\S]*\}/)
    if (match) {
        jsonStr = match[0]
        try {
            return JSON.parse(jsonStr)
        } catch (error) {
            match = undefined
        }
    }

    // 尝试匹配 ```json ```包裹中匹配
    const regex = /```json\n([\s\S]*?)\n```/
    match = str.match(regex)
    if (match) {
        jsonStr = match[1]

        try {
            return JSON.parse(jsonStr)
        } catch (error) {
            match = undefined
        }
    }

    // 直接尝试解析
    try {
        return JSON.parse(jsonStr)
    } catch (error) {
        return null
    }
}


export { getObjectFromString, httpRequest}
