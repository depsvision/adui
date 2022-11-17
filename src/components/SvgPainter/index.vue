<template>
  <div ref="container" class="svg-painter-container">
    <div
      ref="painter"
      class="svg-painter-svg"
      :class="['is-' + painterOption.model]"
    />
    <slot name="painer" />
    <a v-show="painterOption.model === 'viewer'" :href="svgPainter && svgPainter.url" @click.prevent />
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import Painter from './painter'

export default {
  name: 'SvgPainter',
  components: {},
  props: {
    componentOption: {
      type: Object,
      default: function() {
        return {}
      }
    },
    img: {
      type: [String, null],
      default: null
    },
    show: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: function() {
        return []
      }
    },
    fill: {
      type: String,
      default: 'contain'
    },
    fontSize: {
      type: Number,
      default: 14
    },
    maxPadding: {
      type: Number,
      default: 5
    },
    deviation: {
      type: Number,
      default: 0
    },
    model: {
      type: String,
      default: 'viewer'
    },
    drawOption: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      svgPainter: null,
      painterOption: {
        show: true,
        img: null,
        data: [],
        fill: 'contain',
        fontSize: 14,
        deviation: 0,
        maxPadding: 5,
        model: 'viewer',
        drawOption: {}
      },
      painter: null
    }
  },
  watch: {
    'componentOption.data': {
      handler(val) {
        this.$nextTick(() => {
          this.init()
        })
      },
      deep: true
    },
    'svgPainter.clipImage': {
      handler(val) {
        val.length && this.$emit('getSvgPainterClipImage', val)
      }
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {

  },
  methods: {
    init() {
      if (Object.keys(this.componentOption).length) {
        this.componentOption.model = this.componentOption.model ?? 'viewer'

        this.painterOption = deepClone(this.componentOption)
      } else {
        this.painterOption = {
          show: this.show,
          img: this.img,
          data: this.data,
          fill: this.fill,
          fontSize: this.fontSize,
          deviation: this.deviation,
          maxPadding: this.maxPadding,
          model: this.model,
          drawOption: this.drawOption
        }
      }

      this.initSvgPainter()
    },
    initSvgPainter() {
      this.painterOption.painter = this.$refs.painter

      this.painterOption.container = this.$refs.container
      this.painterOption.container.style.width = 'auto'
      this.painterOption.container.style.height = 'auto'

      this.painterOption.main = this

      this.painterOption.data && this.painterOption.data.length && (this.painterOption.painter.innerHTML = '')

      this.svgPainter = new Painter(this.painterOption)
    },

    reset() {
      return {
        show: true,
        img: null,
        data: [],
        fill: 'contain',
        fontSize: 14,
        deviation: 0,
        maxPadding: 5,
        model: 'viewer',
        drawOption: {}
      }
    }
  }
}
</script>

<style lang="scss">
.svg-painter-container {
  position: relative;
  flex: 1;
  display: flex;
  justify-content: center;

  .svg-painter-svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;

    &>svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      overflow: initial;
    }

    &.is-painter {

      &>svg {

        &:hover {
          cursor: url('../../assets/roi/mouse-rect.png'), crosshair;
        }
      }
    }
  }

  a {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;

    &:hover {
      cursor: unset;
    }
  }
}
</style>
