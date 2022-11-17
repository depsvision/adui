import task from '@/api/task'
import configuration from '@/setting'
import { handleAlarmData } from '@/utils/algorithm'

import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
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
            runningDead: '',
            whetherRunningDead: '',
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
                  type: 'spanAssembly',
                  label: '假死判断',
                  prop: 'runningDead',
                  info: {
                    label: '信息均是基于本次进入推理分析工作状态以来的统计信息'
                  },
                  itemClass: 'is-weight',
                  labelWidth: '200px'
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
                  label: '推理状态',
                  itemClass: 'is-weight'
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

      // testInput
      testInputDialog: {},
      testInputDialogTemplate: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            url: null,
            result: '无',
            pictureInput: 1,
            testGroup: [],
            algorithm: []
          },
          form: [
            {
              type: 'ImageBlock',
              label: null,
              prop: 'url',
              data: [],
              fit: 'contain',
              loading: false,
              class: 'no-label form-label--top',
              style: {
                height: '225px'
              }
            },
            {
              type: 'spanAssembly',
              label: '图片',
              prop: 'upload',
              labelSvg: 'required-fill',
              isInlineError: true,
              buttons: {
                buttons: [
                  {
                    label: '上传图片',
                    value: 'uploadTestImg',
                    type: 'text',
                    class: 'is-black',
                    svgIconLeft: 'image-line',
                    disabled: false
                  }
                ]
              }
            },
            {
              type: 'radioAssembly',
              label: '输入方式',
              prop: 'pictureInput',
              radio: [
                {
                  label: 'base64',
                  value: 1
                }
                // {
                //   label: '图片文件',
                //   value: 2
                // },
                // {
                //   label: '图片链接',
                //   value: 3
                // }
              ]
            },
            {
              type: 'tagInput',
              label: '测试算法',
              prop: 'testGroup',
              disabled: true,
              suffixIcon: 'el-icon-caret-bottom',
              size: 'medium',
              placeholder: '请选择算法',
              labelSvg: 'required-fill',
              isInlineError: true
            },
            {
              type: 'spanAssembly',
              label: '测试结果',
              prop: 'result',
              class: 'status-mark is-grey'
            },
            {
              type: 'ButtonGroup',
              label: '显示分析结果绘图',
              prop: 'algorithm',
              openDelay: 200,
              style: {
                'flex-wrap': 'wrap'
              }
            }
          ],
          labelPosition: 'left',
          labelWidth: '120px'
        }
      },
      uploadOption: {
        limit: 1,
        autoUpload: false,
        slot: 'trigger',
        action: 'file/',
        data: {
          type: ''
        },
        accept: '.png,.jpg,.jpeg'
      },
      tagInputKeys: ['', '']
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
      this.clickImageButton(val)
    },
    'testInputDialog.option.data.url'(val) {
      const form = this.testInputDialog.option.form

      form[3].disabled = !val
    },
    'analysisServiceAlgorithmType.option.data.algorithmGroup': {
      handler(val) {
        if (val) {
          const data = this.analysisServiceAlgorithmType.option.data
          const cache = deepClone(data.algorithmThreshold)

          data.algorithmThreshold = []
          val.forEach(item => {
            const hasThreshold = cache.find(key => key.id === item.id)
            const threshold = item.threshold || item.threshold_list

            data.algorithmThreshold.push(hasThreshold || {
              id: item.id,
              label: item.label,
              value: threshold.join(', '),
              length: threshold.length
            })
          })
        }
      },
      deep: true
    },
    'dialog.listenerClick.time': {
      handler(val) {
        if (!this.dialog.listenerClick) return

        switch (this.dialog.listenerClick.refs.componentOption.type) {
          case 'test':
            this.getAlgorithm()
            break
          default:
        }
      },
      deep: true
    }
  },
  methods: {
    clickImageButton(value) {
      const result = value.split('--')

      switch (result[result.length - 1]) {
        // test input
        case 'openTestInput':
          this.openTestInput()
          break
        case 'uploadTestImg':
          this.importImg()
          break
        case 'buttonActive':
          this.changeActiveButton(Number(result[0]))
          break
        case 'tagInput-testGroup':
          this.tagInputKeys = ['testInputDialog', 'test']
          this.openTestTagInput()
          break
        case 'chooseAlgorithm':
          this.chooseAlgorithm()
          break
        case 'testImageInterface':
          this.testImageInterface()
          break
        default:
      }
    },

    // test input
    openTestInput() {
      // 清空数据
      this.testInputDialog = deepClone(this.testInputDialogTemplate)

      const assignObj = {
        title: '接口测试',
        show: true,
        name: 'DialogShell',
        width: '520px',
        buttons: {
          buttons: [
            {
              label: '测试',
              value: 'testImageInterface',
              plain: true
            },
            {
              label: '关闭',
              value: 'cancel',
              type: 'primary',
              buttonSpanClass: 'flex-separate'
            }
          ]
        },
        component: this.testInputDialog
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    importImg() {
      this.$refs.upload.$el.click()
    },
    handleUploadStatus(info) {
      if (info.value === 'ready') {
        const blob = info.arg[0].raw

        const data = this.testInputDialog.option.data

        const reader = new FileReader()
        reader.readAsDataURL(blob)

        reader.onload = () => {
          data.url = reader.result

          const form = this.testInputDialog.option.form
          this.$set(form[1], 'errorMessage', '')

          this.clearTestData(true)
        }

        this.$refs.commonUpload.clearFiles()
      } else if (info.value === 'error') {
        this.$messageInfo({
          type: 'error',
          message: '上传失败！'
        })
      }
    },
    openTestTagInput() {
      if (!this[this.tagInputKeys[0]]) return
      const data = this[this.tagInputKeys[0]].option.data

      const treeListDia = {
        name: 'TreeList',
        option: {
          type: 'test',
          bottomHead: '选择算法',
          placeholder: '搜索算法',
          tagClosable: true,
          resultLoding: false,
          tagData: data[this.tagInputKeys[1] + 'Group'] || [],
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
              resultData: []
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
    getAlgorithm() {
      const option = this.dialog.dialog.component.option
      option.resultLoding = true

      task.taskSub()
        .then(res => {
          const { taskList } = res.data

          taskList.forEach(item => {
            item.label = item.name
            item.id = item.task_key
            item.tagSvg = configuration.algorithmSvg[item.id] || 'normal'
          })

          option.tabData[0].resultData = taskList
          option.resultOption.data = taskList

          option.resultLoding = false

          this.$nextTick(() => {
            this.dialog.listenerClick.refs.setTreeChecked()
          })
        })
        .catch(() => {
          this.dialog.dialog && (option.resultLoding = false)
        })
    },
    chooseAlgorithm() {
      if (!this[this.tagInputKeys[0]]) return

      const data = this[this.tagInputKeys[0]].option.data

      data[this.tagInputKeys[1] + 'Group'] = deepClone(this.dialog.listenerClick.refs.tagData)

      if (this.tagInputKeys[1] === 'test') {
        const form = this.testInputDialog.option.form
        this.$set(form[3], 'errorMessage', '')

        this.clearTestData()
      }

      this.$store.dispatch('dialog/initDialogData', true)
    },
    testImageInterface() {
      const result = this.verifyTestData()

      if (!result) return

      this.loadingOperation(true)

      const data = this.testInputDialog.option.data

      const params = {
        id: Number(this.$route.query.id || this.buttonScope.row.id),
        image: data.url
      }

      params.taskList = []
      data.testGroup.forEach(item => {
        params.taskList.push({
          algorithmId: item.id
        })
      })

      task.testImageAnalysis(params)
        .then(res => {
          this.loadingOperation(false)

          const { rlt } = res.data

          data.algorithm = deepClone(rlt.algorithmList)

          data.algorithm.forEach(item => {
            item.class = 'is-svg'
            item.type = 'text'
            item.tooltip = item.name
            item.svgIconLeft = configuration.algorithmSvg[item.id] || 'normal'
            item.value = item.id + '--buttonActive'
          })

          this.dealGutter()

          data.algorithm.length && this.changeActiveButton(data.algorithm[0].id)
        })
        .catch(() => {
          this.loadingOperation(false)
        })
    },
    dealGutter() {
      const algorithm = this.testInputDialog.option.data.algorithm

      algorithm.forEach((item, index) => {
        item.left = 0

        const integerNum = Math.ceil((index + 1) / 9)
        const remainderNum = (index + 1) % 9

        if (remainderNum !== 0) {
          item.right = 8
        }

        if (integerNum !== Math.ceil(algorithm.length / 9)) {
          item.bottom = 8
        }
      })
    },
    changeActiveButton(taskId) {
      const option = this.testInputDialog.option
      const data = option.data.algorithm.find(item => item.id === taskId)

      option.form[4].class = 'status-mark ' + (data.errCode ? 'is-red' : 'is-green')
      option.data.result = data.errMsg

      option.form[0].data = handleAlarmData(data, data.name, 'rgb(255, 58, 51)', '#fff')

      option.data.algorithm.forEach(item => {
        this.$set(item, 'active', item.id === data.id)
      })
    },
    verifyTestData() {
      let result = true
      const data = this.testInputDialog.option.data
      const form = this.testInputDialog.option.form

      if (!data.url) {
        this.$set(form[1], 'errorMessage', '请上传图片')
        result = false
      } else {
        this.$set(form[1], 'errorMessage', '')

        if (!data.testGroup.length) {
          this.$set(form[3], 'errorMessage', '请选择测试算法')
          result = false
        } else {
          this.$set(form[3], 'errorMessage', '')
        }
      }

      return result
    },
    loadingOperation(type) {
      const form = this.testInputDialog.option.form
      const data = this.testInputDialog.option.data

      form[0].loading = type
      form[1].buttons.buttons[0].disabled = type
      form[3].disabled = type
      form[4].class = 'status-mark is-grey'

      data.result = '无'
      data.algorithm = []

      this.dialog.buttons.buttons[0].disabled = type
      this.dialog.self.$refs.buttonGroup.$forceUpdate()
    },
    clearTestData(type) {
      const form = this.testInputDialog.option.form
      const data = this.testInputDialog.option.data

      if (type) {
        data.testGroup = []
      }

      form[0].data = []
      form[4].class = 'status-mark is-grey'

      data.result = '无'
      data.algorithm = []
    }
  }
}
