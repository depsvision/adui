<template>
  <div class="slider-control-container">
    <el-slider
      ref="left"
      v-model="componentOption.value.left"
      :disabled="componentOption.left.disabled"
      :min="componentOption.left.min"
      :max="componentOption.left.max"
      :step="componentOption.left.step"
      :format-tooltip="formatLeftTooltip"
      class="slider-control-left"
      :style="componentOption.left.style"
      @change="handleLeftChange"
    />
    <svg-icon :icon-class="componentOption.svg" />
    <el-slider
      ref="right"
      v-model="componentOption.value.right"
      :disabled="componentOption.right.disabled"
      :min="componentOption.right.min"
      :max="componentOption.right.max"
      :step="componentOption.right.step"
      :format-tooltip="formatRightTooltip"
      class="slider-control-right"
      :style="componentOption.right.style"
      @change="handleRightChange"
    />
  </div>
</template>

<script>

export default {
  name: 'SliderControl',
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

    }
  },
  methods: {
    formatLeftTooltip(value) {
      const { formatTooltip } = this.componentOption

      if (formatTooltip) {
        return formatTooltip(value, 'left')
      } else {
        return value
      }
    },
    formatRightTooltip(value) {
      const { formatTooltip } = this.componentOption

      if (formatTooltip) {
        return formatTooltip(value, 'right')
      } else {
        return value
      }
    },
    handleLeftChange(value) {
      this.handleChange(value, 'left')
    },
    handleRightChange(value) {
      this.handleChange(value, 'right')
    },
    handleChange(value, type) {
      const { handleChange } = this.componentOption

      handleChange && handleChange(value, type)

      this.$nextTick(() => {
        const slider = this.$refs[type]

        slider.$refs.button1.hideTooltip()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.slider-control-container {

  .el-slider {
    display: flex;
    align-items: center;
  }

  ::v-deep .slider-control-left {

    .el-slider__runway {
      height: 4px;
      margin: 5px 0;
      background-color: rgba(24, 114, 240, 1);

      .el-slider__bar {
        height: 4px;
        background-color: #dde1e6;
      }
    }
  }

  &>svg {
    font-size: 16px;
    border-left: 2px solid rgba(14, 27, 46, 1);
    border-right: 2px solid rgba(14, 27, 46, 1);
    padding: 0 9px;
  }

}
</style>
