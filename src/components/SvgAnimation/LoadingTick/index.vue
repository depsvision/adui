<template>
  <div class="loading-tick-container" :style="{width:`${size}px`,height:`${size}px`}">
    <svg ref="loading" class="loading-tick-loading" :viewBox="`0 0 50 50`">
      <circle
        ref="path"
        class="path"
        :cx="25"
        :cy="25"
        :r="20"
        fill="none"
        :stroke-width="radius * 50 / size"
        :stroke="color"
        stroke-miterlimit="10"
      />
    </svg>
    <svg class="loading-tick-tick">
      <polyline
        ref="tick"
        class="tick"
        fill="none"
        :stroke-width="radius"
        :stroke="color"
        stroke-miterlimit="10"
        :points="`${7.5 * size / 24},${12 * size / 24 } ${11 * size / 24},${15.5 * size / 24} ${16.5 * size / 24},${8.5 * size / 24}`"
        :style="{'stroke-dasharray': `${50 * size / 24}`,'stroke-dashoffset': `${50 * size / 24}`}"
      />
    </svg>
  </div>
</template>

<script>

export default {
  name: 'LoadingTick',
  components: { },
  mixins: [],
  props: {
    size: {
      type: Number,
      default: 24
    },
    status: {
      type: Boolean,
      default: true
    },
    radius: {
      type: Number,
      default: 2
    },
    color: {
      type: String,
      default: 'rgb(24, 114, 240)'
    }
  },
  data() {
    return {

    }
  },
  watch: {
    status: {
      handler(val, old) {
        this.setAnimation(val)
      },
      immediate: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {

    },
    setAnimation(status) {
      this.$nextTick(() => {
        const loading = this.$refs.loading
        const path = this.$refs.path
        const tick = this.$refs.tick

        if (status) {
          loading.style.animation = 'rotate 2s linear 0s infinite normal'

          path.style.animation = 'dash 1.5s ease-in-out infinite'
          path.style['stroke-dasharray'] = '1, 200'

          tick.style.animation = ''
          tick.style['stroke-dashoffset'] = 50 * this.size / 24
          tick.removeEventListener('animationend', this.setTickOffset)
        } else {
          const transform = getComputedStyle(loading, null).transform

          loading.style.transform = transform
          loading.style.animation = ''

          const strokeDasharray = getComputedStyle(path, null)['stroke-dasharray']
          const strokeDashoffset = getComputedStyle(path, null)['stroke-dashoffset']
          const offsetSpin = Number(strokeDashoffset.replace('px', '') ?? 0)
          const offsetReduce = Number(strokeDasharray.split(',')[0].replace('px', '') ?? 0)

          path.style['stroke-dasharray'] = offsetReduce
          path.style['stroke-dashoffset'] = offsetSpin >= -35 ? offsetSpin : -35

          const pathFrame = `{
            from {
              stroke-dasharray: ${offsetReduce} 200;
              stroke-dashoffset: ${offsetSpin};
            }

            to {
              stroke-dasharray: 125, 200;
              stroke-dashoffset: -325;
            }
          }`
          this.setKeyframes('finishDash', pathFrame)
          path.style.animation = `finishDash 1s ease-in-out 1`
          path.style['stroke-dasharray'] = '125, 200'
          path.style['stroke-dashoffset'] = 0

          const tickFrame = `{
            from {
              stroke-dashoffset: ${50 * this.size / 24};
            }

            to {
              stroke-dashoffset: 0;
            }
          }`
          this.setKeyframes('finishTick', tickFrame)
          tick.style.animation = 'finishTick .5s 1s ease-in-out'

          tick.addEventListener('animationend', this.setTickOffset)
        }
      })
    },
    setKeyframes(name, frame) {
      const style = document.createElement('style')
      style.setAttribute('type', 'text/css')
      document.head.appendChild(style)

      const sheet = style.sheet

      sheet.insertRule(
        `@keyframes ${name}${frame}`
      )
    },
    setTickOffset() {
      const tick = this.$refs.tick

      tick.style['stroke-dashoffset'] = 0

      this.$emit('completeAnimation')
    }
  }
}
</script>

<style scoped lang="scss">
.loading-tick-container {
  position: relative;
  line-height: 1;

  .loading-tick-loading {
    transform-origin: center center;

    .path {
      stroke-dashoffset: 0;
      stroke-linecap: round;
    }
  }

  .loading-tick-tick {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
