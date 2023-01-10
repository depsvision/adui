import device from '@/api/device'
import task from '@/api/task'
import configuration from '@/setting'

import { deepClone } from '@/utils'
import { String } from 'core-js'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      tableLoading: null,
      activeTableIndex: null,
      serviceDialog: {},
      serviceDialogTemplate: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          alert: {
            title: '',
            type: 'warning',
            closable: false,
            showIcon: true,
            buttons: [
              {
                label: '查看详情',
                value: 'linkToLicense',
                type: 'text'
              }
            ]
          },
          data: {
            serviceTypeResult: 'RTVAS',
            autoServicePort: 1,
            serviceStatus: 0,
            caisa: []
          },
          form: [
            {
              type: 'selectAssembly',
              label: '服务类型',
              prop: 'serviceTypeResult',
              class: 'has-divider',
              option: [
                {
                  label: 'RTVAS',
                  value: 'RTVAS'
                },
                {
                  label: 'RTIAS',
                  value: 'RTIAS'
                },
                {
                  label: 'RTVRS',
                  value: 'RTVRS'
                },
                {
                  label: 'RTICS',
                  value: 'RTICS'
                }
              ]
            },
            {
              type: 'radioAssembly',
              label: '服务端口',
              prop: 'autoServicePort',
              class: '',
              radio: [
                {
                  label: '自动',
                  value: 1
                },
                {
                  label: '手动',
                  value: 0
                }
              ],
              bottom: {
                type: '',
                valueType: 'Number',
                min: 1024,
                max: 65535,
                prop: 'servicePort',
                isInlineError: true,
                style: {
                  width: '235px'
                },
                clearable: true,
                placeholder: '请输入端口'
              }
            },
            {
              type: 'checkboxAssembly',
              label: '计算资源(板卡)',
              prop: 'caisa',
              error: '',
              checkbox: [],
              hide: false
            }
          ],
          labelPosition: 'left',
          labelWidth: '120px'
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
              hide: false,
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
      },
      serviceAlgorithm: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            algorithmGroup: []
          },
          form: [
            {
              type: 'tagInput',
              label: '启用算法',
              labelSvg: 'required-fill',
              svg: 'list-file-line',
              prop: 'algorithmGroup',
              isInlineError: true,
              suffixIcon: 'el-icon-caret-bottom',
              size: 'medium',
              placeholder: '请选择'
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
      'buttonScope'
    ])
  },
  watch: {
    'serviceDialog.option.data.autoServicePort'(val) {
      if (this.dialog.show) {
        this.dealPortData(val)
      }
    },
    'serviceDialog.option.data.caisa'(val, old) {
      if (this.dialog.show) {
        this.validCaisa(val, old)
      }
    },
    'serviceAlgorithm.option.data.algorithmGroup'(val, old) {
      if (this.dialog.show && old !== undefined) {
        const data = this.serviceAlgorithm.option.data
        const form = this.serviceAlgorithm.option.form

        const algorithmGroupForm = form.find(item => item.prop === 'algorithmGroup')

        if (data.algorithmGroup.length) {
          this.$set(algorithmGroupForm, 'errorMessage', '')
        } else {
          this.$set(algorithmGroupForm, 'errorMessage', '请至少选择一个算法')
        }
      }
    },
    'serviceDialog.option.data.serviceTypeResult'(val) {
      if (!this.serviceDialog.option) {
        return
      }

      const form = this.serviceDialog.option.form

      const autoServicePortForm = form.find(item => item.prop === 'autoServicePort')
      const caisaForm = form.find(item => item.prop === 'caisa')

      if (['RTVRS', 'RTICS'].includes(val)) {
        autoServicePortForm.class = 'is-bottom'
        caisaForm.hide = true
      } else {
        autoServicePortForm.class = ''
        caisaForm.hide = false
      }
    },
    'dialog.show'(val) {
      if (!val) {
        this.serviceDialog = {}
      }
    }
  },
  methods: {
    dealPortData(val) {
      const form = this.serviceDialog.option.form

      const autoServicePortForm = form.find(item => item.prop === 'autoServicePort')

      if (val) {
        autoServicePortForm.bottom.type = ''
      } else {
        autoServicePortForm.bottom.type = 'inputAssembly'
      }
    },

    loadingMask(nodeId) {
      this.activeTableIndex = this.physicalNode.findIndex(item => item.data.id === nodeId)

      this.activeTable = this.$refs.formTable[this.activeTableIndex]

      this.tableLoading = this.$loading({
        target: this.activeTable.$el
      })
    },
    getServiceData(nodeId) {
      this.activeTableIndex = this.physicalNode.findIndex(item => item.data.id === nodeId)

      device.getServiceData({ nodeId: nodeId })
        .then(res => {
          const { serviceList } = res.data

          serviceList.forEach((service) => {
            this.dealTableData(service)
            service.nodeId = this.physicalNode[this.activeTableIndex].id
            service.tasksString = service.tasks
          })

          this.physicalNode[this.activeTableIndex].tableOption['tableData'] = serviceList

          if (!serviceList.length) {
            this.physicalNode[this.activeTableIndex].leftButtons.buttons[2]['disabled'] = true
          } else {
            this.physicalNode[this.activeTableIndex].leftButtons.buttons[2]['disabled'] = false
          }

          this.$nextTick(() => {
            this.tableLoading && this.tableLoading.close()
          })
        })
        .catch(() => {
          this.$nextTick(() => {
            this.tableLoading && this.tableLoading.close()
          })
        })
    },
    showServiceDia() {
      // 清空数据
      this.serviceDialog = deepClone(this.serviceDialogTemplate)

      const assignObj = {
        title: '新增服务',
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
              value: 'saveService',
              type: 'primary'
            }
          ]
        },
        component: {}
      }

      const option = this.serviceDialog

      let caisas = []

      if (this.action === 'edit') {
        assignObj.title = '编辑服务'
        option.option.data = Object.assign(option.option.data, this.buttonScope.row)

        const activeNode = this.physicalNode.find(item => item.data.id === this.buttonScope.row.nodeId)

        caisas = activeNode.caisas
      } else {
        this.activeTableIndex = this.physicalNode.findIndex(item => item.data.id === this.buttonScope.id)

        this.activeTable = this.$refs.formTable[this.activeTableIndex]

        caisas = this.physicalNode[this.activeTableIndex].caisas
      }

      if (!caisas) {
        caisas = []
      }

      const caisaForm = option.option.form.find(item => item.prop === 'caisa')
      caisaForm.checkbox = []
      caisas.forEach(ca => {
        caisaForm.checkbox.push({
          label: ca,
          value: ca
        })
      })

      assignObj.component = option

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    validCaisa(val, old) {
      const form = this.serviceDialog.option.form

      const caisaForm = form.find(item => item.prop === 'caisa')

      if (old !== undefined) {
        if (val && !val.length) {
          caisaForm.error = '请至少选择一张板卡'
        } else {
          caisaForm.error = ''
        }
      }
    },
    saveService() {
      this.serviceDialog.option.alert.title = ''

      const data = this.serviceDialog.option.data
      const form = this.serviceDialog.option.form

      const caisaForm = form.find(item => item.prop === 'caisa')

      if (!data.autoServicePort) {
        if (Number(data.servicePort) < 1024 || Number(data.servicePort) > 65535 || data.servicePort === '') return
      }

      if (['RTVAS', 'RTIAS'].includes(data.serviceTypeResult) && caisaForm.checkbox.length && !data.caisa.length) {
        caisaForm.error = '请至少选择一张板卡'
        return
      }

      let nodeId = this.buttonScope.id
      const params = {
        type: ['', 'RTVAS', 'RTIAS', 'RTVRS', 'RTICS'].indexOf(data.serviceTypeResult),
        nodeId: nodeId,
        port: Number(data.servicePort),
        auto: data.autoServicePort,
        caisa: data.caisa
      }

      if (this.action === 'edit') {
        nodeId = this.buttonScope.row.nodeId
        params.id = this.buttonScope.row.serviceId
        params.nodeId = nodeId
      }

      this.activeTableIndex = this.physicalNode.findIndex(item => item.data.id === params.nodeId)

      this.activeTable = this.$refs.formTable[this.activeTableIndex]

      this.tableLoading = this.$loading({
        target: this.activeTable.$el
      })

      this.dialog.buttons.buttons[1].loading = true
      this.dialog.self.$refs.buttonGroup.$forceUpdate()

      device.saveServiceData(params, true)
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: this.dialog.title + '成功！'
          })

          this.serviceDialog.option.alert.title = ''
          this.dialog.buttons.buttons[1].loading = false
          this.dialog.self.$refs.buttonGroup.$forceUpdate()

          this.$store.dispatch('dialog/initDialogData')
          this.getServiceData(nodeId)
        })
        .catch(err => {
          if (err.errorCode === 2004) {
            // this.serviceDialog.option.alert.title = err.errorMsg.replaceAll('\n', '<br />')
          } else {
            this.$messageInfo({
              type: 'error',
              message: err.errorMsg
            })
          }

          this.dialog.buttons.buttons[1].loading = false
          this.dialog.self.$refs.buttonGroup.$forceUpdate()

          this.$nextTick(() => {
            this.tableLoading.close()
          })
        })
    },
    deleteService() {
      this.$confirm('删除服务后，关联的任务也将无法调用当前服务，请谨慎操作！', '提示', {
        confirmButtonText: '删除',
        confirmButtonClass: 'is-danger',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'dialog--mini'
      }).then(() => {
        this.activeTableIndex = this.physicalNode.findIndex(item => item.data.id === this.buttonScope.row.nodeId)

        this.activeTable = this.$refs.formTable[this.activeTableIndex]

        this.tableLoading = this.$loading({
          target: this.activeTable.$el
        })

        device.deleteServiceData({ id: this.buttonScope.row.serviceId })
          .then(res => {
            this.$messageInfo({
              type: 'success',
              message: '删除成功！'
            })

            this.getServiceData(this.buttonScope.row.nodeId)
          })
          .catch(() => {
            this.$nextTick(() => {
              this.tableLoading.close()
            })
          })
      })
    },
    restartAllService() {
      this.$confirm('该操作将会重启当前物理节点上的所有服务，请谨慎操作！', '重启所有服务', {
        confirmButtonText: '重启',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'dialog--mini'
      }).then(() => {
        this.loadingMask(this.buttonScope.id)

        device.restartServices({ nodeId: this.buttonScope.id })
          .then(res => {
            this.$messageInfo({
              type: 'success',
              message: '正在重启所有服务'
            })

            this.$nextTick(() => {
              this.tableLoading.close()
            })
          })
          .catch(() => {
            this.$nextTick(() => {
              this.tableLoading.close()
            })
          })
      })
    },
    refreshDetail(assignObj) {
      const option = this.detailDialog.option

      option.loading = true

      device.getServiceHealthDetail({ id: this.buttonScope.row.serviceId })
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
    getServiceHealthDetail() {
      // 清空数据
      this.detailDialog.option.data = {}
      this.detailDialog.option.statusOption.statusName = ''
      this.detailDialog.option.statusOption.class = ''

      if (this.buttonScope.row.serviceType === 3) {
        this.detailDialog.option.items[4].hide = true
      } else {
        this.detailDialog.option.items[4].hide = false
      }

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

    getAlgorithm() {
      return new Promise(resolve => {
        task.taskSub()
          .then(res => {
            const { taskList } = res.data

            taskList.forEach(item => {
              item.label = item.name
              item.id = item.task_key
              item.tagSvg = configuration.algorithmSvg[item.id] || 'normal'
            })

            resolve(taskList)
          })
          .catch(() => {
            resolve('')
          })
      })
    },
    changeAlgorithm() {
      this.serviceAlgorithm.option.data.algorithmGroup = deepClone(this.buttonScope.row.runningAlgorithm)

      const assignObj = {
        title: '启用算法',
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
              label: '应用',
              value: 'startAlgorithm',
              type: 'primary'
            }
          ]
        },
        component: this.serviceAlgorithm
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    async openTagInput() {
      const treeListDia = {
        name: 'TreeList',
        option: {
          type: '',
          bottomHead: '选择算法',
          placeholder: '搜索算法',
          tagClosable: true,
          resultLoding: false,
          tagData: this.serviceAlgorithm.option.data.algorithmGroup,
          tabData: [
            {
              id: 'node',
              label: '算法',
              filterBlock: 'rightTree',
              treeData: [
                {
                  label: '全部',
                  groupId: 0
                }
              ],
              resultData: await this.getAlgorithm() || []
            }
          ],
          treeOption: {
            data: [],
            slotScope: true,
            expandOnClickNode: false,
            highlightCurrent: true,
            filterBlock: 'last',
            currentNode: 0,
            nodeKey: 'groupId',
            checkStrictly: true,
            expandedKeys: [0],
            filterInput: {
              hide: true
            },
            tooltip: {
              placement: 'top-start',
              enterable: false
            }
          },
          resultOption: {
            data: [],
            slotScope: true,
            expandOnClickNode: false,
            currentNode: 0,
            nodeKey: 'id',
            filterInput: {
              hide: true
            },
            expandedKeys: [0],
            showCheckbox: true,
            tooltip: {
              placement: 'top-start',
              enterable: false
            },
            tagSvg: 'normal',
            tagColor: 'blue'
          }
        }
      }

      const assignObj = {
        title: '选择算法',
        show: true,
        name: 'DialogShell',
        modal: true,
        clickClose: false,
        pressClose: false,
        showClose: true,
        level: 2,
        appendToBody: true,
        customClass: 'dialog--small',
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '保存',
              value: 'chooseAlgorithm',
              type: 'primary'
            }
          ]
        },
        component: treeListDia
      }

      this.$store.dispatch('dialog/setDialogData', { key: 'dialog', value: assignObj })
    },
    chooseAlgorithm() {
      const data = this.serviceAlgorithm.option.data

      data.algorithmGroup = deepClone(this.dialog.listenerClick.refs.tagData)

      this.$store.dispatch('dialog/initDialogData', true)
    },
    startAlgorithm() {
      const data = this.serviceAlgorithm.option.data

      if (!data.algorithmGroup.length) return

      const idArr = []

      this.serviceAlgorithm.option.data.algorithmGroup.forEach(al => {
        idArr.push(al.id)
      })

      const params = {
        serviceId: this.buttonScope.row.serviceId,
        algorithm: idArr
      }

      device.startRtiasAlgorithm(params)
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: '启用算法成功！'
          })

          this.$store.dispatch('dialog/initDialogData')
          this.getServiceData(this.buttonScope.row.nodeId)
        })
    }
  }
}
