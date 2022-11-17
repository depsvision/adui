import callback from '@/api/callback'
import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'
import task from '@/api/task'

export default {
  data() {
    return {
      transmitDialog: {},
      transmitDialogTemplate: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
          },
          form: [
            {
              type: 'switchAssembly',
              label: '开启转发',
              prop: 'forwardSwitch',
              flex: true
            },
            {
              type: 'inputGroup',
              label: '推流地址',
              prop: 'forwardUrlList',
              maxHeight: '220px',
              placeholder: '请输入推流地址',
              clearable: true,
              buttons: {
                buttons: [
                  {
                    label: '新增',
                    value: 'addInputItem',
                    type: 'text',
                    class: 'is-black',
                    svgIconLeft: 'plus'
                  }
                ]
              },
              inputGroup: []
            }
          ],
          labelPosition: 'left',
          labelWidth: '120px'
        }
      },
      callbackConfigDialog: {},
      callbackConfigDialogTemplate: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            id: '',
            contentArr: [],
            alarmVideoClip: false,
            alarmVideoClipTip: '请先开启相关服务',
            alarmVideoClipRadio: 1
          },
          rule: {
            id: [
              { required: true, message: '请选择推送地址', trigger: 'change' }
            ]
          },
          form: [
            {
              type: 'selectAssembly',
              label: '推送地址',
              clearable: true,
              prop: 'id',
              size: 'medium',
              placeholder: '请选择推送地址',
              option: []
            },
            {
              type: 'inputCountNumber',
              label: '推送间隔',
              prop: 'interval',
              placeholder: '10',
              controlsPosition: 'right',
              width: '108px',
              min: 0,
              unit: '秒内重复报警不再推送'
            },
            {
              type: 'checkboxAssembly',
              label: '推送内容',
              prop: 'contentArr',
              checkbox: [
                {
                  label: '结果数据',
                  value: 1
                },
                {
                  label: '原始图片',
                  value: 2
                },
                {
                  label: '绘制结果图片',
                  value: 4
                }
              ]
            },
            {
              type: 'switchAssembly',
              label: '报警视频片段',
              prop: 'alarmVideoClip',
              componentStyle: {
                width: 'auto'
              },
              back: {
                type: 'spanAssembly',
                prop: 'alarmVideoClipTip',
                spanStyle: {
                  color: 'rgba(7, 14, 23, 0.55)'
                }
              },
              bottom: {
                type: 'radioAssembly',
                prop: 'alarmVideoClipRadio',
                radio: [
                  // {
                  //   label: '发送视频文件',
                  //   value: 2
                  // },
                  {
                    label: '发送本地文件路径 (可能被清理,建议取回本地)',
                    value: 1
                  }
                ]
              }
            }
          ],
          labelPosition: 'left',
          labelWidth: '120px'
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
        case 'refreshCallbackConfig':
          this.refreshCallbackConfig()
          break
        case 'addCallbackConfig':
          this.action = 'add'
          this.showCallbackConfigDialog()
          break
        case 'editCallbackConfig':
          this.action = 'edit'
          this.showCallbackConfigDialog()
          break
        case 'saveCallbackConfig':
          this.saveCallbackConfig()
          break
        case 'removeCallbackConfig':
          this.removeCallbackConfig()
          break
        case 'transmit':
          this.openTransmit()
          break
        case 'addInputItem':
          this.addInputItem()
          break
        case 'saveForward':
          this.saveForward()
          break
        case 'view':
          this.view()
          break

        case 'inputBlur-minInterval':
          this.saveVideoClipInterval()
          break
        default:
      }
    },
    view() {
      const assignObj = {
        title: '预览',
        show: true,
        name: 'DialogShell',
        customClass: 'dialog--medium dialog-height--medium',
        component: this.MpegtsMonitor
      }

      this.MpegtsMonitor.option.code = this.buttonScope.row.code_type
      this.MpegtsMonitor.option.url = this.buttonScope.row.url
      this.MpegtsMonitor.option.tipList = [
        {
          label: this.buttonScope.row.algorithmName,
          style: {
            'font-size': '14px',
            color: 'rgba(14, 27, 46, 0.85)'
          }
        },
        {
          label: this.buttonScope.row.cameraName,
          style: {
            'font-size': '12px',
            color: 'rgba(14, 27, 46, 0.5)',
            'margin-left': '16px'
          }
        }
      ]

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    saveForward() {
      const data = this.transmitDialog.option.data

      const urlList = []

      data.forwardUrlList.forEach(item => {
        if (item.length > 0) {
          urlList.push(item)
        }
      })

      const params = {
        taskId: this.$route.query.id,
        forward: {
          idList: [data.algorithmId, data.cameraId],
          urlList: urlList,
          switch: data.forwardSwitch ? 1 : 0
        }
      }

      task.editForward(params)
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: '保存推流转发成功!'
          })

          this.$store.dispatch('dialog/initDialogData')

          const tableItem = this.demoVideoStream.tableData.find(item => item.algorithmId === data.algorithmId && item.cameraId === data.cameraId)
          const cacheTableItem = this.demoVideoStream.cacheData.find(item => item.algorithmId === data.algorithmId && item.cameraId === data.cameraId)

          this.$set(tableItem, 'forwardLength', urlList.length)
          this.$set(tableItem, 'forward', {
            switch: data.forwardSwitch ? 1 : 0,
            urlList: urlList
          })
          this.$set(tableItem, 'forwardSwitch', data.forwardSwitch)
          this.$set(tableItem, 'forwardUrlList', urlList)

          this.$set(cacheTableItem, 'forwardLength', urlList.length)
          this.$set(cacheTableItem, 'forward', {
            switch: data.forwardSwitch ? 1 : 0,
            urlList: urlList
          })
          this.$set(cacheTableItem, 'forwardSwitch', data.forwardSwitch)
          this.$set(cacheTableItem, 'forwardUrlList', urlList)
        })
    },
    addInputItem() {
      this.dialog.component.option.form[1].inputGroup.push({})

      this.dialog.component.option.data.forwardUrlList.push('')
    },
    openTransmit() {
      // 清空数据
      this.transmitDialog = deepClone(this.transmitDialogTemplate)

      const assignObj = {
        title: '转发推流',
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
              value: 'saveForward',
              type: 'primary'
            }
          ]
        },
        component: this.transmitDialog
      }

      this.transmitDialog.option.data = deepClone(this.buttonScope.row)
      this.transmitDialog.option.form[1].inputGroup = []

      if (!this.transmitDialog.option.data.forwardUrlList.length) {
        this.transmitDialog.option.data.forwardUrlList = ['']
        this.transmitDialog.option.form[1].inputGroup = [{}]
      } else {
        this.transmitDialog.option.data.forwardUrlList.forEach(item => {
          this.transmitDialog.option.form[1].inputGroup.push({})
        })
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    handleSwitchChange(value, scope) {
      const params = {
        taskId: this.$route.query.id,
        push: {
          idList: [scope.row.algorithmId, scope.row.cameraId],
          switch: value ? 1 : 0
        }
      }

      const tableItem = this.demoVideoStream.tableData.find(item => item.algorithmId === scope.row.algorithmId && item.cameraId === scope.row.cameraId)
      const cacheTableItem = this.demoVideoStream.cacheData.find(item => item.algorithmId === scope.row.algorithmId && item.cameraId === scope.row.cameraId)

      task.editPush(params)
        .then(res => {
          this.$store.dispatch('dialog/initDialogData')

          this.$set(tableItem, 'openPush', value ? 1 : 0)
          this.$set(tableItem, 'openPushStatus', value)
          this.$set(cacheTableItem, 'openPush', value ? 1 : 0)
          this.$set(cacheTableItem, 'openPushStatus', value)
        })
        .catch(() => {
          this.$set(tableItem, 'openPushStatus', !value)
          this.$set(cacheTableItem, 'openPushStatus', !value)
        })
    },
    refreshCallbackConfig() {
      const callbackIdArr = []

      this.callbackPush.tableData.forEach(td => {
        callbackIdArr.push(td.id)
      })

      const params = {
        taskId: this.$route.query.id,
        callback: callbackIdArr
      }

      task.getTaskCallbackConfig(params)
        .then(res => {
          const { data } = res

          this.$messageInfo({
            type: 'success',
            message: '刷新callback推送成功!'
          })

          const contentObj = {
            1: '结果数据',
            2: '原始图片',
            4: '绘制结果图片'
          }

          data.forEach(item => {
            item.addressStatusName = ['离线', '在线'][item.addressStatus]
            item.recentStatusName = ['失败', '成功'][item.recentStatus] || '无'
            item.recentStatusName += item.recentStatus !== undefined ? (' ' + item.recentTime) : ''
            item.addressStatusNameClass = [' is-grey', ' is-green'][item.addressStatus]
            item.recentStatusNameClass = [' is-grey', ' is-green'][item.recentStatus] || ' is-grey'
            item.pushInterval = item.interval + ' s'
            item.contentArr = [1, 2, 4].filter(con => (con & item.content) === con)
            item.pushContent = !item.contentArr.length ? '无' : ''
            item.contentArr.forEach((con, index) => {
              item.pushContent += (index === 0 ? '' : ', ') + contentObj[con]
            })

            if ((item.content & 8) === 8) {
              item.alarmVideoClip = true
              item.alarmVideoClipRadio = 1
              item.alarmVideoClipStatus = '发送本地文件路径'
            } else if ((item.content & 8) === 8) {
              item.alarmVideoClip = true
              item.alarmVideoClipRadio = 2
              item.alarmVideoClipStatus = '发送视频文件'
            } else {
              item.alarmVideoClip = false
              item.alarmVideoClipStatus = '关'
            }
          })

          this.callbackPush.tableData = data
        })
    },
    showCallbackConfigDialog() {
      // 清空数据
      this.callbackConfigDialog = deepClone(this.callbackConfigDialogTemplate)

      const assignObj = {
        title: (this.action === 'add' ? '新增' : '修改') + 'callback推送',
        show: true,
        name: 'DialogShell',
        width: '624px',
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '保存',
              value: 'saveCallbackConfig',
              type: 'primary'
            }
          ]
        },
        component: this.callbackConfigDialog
      }

      if (this.action === 'edit') {
        this.callbackConfigDialog.option.data = deepClone(this.buttonScope.row)
      }

      const params = {
        page: 1,
        size: 99999
      }

      callback.getCallbackList(params)
        .then(res => {
          const { callbackList } = res.data

          let dealCallbackList = callbackList

          if (this.action === 'add') {
            dealCallbackList = callbackList.filter(callback => this.callbackPush.tableData.every(td => td.id !== callback.id))
          }

          dealCallbackList.forEach(item => {
            item.value = item.id
            item.label = item.url
          })

          this.callbackConfigDialog.option.form[0].option = dealCallbackList

          this.$store.dispatch('dialog/assignDialogData', assignObj)
        })
    },
    saveCallbackConfig() {
      const params = {
        taskId: this.$route.query.id,
        callback: {
          id: this.callbackConfigDialog.option.data.id,
          interval: this.callbackConfigDialog.option.data.interval || 0,
          content: 0
        }
      }

      this.callbackConfigDialog.option.data.contentArr.forEach(item => {
        params.callback.content += item
      })

      const callbackConfigDialog = this.callbackConfigDialog.option.data
      if (callbackConfigDialog.alarmVideoClip) {
        params.callback.content += callbackConfigDialog.alarmVideoClipRadio * 8
      }

      this.callbackConfigDialog.option.ref.validate(valid => {
        if (valid) {
          task.editCallbackConfig(params)
            .then(res => {
              this.$messageInfo({
                type: 'success',
                message: (this.action === 'add' ? '新增' : '修改') + 'callback推送成功!'
              })

              this.$store.dispatch('dialog/initDialogData')

              this.$parent.$parent.getTaskDetail()
            })
        }
      })
    },
    removeCallbackConfig() {
      const params = {
        taskId: this.$route.query.id,
        callback: {
          id: this.buttonScope.row.id
        }
      }

      task.removeCallbackConfig(params)
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: '删除callback推送成功!'
          })

          this.$parent.$parent.getTaskDetail()
        })
    }
  }
}
