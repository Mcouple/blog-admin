import request from "../utils/request"

export function getBanner() {
    return request({
        url: "/api/banner",
        method: "get",
    })
}

export function settingBanner(data) {
    return request({
        url: '/api/banner',
        method: 'post',
        data
    })
}