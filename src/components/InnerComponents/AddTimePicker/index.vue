<template>
  <div class="add-time-picker-container">
    <button-group
      ref="buttonGroup"
      :component-option="componentOption.buttons"
    />
    <div class="time-picker-blcok" :style="{'max-height':componentOption.maxHeight}">
      <div
        v-for="(time,index) in componentOption.timePicker"
        :key="index"
        class="time-pikcer-item"
      >
        <span>从</span>
        <el-time-select
          v-model="time.start"
          :size="componentOption.size"
          :placeholder="time.startPlaceholder"
          :editable="componentOption.editable"
          :picker-options="time.startPickerOptions"
          clearable
          @change="value=>{changeStartTime(value,time,index)}"
        />
        <span>到</span>
        <el-time-select
          v-model="time.end"
          :size="componentOption.size"
          :placeholder="time.endPlaceholder"
          :editable="componentOption.editable"
          :picker-options="time.endPickerOptions"
          clearable
          @change="value=>{changeEndTime(value,time,index)}"
        />
        <svg-icon v-show="componentOption.timePicker.length >1" icon-class="error-line" @click="removeItem(index)" />
      </div>
    </div>
  </div>
</template>

<script>
import ButtonGroup from '@/components/Button/ButtonGroup'

export default {
  name: 'AddTimePicker',
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
  methods: {
    parseTime(time) {
      const values = (time || '').split(':')
      if (values.length >= 2) {
        const hours = parseInt(values[0], 10)
        const minutes = parseInt(values[1], 10)

        return minutes + hours * 60
      }
      /* istanbul ignore next */
      return null
    },
    changeStartTime(value, time, index) {
      if (!this.verifyTimeInterval(value, time, index, 'start')) return

      this.$set(time.endPickerOptions, 'minTime', value)
    },
    changeEndTime(value, time, index) {
      if (!this.verifyTimeInterval(value, time, index, 'end')) return

      this.$set(time.startPickerOptions, 'maxTime', value)
    },
    verifyTimeInterval(value, time, index, type) {
      let flag = true

      const timeValue = this.parseTime(value)

      const isInterval = this.componentOption.value.some((item, itemIndex) => {
        const start = this.parseTime(item[0])
        const end = this.parseTime(item[1])

        return itemIndex !== index && timeValue < end && timeValue > start
      })

      if (this.componentOption.value.length > 0 && isInterval) {
        this.$set(time, type, '')

        this.$messageInfo({
          type: 'warning',
          message: '选择时间重叠!'
        })

        flag = false
      } else {
        if ((type === 'start' && time.end !== '') || (type === 'end' && time.start !== '')) {
          this.componentOption.value[index] = [time.start, time.end]

          this.$emit('changeValue', this.componentOption.value)
        }
      }

      return flag
    },
    removeItem(index) {
      this.componentOption.timePicker.splice(index, 1)

      this.componentOption.value.splice(index, 1)
    }
  }
}
</script>

<style scoped lang="scss">
.add-time-picker-container {
  display: flex;
  flex-flow: column;

  &>.button-group-container {
    margin-bottom: 8px;
  }

  .time-picker-blcok {
    overflow-y: overlay;
    overflow-x: hidden;
    padding-right: 24px;
    margin-right: -24px;

    .time-pikcer-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      &:last-of-type {
        margin-bottom: 0;
      }

      &>span {
        font-size: 14px;
        color: rgba(7, 14, 23, 0.85);
        margin-right: 16px;
      }

      .el-date-editor{

        &+span {
          margin-left: 16px;
        }
      }

      div {
        &:first-child {
          margin-right: 8px;
        }
      }

      svg {
        flex-shrink: 0;
        color: rgba(7, 14, 23, 0.5);
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
