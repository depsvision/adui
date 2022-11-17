<template>
  <div class="input-set-container" :style="componentOption.style">
    <el-input
      v-for="(input,index) in componentOption.group"
      :key="index"
      v-model.trim="componentOption.value[index]"
      :type="input.inputType"
      :placeholder="input.placeholder"
      :maxlength="input.maxlength"
      :size="input.size || elementSize"
      :clearable="input.clearable"
      :style="input.style"
      @input="handleInput"
    >
      <span v-if="input.suffixSpan" slot="suffix" class="input-set-suffix-span">{{ input.suffixSpan }}</span>
    </el-input>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'InputSet',
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
      isFocus: false
    }
  },
  computed: {
    ...mapGetters([
      'elementSize'
    ])
  },
  methods: {
    handleInput(value, index) {
      this.$emit('changeValue', this.componentOption.value)
    }
  }
}
</script>

<style scoped lang="scss">
.input-set-container {

  .el-input {
    flex: 1;
    margin-right: 8px;

    &:last-of-type {
      margin-right: 0;
    }
  }

  .el-input__suffix {

    .input-set-suffix-span {
      font-size: 12px;
      color: rgba(14, 27, 46, 0.65);
    }
  }

}
</style>
