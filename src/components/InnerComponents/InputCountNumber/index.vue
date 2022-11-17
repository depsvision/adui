<template>
  <div class="input-count-number-container">
    <el-input-number
      v-model="componentOption.value"
      :controls-position="componentOption.controlsPosition"
      :step-strictly="componentOption.stepStrictly"
      :size="componentOption.size || 'small'"
      :min="componentOption.min"
      :max="componentOption.max"
      :step="componentOption.step"
      :precision="componentOption.precision"
      :placeholder="componentOption.placeholder"
      :style="{width:componentOption.width}"
      @change="handleInputCountNumberChange"
      @blur="handleInputCountNumberBlur"
    />
    <span v-if="componentOption.unit" class="input-count-number-unit">{{ componentOption.unit }}</span>
  </div>
</template>

<script>

export default {
  name: 'InputCountNumber',
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
    handleInputCountNumberChange(value) {
      this.$emit('changeValue', value)
    },
    handleInputCountNumberBlur(event) {
      if (!this.componentOption.value) {
        this.componentOption.value = 0
        this.$emit('changeValue', 0)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.input-count-number-container {
  display: flex;
  align-items: center;

  .input-count-number-unit {
    color: rgba(14, 27, 46, .85);
    margin-left: 8px;
  }
}
</style>
