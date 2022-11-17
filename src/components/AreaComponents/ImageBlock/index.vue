<template>
  <div class="image-block-container" :style="componentOption.style">
    <div v-loading="componentOption.loading" class="image-block" :class="[imageError || componentOption.value === ''?'is-error':'']">
      <svg-painter :component-option="dealSvgPainterData">
        <template v-slot:painer>
          <el-image
            v-if="componentOption.value !== null"
            v-loading="componentOption.loading"
            :src="componentOption.value"
            :fit="componentOption.fit"
            @load="imgLoaded()"
            @error="imgError()"
          >
            <div slot="error" class="image-slot svg-slot">
              <svg-icon :icon-class="componentOption.value === ''?'empty-image':'error-image-line'" />
            </div>
          </el-image>
        </template>
      </svg-painter>
    </div>
  </div>
</template>

<script>
import SvgPainter from '@/components/SvgPainter'

export default {
  name: 'ImageBlock',
  components: { SvgPainter },
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
      imageError: false
    }
  },
  computed: {
    dealSvgPainterData() {
      const result = {}

      result.img = this.componentOption.value
      result.data = this.componentOption.data
      result.fontSize = 12
      result.maxPadding = 1

      result.show = true

      return result
    }
  },
  methods: {
    imgLoaded() {
      this.imageError = false
    },
    imgError() {
      this.imageError = true
    }
  }
}
</script>

<style scoped lang="scss">
.image-block-container {
  position: relative;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border: 1px solid rgba(27, 53, 89, 0.2);
  overflow: hidden;

  &::before {
    content: " ";
    position: absolute;
    top: -100%;
    left: -30%;
    width: 150%;
    height: 300%;
    background-image: linear-gradient(45deg, rgba(225, 225, 225, 1) 25%, transparent 25%, transparent),
      linear-gradient(-45deg, rgba(225, 225, 225, 1) 25%, transparent 25%, transparent),
      linear-gradient(45deg, transparent 75%, rgba(225, 225, 225, 1) 75%),
      linear-gradient(-45deg, transparent 75%, rgba(225, 225, 225, 1) 75%);
    background-size: 10px 10px;
    transform: rotate(45deg);
  }

  .image-block {
    max-height: 100%;
    max-width: 100%;
    display: flex;

    .el-image {
      flex: unset;

      .el-image__inner {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
      }
    }

    &.is-error {
      height: 100%;
      aspect-ratio: 16 / 9;

      .el-image {
        flex: 1;

        svg {
          font-size: 36px;
        }
      }
    }
  }
}
</style>
