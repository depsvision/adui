<template>
  <div class="carousel-slot-container" :class="slotClass">
    <span @click="carouselScroll(1)"><slot name="prev" /></span>
    <div ref="carouselScroll" class="carousel-scroll-block">
      <slot name="scroll" />
    </div>
    <span @click="carouselScroll(-1)"><slot name="next" /></span>
  </div>
</template>

<script>

export default {
  name: 'CarouselSlot',
  components: { },
  props: {
    componentOption: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      scrollBlock: {},
      calculateScrollX: null,
      support: null
    }
  },
  computed: {
    slotClass() {
      const classGroup = {}
      this.componentOption.class && this.componentOption.class.split(' ').forEach(item => {
        classGroup[item] = true
      })
      return classGroup
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  beforeDestroy() {
    this.destroyListener()
  },
  methods: {
    init() {
      this.scrollX()
    },
    scrollX() {
      const that = this
      this.scrollBlock = this.$refs.carouselScroll

      this.calculateScrollX = function(e) {
        const detail = e.wheelDelta || e.detail || event.wheelDeltaY

        // 定义滚动方向
        const moveForward = 1
        const moveBack = -1

        // 定义滚动幅度
        const extent = that.componentOption.extent || 80

        // 定义滚动距离
        let step = 0

        if (detail < 0) {
          step = moveForward * extent
        } else {
          step = moveBack * extent
        }

        that.scrollBlock.scrollLeft += step
      }

      this.support = 'onwheel' in document.createElement('div') ? 'wheel' // 各个厂商的高版本浏览器都支持"wheel"
        : document.onmousewheel !== undefined ? 'mousewheel' // Webkit 和 IE一定支持"mousewheel"
          : 'DOMMouseScroll' // 低版本firefox

      this.scrollBlock.addEventListener(this.support, this.calculateScrollX, false)
    },
    carouselScroll(move) {
      // 定义滚动方向
      const moveForward = 1
      const moveBack = -1

      // 定义滚动幅度
      const extent = this.componentOption.extent || 80

      // 定义滚动距离
      let step = 0

      if (move < 0) {
        step = moveForward * extent
      } else {
        step = moveBack * extent
      }
      this.scrollBlock.scrollLeft += step
    },
    destroyListener() {
      this.scrollBlock.removeEventListener(this.support, this.calculateScrollX)
      this.calculateScrollX = null
    }
  }
}
</script>

<style scoped lang="scss">
.carousel-slot-container {
  flex: 1;
  display: flex;
  overflow: hidden;

  .carousel-scroll-block {
    flex: 1;
  }
}
</style>
