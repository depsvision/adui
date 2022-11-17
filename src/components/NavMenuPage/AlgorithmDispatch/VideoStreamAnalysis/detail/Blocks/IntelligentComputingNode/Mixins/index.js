import device from '@/api/device'
import task from '@/api/task'
import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'

export default {
  data() {
    return {
      taskNodeDialog: {},
      taskNodeDialogTemplate: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
          },
          form: [
            {
              type: 'selectAssembly',
              label: '选择要替换的节点',
              prop: 'id',
              size: 'medium',
              placeholder: '请选择节点',
              option: []
            }
          ],
          labelPosition: 'left',
          labelWidth: '150px'
        }
      },
      detailDialog: {
        name: 'FormTree',
        option: {
          // class: 'is-inner',
          loading: false,
          statusOption: {
            label: '服务整体状态',
            statusName: '正常',
            class: ''
          },
          data: {
            currTime: '',
            startTime: '',
            timeTotal: '',
            whetherRunConfig: '',
            serverState: '',
            runningStartTime: '',
            runningStartReadyTime: '',
            runningTime: '',
            runningTimeTotal: '',
            whetherRunningDead: '',
            reasoning: '',
            callbackOk: '',
            cameraConnectString: '',
            cameraDecodeString: '',
            decodingType: '',
            decodingMode: '',
            algorithmString: '',
            pushString: ''
          },
          items: [
            {
              form: [
                {
                  label: '运行时间',
                  itemClass: 'is-weight'
                }
              ],
              items: [
                {
                  form: [
                    {
                      type: 'spanAssembly',
                      label: '当前系统时间',
                      prop: 'currTime',
                      labelWidth: '184px'
                    },
                    {
                      type: 'spanAssembly',
                      label: '服务启动时间',
                      prop: 'startTime',
                      labelWidth: '184px'
                    },
                    {
                      type: 'spanAssembly',
                      label: '服务工作时长',
                      prop: 'timeTotal',
                      labelWidth: '184px'
                    }
                  ]
                }
              ]
            },
            {
              form: [
                {
                  label: '运行参数及动态',
                  itemClass: 'is-weight'
                }
              ],
              items: [
                {
                  form: [
                    {
                      type: 'tagAssembly',
                      label: '是否有运行参数',
                      prop: 'whetherRunConfig',
                      labelWidth: '184px'
                    },
                    {
                      type: 'tagAssembly',
                      label: '服务运行状态',
                      prop: 'serverState',
                      labelWidth: '184px'
                    },
                    {
                      type: 'spanAssembly',
                      label: '开始时间',
                      prop: 'runningStartTime',
                      labelWidth: '184px'
                    },
                    {
                      type: 'spanAssembly',
                      label: '最近一次开始推理时间',
                      prop: 'runningStartReadyTime',
                      labelWidth: '184px'
                    }
                  ]
                }
              ]
            },
            {
              form: [
                {
                  type: 'spanAssembly',
                  label: '推理时间分析',
                  prop: 'runningTime',
                  info: {
                    label: '信息均是基于本次进入推理分析工作状态以来的统计信息'
                  },
                  spanStyle: {
                    color: 'rgba(14, 27, 46, .55)'
                  },
                  itemClass: 'is-weight',
                  labelWidth: '200px'
                }
              ],
              items: [
                {
                  form: [
                    {
                      type: 'spanAssembly',
                      label: '推理工作时长',
                      prop: 'runningTimeTotal',
                      labelWidth: '184px'
                    }
                  ]
                }
              ]
            },
            {
              form: [
                {
                  label: '假死判断',
                  itemClass: 'is-weight'
                }
              ],
              items: [
                {
                  form: [
                    {
                      type: 'tagAssembly',
                      label: '是否假死',
                      prop: 'whetherRunningDead',
                      labelWidth: '184px'
                    }
                  ]
                }
              ]
            },
            {
              form: [
                {
                  type: 'spanAssembly',
                  label: '推理状态',
                  prop: 'reasoning',
                  info: {
                    label: '信息均是基于本次进入推理分析工作状态以来的统计信息'
                  },
                  spanStyle: {
                    color: 'rgba(14, 27, 46, .55)'
                  },
                  itemClass: 'is-weight',
                  labelWidth: '200px'
                }
              ],
              items: [
                {
                  form: [
                    {
                      label: 'Http-callback信息'
                    }
                  ],
                  items: [
                    {
                      form: [
                        {
                          type: 'tagAssembly',
                          label: '最近回调是否成功',
                          prop: 'callbackOk',
                          labelWidth: '168px'
                        }
                      ]
                    }
                  ]
                },
                {
                  form: [
                    {
                      label: '摄像头状态'
                    }
                  ],
                  items: [
                    {
                      form: [
                        {
                          type: 'tagAssembly',
                          label: '连接状态(所有)',
                          prop: 'cameraConnectString',
                          labelWidth: '168px'
                        },
                        {
                          type: 'tagAssembly',
                          label: '解码状态(所有)',
                          prop: 'cameraDecodeString',
                          labelWidth: '168px'
                        },
                        {
                          type: 'spanAssembly',
                          label: '解码类型',
                          prop: 'decodingType',
                          labelWidth: '168px'
                        },
                        {
                          type: 'spanAssembly',
                          label: '解码模式',
                          prop: 'decodingMode',
                          labelWidth: '168px'
                        }
                      ]
                    }
                  ]
                },
                {
                  form: [
                    {
                      label: '启用的算法状态'
                    }
                  ],
                  items: [
                    {
                      form: [
                        {
                          type: 'tagAssembly',
                          label: '是否正常运行',
                          prop: 'algorithmString',
                          labelWidth: '168px'
                        }
                      ]
                    }
                  ]
                },
                {
                  form: [
                    {
                      label: '推流状态'
                    }
                  ],
                  items: [
                    {
                      form: [
                        {
                          type: 'tagAssembly',
                          label: '推流是否正常',
                          prop: 'pushString',
                          labelWidth: '168px'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          labelPosition: 'left'
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'button',
      'dialog'
    ])
  },
  watch: {
    'button.value'(val) {
      this.clickButton(val)
    },
    'dialog.listenerData': {
      handler(val) {
        if (!val || this.dialog.listenerKey !== 'autoSchedule') return

        this.formListOption.form[0].switchTip = this.formListOption.data.autoSchedule ? '自动调度已开启，将为您自动选择可用节点' : ''
        this.formListOption.form[0].disabled = true

        this.saveAutoSchedule(val)
      },
      deep: true
    }
  },
  methods: {
    clickButton(value) {
      switch (value) {
        case 'editTaskNode':
          this.openTaskNodeDia()
          break
        case 'serviceDetail':
          this.openServiceDetail()
          break
        case 'saveTaskNode':
          this.saveTaskNode()
          break
        case 'forceRelease':
          this.forceRelease()
          break
        case 'refreshDetail':
          this.refreshDetail()
          break
        default:
      }
    },
    saveAutoSchedule(value) {
      const params = {
        taskId: this.$route.query.id,
        service: {
          autoSchedule: value ? 1 : 0
        }
      }

      task.editServiceAutoSchedule(params)
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: '自动调度修改成功!'
          })

          this.formListOption.form[0].disabled = false
        })
        .catch(() => {
          this.formListOption.data.autoSchedule = !value
          this.formListOption.form[0].switchTip = this.formListOption.data.autoSchedule ? '自动调度已开启，将为您自动选择可用节点' : ''
          this.formListOption.form[0].disabled = false
        })
    },
    openTaskNodeDia() {
      // 清空数据
      this.taskNodeDialog = deepClone(this.taskNodeDialogTemplate)

      const assignObj = {
        title: '替换计算节点',
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
              value: 'saveTaskNode',
              type: 'primary'
            }
          ]
        },
        component: this.taskNodeDialog
      }

      const formListForm = this.formListOption.form
      formListForm[0].buttons.buttons[0].loading = true

      this.taskNodeDialog.option.data = deepClone(this.formListOption.data)

      device.getServiceList()
        .then(res => {
          const { serviceList } = res.data

          serviceList.forEach(item => {
            item.value = item.id

            item.label = item.name + '-' + item.id + ' ( ' + ['离线', '在线', '占用'][item.status] + ' )'

            item.disabled = item.status !== 1
          })

          this.taskNodeDialog.option.form[0].option = serviceList

          const hasServiceId = serviceList.find(item => item.value === this.taskNodeDialog.option.data.taskNode)

          if (!hasServiceId) {
            this.taskNodeDialog.option.data.taskNode = ''
          }

          formListForm[0].buttons.buttons[0].loading = false

          this.$store.dispatch('dialog/assignDialogData', assignObj)
        })
        .catch(() => {
          formListForm[0].buttons.buttons[0].loading = false
        })
    },
    saveTaskNode() {
      const params = {
        taskId: this.$route.query.id,
        service: {
          id: this.taskNodeDialog.option.data.id
        }
      }

      task.editServiceAutoSchedule(params)
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: '计算节点修改成功!'
          })

          this.$store.dispatch('dialog/initDialogData')

          const select = this.taskNodeDialog.option.form[0].option.find(item => item.id === this.taskNodeDialog.option.data.id)
          this.formListOption.data.id = select.id
          this.formListOption.data.service.id = select.id
          this.formListOption.data.service.ip = select.ip
          this.formListOption.data.service.name = select.name
          this.formListOption.data.service.port = select.port
          this.formListOption.data.taskNode = ['', '自动 ( '][this.formListOption.data.autoSchedule ? 1 : 0] +
                                      select.name +
                                      '-' +
                                      select.id +
                                      ['', ' )'][this.formListOption.data.autoSchedule ? 1 : 0]
        })
    },
    refreshDetail(assignObj) {
      const option = this.detailDialog.option

      option.loading = true

      device.getServiceHealthDetail({ id: this.formListOption.data.id })
        .then(res => {
          const { detail } = res.data

          detail.timeTotal = this.$dayjs.duration(detail.timeTotal * 1000).format('D天  H小时m分钟s秒')

          this.$set(this.detailDialog.option, 'data', detail)

          this.detailDialog.option.statusOption.statusName = ['异常', '正常', '注意'][res.data.serviceStatus]
          this.detailDialog.option.statusOption.class = ['is-red', 'is-green', 'is-orange'][res.data.serviceStatus]

          this.dealDetailData(detail)

          option.loading = false

          if (!assignObj) {
            this.$messageInfo({
              type: 'success',
              message: '刷新服务健康状态成功'
            })
          }
        })
        .catch(() => {
          option.loading = false
        })
    },
    openServiceDetail() {
      // 清空数据
      this.detailDialog.option.data = {}
      this.detailDialog.option.statusOption.statusName = ''
      this.detailDialog.option.statusOption.class = ''

      const assignObj = {
        title: '服务健康状态详情',
        show: true,
        name: 'DialogShell',
        width: '700px',
        customClass: 'dialog-height--large',
        buttons: {
          buttons: [
            {
              label: '刷新',
              value: 'refreshDetail',
              plain: true
            },
            {
              label: '关闭',
              value: 'cancel',
              type: 'primary'
            }
          ]
        },
        component: this.detailDialog
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)

      this.refreshDetail(true)
    },
    dealDetailData(detail) {
      const data = this.detailDialog.option.data

      this.$set(data, 'runningTime', '当运行状态为“run”时，才有以下所有信息')

      this.$set(data, 'reasoning', '当假死判断为“FALSE”时，才有以下所有信息')

      data.whetherRunConfig = [
        {
          label: (data.whetherRunConfig !== undefined) ? String(data.whetherRunConfig).toLocaleUpperCase() : '无',
          class: detail.whetherRunConfig ? 'tag-green' : 'tag-grey'
        }
      ]

      data.serverState = [
        {
          label: detail.serverState,
          class: [' tag-green', ' tag-grey', ' tag-blue', ' tag-orange'][['run', 'stop', 'starting', 'ending'].indexOf(detail.serverState)]
        }
      ]

      !data.runningStartTime && (data.runningStartTime = '一')

      !data.runningStartReadyTime && (data.runningStartReadyTime = '一')

      data.runningTimeTotal = data.runningTimeTotal ? this.$dayjs.duration(detail.runningTimeTotal * 1000).format('D天  H小时m分钟s秒') : '一'

      data.whetherRunningDead = [
        {
          label: (detail.whetherRunningDead !== undefined) ? String(detail.whetherRunningDead).toLocaleUpperCase() : '无',
          class: (detail.whetherRunningDead !== undefined) ? (detail.whetherRunningDead ? 'tag-grey' : 'tag-green') : 'tag-grey'
        }
      ]

      data.callbackOk = [
        {
          label: (detail.callbackOk !== undefined) ? String(detail.callbackOk).toLocaleUpperCase() : '无',
          class: (detail.callbackOk !== undefined) ? (detail.whetherRunningDead ? 'tag-green' : 'tag-grey') : 'tag-grey'
        }
      ]

      data.cameraConnectString = [
        {
          label: detail.cameraConnect ? ['异常', '正常', '注意'][detail.cameraConnect.status] : '无',
          class: detail.cameraConnect ? ['tag-red', 'tag-green', 'tag-orange'][detail.cameraConnect.status] : 'tag-grey'
        }
      ]
      data.cameraConnectStringExpand = detail.cameraConnect ? detail.cameraConnect.status === 1 ? '' : (' ( ' + detail.cameraConnect.error.reduce((f, l, i) => f + ((i === 0) ? '' : ', ') + l, '') + ' )') : ''

      data.cameraDecodeString = [
        {
          label: detail.cameraDecode ? ['异常', '正常', '注意'][detail.cameraDecode.status] : '无',
          class: detail.cameraDecode ? ['tag-red', 'tag-green', 'tag-orange'][detail.cameraDecode.status] : 'tag-grey'
        }
      ]
      data.cameraDecodeStringExpand = detail.cameraDecode ? (detail.cameraDecode.status === 1 ? '' : (' ( ' + detail.cameraDecode.error.reduce((f, l, i) => f + ((i === 0) ? '' : ', ') + l, '') + ' )')) : ''

      data.decodingType = detail.decodingType ? (['软解', '硬解'][['CPU', 'GPU'].indexOf(detail.decodingType.toLocaleUpperCase())] || '混合模式') : '一'

      data.decodingMode = detail.decodingMode ? (['关键帧', '全帧'][['onlyIDR', 'full'].indexOf(detail.decodingType.toLocaleUpperCase())] || '混合') : '一'

      data.algorithmString = [
        {
          label: detail.algorithm ? ['异常', '正常', '注意'][detail.algorithm.status] : '无',
          class: detail.algorithm ? ['tag-red', 'tag-green', 'tag-orange'][detail.algorithm.status] : 'tag-grey'
        }
      ]
      data.algorithmStringExpand = detail.algorithm ? (detail.algorithm.status === 1 ? '' : (' ( ' + detail.algorithm.error.reduce((f, l, i) => f + ((i === 0) ? '' : ', ') + l, '') + ' )')) : ''

      data.pushString = [
        {
          label: detail.push ? ['异常', '正常', '注意'][detail.push.status] : '无',
          class: detail.push ? ['tag-red', 'tag-green', 'tag-orange'][detail.push.status] : 'tag-grey'
        }
      ]
      data.pushStringExpand = detail.push ? (detail.push.status === 1 ? '' : (' ( ' + detail.push.error.reduce((f, l, i) => f + ((i === 0) ? '' : ', ') + l, '') + ' )')) : ''
    },
    forceRelease() {
      this.$confirm('强制释放将会暂时中止任务，但也可用于修复异常错误；请仅在必要时执行该操作！', '强制释放', {
        confirmButtonText: '释放',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        confirmButtonClass: 'is-danger',
        type: 'warning',
        customClass: 'dialog--mini'
      }).then(() => {
        device.stopService({ serviceId: this.formListOption.data.id })
          .then(res => {
            this.$messageInfo({
              type: 'success',
              message: '已发送停止指令'
            })
          })
      })
    }
  }
}
