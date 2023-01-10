<template>
    <div class="login-container">
        <div class="header-logo-title">
            <div class="header-logo">
                <el-image :src="'/src/assets/image/logoImage/logoWhite.png'" />
                <!-- <el-image :src="componentOption.img" :style="componentOption.logeImageStyle"> -->
                    <!-- <template #error>
                        <div class="image-slot">
                            <el-image :src="'/src/assets/image/logoImage/logoWhite.png'" />
                        </div>
                    </template> -->
                <!-- </el-image> -->
            </div>
            <div class="header-title">
                <span>{{ headerTitle }}</span>
            </div>
        </div>
        <div class="login-input" :style="backgroudImage">
            <el-form :model="formData" :rules="rules" label-width="0px">
                <el-form-item prop="username">
                    <el-input v-model.trim="formData.username" :size="elementSize" placeholder="用户名/手机号" />
                </el-form-item>
                <el-form-item prop="password" class="password-form-item">
                    <el-input v-model.trim="formData.password" :size="elementSize" placeholder="请输入密码" show-password
                        @keyup.enter.native="enterPress" />
                </el-form-item>
                <!-- <el-form-item prop="verificationCode">
              <el-input v-model="formData.verificationCode" />
            </el-form-item> -->
                <el-form-item class="login-button-form-item">
                    <el-button :loading="loginLoading" type="primary" class="login-button" @click="userLogin">
                        登录
                    </el-button>
                </el-form-item>
            </el-form>
            <div class="login-callback-info">{{ loginInfo }}</div>
        </div>
    </div>
</template>
  
<script>
import { mapGetters } from 'vuex'
import getPageTitle from '@/utils/getPageTitle'
import pngColor from '@/directive/png-color'
import decorate from '@/assets/image/backGroundImage/decorate.webp'

export default {
    name: 'Login',
    directives: { pngColor },
    props: {
        componentOption: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data() {
        return {
            pngBgColor: '',
            loginLoading: false,
            loginInfo: '',
            formData: {
                username: '',
                password: '',
                verificationCode: ''
            },
            rules: {},
            headerTitle: '人工智能推理平台',
            // errImg: import('@/assets/image/logoImage/logoWhite.png'),
            errImg: '/src/assets/image/logoImage/logoWhite.png',
            backgroudImage: {
                'background-image': 'url(' + decorate + ')'
            }
        }
    },
    computed: {
        ...mapGetters([
            'elementSize'
        ])
    },
    watch: {
        'componentOption.headerTitle': {
            handler(val) {
                if (val && val.length > 0) {
                    this.headerTitle = val
                }
            }
        },
        immediate: true
    },
    activated() {
        document.title = document.title = getPageTitle('登录')
    },
    methods: {
        userLogin() {
            if (this.loginLoading) return

            this.loginLoading = true
            this.$store.dispatch('user/login', this.formData)
                .then(() => {
                    setTimeout(() => {
                        this.loginLoading = false
                        this.$router.push({ path: '/' }).catch(() => { })
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
.login-container {
    position: relative;
    display: flex;
    align-content: center;
    width: 27.77%;
    max-width: 420px;
    min-width: 400px;
    background: #fff;
    background: linear-gradient(154deg, #0f5699 0%, #0a1b33 100%);

    .header-logo-title {
        position: absolute;
        top: 0;
        display: flex;
        flex-flow: column;
        width: 100%;
        padding-top: 32px;
        padding-left: 32px;

        .header-logo {
            display: flex;
            margin-bottom: 16px;

            :deep( .el-image ) {
                img {
                    max-width: 200px;
                    max-height: 32px;
                }
            }
        }

        .header-title {
            display: flex;

            span {
                font-size: 18px;
                color: #fff;
            }
        }

        :deep( .el-image__inner ) {
            width: auto;
            height: auto;
        }
    }

    .login-input {
        width: 100%;
        padding: 0 70px;
        background-position: bottom;
        background-repeat: no-repeat;
        background-size: contain;

        &::before {
            content: " ";
            display: block;
            width: 100%;
            height: 31.5vh;
            min-height: 256px;
        }

        :deep( .el-form-item ) {
            margin-bottom: 16px;

            &.password-form-item {
                margin-bottom: 56px;
            }

            &.login-button-form-item {
                margin-bottom: 24px;
            }

            .el-input {
                &>input {
                    color: rgba(245, 249, 355, 1);
                    border: 1px solid rgba(245, 249, 355, .75);

                    &::-webkit-input-placeholder {
                        color: rgba(245, 249, 355, .35);
                    }
                }
            }

            .el-input__inner {

                &:hover,
                &:focus {
                    border: 1px solid rgba(245, 249, 355, 1);
                }
            }
        }

        .login-button {
            width: 100%;
            padding-top: 12px;
            padding-bottom: 12px;
        }

        .login-callback-info {
            font-size: 12px;
            color: #fff;
            text-align: center;
            word-break: break-all;
        }
    }
}
</style>
  