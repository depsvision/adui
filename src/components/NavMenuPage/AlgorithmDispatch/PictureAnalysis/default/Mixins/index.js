import task from '@/api/task'
import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      taskDialog: {},
      taskDialogTemplate: {
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
              tip: '更多配置信息请在任务详情操作',
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
      'dialog',
      'button',
      'buttonScope',
      'closeDialogName'
    ])
  },
  watch: {
    'button.value'(val) {
      this.clickDefaultButton(val)
    }
  },
  methods: {
    clickDefaultButton(value) {
      switch (value) {
        case 'new':
          this.showAddTaskDialog()
          break
        case 'saveTask':
          this.saveTask()
          break
        case 'detail':
          this.intoAnalysisDetail()
          break

        case 'start':
          this.startTaskStatus()
          break
        case 'stop':
          this.stopTaskStatus()
          break
        default:
      }
    },
    getPictureAnalysisData() {
      const params = {
        page: this.tablePagerOption.currentPage,
        size: this.tablePagerOption.pageSizes
      }

      task.getImageList(params)
        .then(res => {
          const { taskList } = res.data

          this.dealData(taskList)

          this.serveTableOption.tableData = taskList

          this.tablePagerOption = Object.assign(this.tablePagerOption, res.data.pageVO)

          this.pageLoading = false
        })
        .catch(() => {
          this.pageLoading = false
        })
    },
    dealData(data) {
      data.forEach(item => {
        item.disabled = item.status ? [] : ['openTestInput']

        item.statusName = item.status ? '已启用' : '已停用'
        item.statusNameClass = ['is-half', ''][item.status]
        item.hide = item.status ? ['start'] : ['stop']

        item.serviceHealthName = ['异常', '正常', '注意'][item.serviceHealth] || '无'
        item.serviceHealthNameClass = ['is-red', 'is-green', 'is-orange'][item.serviceHealth] || 'is-grey'

        item.algorithmTasksTag = []

        item.algorithm.forEach(tag => {
          item.algorithmTasksTag.push({
            label: tag,
            value: tag,
            class: 'tag-grey',
            style: {
              'max-width': '110px',
              'margin-bottom': '6px'
            },
            disableTransitions: true
          })
        })
      })
    },
    showAddTaskDialog() {
      // 清空数据
      this.taskDialog = deepClone(this.taskDialogTemplate)

      const assignObj = {
        title: '新建任务',
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
              value: 'saveTask',
              type: 'primary'
            }
          ]
        },
        component: this.taskDialog
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    saveTask() {
      this.taskDialog.option.ref.validate(valid => {
        if (valid) {
          task.addImageTask({ name: this.taskDialog.option.data.name })
            .then(res => {
              this.$messageInfo({
                type: 'success',
                message: '新建任务成功！'
              })

              this.$store.dispatch('dialog/initDialogData')
              this.pageLoading = true
              this.getPictureAnalysisData()
            })
        }
      })
    },
    intoAnalysisDetail() {
      this.$router.push({ name: 'PictureAnalysisDetail', query: { id: this.buttonScope.row.id }})
    }
  }
}
