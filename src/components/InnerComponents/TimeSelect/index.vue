<template>
  <div class="time-select-container" :style="componentOption.style">
    <el-time-select
      v-if="componentOption.timeType === 'select'"
      v-model="componentOption.value"
      :clearable="componentOption.clearable"
      :placeholder="componentOption.placeholder"
      :value-format="componentOption.valueFormat"
      :editable="componentOption.editable"
      :size="elementSize"
      :style="componentOption.style"
      @change="handleChange"
    />
    <el-time-picker
      v-if="componentOption.timeType === 'picker'"
      v-model="componentOption.value"
      :clearable="componentOption.clearable"
      :placeholder="componentOption.placeholder"
      :start-placeholder="componentOption.startPlaceholder"
      :end-placeholder="componentOption.endPlaceholder"
      :format="componentOption.format"
      :value-format="componentOption.valueFormat"
      :editable="componentOption.editable"
      :size="elementSize"
      :style="componentOption.style"
      @change="handleChange"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TimeSelect',
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
  methods: {
    handleChange(value) {
      this.$emit('changeValue', value)
    }
  }
}
</script>

<style scoped lang="scss">
.time-select-container {

  &>div {
    width: 100%;
  }
}
</style>
