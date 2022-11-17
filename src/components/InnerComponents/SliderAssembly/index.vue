<template>
  <div class="slider-assembly-container">
    <el-slider
      ref="slider"
      v-model="componentOption.value"
      :step="componentOption.step"
      :show-stops="componentOption.showStops"
      :min="componentOption.min"
      :max="componentOption.max"
      :marks="componentOption.marks"
      :format-tooltip="formatTooltip"
      @change="handleChange"
      @input="handleInput"
    />
    <span v-if="componentOption.unit" class="slider-assembly-last-text">{{ componentOption.value + componentOption.unit }}</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SliderAssembly',
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
  computed: {
    ...mapGetters([
      'elementSize'
    ])
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.componentOption.refs = this.$refs.slider
    },
    handleChange(value) {
      this.$emit('changeValue', value)

      this.$nextTick(() => {
        const slider = this.$refs.slider

        slider.$refs.button1.hideTooltip()
      })
    },
    handleInput(value) {
      this.$emit('changeInput', value)

      if (this.componentOption.dealInput) {
        this.componentOption.dealInput(value)
      }
    },
    formatTooltip(value) {
      if (this.componentOption.formatTooltip) {
        return this.componentOption.formatTooltip(value)
      } else {
        return value
      }
    }
  }
}
</script>

<style scoped lang="scss">
.slider-assembly-container {
  flex: 1;
  display: flex;
  align-items: center;

  .el-slider {
    flex: 1;
  }

  .slider-assembly-last-text {
    font-size: 14px;
    color: rgba(14, 27, 46, 1);
    margin-left: 16px;
  }
}
</style>
