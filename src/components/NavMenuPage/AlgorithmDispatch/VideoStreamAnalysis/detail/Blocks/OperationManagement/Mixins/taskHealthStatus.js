import task from '@/api/task'
import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      taskHealthStatusDialog: {},
      taskHealthStatusDialogTemplate: {
        name: 'FormList',
        option: {
          class: 'is-inner bottom-0',
          data: {
          },
          formGroup: [
            {
              head: { label: '任务就绪检查项', class: 'is-weight' },
              form: [
                {
                  type: 'spanAssembly',
                  label: '计算服务在线状态',
                  prop: 'serviceOnline'
                },
                {
                  type: 'spanAssembly',
                  label: '计算服务运行状态',
                  prop: 'serviceHealth'
                },
                {
                  type: 'spanAssembly',
                  label: '任务运行时间',
                  prop: 'enableName'
                }
              ]
            },
            {
              head: { label: '任务健康状态', class: 'is-weight' },
              form: [
                {
                  type: 'spanAssembly',
                  label: '健康状态',
                  prop: 'taskStatus'
                }
              ]
            }
          ],
          labelPosition: 'left',
          labelWidth: '150px'
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'dialog'
    ])
  },
  watch: {
  },
  methods: {
    openTaskHealthStatusDialog() {
      // 清空数据
      this.taskHealthStatusDialog = deepClone(this.taskHealthStatusDialogTemplate)

      const assignObj = {
        title: '任务健康详情',
        show: true,
        name: 'DialogShell',
        customClass: 'dialog--mini',
        buttons: {
          buttons: [
            {
              label: '关闭',
              value: 'cancel',
              type: 'primary'
            }
          ]
        },
        component: this.taskHealthStatusDialog
      }

      task.getTaskHealthStatus({ taskId: this.$route.query.id })
        .then(res => {
          const { data } = res

          const option = this.taskHealthStatusDialog.option
          option.data.serviceOnline = ['离线', '在线'][data.service.online]
          option.formGroup[0].form[0].svg = ['error', 'success'][data.service.online]

          option.data.serviceHealth = ['异常', '正常', '注意'][data.service.health]
          option.formGroup[0].form[1].svg = ['error', 'success', 'warning'][data.service.health]

          option.data.enableName = ['非运行时间段', '在运行时间段'][data.enable]
          option.formGroup[0].form[2].svg = ['warning', 'success'][data.enable]

          option.data.taskStatus = ['异常', '正常', '注意'][data.task.status]
          option.formGroup[1].form[0].spanTip = '(健康修复功能已开启)'
          option.formGroup[1].form[0].svg = ['error', 'success', 'warning'][data.task.status]

          this.$store.dispatch('dialog/assignDialogData', assignObj)
        })
    }
  }
}
