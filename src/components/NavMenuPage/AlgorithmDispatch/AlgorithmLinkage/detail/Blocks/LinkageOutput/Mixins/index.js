import callback from '@/api/callback'
import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'
import task from '@/api/task'

export default {
  data() {
    return {
      callbackConfigDialog: {},
      callbackConfigDialogTemplate: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            id: '',
            contentArr: []
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
              unit: 's'
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
        default:
      }
    },
    refreshCallbackConfig() {
      const callbackIdArr = []

      this.callbackPush.tableData.forEach(td => {
        callbackIdArr.push(td.id)
      })

      const params = {
        id: this.$route.query.id,
        callback: callbackIdArr
      }

      task.refreshLinkageCallback(params)
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
        id: this.$route.query.id,
        callback: {
          id: this.callbackConfigDialog.option.data.id,
          interval: this.callbackConfigDialog.option.data.interval || 0,
          content: 0
        }
      }

      this.callbackConfigDialog.option.data.contentArr.forEach(item => {
        params.callback.content += item
      })

      this.callbackConfigDialog.option.ref.validate(valid => {
        if (valid) {
          task.editAlgorithmLinkageCallback(params)
            .then(res => {
              this.$messageInfo({
                type: 'success',
                message: (this.action === 'add' ? '新增' : '修改') + 'callback推送成功!'
              })

              this.$store.dispatch('dialog/initDialogData')

              this.$parent.$parent.getLinkageDetail()
            })
        }
      })
    },
    removeCallbackConfig() {
      const params = {
        id: this.$route.query.id,
        callback: {
          id: this.buttonScope.row.id
        }
      }

      task.removeLinkageCallback(params)
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: '删除callback推送成功!'
          })

          this.$parent.$parent.getLinkageDetail()
        })
    }
  }
}
