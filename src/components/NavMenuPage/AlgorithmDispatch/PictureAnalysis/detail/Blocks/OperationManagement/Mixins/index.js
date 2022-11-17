import task from '@/api/task'
import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      taskStatusDialog: {},
      taskStatusDialogTemplate: {
        name: 'CheckStart',
        option: {
          action: 'start',
          check: {},
          start: {
            data: {},
            svgIcon: {},
            text: {},
            buttons: {},
            item: [
              {
                head: '任务就绪检查结果',
                prop: 'taskResult'
              },
              {
                head: '任务启用状态',
                prop: 'taskStatus'
              }
            ]
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'button',
      'dialog',
      'buttonScope'
    ])
  },
  watch: {
    'button.value'(val) {
      this.clickButton(val)
    }
  },
  methods: {
    clickButton(value) {
      switch (value) {
        // task Status
        case 'editTaskStatus':
          this.startTaskStatus()
          break
        case 'stopTaskStatus':
          this.stopTaskStatus()
          break
        case 'startTask':
          this.controlTask(true)
          break
        case 'stopTask':
          this.controlTask(false)
          break
      }
    },
    startTaskStatus() {
      // 清空数据
      this.taskStatusDialog = deepClone(this.taskStatusDialogTemplate)
      const option = this.taskStatusDialog.option

      option.action = ''

      option.start.data = {
        taskResult: '任务就绪',
        taskStatus: '启用任务'
      }

      option.start.svgIcon = {
        taskResult: 'success',
        taskStatus: 'success'
      }

      option.start.text = {
        taskResult: '任务可以启用',
        taskStatus: ''
      }

      this.showEditTaskStatusDialog(this.taskStatusDialog)
    },
    stopTaskStatus() {
      this.taskStatusDialog = deepClone(this.taskStatusDialogTemplate)
      const option = this.taskStatusDialog.option

      option.action = 'stop'

      option.start.data = {
        taskResult: '任务就绪',
        taskStatus: '停用任务'
      }

      option.start.svgIcon = {
        taskResult: 'success',
        taskStatus: 'success'
      }

      option.start.text = {
        taskResult: '任务可以停用',
        taskStatus: ''
      }

      this.showEditTaskStatusDialog(this.taskStatusDialog)
    },
    showEditTaskStatusDialog(dialog) {
      let status = false
      if (this.formListOption) {
        status = this.formListOption.data.runningStatus
      } else {
        status = this.buttonScope.row.status
      }

      const assignObj = {
        title: (!status ? '启用' : '停用') + '任务',
        show: true,
        name: 'DialogShell',
        customClass: 'dialog--mini',
        buttons: {
          style: {
            'justify-content': 'space-between'
          },
          buttons: [
            {
              label: '立即启用',
              value: 'startTask',
              hide: !!status,
              plain: true
            },
            {
              label: '立即停用',
              value: 'stopTask',
              hide: !status,
              plain: true
            },
            {
              label: '关闭',
              value: 'cancel',
              type: 'primary'
            }
          ]
        },
        component: dialog
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    controlTask(type) {
      this.taskStatusDialog.option.start.svgIcon.taskStatus = 'waitting-loadiing'
      let id = 0
      if (this.formListOption) {
        id = Number(this.formListOption.data.id)
      } else {
        id = this.buttonScope.row.id
      }

      if (type) {
        this.dialog.component.option.start.data.taskStatus = '启用中'
        this.dialog.component.option.start.text.taskStatus = '正在查询启用结果，预计很快返回结果。'
        this.dialog.buttons.buttons[0].disabled = true
        this.dialog.buttons.buttons[1].disabled = true
        this.dialog.self.$refs.buttonGroup.$forceUpdate()

        task.startImageTask({ id: id }, true)
          .then(res => {
            this.$messageInfo({
              type: 'success',
              message: '启用任务成功！'
            })

            this.$store.dispatch('dialog/initDialogData')

            if (this.formListOption) {
              this.$parent.$parent.pageLoading = true

              setTimeout(() => {
                this.$parent.$parent.getPictureDetail()
              }, 1000)
            } else {
              this.getPictureAnalysisData()
            }
          })
          .catch(err => {
            this.dialog.component.option.start.data.taskStatus = '启用失败'
            this.dialog.component.option.start.text.taskStatus = err.errorMsg.replaceAll('\n', '<br />')
            // this.dialog.component.option.start.buttons.taskStatus = [
            //   {
            //     label: '查看详情',
            //     value: 'linkToLicense',
            //     type: 'text'
            //   }
            // ]

            this.taskStatusDialog.option.start.svgIcon.taskStatus = 'error'
          })
      } else {
        this.dialog.component.option.start.data.taskStatus = '停用中'
        this.dialog.component.option.start.text.taskStatus = '正在停用任务，预计很快返回结果。'
        this.dialog.buttons.buttons[0].disabled = true
        this.dialog.buttons.buttons[1].disabled = true
        this.dialog.self.$refs.buttonGroup.$forceUpdate()

        task.stopImageTask({ id: id })
          .then(res => {
            this.$messageInfo({
              type: 'success',
              message: '停用任务成功！'
            })

            this.$store.dispatch('dialog/initDialogData')

            if (this.formListOption) {
              this.$parent.$parent.pageLoading = true
              this.$parent.$parent.getPictureDetail()
            } else {
              this.getPictureAnalysisData()
            }
          })
          .catch(() => {
            this.dialog.component.option.start.data.taskStatus = '停用失败'
            this.dialog.component.option.start.text.taskStatus = ''

            this.taskStatusDialog.option.start.svgIcon.taskStatus = 'error'
          })
      }
    }
  }
}
