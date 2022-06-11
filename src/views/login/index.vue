<template>
  <div class="login-container">
    <el-form ref="loginForm" 
    :model="loginForm" 
    :rules="loginRules" 
    class="login-form" 
    auto-complete="on" 
    label-position="left">

      <div class="title-container">
        <h3 class="title">blog-admin</h3>
      </div>
      <!-- 用户名称 -->
      <el-form-item prop="loginId">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="loginId"
          v-model.trim="loginForm.loginId"
          placeholder="please enter Username"
          name="loginId"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <!-- 用户密码 -->
      <el-form-item prop="loginPwd">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.loginPwd"
          :type="passwordType"
          placeholder="please enter Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <!-- 验证码 -->
      <div class="captcha-container">
        <el-form-item class="captcha-input" prop="captcha">
        <span class="svg-container">
          <svg-icon icon-class="nested" />
        </span>
        <el-input
          ref="captcha"
          v-model="loginForm.captcha"
          placeholder="please enter captcha"
          name="captcha"
          type="text"
          tabindex="3"
          auto-complete="on"
        />
        </el-form-item>
        <div class="captcha-img" v-html="svg" @click="handlerCaptcha">
        </div>
      </div>
      
      <!-- 7天免登录 -->
      <el-checkbox class="check-box" v-model="checked">7天免登录</el-checkbox>

      <el-button 
      :loading="loading" 
      type="primary" 
      style="width:100%;
      margin-bottom:30px;" 
      @click.native.prevent="handleLogin">Login</el-button>

      <div class="tips">
        <span style="margin-right:20px;">username: root</span>
        <span> password: 123456</span>
      </div>

    </el-form>
  </div>
</template>

<script>
import {getCaptcha} from "@/api/captcha"
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else if(value.length>16){
        callback(new Error('The password can not be more than 16 digitss'))
      } else {
        callback()
      }
    }
    return {
      svg: "",
      loginForm: {
        loginId: 'root',
        loginPwd: '123456',
        captcha: "",
        remember: "",
      },
      loginRules: {
        //在这里书写各个字段的验证规则，它是根据prop联系在一起的
        loginId: [{ required: true, trigger: 'blur', validator: validateUsername }],
        loginPwd: [{ required: true, trigger: 'blur', validator: validatePassword }],
        captcha: [{required:true,trigger:'blur',message:'Please enter the correct captcha '}]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      checked:true
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },

    //登录相关方法
    handleLogin() {
      //拿到form表单验证，如果prop验证全通过，valid为true，否则为false
      this.$refs.loginForm.validate(valid => {
        this.loading = true
        if (valid) {
          // this.loading=true
          if (this.checked) { 
            this.loginForm.remember = "7"
          }
          this.$store.dispatch('user/login', this.loginForm).then((res) => {
            this.$message.success(res.msg);
            this.loading = false
            //这里的path:this.redirect||"/"，是看进入login页面之前的页面是什么，
            //redirect跟的是之前要进入的页面，没有的话就去首页
            this.$router.push({path:this.redirect || "/"})
          }).catch(err => {
            if (err.code === 406) {
              this.$message.error('验证码错误');

            } else {

              this.$message.error('账号或密码错误');
            }
              this.loading =false
              this.loginForm.captcha = ""
              getCaptcha().then(res => { this.svg = res })
          })
        } else {
          this.loading =false
          console.log('error submit!!')
          return false
        }
      })
    },

    //获取验证码
    handlerCaptcha() { 
      getCaptcha().then(res => {
        this.svg = res
      })
    }

  },
  created() { 
    getCaptcha().then(res => {
      this.svg =res
    })
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.captcha-container{
  display: flex;
}
.captcha-input{
  width: 70%;
}
.captcha-img{
  width:150px;
  height:50px;
}

.check-box{
  margin-bottom: 10px;
}
</style>
