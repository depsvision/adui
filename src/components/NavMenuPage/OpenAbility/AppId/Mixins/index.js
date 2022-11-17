import openness from '@/api/openness'
import { deepClone, trimObject } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      appIdDialog: {},
      appIdDialogTemplate: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            name: '',
            url: ''
          },
          rule: {
            name: [
              { required: true, message: '请输入名称', trigger: 'blur' }
            ]
          },
          form: [
            {
              type: 'inputAssembly',
              label: '应用名称',
              prop: 'name',
              tip: '请根据实际使用的应用填写名称，以方便后续维护和管理',
              placeholder: '请输入名称'
            }
          ],
          labelPosition: 'left',
          labelWidth: '120px'
        }
      },
      settingDialog: {},
      settingDialogTemplate: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            enableStatus: false,
            display: '',
            url: ''
          },
          rule: {
            url: [
              { required: true, message: '请输入链接', trigger: 'blur' }
            ]
          },
          form: [
            {
              type: 'switchAssembly',
              label: '是否启用',
              prop: 'enableStatus'
            },
            {
              type: 'inputAssembly',
              label: '显示名称',
              prop: 'display',
              placeholder: '默认为“应用名称”'
            },
            {
              type: 'inputAssembly',
              label: '跳转链接',
              inputType: 'textarea',
              autosize: {
                minRows: 3
              },
              prop: 'url',
              tip: '将在新标签打开该扩展应用',
              placeholder: '请输入链接'
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
      'dialog',
      'button',
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
        case 'add':
          this.action = 'add'
          this.showNewAppId()
          break
        case 'edit':
          this.action = 'edit'
          this.showNewAppId()
          break
        case 'save':
          this.saveAppIdData()
          break
        case 'appSetting':
          this.showAppIdSetting()
          break
        case 'saveSetting':
          this.saveSetting()
          break
        case 'delete':
          this.deleteAppId()
          break
        default:
      }
    },
    getAppIdData() {
      this.pageLoading = true

      openness.getAppIdData()
        .then(res => {
          const { application } = res.data
          this.appIdOption.tableData = application
          this.appIdOption.tableData.forEach(item => {
            item.enableName = ['未启用', '已启用'][item.enable]
            item.enableStatus = !!item.enable
            item.enableNameClass = ['is-half', ''][item.enable]
          })

          this.pageLoading = false
        })
        .catch(() => {
          this.pageLoading = false
        })
    },
    showNewAppId() {
      // 清空数据
      this.appIdDialog = deepClone(this.appIdDialogTemplate)

      const assignObj = {
        title: (this.action === 'add' ? '新增' : '编辑') + '应用',
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

      const option = this.appIdDialog

      if (this.action === 'edit') {
        option.option.data = Object.assign(option.option.data, this.buttonScope.row)
      }

      assignObj.component = option

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    saveAppIdData() {
      let params = {
        name: this.appIdDialog.option.data.name
      }

      if (this.action === 'edit') {
        params.id = this.buttonScope.row.id
      }

      params = trimObject(params, 'name')

      this.appIdDialog.option.ref.validate(valid => {
        if (valid) {
          openness.editAppId(params)
            .then(res => {
              this.$messageInfo({
                message: (this.action === 'add' ? '新增' : '编辑') + '成功',
                type: 'success'
              })

              this.$store.dispatch('dialog/initDialogData')
              this.getAppIdData()

              this.changeAppJump()
            })
        }
      })
    },
    showAppIdSetting() {
      // 清空数据
      this.settingDialog = deepClone(this.settingDialogTemplate)

      const assignObj = {
        title: '扩展应用',
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
              value: 'saveSetting',
              type: 'primary'
            }
          ]
        },
        component: this.settingDialog
      }

      this.settingDialog.option.data = deepClone(this.buttonScope.row)

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    saveSetting() {
      let params = this.settingDialog.option.data

      params.enable = params.enableStatus ? 1 : 0

      params = trimObject(params, 'name')

      this.settingDialog.option.ref.validate(valid => {
        if (valid) {
          openness.setAppIdSetting(params)
            .then(res => {
              this.$messageInfo({
                message: '设置成功',
                type: 'success'
              })

              this.$store.dispatch('dialog/initDialogData')
              this.getAppIdData()

              this.changeAppJump()
            })
        }
      })
    },
    deleteAppId() {
      this.$confirm('删除后无法恢复，相应的应用也将无法通过开放API连接当前服务，<br />确定要删除该地址吗？', '删除确认', {
        confirmButtonText: '删除',
        confirmButtonClass: 'is-danger',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning',
        customClass: 'dialog--mini'
      }).then(() => {
        openness.deleteAppId({ id: Number(this.buttonScope.row.id) })
          .then(res => {
            this.$messageInfo({
              message: '删除成功',
              type: 'success'
            })

            this.getAppIdData()
          })
      })
    },
    changeAppJump() {
      openness.getJumpList()
        .then(res => {
          const { application } = res.data
          application.forEach(item => {
            item.label = item.display
            item.value = 'jumpToApp-' + item.appId + Date.now()
            item.noAuth = true
          })
          this.$store.dispatch('data/setData', { obj: 'appidData', value: application })
        })
    }
  }
}
