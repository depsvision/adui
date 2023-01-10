<template>
    <el-container>
        <el-header>
            <div class="corerain-header">
                <div class="header-logo-title">
                    <div class="header-logo">
                        <el-image :src="'/src/assets/image/logoImage/logoBlue.png'" :style="logeImageStyle">
                            <div slot="error" class="image-slot">
                                <el-image :src="logoUrl.errImg" />
                            </div>
                        </el-image>
                    </div>
                    <div class="header-title">
                        <span>{{ headerTitle }}</span>
                    </div>
                </div>
                <common-menu ref="headerMenu" :component-option="menuOption.headerMenu"
                    @handleMenuItemClick="handleMenuItemClick" />
                <div class="header-right-menu">
                    <point-drop-down :component-option="appidOption" class="header-app-id header-right-menu-item"
                        :class="[!calcAuthority(['app']) ? 'is-none' : '']">
                        <div class="header-app-id-display">
                            <svg-icon icon-class="plug-in-fill" />
                        </div>
                    </point-drop-down>
                    <div class="header-setup header-right-menu-item"
                        :class="[!calcAuthority(['setting']) ? 'is-none' : '']">
                        <svg-icon icon-class="setup-fill" @click="intoSetting" />
                    </div>
                </div>
                <user-menu :user-data="headerUser.userData" :drop-down-data="headerUser.dropDownData" />
            </div>
        </el-header>
        <el-container class="inner-container">
            <el-aside v-show="menuOption.asideMenu.menuGroup.length > 0" class="aside-layout" width="auto">
                <common-menu ref="asideMenu" :component-option="menuOption.asideMenu" />
                <div class="aside-menu-button" :class="{ 'shrink-aside-menu': menuOption.asideMenu.collapse }"
                    @click="collapseAsideMenu(menuOption.asideMenu.collapse)">
                    <div class="aside-menu-svg">
                        <svg-icon icon-class="arrow-left-move" />
                    </div>
                </div>
            </el-aside>
            <el-main class="main-out">
                <router-view v-slot="{ Component }">
                    <transition name="fade-transform" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </el-main>
        </el-container>

        <!-- 全局语音播报 -->
        <voice-broadcast />

        <!-- 全局图片查看器 -->
        <image-viewer />

        <!-- 全局共用弹出动态组件 -->
        <component :is="dialog.name" />

    </el-container>
</template>

<script>
import authorityConfig from '@/setting'
import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'

import { handleErrorCode } from '@/utils/error'

import Storage from '@/utils/token'
import axios from 'axios'
import Config from '@/setting'
import setting from '@/api/setting'
import openness from '@/api/openness'
import resizeScreen from '@/mixins/resizeScreen'
import CommonMenu from '@/components/NavMenu/CommonMenu'
import DialogShell from '@/components/Dialog/DialogShell'
import VoiceBroadcast from '@/components/Audio/VoiceBroadcast'
import ImageViewer from '@/components/ImageViewer'
import UserMenu from '@/components/AreaComponents/UserMenu'
import PointDropDown from '@/components/InnerComponents/PointDropDown'
import DefaultAvatar from '@/assets/image/othersImage/user_avatar_person.png'
import pngColor from '@/directive/png-color'

