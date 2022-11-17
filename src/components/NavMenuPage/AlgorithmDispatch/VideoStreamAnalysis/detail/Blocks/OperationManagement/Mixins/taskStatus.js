import task from '@/api/task'
import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      serveTimer: null,
      taskStatusDialog: {},
      taskStatusDialogTemplate: {
        name: 'CheckStart',
        option: {
          action: 'start',
          check: {
            head: '任务就绪检查项',
            labelWidth: 154,
            data: {},
            svgIcon: {},
            list: [
              {
                label: '算法任务已选择',
                prop: 'algorithm_choice'
              },
              {
                head: '监控点位',
                item: [
                  {
                    label: '监控点位已选择',
                    prop: 'camera_choice'
                  }
                ]
              },
              {
                label: '计算服务可用',
                prop: 'service_status'
              }
            ]
          },
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
      'dialog',
      'checkStart',
      'closeDialogName'
    ])
  },
  watch: {
    'checkStart.waitting'(val) {
      this.allowControlTask()
    },
    'dialog.show'(val) {
      if (!val && this.serveTimer) {
        clearInterval(this.serveTimer)
        this.serveTimer = null
      }
    },
    closeDialogName(val) {
      if (val.split('-')[0] === 'CheckStart') {
        this.refreshDetail()
      }
    }
  },
  methods: {
    refreshDetail() {
      this.$parent.$parent.getTaskDetail()
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
        taskStatus: '停用后计算节点将被释放，同时报警推送等也将停止，请确定后再操作'
      }

      this.showEditTaskStatusDialog(this.taskStatusDialog)
    },
    showEditTaskStatusDialog(dialog) {
      const assignObj = {
        title: this.formListOption.form[0].buttons.buttons[0].label + '任务',
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
              disabled: true,
              hide: !!this.formListOption.data.runningStatus,
              plain: true
            },
            {
              label: '立即停用',
              value: 'stopTask',
              disabled: true,
              hide: !this.formListOption.data.runningStatus,
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

      this.$store.dispatch('dialog/initDialogData')

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    getTaskEnableData() {
      task.getTaskCheck({ taskId: this.$route.query.id })
        .then(res => {
          const { data } = res

          // 清空数据
          this.taskStatusDialog = deepClone(this.taskStatusDialogTemplate)
          const option = this.taskStatusDialog.option
          option.action = 'start'

          option.check.data = {
            algorithm_choice: !data.algorithm.choice ? '未选择' : data.algorithm.choice + '种算法',
            camera_choice: !data.camera.choice ? '未选择' : data.camera.choice + '个点位',
            service_status: ['无可用', data.service.name + '-' + data.service.id][data.service.status]
          }

          option.check.svgIcon = {
            algorithm_choice: !data.algorithm.choice ? 'error-small' : 'success-small',
            camera_choice: !data.camera.choice ? 'error-small' : 'success-small',
            service_status: ['error-small', 'success-small'][data.service.status]
          }

          option.start.data = {
            taskResult: ['任务未就绪', '任务就绪', '部分就绪'][data.task.status],
            taskResultCache: '检查任务',
            taskStatus: ['任务无法操作', '任务可以操作', '任务可以操作'][data.task.status],
            taskStatusCache: '等待中'
          }

          option.start.svgIcon = {
            taskResult: ['error', 'success', 'warning'][data.task.status],
            taskStatus: ['error', 'success', 'success'][data.task.status]
          }

          option.start.text = {
            taskResult: ['请注意检查未就绪的内容并重试', '任务已准备就绪', '请注意检查未就绪的内容，系统将在检测到相关内容就绪后自动修复任务'][data.task.status],
            taskResultCache: '任务检查中...',
            taskStatus: '',
            taskStatusCache: '等待任务检查结束'
          }

          this.showEditTaskStatusDialog(this.taskStatusDialog)
        })
    },
    allowControlTask() {
      if (!this.dialog.buttons) return

      if (this.taskStatusDialog.option.start.svgIcon.taskStatus === 'success') {
        this.dialog.buttons.buttons[0].disabled = false
        this.dialog.buttons.buttons[1].disabled = false
      } else {
        this.dialog.buttons.buttons[0].disabled = true
        this.dialog.buttons.buttons[1].disabled = true
      }

      this.dialog.self.$refs.buttonGroup.$forceUpdate()
    },
    controlTask(type) {
      this.taskStatusDialog.option.start.svgIcon.taskStatus = 'waitting-loadiing'
      if (type) {
        task.taskStart({ taskId: this.$route.query.id, serviceId: this.formListOption.data.serviceId }, true)
          .then(res => {
            this.dialog.component.option.start.data.taskStatus = '启用中'
            this.dialog.component.option.start.text.taskStatus = '正在查询启用结果，服务需要10～120s启动时间，您可以关闭该窗口并稍后查看状态。'
            this.dialog.buttons.buttons[0].disabled = true
            this.dialog.buttons.buttons[1].disabled = true
            this.dialog.self.$refs.buttonGroup.$forceUpdate()

            this.pollServeStatus()
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
        task.taskStop({ taskId: this.$route.query.id, serviceId: this.formListOption.data.serviceId })
          .then(res => {
            this.dialog.component.option.start.data.taskStatus = '停用中'
            this.dialog.component.option.start.text.taskStatus = '正在停用任务，预计很快返回结果。'
            this.dialog.buttons.buttons[0].disabled = true
            this.dialog.buttons.buttons[1].disabled = true
            this.dialog.self.$refs.buttonGroup.$forceUpdate()

            this.pollServeStatus()
          })
          .catch(() => {
            this.dialog.component.option.start.data.taskStatus = '停用失败'
            this.dialog.component.option.start.text.taskStatus = ''

            this.taskStatusDialog.option.start.svgIcon.taskStatus = 'error'
          })
      }
    },
    pollServeStatus() {
      if (!this.serveTimer) {
        this.serveTimer = setInterval(() => {
          this.getTaskRuningStatus()
        }, 3000)
      }
    },
    getTaskRuningStatus() {
      task.getRunningStatus({ taskId: this.$route.query.id })
        .then(res => {
          const { status } = res.data
          this.setTaskDialog(status)
        })
    },
    setTaskDialog(status) {
      const option = this.taskStatusDialog.option
      if (status === 0) {
        option.start.svgIcon.taskStatus = 'success'

        option.start.text.taskStatus = '已成功停用'
      } else if (status === 1) {
        option.start.svgIcon.taskStatus = 'success'

        option.start.text.taskStatus = '已成功启用'
      } else if (status === 4) {
        option.start.svgIcon.taskStatus = 'success'

        option.start.data.taskStatus = '待机中'
        option.start.text.taskStatus = '任务已进入待机时间段'
      }
    }
  }
}
