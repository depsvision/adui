import task from '@/api/task'
import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
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
      'dialog',
      'button',
      'buttonScope',
      'checkStart',
      'closeDialogName'
    ])
  },
  watch: {
    'button.value'(val) {
      this.clickButton(val)
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
          this.startTaskStatus()
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
        default:
      }
    },
    controlTask(type) {
      this.taskStatusDialog.option.start.svgIcon.taskStatus = 'waitting-loadiing'
      if (type) {
        this.dialog.component.option.start.data.taskStatus = '启用中'
        this.dialog.component.option.start.text.taskStatus = '正在查询启用结果，预计很快返回结果。'
        this.dialog.buttons.buttons[0].disabled = true
        this.dialog.buttons.buttons[1].disabled = true
        this.dialog.self.$refs.buttonGroup.$forceUpdate()

        task.algorithmLinkageStart({ id: this.buttonScope.row.id }, true)
          .then(res => {
            this.$messageInfo({
              type: 'success',
              message: '启用任务成功！'
            })

            this.$store.dispatch('dialog/initDialogData')
            this.pageLoading = true
            this.getAlgorithmLinkageData()
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

        task.algorithmLinkageStop({ id: this.buttonScope.row.id })
          .then(res => {
            this.$messageInfo({
              type: 'success',
              message: '停用任务成功！'
            })

            this.$store.dispatch('dialog/initDialogData')
            this.pageLoading = true
            this.getAlgorithmLinkageData()
          })
          .catch(() => {
            this.dialog.component.option.start.data.taskStatus = '停用失败'
            this.dialog.component.option.start.text.taskStatus = ''

            this.taskStatusDialog.option.start.svgIcon.taskStatus = 'error'
          })
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
              hide: !!this.buttonScope.row.status,
              plain: true
            },
            {
              label: '立即停用',
              value: 'stopTask',
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
    getAlgorithmLinkageData() {
      const params = {
        page: this.tablePagerOption.currentPage,
        size: this.tablePagerOption.pageSizes
      }

      task.getAlgorithmLinkageList(params)
        .then(res => {
          const { taskGroupList } = res.data

          taskGroupList.forEach(item => {
            item.statusName = ['未启用', '已启用'][item.status]
            item.statusNameClass = ['is-half', ''][item.status]
            item.hide = item.status ? ['start'] : ['stop']

            item.sourceTypeName = ['无', '视频流分析任务', '图片分析任务'][item.sourceType] || '无'

            if (item.sourceId === null || item.sourceId === undefined) {
              item.sourceId = '无'
            }

            item.remindName = ['一级任务不存在', '正常', '任务变动'][item.remind] || '无'
          })

          this.serveTableOption.tableData = taskGroupList

          this.tablePagerOption = Object.assign(this.tablePagerOption, res.data.pageVO)

          this.pageLoading = false
        })
        .catch(() => {
          this.pageLoading = false
        })
    },
    showAddTaskDialog() {
      // 清空数据
      this.taskDialog = deepClone(this.taskDialogTemplate)

      const assignObj = {
        title: '新建任务',
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
          task.addAlgorithmLinkage({ name: this.taskDialog.option.data.name })
            .then(res => {
              this.$messageInfo({
                type: 'success',
                message: '新建任务成功！'
              })

              this.$store.dispatch('dialog/initDialogData')
              this.pageLoading = true
              this.getAlgorithmLinkageData()
            })
        }
      })
    },
    intoAnalysisDetail() {
      this.$router.push({ name: 'AlgorithmLinkageDetail', query: { id: this.buttonScope.row.id }})
    }
  }
}
