<template>
  <div class="image-assembly-layout" @click="handleClickImage">
    <el-image
      :src="transformSrc || componentOption.value"
      :class="[componentOption.errImg?'':'image-svg-bg']"
      :fit="componentOption.fit || 'cover'"
    >
      <img v-if="componentOption.errImg" slot="error" :src="componentOption.errImg">
      <svg-icon v-else slot="error" :icon-class="componentOption.value === ''?(componentOption.emptySvg || 'empty-image'):(componentOption.errorSvg||'error-image-line')" />
    </el-image>
    <span
      v-if="componentOption.hasClose && componentOption.value !== ''"
      class="filter-img-remove-img"
      :class="[componentOption.closeDisabled?'is-disabled':'']"
      @click.stop="removePicture()"
    >
      <svg-icon icon-class="error-small-m" />
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { trasformImage } from '@/utils'

export default {
  name: 'ImageAssembly',
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
      transformSrc: null
    }
  },
  computed: {
    ...mapGetters([

    ])
  },
  watch: {
    'componentOption.compress': {
      handler(val) {
        if (val) {
          this.dealSrc()
        }
      },
      deep: true
    }
  },
  methods: {
    removePicture() {
      this.componentOption.value = ''

      this.$emit('changeValue', this.componentOption.value)
    },
    handleClickImage() {
      this.$emit('clickImage')
    },
    async dealSrc() {
      const { format, quality } = this.componentOption.compress

      const result = await trasformImage(this.componentOption.value, format, quality)

      this.transformSrc = result
    }
  }
}
</script>

<style scoped lang="scss">
.image-assembly-layout {
  position: relative;
  flex: 1;
  display: flex;

  .el-image {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    &.image-svg-bg {
      background-color: rgba(230, 232, 234, 1);
    }

  }

  .filter-img-remove-img {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 58, 51, 1);
    border-radius: 50%;

    &:hover {
      cursor: pointer;

      &::after {
        content: " ";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255,255,255,.15);
        border-radius: 50%;
      }
    }

    &.is-disabled {
      pointer-events: none;
      filter: opacity(.65);
    }

    svg {
      font-size: 12px;
      color: #fff;
    }
  }
}
</style>
