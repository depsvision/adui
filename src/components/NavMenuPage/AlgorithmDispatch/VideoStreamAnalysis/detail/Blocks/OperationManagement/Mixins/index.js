import task from '@/api/task'

import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      configDia: {
        name: 'FormList',
        option: {
          class: 'is-inner bottom-0',
          topButtons: {
            style: {
              'margin-bottom': '16px'
            },
            class: ['small-buttons'],
            buttons: [
              {
                label: '导入',
                value: 'importConfig',
                plain: true
              }, {
                label: '导出',
                value: 'exportConfig',
                plain: true
              }
            ]
          },
          data: {
          },
          formGroup: [
            {
              head: { label: '版本对照', class: 'is-weight' },
              form: [
                {
                  type: 'spanAssembly',
                  label: '当前配置文件修改日期',
                  prop: 'configUpdate'
                },
                {
                  type: 'spanAssembly',
                  label: '是否已下发最新配置',
                  prop: 'issueNew'
                }
              ]
            },
            {
              head: { label: '下发记录', class: 'is-weight' },
              form: [
                {
                  type: 'spanAssembly',
                  label: '是否在运行时间段',
                  prop: 'running'
                },
                {
                  type: 'spanAssembly',
                  label: '最近下发时间',
                  prop: 'deliveryTime'
                },
                {
                  type: 'spanAssembly',
                  label: '是否下发成功',
                  prop: 'success'
                },
                {
                  type: 'spanAssembly',
                  label: '下发方式',
                  prop: 'mode'
                }
              ]
            }
          ],
          labelPosition: 'left',
          labelWidth: '224px'
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'button'
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
        // task Status
        case 'editTaskStatus':
          this.getTaskEnableData()
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

        // task Time
        case 'setTaskTime':
          this.openTaskTimeDialog()
          break
        case 'addTimePicker':
          this.addTimePicker()
          break
        case 'saveTaskTime':
          this.saveTaskTime()
          break

          // tsak Health Status
        case 'viewTaskHealthStatus':
          this.openTaskHealthStatusDialog()
          break

        // health Level
        case 'editHealthLevel':
          this.openHealthLevelDialog()
          break
        case 'saveHealthLevel':
          this.saveHealthLevel()
          break

        // config issue
        case 'viewConfig':
          this.viewConfig()
          break
        case 'importConfig':
          this.importConfig()
          break
        case 'exportConfig':
          this.exportConfig()
          break
        default:
      }
    },

    viewConfig() {
      this.configDia.option.data = deepClone(this.formListOption.data)

      const assignObj = {
        title: '配置文件下发',
        show: true,
        name: 'DialogShell',
        width: '624px',
        buttons: {
          buttons: [
            {
              label: '关闭',
              value: 'cancel',
              type: 'primary'
            }
          ]
        },
        component: this.configDia
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    importConfig() {
      this.$refs.fileImport.dispatchEvent(new MouseEvent('click'))
    },
    fileLoad() {
      const that = this
      const selectedFile = this.$refs.fileImport.files[0]
      var reader = new FileReader()
      reader.readAsText(selectedFile)
      reader.onload = async function() {
        const result = JSON.parse(this.result)

        const params = {
          taskId: that.$route.query.id,
          config: result
        }
        task.importTaskConfig(params)
          .then(res => {
            that.$message({
              type: 'success',
              message: '导入配置文件成功!'
            })

            that.$parent.$parent.getTaskDetail()
          })
        that.$refs.fileImport.value = ''
      }
    },
    exportConfig() {
      task.exportTaskConfig({ taskId: this.$route.query.id })
        .then(res => {
          const { url } = res.data

          const link = document.createElement('a')
          link.href = url

          if (url) {
            link.click()
          } else {
            this.$messageInfo({
              type: 'warning',
              message: '暂无配置!'
            })
          }
        })
    }
  }
}
