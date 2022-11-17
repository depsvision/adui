<template>
  <div class="login-body" :style="backgroudImage">
    <div class="login-operate-block">
      <div class="header-title">
        <span>{{ headerTitle }}</span>
      </div>
      <div class="login-input">
        <el-form
          :model="formData"
          :rules="rules"
          label-width="0px"
        >
          <el-form-item prop="username">
            <el-input
              v-model.trim="formData.username"
              :size="elementSize"
              placeholder="用户名/手机号"
            />
          </el-form-item>
          <el-form-item prop="password" class="password-form-item">
            <el-input
              v-model.trim="formData.password"
              :size="elementSize"
              placeholder="请输入密码"
              show-password
              @keyup.enter.native="enterPress"
            />
          </el-form-item>
          <!-- <el-form-item prop="verificationCode">
            <el-input v-model="formData.verificationCode" />
          </el-form-item> -->
          <el-form-item class="login-button-form-item">
            <el-button
              :loading="loginLoading"
              type="primary"
              class="login-button"
              @click="userLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
        <div class="login-callback-info">{{ loginInfo }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Config from '@/setting'
import setting from '@/api/setting'
import Storage from '@/utils/token'
import { mapGetters } from 'vuex'
import openness from '@/api/openness'
import BackGroudImage from '@/assets/image/backGroundImage/thirdBg.webp'

export default {
  name: 'ThirdLogin',
  components: { },
  props: {},
  data() {
    return {
      backgroudImage: {
        'background-image': 'url(' + BackGroudImage + ')'
      },
      loginLoading: false,
      loginInfo: '',
      formData: {
        username: '',
        password: '',
        verificationCode: '',
        accessKey: ''
      },
      rules: {},
      headerTitle: ''
    }
  },
  computed: {
    ...mapGetters([
      'session',
      'elementSize'
    ])
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getLogo()
      this.getAccessKey()
    },
    getLogo() {
      setting.getLogoIco().then(res => {
        const { data } = res
        Storage.setSession('logo', JSON.stringify(data))
        this.$store.dispatch('storage/listenSessionStorage', { key: 'logo', value: data })
        this.setHeader()
        this.setPageIco()
      })
    },
    setHeader() {
      this.headerTitle = (!this.session.logo.name.trim().length ? Config.title : this.session.logo.name.trim()) + '授权登录'
    },
    setPageIco() {
      const page = document.querySelector("link[rel*='icon']") || document.createElement('link')
      this.session.logo.favicon && this.session.logo.favicon.length > 0 && (page.href = this.session.logo.favicon + '?' + Date.now())
    },
    getAccessKey() {
      const params = window.location.hash.split('?')[1]

      if (params) {
        const reg = new RegExp('(^|&)' + 'accessKey' + '=([^&]*)(&|$)')
        const r = params.match(reg)
        this.formData.accessKey = r[2]
      }
    },
    userLogin() {
      if (this.loginLoading) return

      this.loginLoading = true
      openness.getAccessKeyJumpUrl(this.formData)
        .then(res => {
          setTimeout(() => {
            this.loginLoading = false

            const { data } = res

            const a = document.createElement('a')
            a.href = data.url
            a.click()
          }, 300)
        })
        .catch(err => {
          setTimeout(() => {
            this.loginLoading = false
            this.loginInfo = err
          }, 300)
        })
    },
    enterPress() {
      this.userLogin()
    }
  }
}
</script>

<style scoped lang="scss">
.login-body {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;

  .login-operate-block {
    display: flex;
    flex-flow: column;
    align-items: center;

    .header-title {
      font-size: 24px;
      font-weight: 600;
      color: rgba(245, 249, 255, 1);
      margin-bottom: 24px;
    }

    .login-input {
      position: relative;
      padding: 60px 120px;
      border-radius: 16px;
      background-image: linear-gradient(121deg, #115da6, #143666);

      ::v-deep .el-form-item {
        margin-bottom: 16px;

        &.password-form-item {
          margin-bottom: 56px;
        }

        &.login-button-form-item {
          margin-bottom: 0;
        }

        .el-input {
          width: 260px;

          &>input {
            color: rgba(245,249,355,1);
            border: 1px solid rgba(245,249,355, .75);

            &::-webkit-input-placeholder {
              color: rgba(245,249,355, .35);
            }
          }
        }

        .el-input__inner {
          &:hover,
          &:focus {
            border: 1px solid rgba(245,249,355,1);
          }
        }
      }

      .login-button {
        width: 100%;
        padding-top: 12px;
        padding-bottom: 12px;
      }

      .login-callback-info {
        position: absolute;
        bottom: 98px;
        width: 260px;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: rgba(255, 255, 255, 1);
        text-align: center;
        word-break: break-all;
      }
    }
  }
}
</style>
