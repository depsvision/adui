import task from '@/api/task'
import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      linkageNameDialog: {},
      linkageNameDialogTemplate: {
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
      'button',
      'dialog'
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
        case 'editLinkageName':
          this.showEditLinkageNameDialog()
          break
        case 'saveLinkageName':
          this.saveLinkageName()
          break
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
        default:
      }
    },
    showEditLinkageNameDialog() {
      // 清空数据
      this.linkageNameDialog = deepClone(this.linkageNameDialogTemplate)

      const assignObj = {
        title: '修改任务名称',
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
              value: 'saveLinkageName',
              type: 'primary'
            }
          ]
        },
        component: this.linkageNameDialog
      }

      this.linkageNameDialog.option.data = deepClone(this.formListOption.data)

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    saveLinkageName() {
      this.linkageNameDialog.option.ref.validate(valid => {
        if (valid) {
          const params = {
            id: Number(this.$route.query.id),
            name: this.linkageNameDialog.option.data.name
          }

          task.addAlgorithmLinkage(params)
            .then(res => {
              this.$messageInfo({
                type: 'success',
                message: '修改任务名称成功!'
              })

              this.$store.dispatch('dialog/initDialogData')
              this.formListOption.data.name = this.linkageNameDialog.option.data.name
            })
        }
      })
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
        title: (!this.formListOption.data.status ? '启用' : '停用') + '任务',
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
              hide: !!this.formListOption.data.status,
              plain: true
            },
            {
              label: '立即停用',
              value: 'stopTask',
              hide: !this.formListOption.data.status,
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
    controlTask(type) {
      this.taskStatusDialog.option.start.svgIcon.taskStatus = 'waitting-loadiing'
      if (type) {
        this.dialog.component.option.start.data.taskStatus = '启用中'
        this.dialog.component.option.start.text.taskStatus = '正在查询启用结果，预计很快返回结果。'
        this.dialog.buttons.buttons[0].disabled = true
        this.dialog.buttons.buttons[1].disabled = true
        this.dialog.self.$refs.buttonGroup.$forceUpdate()

        task.algorithmLinkageStart({ id: this.formListOption.data.id }, true)
          .then(res => {
            this.$messageInfo({
              type: 'success',
              message: '启用任务成功！'
            })

            this.$store.dispatch('dialog/initDialogData')
            this.$parent.$parent.pageLoading = true
            this.$parent.$parent.getLinkageDetail()
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

        task.algorithmLinkageStop({ id: this.formListOption.data.id })
          .then(res => {
            this.$messageInfo({
              type: 'success',
              message: '停用任务成功！'
            })

            this.$store.dispatch('dialog/initDialogData')
            this.$parent.$parent.pageLoading = true
            this.$parent.$parent.getLinkageDetail()
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
