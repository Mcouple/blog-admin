import request from '@/utils/request'

export function login(data) {
    return request({
        url: '/api/admin/login',
        method: 'post',
        data
    })
}

//恢复登录
export function getInfo() {
    return request({
        url: '/api/admin/whoami',
        method: 'get',
    })
}

// export function logout() {
//     return request({
//         url: '/vue-admin-template/user/logout',
//         method: 'post'
//     })
// }