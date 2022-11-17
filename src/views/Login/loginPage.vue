<template>
  <div class="login-body" :style="backgroudImage">
    <component :is="activeName" :component-option="loginOption" />
  </div>
</template>

<script>
import Config from '@/setting'
import setting from '@/api/setting'
import Login from '@/components/SinglePage/Login/Login'
import Storage from '@/utils/token'
import { mapGetters } from 'vuex'
import BackGroudImage from '@/assets/image/backGroundImage/backgroundImage.webp'

export default {
  name: 'LoginPage',
  components: { Login },
  props: {},
  data() {
    return {
      activeName: 'login',
      loginOption: {
        logeImageStyle: {},
        img: '',
        headerTitle: ''
      },
      backgroudImage: {
        'background-image': 'url(' + BackGroudImage + ')'
      }
    }
  },
  computed: {
    ...mapGetters([
      'session'
    ])
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getLogo()
    },
    getLogo() {
      setting.getLogoIco().then(res => {
        const { data } = res
        Storage.setSession('logo', JSON.stringify(data))
        this.$store.dispatch('storage/listenSessionStorage', { key: 'logo', value: data })
        this.setHomeLogo()
        this.setPageIco()
      })
    },
    setHomeLogo() {
      if (this.session.logo.logo && this.session.logo.logo.length > 0) {
        this.loginOption.img = this.session.logo.logo + '?' + Date.now()
      }

      this.loginOption.headerTitle = !this.session.logo.name.trim().length ? Config.title : this.session.logo.name.trim()
    },
    setPageIco() {
      const page = document.querySelector("link[rel*='icon']") || document.createElement('link')
      this.session.logo.favicon && this.session.logo.favicon.length > 0 && (page.href = this.session.logo.favicon + '?' + Date.now())
    }
  }
}
</script>

<style scoped lang="scss">
.login-body {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
