<template>
  <div class="radio-assembly-container">
    <el-radio-group
      v-model="componentOption.value"
      class="radio-assembly-group"
      :class="{'flex-column-class':componentOption.flex === 'column' }"
      @change="handleRadio"
    >
      <el-radio
        v-for="radio in componentOption.radio"
        :key="radio.value"
        v-model="radio.value"
        :label="radio.value"
        :disabled="radio.disabled"
      >
        <span>{{ radio.label }}</span>
        <span v-if="radio.tip" class="font-tip">{{ radio.tip }}</span>
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script>

export default {
  name: 'RadioAssembly',
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
    handleRadio(value) {
      this.$emit('changeValue', value, this.componentOption)
    }
  }
}
</script>

<style scoped lang="scss">
.radio-assembly-container {

  .radio-assembly-group {
    display: flex;

    &.flex-column-class {

      ::v-deep .el-radio {
        margin-bottom: 16px;

        &:last-of-type{
          margin-bottom: 0;
        }
      }
    }

    ::v-deep .el-radio {

      &.is-checked {

        .font-tip {
          color: rgba(24, 114, 240, 1);
        }
      }
    }
  }
}
</style>
