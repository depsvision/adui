<template>
  <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" />
  <component :is="componentOption.is" v-else-if="isComponent" :class="svgClass" aria-hidden="true" />
  <!-- remove v-on for vue3 usage -->
  <svg v-else :class="svgClass" aria-hidden="true" >
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
import { isExternal } from '@/utils/validate'

import UploadStatus from '@/components/SvgAnimation/UploadStatus'

export default {
  name: 'SvgIcon',
  components: { UploadStatus },
  props: {
    componentOption: {
      type: Object,
      default: function() {
        return {}
      }
    },
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.iconClass)
    },
    isComponent() {
      return !!Object.keys(this.componentOption).length
    },
    iconName() {
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    },
    styleExternalIcon() {
      return {
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`
      }
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover!important;
  display: inline-block;
}
</style>
