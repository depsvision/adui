export default {
  data() {
    return {
    }
  },
  mounted() {
    this.initListener()
  },
  beforeDestroy() {
    this.destroyListener()
  },
  methods: {
    initListener() {
      const that = this
      this.$_resizeHandler = function() {
        that.$store.dispatch('resolution/getScreenResolution', { width: document.body.offsetWidth, height: document.body.offsetHeight })
        that.$store.dispatch('resolution/changeEleSize', 'medium')
      }
      window.addEventListener('resize', this.$_resizeHandler)

      this.$_resizeHandler()
    },
    destroyListener() {
      window.removeEventListener('resize', this.$_resizeHandler)
      this.$_resizeHandler = null
    }
  }
}
