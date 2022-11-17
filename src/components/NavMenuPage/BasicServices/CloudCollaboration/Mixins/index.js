import cloud from '@/api/cloud'

import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'

export default {
  data() {
    return {
      action: 'add',
      synchronizeDia: {},
      synchronizeDiaTem: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            name: '',
            ip: '',
            port: '',
            platPort: '',
            username: '',
            password: ''
          },
          rule: {
            name: [
              { required: true, message: '请输入名称', trigger: ['blur', 'change'] }
            ],
            ip: [
              { required: true, message: '请输入ip', trigger: ['blur', 'change'] }
            ],
            port: [
              { required: true, message: '请输入内网端口', trigger: ['blur', 'change'] },
              {
                validator(rule, value, callback, source, options) {
                  const reg = /^[0-9]+.?[0-9]*/
                  const valueNumber = Number(value)

                  if (reg.test(valueNumber)) {
                    if (Math.round(Number(value)) > -1 && Math.round(Number(value)) < 65536) {
                      callback([])
                    } else {
                      callback('请输入0 - 65535 之间的值')
                    }
                  } else {
                    callback('请输入数字')
                  }
                },
                trigger: ['blur', 'change']
              }
            ],
            platPort: [
              { required: true, message: '请输入平台端口', trigger: ['blur', 'change'] },
              {
                validator(rule, value, callback, source, options) {
                  const reg = /^[0-9]+.?[0-9]*/
                  const valueNumber = Number(value)

                  if (reg.test(valueNumber)) {
                    if (Math.round(Number(value)) > -1 && Math.round(Number(value)) < 65536) {
                      callback([])
                    } else {
                      callback('请输入0 - 65535 之间的值')
                    }
                  } else {
                    callback('请输入数字')
                  }
                },
                trigger: ['blur', 'change']
              }
            ],
            username: [
              { required: true, message: '请输入用户名', trigger: ['blur', 'change'] }
            ],
            password: [
              { required: true, message: '请输入密码', trigger: ['blur', 'change'] }
            ]
          },
          form: [
            {
              type: 'inputAssembly',
              label: '节点名称',
              prop: 'name',
              placeholder: '请输入名称'
            },
            {
              type: 'inputAssembly',
              label: 'ip',
              prop: 'ip',
              placeholder: '请输入ip'
            },
            {
              type: 'inputAssembly',
              label: '内网端口',
              prop: 'port',
              placeholder: '请输入内网端口'
            },
            {
              type: 'inputAssembly',
              label: '平台端口',
              prop: 'platPort',
              placeholder: '请输入平台端口'
            },
            {
              type: 'inputAssembly',
              label: '用户名',
              prop: 'username',
              placeholder: '请输入用户名'
            },
            {
              type: 'inputAssembly',
              label: '密码',
              prop: 'password',
              placeholder: '请输入密码'
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
    },
    'synchronizeData.data.edgeEnvironment'(val) {
      this.setAiData()
    }
  },
  methods: {
    clickButton(value) {
      // const edit = value.split('edit')[1]
      // const save = value.split('save')[1]
      // const cancel = value.split('cancel')[1]

      // const prop = edit || save || cancel
      // const index = [1, 2, 3][['Ip', 'Frps', 'Token'].indexOf(prop)]

      // if (edit) {
      //   this.editOption(prop, index)
      // } else if (save) {
      //   this.saveOption(prop, index)
      // } else if (cancel) {
      //   this.cancelOption(prop, index)
      // }

      switch (value) {
        case 'showSynchronize':
          this.action = 'add'
          this.showSynchronize()
          break
        case 'editSynchronize':
          this.action = 'edit'
          this.showSynchronize()
          break
        case 'refreshEdge':
          this.getCloudConfig('refresh')
          break
        case 'saveSynchronize':
          this.saveSynchronize()
          break
        case 'deleteSynchronize':
          this.deleteSynchronize()
          break

        case 'addAiService':
          this.addAiService()
          break
        case 'saveAiService':
          this.saveAiService()
          break
        case 'editAiServicePlatPort':
          this.editAiServicePlatPort()
          break
        case 'saveAiServicePlatPort':
          this.saveAiServicePlatPort()
          break

        case 'addAiPoint':
          this.addAiPoint()
          break
        case 'saveAipoint':
          this.saveAipoint()
          break
        case 'editAiPointPlatPort':
          this.editAiPointPlatPort()
          break
        case 'saveAiPointPlatPort':
          this.saveAiPointPlatPort()
          break

        case 'addAiOther':
          this.otherAction = 'add'
          this.addAiOther()
          break
        case 'editAiOther':
          this.otherAction = 'edit'
          this.addAiOther()
          break
        case 'saveAiOther':
          this.saveAiOther()
          break
        case 'deleteAiOther':
          this.deleteAiOther()
          break

        case 'synchronizeEdge':
          this.synchronizeEdge()
          break
        default:
          break
      }
    },
    editOption(prop, index) {
      const form = this.cloudOption.form

      form[index].input = true

      form[index].buttons = {
        buttons: [
          {
            label: '保存',
            value: 'save' + prop,
            plain: true
          },
          {
            label: '取消',
            value: 'cancel' + prop,
            plain: true
          }
        ]
      }
    },
    saveOption(prop, index) {
      const form = this.cloudOption.form

      form[index].input = false

      form[index].buttons = {
        buttons: [
          {
            label: '编辑',
            value: 'edit' + prop,
            plain: true
          }
        ]
      }
    },
    cancelOption(prop, index) {
      const form = this.cloudOption.form

      form[index].input = false

      form[index].buttons = {
        buttons: [
          {
            label: '编辑',
            value: 'edit' + prop,
            plain: true
          }
        ]
      }
    },

    getCloudConfig(type) {
      cloud.getCloudConfig()
        .then(res => {
          if (type !== 'interval') {
            this.synchronizeLoading = true
          }

          const cloudData = this.cloudOption.data
          const synchronizeStatus = this.synchronizeStatus.data

          const { ip, port, token, syncTime, frpc } = res.data

          cloudData.ip = ip
          cloudData.frps = port
          cloudData.privilegeToken = token
          synchronizeStatus.syncTimeData = syncTime ?? '无记录'

          const calculateNode = this.calculateNode

          const frpcData = deepClone(frpc)

          frpcData.sort((a, b) => a.id - b.id).forEach(td => {
            this.handleEdgeStatus(td)

            td.label = td.id + ' : ' + td.name
            td.value = td.id
          })

          calculateNode.tableData = frpcData

          const synchronizeData = this.synchronizeData

          synchronizeData.data.edgeEnvironment = (frpcData[0] && frpcData[0].value) || ''
          synchronizeData.form[0].option = frpcData

          if (type === 'refresh') {
            this.$messageInfo({
              type: 'success',
              message: '刷新成功！'
            })
          }

          this.synchronizeLoading = false
        })
        .catch(() => {
          this.synchronizeLoading = false
        })
    },
    handleEdgeStatus(td) {
      td.onlineStatus = td.status === 4 ? '离线' : '在线'
      td.onlineStatusClass = td.status === 4 ? 'is-grey' : 'is-green'
      td.synchronizeStatus = ['未同步', '同步成功', '同步中', '同步失败', '无法连接'][td.status]

      td.spanSvg = td.status === 0 || td.status === 2 ? [] : ['synchronizeStatus']
      td.loadingS = td.status === 2 ? ['synchronizeStatus'] : []
      td.synchronizeStatusSvg = ['', 'bingo-line', '', 'error-line', 'attention-line'][td.status]
    },

    showSynchronize() {
      // 清空数据
      this.synchronizeDia = deepClone(this.synchronizeDiaTem)

      const assignObj = {
        title: (this.action === 'add' ? '新增' : '编辑') + ' FRP Manager',
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
              value: 'saveSynchronize',
              type: 'primary'
            }
          ]
        },
        component: this.synchronizeDia
      }

      if (this.action === 'edit') {
        this.synchronizeDia.option.data = deepClone(this.buttonScope.row)
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    saveSynchronize() {
      const params = deepClone(this.synchronizeDia.option.data)

      cloud.editCloudConfig(params)
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: (this.action === 'add' ? '新增' : '编辑') + ' FRP Manager 成功！'
          })

          this.getCloudConfig()
        })

      this.$store.dispatch('dialog/initDialogData')
    },
    deleteSynchronize() {
      cloud.deleteCloudConfig({ id: this.buttonScope.row.id })
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: '删除成功！'
          })

          this.getCloudConfig('interval')
        })
    },
    synchronizeEdge() {
      const button = this.synchronizeStatusButtons.buttons[1]

      button.loading = true

      this.calculateNode.tableData.forEach(td => {
        td.status = 2

        this.handleEdgeStatus(td)
      })

      cloud.synchronizeCloudDataToEdge()
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: '同步成功！'
          })

          button.loading = false

          this.getCloudConfig('interval')
        })
        .catch(() => {
          button.loading = false

          this.getCloudConfig('interval')
        })
    }
  }
}