export default {
    name: 'HomePage',
    components: { CommonMenu, UserMenu, DialogShell, VoiceBroadcast, ImageViewer, PointDropDown },
    directives: { pngColor },
    mixins: [resizeScreen],
    props: {},
    data() {
        return {
            // Logo 背景颜色
            pngBgColor: '',
            // appId
            appidOption: {
                trigger: 'click',
                style: {
                    'min-width': '180px'
                },
                option: [],
                dropdownClass: [],
                noData: '暂无应用',
                placement: 'bottom-end'
            },
            // 导航栏option
            menuOption: {
                headerMenu: {
                    mode: 'horizontal',
                    active: '',
                    textColor: 'rgba(14, 27, 46, .6)',
                    activeTextColor: '#0E1B2E',
                    backgroundColor: '#fff',
                    router: true,
                    class: 'corerain-header-menu',
                    menuGroup: [],
                    bar: {
                        show: true,
                        transform: {
                            elWidth: 0,
                            x: 0
                        },
                        style: {
                            width: '32px',
                            height: '4px',
                            'background-color': '#1872F0',
                            bottom: 0,
                            transition: ''
                        }
                    }
                },
                asideMenu: {
                    active: '',
                    textColor: '#F5F9FF',
                    activeTextColor: '#F5F9FF',
                    backgroundColor: '#0F223D',
                    collapse: false,
                    collapseTransition: true,
                    router: true,
                    class: 'corerain-aside-menu',
                    submenuClass: 'aside-submenu-child',
                    menuGroup: []
                }
            },
            logoUrl: {
                img: import('/src/assets/image/logoImage/logoBlue.png'),
                errImg: import('/src/assets/image/logoImage/logoBlue.png')
            },
            logeImageStyle: {},
            headerTitle: '',
            headerUser: {
                userData: {
                    //   img: JSON.parse(Storage.getLocal('userMarks')).userInfo.picture,
                    errImg: DefaultAvatar,
                    //   userName: JSON.parse(Storage.getLocal('userMarks')).userInfo.name
                    // email: 'xxxx@xxxxxx.com'
                },
                dropDownData: [
                    {
                        label: '登出',
                        command: 'logout',
                        svg: 'exit',
                        class: 'user-logout'
                    }
                ]
            },
            rencentTimer: null
        }
    },
    computed: {
        ...mapGetters([
            'button',
            'dialog',
            'voiceOption',
            'accessedRoutes',
            'aside',
            'session',
            'globalData',
            'authority',
            'streamSaver'
        ])
    },
    watch: {
        'voiceOption': {
            handler(val) {
                if (val && !val.isAudition && (val.voice || val.notify)) {
                    this.createRecentTimer()
                } else {
                    if (this.rencentTimer) {
                        clearInterval(this.rencentTimer)
                        this.rencentTimer = null
                    }
                }
            },
            deep: true
        },
        accessedRoutes: {
            handler(val) {
                val && this.handleRoutes()
            },
            immediate: true
        },
        'aside.collapse'(val) {
            this.menuOption.asideMenu.collapse = val
        },
        '$route.path'(val) {
            this.handleRoutes()
        },
        'session.logo': {
            handler(val) {
                this.setHomeLogo()
                this.setSystemName()
                this.setPageIco()
            },
            deep: true
        },
        'globalData.appidData': {
            handler(val) {
                this.appidOption.option = val
            },
            deep: true
        },
        'button.value'(val) {
            this.clickButton(val)
        }
    },
    created() {
        this.init()
    },
    beforeDestroy() {
        if (this.rencentTimer) {
            clearInterval(this.rencentTimer)
        }
    },
    methods: {
        init() {
            this.setHomeLogo()
            this.getVoiceBroadcastStatus()
            this.getAppIdUrl()
            this.bindWindowEvent()
        },
        // 浏览器行为
        bindWindowEvent() {
            window.onbeforeunload = e => {
                const writerKeys = Object.keys(this.streamSaver.writer)

                writerKeys.forEach(time => {
                    this.streamSaver.writer[String(time)].close()
                    this.streamSaver.writer[String(time)].abort()
                })
            }
        },

        getAppIdUrl() {
            openness.getJumpList()
                .then(res => {
                    const { application } = res.data
                    application.forEach(item => {
                        item.label = item.display
                        item.value = 'jumpToApp-' + item.appId + Date.now()
                        item.noAuth = true
                    })
                    this.$store.dispatch('data/setData', { obj: 'appidData', value: application })
                })
        },
        clickButton(value) {
            const command = value.split('-')[0]
            switch (command) {
                case 'jumpToApp':
                    this.jumpToUrl()
                    break
                case 'linkToLicense':
                    this.linkToLicense()
                    break
                case 'backHistory':
                    this.backHistory()
                    break
                default:
            }
        },
        jumpToUrl() {
            openness.getJumpUrl({ id: this.button.id })
                .then(res => {
                    const { data } = res

                    window.open(data.url)
                })
        },
        linkToLicense() {
            this.$store.dispatch('dialog/initDialogData', true)
            this.$store.dispatch('dialog/initDialogData')

            this.$router.push({ name: 'LicenseManage' }).catch(() => { })
        },
        backHistory() {
            window.history.back(-1)
        },
        calcAuthority(typeArr) {
            let result = false

            if (this.authority.limit || this.authority.role) {
                if (this.authority.limit === 1) {
                    result = true
                } else {
                    const keys = Object.keys(this.authority.role)
                    result = !keys.some(au => (typeArr[au] & authorityConfig.authority.operate) === authorityConfig.authority.operate)
                }
            }

            return result
        },
        getLogo() {
            setting.getLogoIco().then(res => {
                const { data } = res
                Storage.setSession('logo', JSON.stringify(data))
                this.$store.dispatch('storage/listenSessionStorage', { key: 'logo', value: data })
                this.setHomeLogo()
            })
        },
        setHomeLogo() {
            if (!this.session.logo) {
                this.getLogo()
            } else {
                if (this.session.logo.logo.length > 0) {
                    this.logoUrl.img = this.session.logo.logo + '?' + Date.now()
                }
                this.setSystemName()
                this.setPageIco()
            }
        },
        setSystemName() {
            this.headerTitle = !this.session.logo.name.trim().length ? Config.title : this.session.logo.name.trim()
        },
        setPageIco() {
            const page = document.querySelector("link[rel*='icon']") || document.createElement('link')
            this.session.logo.favicon && this.session.logo.favicon.length > 0 && (page.href = this.session.logo.favicon + '?' + Date.now())
        },
        handleRoutes() {
            const routerArr = deepClone(this.accessedRoutes)
            this.setHeaderRoutes(routerArr)
        },
        setHeaderRoutes(routes) {
            const headerRoute = routes.filter(route => route.meta && !route.hidden)
            headerRoute.forEach(item => {
                item.children = []
            })
            this.menuOption.headerMenu.menuGroup = headerRoute
            this.setActiveHeaderRoute(headerRoute)

            this.$nextTick(() => {
                this.handleMenuItemClick(this.$route.path, false)
            })
        },
        setActiveHeaderRoute(head) {
            const route = this.$route
            const { path } = route
            this.menuOption.headerMenu.active = '/' + path.split('/').filter(head => head !== '')[0]
            this.setAsideRoutes()
        },
        setAsideRoutes() {
            const route = this.$route
            const { path } = route
            const routerArr = JSON.parse(JSON.stringify(this.accessedRoutes))
            const headerPath = path.split('/').filter(head => head !== '')[0]
            const activeHeaderRoute = routerArr.filter(arr => arr.path === '/' + headerPath && !arr.hidden)[0]
            let asideRoutes = []
            activeHeaderRoute && (asideRoutes = this.filterAsideRoutes(activeHeaderRoute).children)
            asideRoutes.forEach(item => {
                item.basePath = '/' + headerPath
            })
            this.menuOption.asideMenu.menuGroup = asideRoutes

            const isExternal = route => {
                let match = route

                if (route.meta.isInside) {
                    match = isExternal(route.parent)
                }

                return match
            }

            const match = route.matched.find(route => route.path === path)
            const asideFatherPath = isExternal(match).path
            this.setActiveAsideRoute(asideRoutes, asideFatherPath)
        },
        filterAsideRoutes(asides) {
            if (asides.children) {
                asides.children = asides.children.filter(aside => !aside.notMenu && aside.meta && !aside.meta.root)
                asides.children.length > 0 && asides.children.forEach(item => {
                    item = this.filterAsideRoutes(item)
                })
            }
            return asides
        },
        setActiveAsideRoute(aside, fullPath) {
            this.menuOption.asideMenu.active = fullPath
        },
        async getVoiceBroadcastStatus() {
            const { data } = await setting.getAlarmVoiceNotify()
            this.$store.dispatch('audio/setVoiceOption', { key: 'voice', value: data.voice })
            this.$store.dispatch('audio/setVoiceOption', { key: 'notify', value: data.pop })
        },
        createRecentTimer() {
            const that = this
            if (!this.rencentTimer) {
                this.rencentTimer = setInterval(() => {
                    that.getRecent()
                }, 8000)
            }
        },
        getRecent() {
            const accessToken = Storage.getLocal('accessToken') || ''

            return new Promise((resolve, reject) => {
                axios.get('api/log/recent', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then(res => {
                    const { data, requestInfo } = res.data

                    if (requestInfo.flag) {
                        this.$store.dispatch('audio/setVoiceBroadcast', data.dataList)
                    } else {
                        handleErrorCode(data.errorCode)
                    }
                })
            })
        },
        handleMenuItemClick(index, indexPath) {
            // 第一次加载时直接出现，不出现动画
            if (indexPath) {
                this.menuOption.headerMenu.bar.style.transition = 'transform .3s cubic-bezier(.645,.045,.355,1)'
            }

            const headerPath = '/' + index.split('/').filter(head => head !== '')[0]

            const transform = this.menuOption.headerMenu.bar.transform
            let menuItem = {}
            if (this.$refs.headerMenu && this.$refs.headerMenu.$refs[headerPath]) {
                this.menuOption.headerMenu.bar.show = true
                menuItem = this.$refs.headerMenu.$refs[headerPath][0]
                transform.elWidth = menuItem.$el.offsetWidth
                transform.x = menuItem.$el.offsetLeft
            } else {
                this.menuOption.headerMenu.bar.show = false
            }
        },
        collapseAsideMenu(flag) {
            this.menuOption.asideMenu.collapse = !this.menuOption.asideMenu.collapse
            this.$store.dispatch('menu/changeAsideData', { key: 'collapse', value: !flag })
        },
        intoSetting() {
            this.$router.push({ name: 'SystemSetting' }).catch(() => { })
        }
    }
}
</script>

<style scoped lang="scss">
.el-container {
    position: relative;
    overflow: hidden;
}

.el-header {
    position: relative;
    width: 100%;
    height: 60px;
    padding: 0;
    display: flex;
    flex-flow: row nowrap;
    box-shadow: 0px 1px 4px 0px rgba(23, 24, 26, 0.15);
    z-index: 10;

    .corerain-header {
        position: relative;
        display: flex;
        width: 100%;
        background-color: #fff;

        .header-logo-title {
            display: flex;
            align-items: center;
            margin-left: 32px;
            margin-right: 80px;

            .header-logo {
                display: flex;
                margin-right: 16px;

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
                    font-weight: 600;
                    color: #0159AA;
                }
            }

            :deep( .el-image__inner ) {
                width: auto;
                height: auto;
            }
        }

        :deep( .corerain-header-menu ) {
            position: relative;

            .el-sub-menu__title,
            .el-menu-item {
                height: 60px;
                line-height: 60px;
                font-size: 16px;
                color: #0E1B2E;
                opacity: 0.75;
                padding: 0 16px;
                background-color: #fff !important;
                opacity: 1;

                &.is-active {
                    opacity: 1;
                }

                &:hover {
                    color: #0E1B2E !important;
                }

                &:focus-visible {
                    outline: none
                }
            }

            .el-sub-menu {
                &:focus-visible {
                    outline: none
                }
            }

            .el-sub-menu__title {

                .el-sub-menu__icon-arrow {
                    display: none;
                }
            }
        }

        .user-menu-container {
            position: absolute;
            right: 25px;
        }

        .header-right-menu {
            position: absolute;
            height: 100%;
            right: 85px;
            display: flex;

            .header-right-menu-item {
                margin-left: 16px;

                &:first-child {
                    margin-left: 0;
                }
            }

            .header-app-id {
                height: 100%;
                display: flex;

                &.is-none {
                    display: none;
                }

                .header-app-id-display {
                    display: flex;
                    align-items: center;
                    padding: 4px;
                    border: 1px solid rgba(27, 53, 89, 0.2);
                    border-radius: 3px;

                    svg {
                        color: rgba(14, 27, 46, 1);
                        font-size: 16px;
                    }

                    &:hover {
                        cursor: pointer;
                        background-color: rgba(14, 27, 46, 0.05);
                        border: 1px solid #F3F3F4;

                        svg {
                            color: #1872F0;
                        }
                    }
                }
            }

            .header-setup {
                height: 100%;
                display: flex;
                align-items: center;

                &.is-none {
                    display: none;
                }

                svg {
                    color: rgba(14, 27, 46, 1);
                    font-size: 16px;
                    border: 1px solid rgba(27, 53, 89, 0.2);
                    border-radius: 3px;
                    padding: 4px;

                    &:hover {
                        cursor: pointer;
                        color: #1872F0;
                        background-color: rgba(14, 27, 46, 0.05);
                        border: 1px solid #F3F3F4;
                    }
                }
            }
        }
    }
}

