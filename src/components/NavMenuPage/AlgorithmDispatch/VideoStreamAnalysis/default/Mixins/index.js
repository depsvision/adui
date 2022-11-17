import task from '@/api/task'
import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      serveTimer: null,
      taskTimer: null,
      taskId: null,
      taskDialog: {},
      taskDialogTemplate: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            name: ''
          },
          rule: {
            name: [
              { required: true, message: '请输入名称', trigger: ['blur', 'change'] }
            ]
          },
          form: [
            {
              type: 'inputAssembly',
              label: '任务名称',
              tip: '更多配置信息请在任务详情操作',
              prop: 'name',
              placeholder: '请输入名称'
            }
          ],
          labelPosition: 'left',
          labelWidth: '120px'
        }
      },
      taskStatusDialog: {},
      taskStatusDialogTemplate: {
        name: 'CheckStart',
        option: {
          action: 'start',
          check: {
            head: '任务就绪检查项',
            labelWidth: 150,
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
      },
      MpegtsMonitor: {
        name: 'MpegtsMonitor',
        option: {
          url: '',
          tipList: []
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'dialog',
      'button',
      'buttonScope',
      'checkStart',
      'closeDialogName'
    ])
  },
  watch: {
    'checkStart.waitting'(val) {
      this.allowControlTask()
    },
    'button.value'(val) {
      this.clickButton(val)
    },
    'dialog.show'(val) {
      if (!val && this.serveTimer) {
        clearInterval(this.serveTimer)
        this.serveTimer = null
      }
    },
    closeDialogName(val) {
      if (val.split('-')[0] === 'CheckStart') {
        this.init()
      }
    }
  },
  methods: {
    clickButton(value) {
      switch (value) {
        case 'new':
          this.showAddTaskDialog()
          break
        case 'saveTask':
          this.saveTask()
          break
        case 'detail':
          this.intoAnalysisDetail()
          break
        case 'start':
          this.getTaskEnableData()
          break
        case 'stop':
          this.stopTaskStatus()
          break
        case 'startTask':
          this.controlTask(true)
          break
        case 'stopTask':
          this.controlTask(false)
          break
        case 'demoVideo':
          this.openVideoDialog()
          break
        default:
      }
    },
    openVideoDialog() {
      const assignObj = {
        title: '演示视频',
        show: true,
        name: 'DialogShell',
        customClass: 'dialog--medium dialog-height--medium',
        component: this.MpegtsMonitor
      }

      if (this.buttonScope.row.url.length > 0) {
        this.MpegtsMonitor.option.code = this.buttonScope.row.url[0].code_type
        this.MpegtsMonitor.option.url = this.buttonScope.row.url[0].url
        this.MpegtsMonitor.option.tipList = [
          {
            label: this.buttonScope.row.url[0].algorithmName,
            style: {
              'font-size': '14px',
              color: 'rgba(14, 27, 46, 0.85)'
            }
          },
          {
            label: this.buttonScope.row.url[0].cameraName,
            style: {
              'font-size': '12px',
              color: 'rgba(14, 27, 46, 0.5)',
              'margin-left': '16px'
            }
          }
        ]
        this.MpegtsMonitor.option.video = {
          trigger: 'click',
          placement: 'top-start',
          appendToBody: false,
          svgIcon: 'video_list',
          class: 'is-inner',
          option: [],
          style: {
            'max-height': '188px',
            'overflow-y': 'auto'
          }
        }

        const videoList = []
        this.buttonScope.row.url.forEach(item => {
          videoList.push({
            label: item.algorithmName + ' ' + item.cameraName,
            url: item.url
          })
        })
        this.MpegtsMonitor.option.video.option = videoList

        this.$store.dispatch('dialog/assignDialogData', assignObj)
      } else {
        this.$messageInfo({
          type: 'warning',
          message: '暂无演示视频'
        })
      }
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
        task.taskStart({ taskId: this.buttonScope.row.id, serviceId: this.taskStatusDialog.serviceId }, true)
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
        task.taskStop({ taskId: this.buttonScope.row.id, serviceId: this.taskStatusDialog.serviceId })
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
      task.getRunningStatus({ taskId: this.taskId })
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
    },
    getTaskEnableData() {
      this.taskId = this.buttonScope.row.id
      task.getTaskCheck({ taskId: this.buttonScope.row.id })
        .then(res => {
          const { data } = res

          // 清空数据
          this.taskStatusDialog = deepClone(this.taskStatusDialogTemplate)
          const option = this.taskStatusDialog.option
          this.taskStatusDialog.serviceId = data.service.id
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
    stopTaskStatus() {
      this.taskId = this.buttonScope.row.id
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
        title: (!this.buttonScope.row.status ? '启用' : '停用') + '任务',
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
              hide: !!this.buttonScope.row.status,
              plain: true
            },
            {
              label: '立即停用',
              value: 'stopTask',
              disabled: true,
              hide: !this.buttonScope.row.status,
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
    getVideoStreamData() {
      const params = {
        page: this.tablePagerOption.currentPage,
        size: this.tablePagerOption.pageSizes
      }

      task.getTaskList(params)
        .then(res => {
          const { taskList } = res.data

          this.dealData(taskList)

          this.serveTableOption.tableData = taskList

          this.tablePagerOption = Object.assign(this.tablePagerOption, res.data.pageVO)

          if (!this.taskTimer) {
            this.taskTimer = setInterval(() => {
              this.getVideoStreamData()
            }, 6000)
          }

          this.pageLoading = false
        })
        .catch(() => {
          this.pageLoading = false
        })
    },
    dealData(data) {
      data.forEach(item => {
        item.statusName = item.status ? '已启用' : '已停用'
        item.statusNameClass = ['is-half', ''][item.status]
        item.hide = item.status ? ['start'] : ['stop']

        item.taskHealName = item.status ? ['异常', '正常', '注意'][item.taskHeal] : '无'
        item.taskHealNameClass = item.status ? ['is-red', 'is-green', 'is-orange'][item.taskHeal] : 'is-grey'

        item.autoScheduleName = item.autoSchedule ? '已开启' : '未开启'

        item.serviceHealthName = ['异常', '正常', '注意'][item.serviceHealth] || '无'
        item.serviceHealthNameClass = ['is-red', 'is-green', 'is-orange'][item.serviceHealth] || 'is-grey'

        item.callbackName = item.callback ? '已配置' : '未配置'
        item.callbackNameClass = ['is-half', ''][item.callback]

        item.pushName = item.push ? '已启用' : '未启用'
        item.pushNameClass = ['is-half', ''][item.push]
      })
    },
    showAddTaskDialog() {
      // 清空数据
      this.taskDialog = deepClone(this.taskDialogTemplate)

      const assignObj = {
        title: '新建任务',
        show: true,
        name: 'DialogShell',
        width: '568px',
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '保存',
              value: 'saveTask',
              type: 'primary'
            }
          ]
        },
        component: this.taskDialog
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    saveTask() {
      this.taskDialog.option.ref.validate(valid => {
        if (valid) {
          task.saveTaskData({ name: this.taskDialog.option.data.name })
            .then(res => {
              this.$messageInfo({
                type: 'success',
                message: '新建任务成功！'
              })

              this.$store.dispatch('dialog/initDialogData')
              this.pageLoading = true
              this.getVideoStreamData()
            })
        }
      })
    },
    intoAnalysisDetail() {
      this.$router.push({ name: 'VideoStreamAnalysisDetail', query: { id: this.buttonScope.row.id }})
    }
  }
}
