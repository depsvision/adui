import task from '@/api/task'
import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      taskTimeDialog: {},
      taskTimeDialogTemplate: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            enableTimeValue: 0,
            weekday: [],
            time: []
          },
          form: [
            {
              type: 'radioAssembly',
              label: '启用时间',
              prop: 'enableTimeValue',
              radio: [
                {
                  label: '7 x 24小时',
                  value: 0
                },
                {
                  label: '自定义时间段',
                  value: 1
                }
              ]
            },
            {
              type: 'tagAssembly',
              label: '自定义周期',
              prop: 'weekday',
              class: 'form-label--top',
              tagClass: 'is-button',
              tagClick: true,
              isInlineError: true,
              weekdayTag: [
                {
                  label: '周一',
                  value: 0
                },
                {
                  label: '周二',
                  value: 1
                },
                {
                  label: '周三',
                  value: 2
                },
                {
                  label: '周四',
                  value: 3
                },
                {
                  label: '周五',
                  value: 4
                },
                {
                  label: '周六',
                  value: 5
                },
                {
                  label: '周日',
                  value: 6
                }
              ]
            },
            {
              type: 'addTimePicker',
              label: '起始时间段',
              prop: 'time',
              size: 'medium',
              class: 'form-label--top',
              maxHeight: '220px',
              editable: false,
              isInlineError: true,
              buttons: {
                buttons: [
                  {
                    label: '新增时间段',
                    value: 'addTimePicker',
                    type: 'text',
                    class: 'is-black',
                    svgIconLeft: 'plus'
                  }
                ]
              },
              timePicker: []
            }
          ],
          labelPosition: 'left',
          labelWidth: '120px'
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'button',
      'dialog'
    ])
  },
  watch: {
    'dialog.listenerData': {
      handler(val) {
        if (!val || this.dialog.listenerKey !== 'enableTimeValue') return

        if (val.enableTimeValue) {
          this.dialog.component.option.form[1].class = 'form-label--top'
          this.dialog.component.option.form[2].class = 'form-label--top'
        } else {
          this.dialog.component.option.form[1].class = 'form-label--top is-disabled'
          this.dialog.component.option.form[2].class = 'form-label--top is-disabled'
        }
      },
      deep: true
    },
    'dialog.listenerDataTime'(val) {
      if (val && (this.dialog.listenerKey === 'weekday' || this.dialog.listenerKey === 'time')) {
        const task = this.taskTimeDialog.option.data

        if (task.weekday.length > 0) {
          this.$set(this.dialog.component.option.form[1], 'errorMessage', '')
        }

        const hasTime = task.time.some(item => item[0] && item[1])

        if (hasTime) {
          this.$set(this.dialog.component.option.form[2], 'errorMessage', '')
        }
      }
    }
  },
  methods: {
    openTaskTimeDialog() {
      // 清空数据
      this.taskTimeDialog = deepClone(this.taskTimeDialogTemplate)

      const assignObj = {
        title: '任务启用时间',
        show: true,
        name: 'DialogShell',
        customClass: 'dialog--mini',
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '保存',
              value: 'saveTaskTime',
              type: 'primary'
            }
          ]
        },
        component: this.taskTimeDialog
      }

      this.taskTimeDialog.option.data = deepClone(this.formListOption.data)

      this.taskTimeDialog.option.data.time.forEach(item => {
        this.taskTimeDialog.option.form[2].timePicker.push({
          start: item[0],
          end: item[1],
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          startPickerOptions: {
            start: '00:00',
            end: '23:45',
            step: '00:15',
            maxTime: item[1]
          },
          endPickerOptions: {
            start: '00:15',
            end: '24:00',
            step: '00:15',
            minTime: item[0]
          }
        })
      })

      if (!this.taskTimeDialog.option.data.enableTimeValue) {
        this.taskTimeDialog.option.form[1].class = 'form-label--top is-disabled'
        this.taskTimeDialog.option.form[2].class = 'form-label--top is-disabled'
      } else {
        this.taskTimeDialog.option.form[1].class = 'form-label--top'
        this.taskTimeDialog.option.form[2].class = 'form-label--top'
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    addTimePicker() {
      this.dialog.component.option.form[2].timePicker.push({
        start: '',
        end: '',
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间',
        startPickerOptions: {
          start: '00:00',
          end: '23:45',
          step: '00:15'
        },
        endPickerOptions: {
          start: '00:15',
          end: '24:00',
          step: '00:15',
          minTime: ''
        }
      })

      this.dialog.component.option.form[2].value.push([])
    },
    saveTaskTime() {
      const enableTime = this.taskTimeDialog.option.data.enableTimeValue
      const taskData = this.taskTimeDialog.option.data

      const params = {
        taskId: this.$route.query.id
      }

      if (enableTime) {
        params.enableTime = {}

        if (taskData.weekday.length === 0) {
          this.$set(this.dialog.component.option.form[1], 'errorMessage', '请选择自定义周期')
        }

        const hasTime = taskData.time.some(item => item[0] && item[1])

        if (!hasTime) {
          this.$set(this.dialog.component.option.form[2], 'errorMessage', '请选择起始时间段')
        }

        if (taskData.weekday.length === 0 || !hasTime) return

        params.enableTime.weekday = taskData.weekday.sort((a, b) => a - b)

        params.enableTime.time = taskData.time.filter(item => item[0] && item[1])
      }

      task.editEnableTime(params)
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: '保存任务启用时间成功!'
          })

          this.$store.dispatch('dialog/initDialogData')
          this.formListOption.data.enableTimeName = taskData.enableTimeValue ? '自定义时间段' : '7 x 24小时'
          this.formListOption.data.enableTimeValue = taskData.enableTimeValue
          this.formListOption.data.weekday = taskData.enableTimeValue ? params.enableTime.weekday : []
          this.formListOption.data.time = taskData.enableTimeValue ? params.enableTime.time : [[]]
        })
    }
  }
}
