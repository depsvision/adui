import task from '@/api/task'
import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      taskNameDialog: {},
      taskNameDialogTemplate: {
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
        case 'editTaskName':
          this.showEditTaskNameDialog()
          break
        case 'saveTaskName':
          this.saveTaskName()
          break
        default:
      }
    },
    showEditTaskNameDialog() {
      // 清空数据
      this.taskNameDialog = deepClone(this.taskNameDialogTemplate)

      const assignObj = {
        title: '修改任务名称',
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
              value: 'saveTaskName',
              type: 'primary'
            }
          ]
        },
        component: this.taskNameDialog
      }

      this.taskNameDialog.option.data = deepClone(this.formListOption.data)

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    saveTaskName() {
      this.taskNameDialog.option.ref.validate(valid => {
        if (valid) {
          const params = {
            taskId: this.$route.query.id,
            name: this.taskNameDialog.option.data.name
          }

          task.editTaskName(params)
            .then(res => {
              this.$messageInfo({
                type: 'success',
                message: '修改任务名称成功!'
              })

              this.$store.dispatch('dialog/initDialogData')
              this.formListOption.data.name = this.taskNameDialog.option.data.name
            })
        }
      })
    }
  }
}
