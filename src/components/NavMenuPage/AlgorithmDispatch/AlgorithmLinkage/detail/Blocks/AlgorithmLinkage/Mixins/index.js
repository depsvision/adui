import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'

import device from '@/api/device'
import task from '@/api/task'

export default {
  data() {
    return {
      // first level
      firstLevelDia: {},
      firstLevelDiaTemplate: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            type: '',
            linkageObject: 0,
            object: 0,
            task: ''
          },
          rule: {
            task: [
              { required: true, message: '请选择任务', trigger: 'change' }
            ]
          },
          form: [
            {
              type: 'radioAssembly',
              label: '任务类型',
              prop: 'type',
              radio: [
                {
                  label: '视频流分析',
                  value: 1
                }
                // {
                //   label: '图片分析',
                //   value: 2
                // }
              ]
            },
            {
              type: 'selectAssembly',
              label: '选择任务',
              prop: 'task',
              size: 'medium',
              selectStyle: {
                width: '332px'
              },
              placeholder: '请选择任务',
              option: []
            },
            {
              type: 'radioAssembly',
              label: '联动算法',
              prop: 'linkageObject',
              radio: [
                {
                  label: '所有报警结果',
                  value: 0
                }
                // {
                //   label: '自定义',
                //   value: 1
                // }
              ],
              bottom: {}
            },
            {
              type: 'radioAssembly',
              label: '联动对象',
              prop: 'object',
              radio: [
                {
                  label: '所有对象',
                  value: 0
                },
                {
                  label: '仅报警对象',
                  value: 1
                }
              ]
            }
          ],
          labelPosition: 'left',
          labelWidth: '120px'
        }
      },
      videoStreamBottom: {
        type: 'LinkageTable',
        mainTable: {
          option: {
            height: 160
          },
          tableData: [
            {
              name: '反光衣',
              point: [
                {
                  id: 1,
                  name: '大门左边'
                },
                {
                  id: 2,
                  name: '大门右边'
                },
                {
                  id: 3,
                  name: '大门上边'
                },
                {
                  id: 4,
                  name: '大门下边'
                },
                {
                  id: 5,
                  name: '大门里边'
                }
              ],
              pointName: '大门左边、大门右边、路灯#12、路灯#16...等12个'
            },
            {
              name: '安全帽与反光衣',
              point: [
                {
                  id: 1,
                  name: '大门左边'
                },
                {
                  id: 2,
                  name: '大门右边'
                },
                {
                  id: 3,
                  name: '大门上边'
                },
                {
                  id: 4,
                  name: '大门下边'
                },
                {
                  id: 5,
                  name: '大门里边'
                }
              ],
              pointName: '大门左边、大门右边、路灯#12、路灯#16...等12个'
            },
            {
              name: '安全帽',
              point: [
                {
                  id: 1,
                  name: '大门左边'
                },
                {
                  id: 2,
                  name: '大门右边'
                },
                {
                  id: 3,
                  name: '大门上边'
                },
                {
                  id: 4,
                  name: '大门下边'
                },
                {
                  id: 5,
                  name: '大门里边'
                }
              ],
              pointName: '大门左边、大门右边、路灯#12、路灯#16...等12个'
            },
            {
              name: '工作服',
              point: [
                {
                  id: 1,
                  name: '大门左边'
                },
                {
                  id: 2,
                  name: '大门右边'
                },
                {
                  id: 3,
                  name: '大门上边'
                },
                {
                  id: 4,
                  name: '大门下边'
                },
                {
                  id: 5,
                  name: '大门里边'
                }
              ],
              pointName: '大门左边、大门右边、路灯#12、路灯#16...等12个'
            },
            {
              name: '安全帽与工作服',
              point: [
                {
                  id: 1,
                  name: '大门左边'
                },
                {
                  id: 2,
                  name: '大门右边'
                },
                {
                  id: 3,
                  name: '大门上边'
                },
                {
                  id: 4,
                  name: '大门下边'
                },
                {
                  id: 5,
                  name: '大门里边'
                }
              ],
              pointName: '大门左边、大门右边、路灯#12、路灯#16...等12个'
            },
            {
              name: '1',
              point: [
                {
                  id: 1,
                  name: '大门左边'
                },
                {
                  id: 2,
                  name: '大门右边'
                },
                {
                  id: 3,
                  name: '大门上边'
                },
                {
                  id: 4,
                  name: '大门下边'
                },
                {
                  id: 5,
                  name: '大门里边'
                }
              ],
              pointName: '大门左边、大门右边、路灯#12、路灯#16...等12个'
            },
            {
              name: '2',
              point: [
                {
                  id: 1,
                  name: '大门左边'
                },
                {
                  id: 2,
                  name: '大门右边'
                },
                {
                  id: 3,
                  name: '大门上边'
                },
                {
                  id: 4,
                  name: '大门下边'
                },
                {
                  id: 5,
                  name: '大门里边'
                }
              ],
              pointName: '大门左边、大门右边、路灯#12、路灯#16...等12个'
            },
            {
              name: '3',
              point: [
                {
                  id: 1,
                  name: '大门左边'
                },
                {
                  id: 2,
                  name: '大门右边'
                },
                {
                  id: 3,
                  name: '大门上边'
                },
                {
                  id: 4,
                  name: '大门下边'
                },
                {
                  id: 5,
                  name: '大门里边'
                }
              ],
              pointName: '大门左边、大门右边、路灯#12、路灯#16...等12个'
            },
            {
              name: '4',
              point: [
                {
                  id: 1,
                  name: '大门左边'
                },
                {
                  id: 2,
                  name: '大门右边'
                },
                {
                  id: 3,
                  name: '大门上边'
                },
                {
                  id: 4,
                  name: '大门下边'
                },
                {
                  id: 5,
                  name: '大门里边'
                }
              ],
              pointName: '大门左边、大门右边、路灯#12、路灯#16...等12个'
            },
            {
              name: '5',
              point: [
                {
                  id: 1,
                  name: '大门左边'
                },
                {
                  id: 2,
                  name: '大门右边'
                },
                {
                  id: 3,
                  name: '大门上边'
                },
                {
                  id: 4,
                  name: '大门下边'
                },
                {
                  id: 5,
                  name: '大门里边'
                }
              ],
              pointName: '大门左边、大门右边、路灯#12、路灯#16...等12个'
            }
          ],
          header: [
            {
              minWidth: 200,
              align: 'left',
              label: '算法类型',
              prop: 'name',
              type: 'span'
            },
            {
              minWidth: 420,
              align: 'left',
              label: '关联点位',
              prop: 'pointName',
              type: 'span',
              buttonGroup: {
                buttons: [
                  {
                    label: '选择点位',
                    value: 'showTreeList',
                    type: 'text'
                  }
                ]
              }
            },
            {
              width: 160,
              align: 'left',
              label: '算法联动对象',
              type: 'span',
              buttonGroup: {
                buttons: [
                  {
                    label: '点击选中',
                    value: 'choosePoint',
                    type: 'text'
                  },
                  {
                    label: '已选中',
                    value: 'choosed',
                    type: 'text'
                  }
                ]
              }
            }
          ]
        },
        linkageTable: {
          option: {
            height: 160
          },
          tableData: [],
          selectionColumn: {
            fixed: 'right',
            head: '选择联动对象',
            content: '选择',
            width: 200,
            show: true,
            align: 'left'
          },
          header: [
            {
              minWidth: 160,
              align: 'left',
              label: '点位id',
              prop: 'id',
              type: 'span'
            },
            {
              minWidth: 300,
              align: 'left',
              label: '点位名称',
              prop: 'name',
              type: 'span'
            }
          ]
        }
      },
      pictureBottom: {
        type: 'LinkageTable',
        mainTable: {
          option: {
            height: 320
          },
          tableData: [
            {
              name: '安全帽'
            },
            {
              name: '反光衣'
            },
            {
              name: '车辆检查'
            },
            {
              name: '车辆检查'
            }
          ],
          selectionColumn: {
            fixed: 'right',
            head: '选择联动对象',
            content: '选择',
            width: 200,
            show: true,
            align: 'left'
          },
          header: [
            {
              minWidth: 400,
              align: 'left',
              label: '算法类型',
              prop: 'name',
              type: 'span'
            }
          ]
        }
      },

      // linkage task
      linkageTask: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            linkageId: 2
          },
          form: [
            {
              type: 'radioAssembly',
              label: '联动算法',
              prop: 'linkageId',
              radio: [
                {
                  label: '人脸比对',
                  value: 1
                },
                {
                  label: '加油站AI助力',
                  value: 2
                }
              ]
            }
          ],
          labelPosition: 'left',
          labelWidth: '120px'
        }
      },
      faceSetting: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            serviceId: ''
          },
          form: [
            {
              type: 'selectAssembly',
              label: '人脸特征提取',
              prop: 'serviceId',
              size: 'medium',
              placeholder: '请选择算法服务',
              option: [],
              hide: false
            }
            // {
            //   type: 'tagInput',
            //   label: '人脸分组',
            //   prop: 'faceGroup',
            //   suffixIcon: 'el-icon-caret-bottom',
            //   size: 'medium',
            //   placeholder: '请选择用户组'
            // }
          ],
          labelPosition: 'left',
          labelWidth: '120px'
        }
      },
      sceneConfigSetting: {
        name: 'ConditionGroupList',
        option: {
          groupStyle: {
            'margin-bottom': '16px'
          },
          data: []
        }
      },
      filterConditionTemplate: {
        initShowInput: false,
        canChangeName: false,
        head: {
          name: '条件组'
        },
        condition: {
          labelStyle: {
            width: '80px',
            'text-align': 'right',
            'padding-right': '24px'
          },
          algorithm: {
            label: '算法',
            content: {
              prop: 'algorithm',
              algorithmTag: [],
              closable: true,
              tagClass: 'hover-point',
              disableTransitions: true,
              popover: {
                visible: false,
                type: 'select',
                title: '新增算法',
                placeholder: '选择算法',
                content: '',
                option: [],
                visibleArrow: false,
                width: 256
              }
            }
          },
          rule: {
            value: {
              formula: [],
              script: ''
            },
            label: '警告规则',
            buttons: {
              buttons: [
                {
                  label: '配置',
                  value: 'ruleConfig',
                  plain: true
                }
              ]
            },
            tip: ''
          },
          judgment: {
            label: '报警判定',
            input: [
              {
                value: '',
                lastValue: '',
                width: 100,
                type: 'number',
                unit: '秒',
                placeholder: '统计间隔',
                text: '内触发规则',
                select: {
                  value: 3,
                  width: 80,
                  placeholder: '>=',
                  option: [
                    {
                      label: '==',
                      value: 1
                    },
                    {
                      label: '>',
                      value: 2
                    },
                    {
                      label: '>=',
                      value: 3
                    },
                    {
                      label: '<',
                      value: 4
                    },
                    {
                      label: '<=',
                      value: 5
                    }
                  ]
                }
              },
              {
                value: '',
                lastValue: '',
                width: 100,
                type: 'number',
                unit: '次',
                placeholder: '统计次数',
                text: '则认为报警'
              }
            ]
          },
          output: {
            label: '输出次数',
            value: '',
            lastValue: '',
            width: 100,
            type: 'number',
            placeholder: '-1 ~ 99',
            tip: '-1 表示不限制'
          }
        }
      },

      // rule config
      ruleConfigDia: {
        name: 'CustomCombination',
        option: {
          afterRangeChange: this.afterRangeChange,
          eleStyle: {
            height: '240px'
          },
          elementOption: {
            nodeKey: 'value'
          },
          value: {
            formula: [],
            script: ''
          },
          element: [
            {
              head: '参数',
              class: ['is-text', 'is-blue'],
              data: [
                {
                  label: '算法参数',
                  value: 'params',
                  nodeDisabled: false,
                  isEditable: true,
                  removeClass: ['is-error']
                }
              ],
              style: {
                width: '150px'
              }
            },
            {
              head: '条件',
              class: ['is-svg'],
              dataGroup: [
                {
                  head: '逻辑条件',
                  data: [
                    {
                      label: '且',
                      value: '&&',
                      svg: 'union',
                      br: true,
                      nodeDisabled: false
                    },
                    {
                      label: '或',
                      value: '||',
                      svg: 'or',
                      br: true,
                      nodeDisabled: false
                    }
                  ]
                },
                {
                  head: '判断条件',
                  data: [
                    {
                      label: '不等于',
                      value: '!=',
                      svg: 'unequal',
                      nodeDisabled: false
                    },
                    {
                      label: '大于',
                      value: '>',
                      svg: 'more',
                      nodeDisabled: false
                    },
                    {
                      label: '大于等于',
                      value: '>=',
                      svg: 'moreEqual',
                      nodeDisabled: false
                    },
                    {
                      label: '等于',
                      value: '==',
                      svg: 'equal',
                      nodeDisabled: false
                    },
                    {
                      label: '小于等于',
                      value: '<=',
                      svg: 'lessEqual',
                      nodeDisabled: false
                    },
                    {
                      label: '小于',
                      value: '<',
                      svg: 'less',
                      nodeDisabled: false
                    }
                  ]
                }
              ],
              style: {
                width: '200px'
              }
            },
            {
              head: '值',
              class: ['is-text', 'is-orange'],
              data: [
                {
                  label: '参数值',
                  value: 'value',
                  nodeDisabled: false,
                  isEditable: true,
                  removeClass: ['is-error']
                }
              ],
              style: {
                width: '150px'
              }
            }
          ]
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
    'firstLevelDia.option.data.type'(val) {
      this.changeBottom()
      this.setTaskData()
    },
    'firstLevelDia.option.data.linkageObject'(val) {
      this.changeBottom()
    }
  },
  methods: {
    clickButton(value) {
      switch (value) {
        case 'editFirstLevel':
          this.showFirstLevelDia()
          break
        case 'choosePoint':
          this.chooseTableItem()
          break

        case 'editLinkage':
          this.showLinkageTaskDia()
          break
        case 'saveLinkageTask':
          this.saveLinkageTask()
          break

        case 'editFeatureExtract':
          this.editFeatureExtract()
          break
        case 'saveFaceSetting':
          this.saveFaceSetting()
          break

        case 'editSceneConfig':
          this.editSceneConfig()
          break
        case 'addTagAssembly':
          this.addTag()
          break
        case 'closeTag':
          this.closeTag()
          break

        case 'ruleConfig':
          this.openRuleConfig()
          break
        case 'saveSceneConfig':
          this.saveSceneConfig()
          break
        case 'saveWarnRules':
          this.saveWarnRules()
          break

        case 'saveFirstLevel':
          this.saveFirstLevel()
          break
        default:
      }
    },

    // first level
    getVideoStreamData() {
      return new Promise((resolve, reject) => {
        const params = {
          page: 1,
          size: 99999
        }

        task.getTaskList(params)
          .then(res => {
            const { taskList } = res.data

            taskList.forEach(task => {
              task.label = task.id + ': ' + task.name
              task.value = task.id
            })

            resolve(taskList)
          })
          .catch(() => {
            resolve('')
          })
      })
    },
    showFirstLevelDia() {
      // 清空数据
      this.firstLevelDia = deepClone(this.firstLevelDiaTemplate)

      const assignObj = {
        title: '一级任务信息',
        show: true,
        name: 'DialogShell',
        width: '968px',
        tip: {
          label: '选中的算法*点位组合，其报警结果将用于下级算法分析联动',
          style: {
            'font-size': '12px',
            color: 'rgba(14, 27, 46, 0.35)',
            'margin-bottom': '16px'
          }
        },
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '保存',
              value: 'saveFirstLevel',
              type: 'primary'
            }
          ]
        },
        component: this.firstLevelDia
      }

      this.firstLevelDia.option.data = deepClone(this.firstLevel.data)

      this.setTaskData()

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    saveFirstLevel() {
      this.firstLevelDia.option.ref.validate(valid => {
        if (valid) {
          const data = this.firstLevelDia.option.data

          const params = {
            id: this.$route.query.id,
            type: data.type,
            sourceId: data.task,
            object: data.object
          }

          if (!data.linkageObject) {
            params.config = null
          }

          task.editFirstLevel(params)
            .then(res => {
              this.$messageInfo({
                type: 'success',
                message: '保存一级任务成功！'
              })

              this.$store.dispatch('dialog/initDialogData')

              this.$parent.$parent.getLinkageDetail()
            })
        }
      })
    },

    chooseTableItem() {
      const bottom = this.firstLevelDia.option.form[2].bottom

      bottom.mainTable.tableData.forEach(td => {
        if (td.name === this.buttonScope.row.name) {
          this.$set(td, 'hide', ['choosePoint'])
          this.$set(td, 'rowClass', 'is-active')

          bottom.linkageTable.tableData = [...td.point]
        } else {
          this.$set(td, 'hide', ['choosed'])
          this.$set(td, 'rowClass', '')
        }
      })

      this.$set(bottom, 'index', bottom.mainTable.tableData.findIndex(td => td.name === this.buttonScope.row.name))

      bottom.mainTable.tableData = [...bottom.mainTable.tableData]
    },
    changeBottom() {
      const taskType = this.firstLevelDia.option.data.type

      const linkageObject = this.firstLevelDia.option.data.linkageObject

      const form = this.firstLevelDia.option.form[2]

      if (taskType === 1) {
        if (linkageObject) {
          form.bottom = this.videoStreamBottom

          const table = form.bottom.mainTable

          table.tableData.forEach(td => {
            td.hide = ['choosed']
          })
        } else {
          form.bottom = {}
        }
      } else {
        if (linkageObject) {
          form.bottom = this.pictureBottom
        } else {
          form.bottom = {}
        }
      }
    },
    async setTaskData() {
      const taskType = this.firstLevelDia.option.data.type

      let task = []

      if (taskType === 1) {
        task = await this.getVideoStreamData()
      }

      if (task) {
        this.firstLevelDia.option.form[1].option = task
      }
    },

    // linkage task
    getAlgorithmServiceData() {
      return new Promise((resolve, reject) => {
        const params = {
          type: 2,
          algorithm: 24
        }

        device.getServiceList(params)
          .then(res => {
            resolve(res.data)
          })
          .catch(() => {
            resolve('')
          })
      })
    },
    showLinkageTaskDia() {
      // 清空数据
      this.linkageTask.option.data = deepClone(this.linkage.data)

      const assignObj = {
        title: '一级任务信息',
        show: true,
        name: 'DialogShell',
        width: '500px',
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '保存',
              value: 'saveLinkageTask',
              type: 'primary'
            }
          ]
        },
        component: this.linkageTask
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    saveLinkageTask() {
      const params = {
        id: this.$route.query.id,
        scene: this.linkageTask.option.data.linkageId
      }

      task.editLinkageAlgorithm(params)
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: '保存特征提取成功！'
          })

          this.$store.dispatch('dialog/initDialogData')

          this.$parent.$parent.getLinkageDetail()
        })
    },

    async editFeatureExtract() {
      // 清空数据
      this.faceSetting.option.data = deepClone(this.linkage.data)

      const assignObj = {
        title: '一级任务信息',
        show: true,
        name: 'DialogShell',
        width: '500px',
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '保存',
              value: 'saveFaceSetting',
              type: 'primary'
            }
          ]
        },
        component: this.faceSetting
      }

      const button = this.linkage.form[1].buttons.buttons
      button[0].loading = true

      const service = await this.getAlgorithmServiceData()

      if (service) {
        const { serviceList } = service

        serviceList.forEach(item => {
          item.value = item.id

          item.label = item.name + '-' + item.id + ' ( ' + ['离线', '在线', '占用'][item.status] + ' )'

          item.disabled = item.status !== 1
        })

        this.faceSetting.option.form[0].option = serviceList

        const hasServiceId = serviceList.find(item => item.value === this.faceSetting.option.data.serviceId)

        if (!hasServiceId) {
          this.faceSetting.option.data.serviceId = ''
        }
      }

      button[0].loading = false

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    saveFaceSetting() {
      const params = {
        id: this.$route.query.id,
        serviceId: this.faceSetting.option.data.serviceId,
        config: {
          algorithm: this.faceSetting.option.data.algorithm,
          department: this.faceSetting.option.data.department
        }
      }

      task.editSceneAssociate(params)
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: '保存特征提取成功！'
          })

          this.$store.dispatch('dialog/initDialogData')

          this.$parent.$parent.getLinkageDetail()
        })
    },

    editSceneConfig() {
      // 清空数据
      this.sceneConfigSetting.option.data = []

      const assignObj = {
        title: '场景配置',
        show: true,
        name: 'DialogShell',
        width: '784px',
        tip: {
          label: '未选择算法及条件默认不过滤',
          svg: 'warning',
          class: ['dialog-shell-tip', 'is-warning-tip'],
          style: {
            width: '212px'
          }
        },
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '保存',
              value: 'saveSceneConfig',
              type: 'primary'
            }
          ]
        },
        component: this.sceneConfigSetting
      }

      this.dealSceneConfig()

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    dealSceneConfig() {
      this.linkage.data.associate.forEach((item, index) => {
        this.sceneConfigSetting.option.data.push(deepClone(this.filterConditionTemplate))

        const data = this.sceneConfigSetting.option.data[index]
        data.idValue = item.action
        data.head.name = item.name

        const algorithm = data.condition.algorithm
        algorithm.content.popover.option = deepClone(this.subList)

        item.algorithm.forEach(al => {
          const sub = this.subList.find(item => item.value === al)

          if (sub) {
            algorithm.content.algorithmTag.push({
              parentId: item.action,
              id: sub.value,
              label: sub.label,
              value: sub.value + sub.label,
              class: 'tag-grey'
            })
          }
        })

        const rule = data.condition.rule
        rule.value.formula = []
        let conditonNum = 0

        item.conditions.forEach((or, orIndex) => {
          or.forEach((and, andIndex) => {
            conditonNum++
            rule.value.formula.push({
              class: ['is-text', 'is-blue'],
              isEditable: true,
              label: and.parameter,
              removeClass: ['is-error'],
              total: 0,
              value: 'params'
            })
            rule.value.formula.push({
              class: ['is-svg'],
              label: '',
              svg: ['unequal', 'equal', 'more', 'moreEqual', 'less', 'lessEqual'][and.judge],
              total: 0,
              value: ['!=', '==', '>', '>=', '<', '<='][and.judge]
            })
            rule.value.formula.push({
              class: ['is-text', 'is-orange'],
              isEditable: true,
              label: and.reference,
              removeClass: ['is-error'],
              total: 0,
              value: 'value'
            })

            if (andIndex < or.length - 1) {
              rule.value.formula.push({
                class: ['is-svg'],
                label: '',
                svg: 'union',
                total: 0,
                br: true,
                value: '&&'
              })
            }
          })

          if (orIndex < item.conditions.length - 1) {
            rule.value.formula.push({
              class: ['is-svg'],
              label: '',
              svg: 'or',
              total: 0,
              br: true,
              value: '||'
            })
          }
        })

        rule.pushData = item.conditions
        rule.tip = `当前已有${conditonNum}条规则`

        const judgment = data.condition.judgment
        judgment.input[0].value = item.duration
        judgment.input[0].lastValue = item.duration
        judgment.input[0].select.value = item.judge ?? (item.action === 'car_out' ? 5 : 3)
        judgment.input[1].value = item.critical
        judgment.input[1].lastValue = item.critical

        const output = data.condition.output
        output.value = item.output
        output.lastValue = item.output
      })
    },
    addTag() {
      const data = this.sceneConfigSetting.option.data
      const condition = data.find((item) => item.id === this.buttonScope.id)

      const algorithm = this.subList.find(item => item.value === this.buttonScope.label)

      const algorithmContent = condition.condition.algorithm.content

      algorithmContent.algorithmTag.push({
        parentId: this.buttonScope.id,
        id: this.buttonScope.label,
        label: algorithm.label,
        value: this.buttonScope.label + algorithm.label,
        class: 'tag-grey'
      })

      algorithmContent.popover.content = ''
      algorithmContent.popover.visible = false
    },
    closeTag() {
      const condition = this.sceneConfigSetting.option.data.find((item) => item.id === this.buttonScope.parentId)

      const algorithmContent = condition.condition.algorithm.content

      algorithmContent.algorithmTag.splice(algorithmContent.algorithmTag.findIndex(item => item.id === this.buttonScope.id), 1)
    },

    openRuleConfig() {
      const data = this.sceneConfigSetting.option.data
      const condition = data.find((item) => item.id === this.buttonScope.id)
      this.ruleConfigDia.option.value = condition.condition.rule.value

      const assignObj = {
        title: '警告规则',
        show: true,
        name: 'DialogShell',
        modal: true,
        clickClose: false,
        pressClose: false,
        showClose: true,
        level: 2,
        appendToBody: true,
        width: '564px',
        tip: {
          label: '根据以下规则， 过滤为一次警告',
          svg: 'warning',
          class: ['dialog-shell-tip', 'is-warning-tip']
        },
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '确认',
              value: 'saveWarnRules',
              type: 'primary'
            }
          ]
        },
        component: this.ruleConfigDia
      }

      this.$store.dispatch('dialog/setDialogData', { key: 'dialog', value: assignObj })

      this.$nextTick(() => {
        let index = condition.condition.rule.value.formula.length - 1

        index = index === -1 ? null : index

        this.afterRangeChange(index)
      })
    },
    afterRangeChange(index) {
      const formula = this.ruleConfigDia.option.value.formula

      const end = formula[index]

      this.setDisable(false)

      if (end) {
        const endIsParams = end.value === 'params'
        const endIsJudgment = ['!=', '>', '>=', '==', '<=', '<'].includes(end.value)
        const endIsValue = end.value === 'value'
        const endIsLogic = ['&&', '||', '('].includes(end.value)

        if (endIsParams) {
          this.setDisable(true, 0)
          this.setDisable(true, 1, 0)
          this.setDisable(true, 2)
        } else if (endIsJudgment) {
          this.setDisable(true, 0)
          this.setDisable(true, 1, 0)
          this.setDisable(true, 1, 1)
        } else if (endIsValue) {
          this.setDisable(true, 0)
          this.setDisable(true, 1, 1)
          this.setDisable(true, 2)
        } else if (endIsLogic) {
          this.setDisable(true, 1, 0)
          this.setDisable(true, 1, 1)
          this.setDisable(true, 2)
        }
      } else {
        this.setDisable(true, 1, 0)
        this.setDisable(true, 1, 1)
        this.setDisable(true, 2)
      }
    },
    setDisable(disabled, elementIndex, groupIndex) {
      const element = this.ruleConfigDia.option.element

      if (typeof elementIndex !== 'undefined') {
        if (elementIndex === 1) {
          if (typeof groupIndex !== 'undefined') {
            element[elementIndex].dataGroup[groupIndex].data.forEach(item => {
              item.nodeDisabled = disabled
            })
          } else {
            element[elementIndex].dataGroup.forEach(group => {
              group.data.forEach(item => {
                item.nodeDisabled = disabled
              })
            })
          }
        } else {
          element[elementIndex].data.forEach(item => {
            item.nodeDisabled = disabled
          })
        }
      } else {
        element.forEach((ele, eleIndex) => {
          if (eleIndex === 1) {
            ele.dataGroup.forEach(group => {
              group.data.forEach(item => {
                item.nodeDisabled = disabled
              })
            })
          } else {
            ele.data.forEach(item => {
              item.nodeDisabled = disabled
            })
          }
        })
      }
    },
    findLastIndex(arr, params, value) {
      const indexList = []
      const arrList = deepClone(arr)

      arrList.forEach(item => {
        indexList.push(item[params])
      })

      return indexList.lastIndexOf(value)
    },
    saveWarnRules() {
      const verify = this.checkFormula()

      if (!verify) {
        this.$messageInfo({
          type: 'warning',
          message: '公式内存在错误，请检查公式！'
        })
      } else {
        this.transformFormulaToArray()

        this.$store.dispatch('dialog/initDialogData', true)
      }
    },
    checkFormula() {
      let verify = true

      const formula = this.ruleConfigDia.option.value.formula

      const start = formula[0]
      const end = formula[formula.length - 1]

      if (start && ['&&', '||'].includes(start.value)) {
        start.class.push('is-error')
      }

      if (end && ['&&', '||'].includes(end.value)) {
        end.class.push('is-error')
      }

      const ruleList = start ? [''] : []

      formula.forEach(item => {
        if (item.isEditable && item.label === '' && !item.class.includes('is-error')) {
          item.class.push('is-error')
          verify = false
        }

        if (!['&&', '||'].includes(item.value)) {
          if (['!=', '>', '>=', '==', '<=', '<'].includes(item.value)) {
            ruleList[ruleList.length - 1] += 'judge'
          } else {
            ruleList[ruleList.length - 1] += item.value
          }
        } else {
          ruleList[ruleList.length] = ''
        }
      })

      const isEveryRuleIsTrue = ruleList.every(rule => rule === 'paramsjudgevalue')

      if (!isEveryRuleIsTrue) {
        verify = false
      }

      return verify
    },

    transformFormulaToArray() {
      const formula = this.ruleConfigDia.option.value.formula

      const condition = []
      formula.forEach(item => {
        if (item.value !== '||') {
          !condition.length && (condition[0] = [])

          if (item.value !== '&&') {
            !condition[condition.length - 1].length && (condition[condition.length - 1][0] = {})

            const inner = condition[condition.length - 1][condition[condition.length - 1].length - 1]

            if (item.value === 'params') {
              inner.parameter = item.label
            } else if (['!=', '>', '>=', '==', '<=', '<'].includes(item.value)) {
              inner.judge = ['!=', '==', '>', '>=', '<', '<='].indexOf(item.value)
            } else if (item.value === 'value') {
              inner.reference = item.label
            }
          } else {
            condition[length - 1][condition[length - 1].length] = {}
          }
        } else {
          condition[condition.length] = []
        }
      })

      let ruleNum = 0
      condition.forEach(con => {
        con.forEach(item => {
          ruleNum++
        })
      })

      const data = this.sceneConfigSetting.option.data
      const config = data.find(item => item.id === this.buttonScope.id)

      config.condition.rule.pushData = condition
      config.condition.rule.tip = `当前已有${ruleNum}条规则`
    },
    saveSceneConfig() {
      const data = this.sceneConfigSetting.option.data

      const associate = []

      data.forEach(item => {
        const algorithm = []

        item.condition.algorithm.content.algorithmTag.forEach(item => {
          algorithm.push(item.id)
        })

        associate.push({
          action: item.id,
          name: item.head.name,
          algorithm: algorithm,
          conditions: item.condition.rule.pushData,
          duration: item.condition.judgment.input[0].value,
          judge: item.condition.judgment.input[0].select.value,
          critical: item.condition.judgment.input[1].value,
          output: item.condition.output.value
        })
      })

      const params = {
        id: this.$route.query.id,
        config: associate
      }

      task.editSceneAssociate(params)
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: '保存场景配置成功！'
          })

          this.$store.dispatch('dialog/initDialogData')

          this.$parent.$parent.getLinkageDetail()
        })
    }
  }
}
