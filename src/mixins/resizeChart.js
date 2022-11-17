import { mapGetters } from 'vuex'
import { debounce } from '@/utils'

export default {
  data() {
    return {
      $_resizeHandler: null,
      $_chart: null
    }
  },
  mounted() {
    this.initListener()
  },
  activated() {
    if (!this.$_resizeHandler) {
      // avoid duplication init
      this.initListener()
    }

    // when keep-alive chart activated, auto resize
    this.resize()
  },
  beforeDestroy() {
    this.destroyListener()
  },
  deactivated() {
    this.destroyListener()
  },
  computed: {
    ...mapGetters([
      'screenResolution'
    ])
  },
  methods: {
    initListener() {
      if (this.componentOption.ref) {
        this.$_resizeHandler = debounce(() => {
          this.resize()
        }, 100)
        const chartDiv = this.$refs[this.componentOption.ref]
        this.$_chart = this.$echarts.init(chartDiv, null, { renderer: 'svg' })
        window.addEventListener('resize', this.$_resizeHandler)
      }
    },
    destroyListener() {
      window.removeEventListener('resize', this.$_resizeHandler)
      this.$_resizeHandler = null
    },
    resize() {
      this.$_chart && this.$_chart.resize()
    }
  }
}
