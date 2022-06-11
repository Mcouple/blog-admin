import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import nprogress from 'nprogress'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist  白名单，不需要权限验证

//路由前置守卫
router.beforeEach(async(to, from, next) => {
    // start progress bar
    NProgress.start();
    // set page title
    document.title = getPageTitle(to.meta.title) //添加title

    const hasUserInfo = store.getters.userInfo //store里的getter获取用户信息
    if (to.meta.auth) {
        //有auth属性表示需要鉴权
        if (hasUserInfo) {
            //有用户信息,直接放行
            next()
        } else {
            //没有用户信息看一下有没有token
            const hasToken = localStorage.getItem("adminToken")
            if (hasToken) {
                //有token，需要验证token有没有过期
                try {
                    await store.dispatch("user/getInfo") //相当于之前的whoAmi方法
                    next() //在try里面如果上面返回错误，会直接跳到catch不执行next()
                } catch (err) {
                    await store.dispatch('user/resetToken') //进到这里说明token过期或错误，先删除token
                    Message.error("登录过期，请重新登录")
                    next(`/login?redirect=${to.path}`) //重新登录
                    NProgress.done()
                }

            } else {
                //说明没有token，所以需要重新登录
                next(`/login?redirect=${to.path}`);
                NProgress.done()
            }
        }
    } else {
        //没有auth属性表示不用鉴权
        if (to.path === "/login" && hasUserInfo) {
            //说明现在有登陆状态，直接导航到首页
            next({ path: "/" })
        } else {
            next()
        }
        NProgress.done()
    }


    //下面是element - ui的鉴权流程
    // if (hasToken) {
    //     if (to.path === '/login') {
    //         // if is logged in, redirect to the home page
    //         next({ path: '/' })
    //         NProgress.done()
    //     } else {
    //         const hasGetUserInfo = store.getters.name
    //         if (hasGetUserInfo) {
    //             next()
    //         } else {
    //             try {
    //                 // get user info
    //                 await store.dispatch('user/getInfo')

    //                 next()
    //             } catch (error) {
    //                 // remove token and go to login page to re-login
    //                 await store.dispatch('user/resetToken')
    //                 Message.error(error || 'Has Error')
    //                 next(`/login?redirect=${to.path}`)
    //                 NProgress.done()
    //             }
    //         }
    //     }
    // } else {
    //     /* has no token*/ //没有token

    //     if (whiteList.indexOf(to.path) !== -1) { //看看是不是在白名单里
    //         // in the free login whitelist, go directly
    //         next()
    //     } else {
    //         // other pages(不在白名单内，需要登录) that do not have permission to access are redirected to the login page.
    //         next(`/login?redirect=${to.path}`)
    //         NProgress.done() //loading 的滚动条
    //     }
    // }
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done() //loading 的滚动条
})