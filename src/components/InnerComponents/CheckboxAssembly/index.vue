<template>
  <div class="checkbox-assembly-container">
    <el-checkbox-group v-model="componentOption.value" @change="handleCheckbox">
      <el-checkbox
        v-for="checkbox in componentOption.checkbox"
        :key="checkbox.value"
        :label="checkbox.value"
        :style="componentOption.style"
        :indeterminate="checkbox.indeterminate"
        :disabled="checkbox.disabled"
        @change="value=>{changeCheckBox(value,checkbox)}"
      >
        {{ checkbox.label }}
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
import { deepClone } from '@/utils'

export default {
  name: 'CheckboxAssembly',
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
      lastValue: []
    }
  },
  watch: {
    'componentOption.value': {
      handler(val) {
        const value = this.componentOption.value.length > this.lastValue
        this.dealRelateCheckbox(value)
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {

    },
    handleCheckbox(value) {
      this.$emit('changeValue', value)
    },
    changeCheckBox(value, checkbox) {
      if (checkbox.indeterminate !== undefined) {
        this.$store.dispatch('data/setData', { obj: 'checkbox', key: this.componentOption.prop, value: this.componentOption.value })
      }

      this.dealRelateCheckbox(value)
    },
    dealRelateCheckbox(value, type) {
      const newValue = this.componentOption.value
      const longArr = value ? newValue : this.lastValue
      const shortArr = value ? this.lastValue : newValue

      const change = longArr.filter(value => !shortArr.includes(value))
      const changeCheckbox = this.componentOption.checkbox.filter(checkbox => change.includes(checkbox.value))

      changeCheckbox.forEach(check => {
        if (check && check.relate !== undefined) {
          check.relate.forEach(checkbox => {
            const relate = this.componentOption.checkbox.find(item => item.value === checkbox)

            relate.disabled !== value && this.$set(relate, 'disabled', value)

            if (value) {
              !this.componentOption.value.includes(checkbox) && this.componentOption.value.push(checkbox)
            } else {
              const index = this.componentOption.value.indexOf(checkbox)
              index !== -1 && this.componentOption.value.splice(index, 1)
            }
          })

          this.$emit('changeValue', this.componentOption.value)
        }
      })

      this.lastValue = deepClone(this.componentOption.value)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
