import { login, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
    return {
        token: getToken(),
        name: '',
        avatar: '',
        user: null
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_USER: (state, payload) => {
        state.user = payload
    }
}

const actions = {
    // user login
    login({ commit }, userInfo) {
        return new Promise((resolve, reject) => {
            login(userInfo).then(res => {
                const { data } = res
                if (data) {
                    //有用户信息
                    commit('SET_USER', data)
                    resolve(res)
                } else {
                    reject(res)
                }
            }).catch(err => {
                reject(res)
            })
        })

        //   login(userInfo).then(response => {
        //     const { data } = response
        //     commit('SET_TOKEN', data.token)
        //     setToken(data.token)
        //     resolve()
        // }).catch(error => {
        //     reject(error)
        // })
    },

    // whoAmi
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            //getInfoAPi方法
            getInfo().then(res => {
                if (res.code === 0) {
                    //表示有登录信息
                    commit("SET_USER", res.data)
                    resolve(res)
                } else {
                    reject(res.msg)
                }
            })
        })

        // getInfo(state.token).then(response => {
        //     const { data } = response
        //     console.log(data);
        //     if (!data) {
        //         return reject('Verification failed, please Login again.')
        //     }

        //     const { name, avatar } = data

        //     commit('SET_NAME', name)
        //     commit('SET_AVATAR', avatar)
        //     resolve(data)
        // }).catch(error => {
        //     reject(error)
        // })
    },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            removeToken() // 删除token
            resetRouter() //重置路由
            commit('RESET_STATE')
            resolve()
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            removeToken() // must remove  token  first
            commit('RESET_STATE')
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}