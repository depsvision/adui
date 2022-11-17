import callback from '@/api/callback'
import oss from '@/api/oss'

import configuration from '@/setting'

import { deepClone, trimObject } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      callbackDialog: {},
      callbackDialogTemplate: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            name: '',
            url: '',
            pushType: 1,
            ossId: null
          },
          rule: {
            name: [
              { required: true, message: '请输入名称', trigger: 'blur' }
            ],
            url: [
              { required: true, message: '请输入推送地址', trigger: 'blur' }
            ],
            ossId: [
              { required: true, message: '请选择存储服务', trigger: 'change' }
            ]
          },
          form: [],
          labelPosition: 'left',
          labelWidth: '120px'
        }
      },
      basicCallbackForm: [
        {
          type: 'inputAssembly',
          label: '名称',
          prop: 'name',
          placeholder: '请输入名称'
        },
        {
          type: 'inputAssembly',
          label: '推送地址',
          prop: 'url',
          placeholder: '请输入推送地址'
        },
        {
          type: 'radioAssembly',
          label: '图片推送方式',
          prop: 'pushType',
          radio: [
            {
              label: 'base64',
              value: 1
            },
            {
              label: '对象存储',
              value: 2
            }
          ]
        }
      ],
      ossForm: {
        type: 'selectAssembly',
        label: '对象存储服务',
        prop: 'ossId',
        size: 'medium',
        placeholder: '请选择存储服务',
        option: []
      },

      testCallbackTemplate: ``,
      testCallbackDialog: {},
      testCallbackDialogTemplate: {
        name: 'TestCallback',
        option: {
          data: ``,
          class: 'is-inner',
          formListOption: {
            data: {
              testResult: '',
              returnResult: ''
            },
            form: [
              {
                type: 'spanAssembly',
                label: '测试结果',
                prop: 'testResult',
                class: 'status-mark'
              },
              {
                type: 'spanAssembly',
                label: '返回结果',
                prop: 'returnResult'
              }
            ],
            labelWidth: '120px',
            labelPosition: 'left'
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'dialog',
      'button',
      'buttonScope'
    ])
  },
  watch: {
    'button.value'(val) {
      this.clickButton(val)
    },
    'dialog.listenerData'(val) {
      if (!this.testCallbackDialog.option) return

      if (val) {
        this.testCallbackDialog.option.data = val
      } else {
        this.testCallbackDialog.option.data = null
      }
    },
    'callbackDialog.option.data.pushType'(val) {
      this.setCallbackForm()
    }
  },
  methods: {
    clickButton(value) {
      switch (value) {
        case 'add':
          this.action = 'add'
          this.showNewCallback()
          break
        case 'edit':
          this.action = 'edit'
          this.showNewCallback()
          break
        case 'save':
          this.saveCallbackData()
          break
        case 'openTest':
          this.showTestCallback()
          break
        case 'test':
          this.testCallback()
          break
        case 'reset':
          this.resetTestTemplate()
          break
        case 'delete':
          this.deleteCallbackData()
          break
        default:
      }
    },
    getCallbackTemplate() {
      callback.getCallbackTemplate()
        .then(res => {
          const { data } = res
          this.testCallbackTemplate = data.templateData
        })
    },
    getOssList() {
      oss.getOssList()
        .then(res => {
          const { storages } = res.data

          storages.forEach(oss => {
            oss.label = oss.name
            oss.value = oss.id
            oss.tip = configuration.ossService[oss.storagePlatform]
          })

          this.ossForm.option = storages
        })
    },
    getCallbackData() {
      const params = {
        page: this.tablePagerOption.currentPage,
        size: this.tablePagerOption.pageSizes
      }

      this.pageLoading = true

      callback.getCallbackList(params)
        .then(res => {
          const { data } = res
          this.callbackOption.tableData = data.callbackList
          this.callbackOption.tableData.forEach(item => {
            item.pushType = item.pushType ?? 1

            if (item.test) {
              item.testStatus = '在线'
              item.testStatusClass = 'is-green'
            } else {
              item.testStatus = '离线'
              item.testStatusClass = 'is-grey'
            }

            item.tasksName = ''

            item.tasks.forEach((task, taskIndex) => {
              item.tasksName += task.type + ':' + task.task.map(t => Number(t)).sort((a, b) => a - b).join(',') + (taskIndex === item.tasks.length - 1 ? '' : ', ')
            })
          })

          this.tablePagerOption = Object.assign(this.tablePagerOption, data.pageVO)

          this.pageLoading = false
        })
        .catch(() => {
          this.pageLoading = false
        })
    },

    setCallbackForm() {
      const callback = this.callbackDialog.option

      const finalForm = deepClone(this.basicCallbackForm)

      if (callback.data.pushType === 2) {
        finalForm.push(this.ossForm)
      }

      callback.form = deepClone(finalForm)
    },
    showNewCallback() {
      // 清空数据
      this.callbackDialog = deepClone(this.callbackDialogTemplate)

      const assignObj = {
        title: '新增callback地址',
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
              value: 'save',
              type: 'primary'
            }
          ]
        },
        component: {}
      }

      const option = this.callbackDialog

      if (this.action === 'edit') {
        assignObj.title = '编辑callback地址'
        option.option.data = Object.assign(option.option.data, this.buttonScope.row)
      }

      this.setCallbackForm()

      assignObj.component = option

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    saveCallbackData() {
      const data = this.callbackDialog.option.data

      let params = {
        name: data.name,
        url: data.url,
        pushType: data.pushType
      }

      if (params.pushType !== 1) {
        params.ossId = data.ossId
      }

      if (this.action === 'edit') {
        params.id = this.buttonScope.row.id
      }

      params = trimObject(params, 'name', 'url')

      this.callbackDialog.option.ref.validate(valid => {
        if (valid) {
          callback.saveCallbackData(params)
            .then(res => {
              this.$messageInfo({
                message: '新建成功',
                type: 'success'
              })

              this.$store.dispatch('dialog/initDialogData')
              this.getCallbackData()
            })
        }
      })
    },
    showTestCallback() {
      // 清空数据
      this.testCallbackDialog = deepClone(this.testCallbackDialogTemplate)

      this.testCallbackDialog.option.data = JSON.parse(JSON.stringify(this.testCallbackTemplate))
      this.testCallbackDialog.option.formListOption.data.testResult = this.buttonScope.row.testStatus
      this.testCallbackDialog.option.formListOption.form[0].class = 'status-mark ' + this.buttonScope.row.testStatusClass

      const assignObj = {
        title: 'Callback模拟发送',
        show: true,
        name: 'DialogShell',
        customClass: 'dialog--mini',
        buttons: {
          buttons: [
            {
              label: 'Callback 模拟测试',
              value: 'test',
              plain: true,
              loading: false
            },
            {
              label: '重置',
              value: 'reset',
              plain: true
            },
            {
              label: '关闭',
              value: 'cancel',
              buttonSpanClass: 'flex-separate',
              type: 'primary'
            }
          ]
        },
        component: this.testCallbackDialog
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    testCallback() {
      this.dialog.buttons.buttons[0].loading = true
      this.dialog.self.$refs.buttonGroup.$forceUpdate()

      const params = {
        id: this.buttonScope.row.id,
        data: this.testCallbackDialog.option.data
      }

      setTimeout(() => {
        callback.testCallback(params)
          .then(res => {
            const { data } = res

            this.callbackOption.tableData.forEach((item, index) => {
              if (item.id === this.buttonScope.row.id) {
                if (data.code) {
                  item.testStatus = '在线'
                  item.testStatusClass = 'is-green'
                } else {
                  item.testStatus = '离线'
                  item.testStatusClass = 'is-grey'
                }
                this.$set(this.callbackOption.tableData, index, item)
              }
            })

            if (data.code) {
              this.testCallbackDialog.option.formListOption.data.testResult = '在线'
              this.testCallbackDialog.option.formListOption.form[0].class = 'status-mark is-green'
            } else {
              this.testCallbackDialog.option.formListOption.data.testResult = '离线'
              this.testCallbackDialog.option.formListOption.form[0].class = 'status-mark is-grey'
            }

            this.testCallbackDialog.option.formListOption.data.returnResult = data.msg

            this.dialog.buttons.buttons[0].loading = false
            this.dialog.self.$refs.buttonGroup.$forceUpdate()
          })
          .catch(err => {
            this.testCallbackDialog.option.formListOption.data.testResult = '离线'
            this.testCallbackDialog.option.formListOption.form[0].class = 'status-mark is-grey'
            this.testCallbackDialog.option.formListOption.data.returnResult = err

            this.dialog.buttons.buttons[0].loading = false
            this.dialog.self.$refs.buttonGroup.$forceUpdate()
          })
      }, 300)
    },
    resetTestTemplate() {
      if (!this.testCallbackDialog.option.data) {
        this.$store.dispatch('dialog/setDialogData', { key: 'listenerData', value: deepClone(this.testCallbackTemplate) })
      }
      this.testCallbackDialog.option.data = deepClone(this.testCallbackTemplate)
    },
    deleteCallbackData() {
      this.$confirm('当前callback地址已关联任务，删除后相应callback将会失效确认要删除该地址吗？', '删除确认', {
        confirmButtonText: '删除',
        confirmButtonClass: 'is-danger',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'dialog--mini'
      }).then(() => {
        callback.deleteCallbackData({ id: this.buttonScope.row.id })
          .then(res => {
            this.$messageInfo({
              message: '删除成功',
              type: 'success'
            })

            this.getCallbackData()
          })
      })
    }
  }
}
