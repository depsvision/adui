import oss from '@/api/oss'

import configuration from '@/setting'

import { deepClone, trimObject } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      ossDialog: {},
      ossDialogTemplate: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            name: '',
            storagePlatform: null,
            region: '',
            spaceName: '',
            apiKey: '',
            secretKey: '',
            domain: '',
            path: '',
            url: '',
            testStatus: 0,
            result: null
          },
          rule: {
            name: [
              { required: true, message: '请输入名称', trigger: ['blur', 'change'] }
            ],
            storagePlatform: [
              { required: true, message: '请选择服务类型', trigger: ['change'] }
            ],
            region: [
              { required: true, message: '请输入区域', trigger: ['blur', 'change'] }
            ],
            spaceName: [
              { required: true, message: '请输入空间名称', trigger: ['blur', 'change'] }
            ],
            apiKey: [
              { required: true, message: '请输入', trigger: ['blur', 'change'] }
            ],
            secretKey: [
              { required: true, message: '请输入Secret Key', trigger: ['blur', 'change'] }
            ],
            domain: [
              { required: true, message: '请输入域名', trigger: ['blur', 'change'] }
            ],
            path: [
              { required: true, message: '请输入保存路径', trigger: ['blur', 'change'] }
            ]
          },
          form: [
            {
              type: 'inputAssembly',
              label: '系统名称',
              prop: 'name',
              placeholder: '请输入名称'
            },
            {
              type: 'selectAssembly',
              label: '服务类型',
              prop: 'storagePlatform',
              size: 'medium',
              placeholder: '阿里云 OSS',
              class: 'has-divider',
              option: [
                {
                  label: '阿里云 OSS',
                  value: 1
                },
                {
                  label: '腾讯云 COS',
                  value: 2
                }
              ]
            },
            {
              type: 'inputAssembly',
              label: '区域',
              prop: 'region',
              placeholder: '请输入区域',
              hide: true
            },
            {
              type: 'inputAssembly',
              label: '空间名称',
              prop: 'spaceName',
              placeholder: '请输入空间名称',
              hide: true
            },
            {
              type: 'inputAssembly',
              label: 'Access Key',
              prop: 'apiKey',
              placeholder: '请输入',
              hide: true
            },
            {
              type: 'inputAssembly',
              label: 'Secret Key',
              prop: 'secretKey',
              showPassword: true,
              placeholder: '••••••',
              hide: true
            },
            {
              type: 'inputAssembly',
              label: '域名',
              prop: 'domain',
              placeholder: 'https://cr-docs.oss-cn-beijing. aliyuncs.com/',
              inputType: 'textarea',
              autosize: {
                minRows: 3
              },
              hide: true
            },
            {
              type: 'inputAssembly',
              label: '保存路径',
              prop: 'path',
              class: 'has-divider',
              placeholder: 'cr-alarm',
              hide: true
            },
            {
              type: 'spanAssembly',
              label: '验证结果',
              prop: 'result',
              isLink: true
            }
          ],
          labelPosition: 'left',
          labelWidth: '120px'
        }
      },

      ossService: []
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
    'ossDialog.option.data.storagePlatform'(val, old) {
      this.showConfigForm()
    }
  },
  methods: {
    clickButton(value) {
      switch (value) {
        case 'add':
          this.action = 'add'
          this.showNewOss()
          break
        case 'edit':
          this.action = 'edit'
          this.showNewOss()
          break
        case 'test':
          this.action = 'test'
          this.showNewOss()
          break
        case 'save':
          this.saveOssData()
          break
        case 'deleteOss':
          this.deleteOss()
          break
        case 'testOss':
          this.testOss()
          break
        default:
      }
    },

    showConfigForm(assignObj) {
      const option = this.ossDialog.option

      if (option.data.storagePlatform) {
        const allForm = option.form
        const hideForm = ['region', 'spaceName', 'apiKey', 'secretKey', 'domain', 'path']

        hideForm.forEach(prop => {
          const form = allForm.find(form => form.prop === prop)

          form.hide = false

          if (prop === 'apiKey') {
            form.label = option.data.storagePlatform === 2 ? 'Secret Id' : 'Access Key'
          }
        })

        if (assignObj) {
          assignObj.buttons.buttons[3].disabled = false
        } else {
          this.dialog.buttons.buttons[3].disabled = false
          this.dialog.self && this.dialog.self.$refs.buttonGroup.$forceUpdate()
        }
      }
    },

    getOssData(noLoading) {
      this.pageLoading = !noLoading

      oss.getOssList()
        .then(res => {
          const { storages } = res.data
          this.ossOption.tableData = storages
          this.ossOption.tableData.forEach(oss => {
            oss.platform = configuration.ossService[oss.storagePlatform]
          })

          this.pageLoading = false
        })
        .catch(() => {
          this.pageLoading = false
        })
    },
    showNewOss() {
      // 清空数据
      this.ossDialog = deepClone(this.ossDialogTemplate)

      const actionObj = {
        add: '新增',
        edit: '编辑',
        test: '验证'
      }

      const assignObj = {
        title: actionObj[this.action] + '应用',
        show: true,
        name: 'DialogShell',
        width: '552px',
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true,
              hide: this.action === 'test'
            },
            {
              label: '关闭',
              value: 'cancel',
              plain: true,
              hide: this.action !== 'test'
            },
            {
              label: '验证',
              value: 'testOss',
              type: 'primary',
              loading: false,
              hide: this.action !== 'test'
            },
            {
              label: '保存',
              value: 'save',
              type: 'primary',
              loading: false,
              disabled: true,
              hide: this.action === 'test'
            }
          ]
        },
        component: {}
      }

      const option = this.ossDialog

      if (['edit', 'test'].includes(this.action)) {
        option.option.data = Object.assign(option.option.data, this.buttonScope.row)
      }

      option.option.form.forEach(form => {
        if (this.action === 'test') {
          form.type = 'spanAssembly'
        } else {
          form.type = 'inputAssembly'

          if (form.prop === 'storagePlatform') {
            form.type = 'selectAssembly'
          }

          if (form.prop === 'result') {
            form.type = 'spanAssembly'
          }
        }
      })

      option.option.data.result = ['未验证', '验证失败', option.option.data.testUrl][option.option.data.testStatus]

      const resultForm = option.option.form.find(item => item.prop === 'result')
      resultForm.isLink = option.option.data.testStatus === 2

      assignObj.component = option

      this.showConfigForm(assignObj)

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    saveOssData() {
      const data = this.ossDialog.option.data

      let params = {
        name: data.name,
        storagePlatform: data.storagePlatform,
        region: data.region,
        spaceName: data.spaceName,
        apiKey: data.apiKey,
        secretKey: data.secretKey,
        domain: data.domain,
        path: data.path
      }

      if (this.action === 'edit') {
        params.id = this.buttonScope.row.id
      }

      params = trimObject(params, 'name')

      this.ossDialog.option.ref.validate(valid => {
        if (valid) {
          this.dialog.buttons.buttons[3].loading = true
          this.dialog.self.$refs.buttonGroup.$forceUpdate()

          oss.editOssService(params)
            .then(res => {
              this.dialog.buttons.buttons[3].loading = false
              this.dialog.self.$refs.buttonGroup.$forceUpdate()

              this.$messageInfo({
                type: 'success',
                message: (this.action === 'edit' ? '编辑' : '新增') + '服务成功！'
              })

              this.$store.dispatch('dialog/initDialogData')

              this.getOssData()
            })
            .catch(() => {
              this.dialog.buttons.buttons[3].loading = false
              this.dialog.self.$refs.buttonGroup.$forceUpdate()
            })
        }
      })
    },
    deleteOss() {
      this.$confirm('删除后 callback 推送对应的存储服务将失效，<br />确定要删除该存储服务吗？', '删除确认', {
        confirmButtonText: '删除',
        confirmButtonClass: 'is-danger',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning',
        customClass: 'dialog--mini'
      }).then(() => {
        const params = {
          id: this.buttonScope.row.id
        }

        oss.deleteOssService(params)
          .then(res => {
            this.$messageInfo({
              type: 'success',
              message: '删除服务成功！'
            })

            this.$store.dispatch('dialog/initDialogData')

            this.getOssData()
          })
      })
    },
    testOss() {
      const params = {
        oss_id: this.buttonScope.row.id
      }

      this.dialog.buttons.buttons[2].loading = true
      this.dialog.self.$refs.buttonGroup.$forceUpdate()

      const option = this.ossDialog.option
      const resultForm = option.form.find(item => item.prop === 'result')

      oss.testOssService(params, true)
        .then(res => {
          this.dialog.buttons.buttons[2].loading = false
          this.dialog.self.$refs.buttonGroup.$forceUpdate()

          const { url } = res.data

          option.data.result = url
          resultForm.isLink = true

          this.getOssData(true)
        })
        .catch(err => {
          this.dialog.buttons.buttons[2].loading = false
          this.dialog.self.$refs.buttonGroup.$forceUpdate()

          option.data.result = err.errorMsg || err
          resultForm.isLink = false

          this.getOssData(true)
        })
    }
  }
}