.inner-container {

    .aside-layout {
        position: relative;
        display: flex;
        flex-flow: column;
        overflow: unset;
        background-color: #0F223D;
        padding: 8px;

        .common-menu-container {
            flex: 1;
            margin-bottom: 8px;
        }

        :deep( .corerain-aside-menu ) {
            border-right: none;

            &:not(.el-menu--collapse) {
                width: 200px;
            }

            .el-menu-item:hover {
                background-color: rgba(245, 249, 255, 0.1) !important;
            }

            .el-menu-item.is-active {
                color: #1872F0 !important;
                background-color: #F5F7FA !important;
            }

            .el-sub-menu__title {
                height: 40px;
                line-height: 40px;
                overflow: hidden;
                padding: 0;
                padding-left: 12px !important;

                &:hover {
                    background-color: rgba(245, 249, 255, 0.1) !important;
                }
            }

            &.el-menu--collapse {
                width: 32px;

                .el-sub-menu__title {
                    height: 32px;
                    line-height: 32px;
                    padding-left: 6px !important;
                }
            }

            .menu-item-padding {

                &.is-active {

                    .el-sub-menu__title {
                        background-color: rgba(31, 70, 122, 1) !important;
                    }
                }
            }

            .el-menu--inline {
                border-left: 2px solid rgba(245, 249, 255, 0.5);
                padding-left: 8px;

                .el-menu-item {
                    height: 32px;
                    line-height: 32px;
                    overflow: hidden;
                    padding: 0;
                    padding-left: 12px !important;
                }
            }
        }

        .aside-menu-button {
            flex-shrink: 0;
            display: flex;

            .aside-menu-svg {
                font-size: 16px;
                line-height: 1;
                color: rgba(245, 249, 255, 1);
                border-radius: 4px;
                background: rgba(245, 249, 255, 0.1);
                padding: 8px;
                margin-left: auto;

                &:hover {
                    background: rgba(245, 249, 255, 0.2);
                    cursor: pointer;
                }

                svg {
                    transition: all ease-in-out .3s;
                }
            }
        }

        .shrink-aside-menu {

            svg {
                transform: rotate(-180deg);
            }
        }
    }
}

.main-out {
    position: relative;
    padding: 0;
    overflow-x: hidden;
    overflow-y: overlay;
}
</style>
