<template>
  <div class="input-assembly-container" :style="componentOption.style">
    <el-input
      ref="input"
      v-model.trim="value"
      :type="componentOption.inputType"
      :autosize="componentOption.autosize"
      :disabled="componentOption.disabled"
      :placeholder="componentOption.placeholder"
      :maxlength="componentOption.maxlength"
      :size="componentOption.size || elementSize"
      :clearable="componentOption.clearable"
      :resize="componentOption.resize"
      :class="[isFocus?'is-focus':'']"
      :style="componentOption.style"
      :show-password="componentOption.showPassword"
      :auto-complete="componentOption.autocomplete"
      @input="handleInput"
      @focus="isFocus = true"
      @blur="inputBlur"
      @keyup.enter.native="handleInputEnter"
      @keydown.tab.native.prevent="handleInputTab"
      @change="handleChange"
    >
      <template v-if="componentOption.prepend" slot="prepend">{{ componentOption.prepend }}</template>
      <span v-if="componentOption.suffixSpan" slot="suffix" class="input-assembly-suffix-span">{{ componentOption.suffixSpan }}</span>
    </el-input>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'InputAssembly',
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
      isFocus: false,
      value: '',
      lastValue: '',
      setValueTimer: null
    }
  },
  computed: {
    ...mapGetters([
      'elementSize'
    ])
  },
  watch: {
    'componentOption.value'(val) {
      this.value = val
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.value = this.componentOption.value
      this.lastValue = this.componentOption.value
    },
    handleInput(value) {
      let resultValue = this.value

      if (this.componentOption.valueType === 'Number') {
        const pattern = /^-?[0-9][0-9]*$/ // 整数的正则表达式

        if (this.value !== '' && this.value !== '-' && !pattern.test(this.value)) {
          this.value = this.lastValue
        } else {
          this.lastValue = this.value
        }

        if (this.value) {
          const numberValue = Number(this.value)

          let errString = '请输入'

          if (typeof this.componentOption.min !== 'undefined' && this.componentOption.min !== null) {
            errString += '大于' + this.componentOption.min
          }

          if (typeof this.componentOption.max !== 'undefined' && this.componentOption.max !== null) {
            errString += '小于' + this.componentOption.max
          }

          errString += '的值'

          if (numberValue > this.componentOption.max || numberValue < this.componentOption.min) {
            this.$set(this.componentOption, 'errorMessage', errString)
          } else {
            this.$set(this.componentOption, 'errorMessage', '')
          }

          if (this.componentOption.force && this.componentOption.force.length > 0) {
            const numberValue = Number(this.value)

            if (numberValue > this.componentOption.force[1]) {
              this.value = String(this.componentOption.force[1])
            } else if (numberValue < this.componentOption.force[0]) {
              this.value = String(this.componentOption.force[0])
            }
          }
        } else {
          this.$set(this.componentOption, 'errorMessage', '')
        }

        if (value !== '-') {
          resultValue = Number(this.value ?? 0)
        }
      }

      clearTimeout(this.setValueTimer)
      this.setValueTimer = null
      this.setValueTimer = setTimeout(() => {
        this.$emit('changeValue', resultValue)
      }, 100)
    },
    handleInputEnter() {
      this.$store.dispatch('button/simulateButton', 'inputEnter' + (this.componentOption.prop ? '-' + this.componentOption.prop : ''))
    },
    handleInputTab() {
      if (this.componentOption.inputType === 'textarea') {
        const input = this.$refs.input.$el.children[0]

        const startPos = input.selectionStart ?? 0
        const endPos = input.selectionEnd ?? 0
        const value = input.value
        const length = value.length

        if (!startPos || !endPos || startPos === length || endPos === length) {
          return
        }

        const result = `${value.substring(0, startPos)}  ${value.substring(endPos)}`

        this.componentOption.value = result

        this.$nextTick(() => {
          input.focus()
          input.selectionStart = startPos + 2
          input.selectionEnd = startPos + 2
        })
      }
    },
    inputBlur() {
      this.isFocus = false

      this.$store.dispatch('button/simulateButton', 'inputBlur' + '-' + this.componentOption.prop)
    },
    handleChange(value) {
      this.$emit('handleChange', value)
    }
  }
}
</script>

<style scoped lang="scss">
.input-assembly-container {

  .el-input {
    width: 100%;
  }

  ::v-deep .el-textarea {

    .el-textarea__inner {
      height: 100%;
    }
  }

  .input-assembly-font {
    margin-right: 8px;
  }

  .el-input__suffix {

    .input-assembly-suffix-span {
      font-size: 12px;
      color: rgba(14, 27, 46, 0.65);
    }
  }

}
</style>
