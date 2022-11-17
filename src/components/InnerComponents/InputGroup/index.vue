<template>
  <div class="input-group-container">
    <button-group
      ref="buttonGroup"
      :component-option="componentOption.buttons"
    />
    <div class="input-group-blcok" :style="{'max-height':componentOption.maxHeight}">
      <div
        v-for="(input,index) in componentOption.inputGroup"
        :key="index"
        class="input-group-item"
      >
        <el-input
          v-model.trim="componentOption.value[index]"
          :type="input.inputType"
          :placeholder="componentOption.placeholder"
          :size="elementSize"
          :clearable="componentOption.clearable"
          :resize="input.resize"
          :style="input.style"
          @input="handleInput"
        />
        <svg-icon v-show="componentOption.inputGroup.length >1" icon-class="error-line" @click="removeItem(index)" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ButtonGroup from '@/components/Button/ButtonGroup'

export default {
  name: 'InputGroup',
  components: { ButtonGroup },
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
  methods: {
    handleInput(value, index) {
      if (this.componentOption.inputType === 'Number') {
        const pattern = /^[1-9][0-9]*$/ // 正整数的正则表达式

        if (!pattern.test(value)) {
          value = ''
        }
      }

      this.$emit('changeValue', this.componentOption.value)
    },
    removeItem(index) {
      this.componentOption.inputGroup.splice(index, 1)

      this.componentOption.value.splice(index, 1)
      this.$emit('changeValue', this.componentOption.value)
    }
  }
}
</script>

<style scoped lang="scss">
.input-group-container {
  display: flex;
  flex-flow: column;

  .input-group-blcok {
    overflow-y: overlay;
    overflow-x: hidden;
    padding-right: 24px;
    margin-right: -24px;

    .input-group-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      &:last-of-type {
        margin-bottom: 0;
      }

      svg {
        font-size: 16px;
        margin-left: 20px;

        &:hover {
          cursor: pointer;
          color: #FF3A33;
        }
      }
    }
  }
}
</style>
