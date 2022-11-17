import task from '@/api/task'
import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      analysisConfigDialog: {},
      analysisConfigDialogTemplate: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            analysisFrammeRate: '默认所有',
            analysisCallback: '默认报警结果及原始图片'
          },
          form: [
            {
              type: 'spanAssembly',
              label: '分析帧率',
              prop: 'analysisFrammeRate'
            },
            {
              type: 'inputCountNumber',
              label: '报警返回间隔',
              prop: 'interval',
              placeholder: '0',
              controlsPosition: 'right',
              width: '108px',
              min: 0,
              unit: 's'
            },
            {
              type: 'spanAssembly',
              label: '报警返回内容',
              prop: 'analysisCallback'
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
        case 'editAnalysisConfig':
          this.openAnalysisConfigDialog()
          break
        case 'saveAnalysisConfig':
          this.saveAnalysisConfig()
          break
        default:
      }
    },
    openAnalysisConfigDialog() {
      // 清空数据
      this.analysisConfigDialog = deepClone(this.analysisConfigDialogTemplate)

      const assignObj = {
        title: '分析配置',
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
              value: 'saveAnalysisConfig',
              type: 'primary'
            }
          ]
        },
        component: this.analysisConfigDialog
      }

      this.analysisConfigDialog.option.data = deepClone(this.analysisConfiguration.data)

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    saveAnalysisConfig() {
      const params = {
        taskId: this.$route.query.id,
        analysis: {
          interval: this.analysisConfigDialog.option.data.interval
        }
      }
      task.editAnalysisConfig(params)
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: '保存分析配置成功!'
          })

          this.$store.dispatch('dialog/initDialogData')

          this.analysisConfiguration.data.interval = params.analysis.interval
          this.analysisConfiguration.data.analysisInterval = params.analysis.interval + ' s'
        })
    }
  }
}
