<template>
  <div class="date-picker-container">
    <el-date-picker
      v-model="componentOption.value"
      :disabled="componentOption.disabled"
      :type="componentOption.data"
      :align="componentOption.align"
      :start-placeholder="componentOption.startPlaceholder"
      :end-placeholder="componentOption.endPlaceholder"
      :default-time="componentOption.defaultTime || defaultTime"
      :picker-options="componentOption.pickerOptions"
      :value-format="componentOption.valueFormat"
      :size="elementSize"
      :style="{
        width:componentOption.width
      }"
      @change="handleChange"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DatePicker',
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
      defaultTime: ['00:00:00', this.$dayjs().hour() + ':' + this.$dayjs().minute() + ':' + this.$dayjs().second()]
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
.date-picker-container {

  .el-date-editor--datetimerange{
    width: 100%;
  }

}
</style>
