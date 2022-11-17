import task from '@/api/task'

import configuration from '@/setting'

import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      algorithmPointDialog: {},
      algorithmPointDialogTemplate: {
        name: 'AlgorithmPoint',
        option: {
          decode: true,
          getPointData: {
            params: {
              typeValue: 1
            }
          },
          getConfig: {
            api: 'getTaskConfig',
            params: {
              idKey: 'taskId'
            }
          },
          saveAlgorithm: {
            api: 'editTaskAlgorithm',
            params: {
              idKey: 'taskId'
            }
          },
          savePointData: {
            api: 'editTaskAlgorithmPoint',
            params: {
              idKey: 'taskId'
            }
          },
          editStreamline: {
            api: 'editTaskAlgorithmPointEnable',
            params: {
              idKey: 'taskId'
            }
          },
          saveThreshold: {
            api: 'editTaskAlgorithmPointThreshold',
            params: {
              idKey: 'taskId'
            }
          },
          saveExpand: {
            api: 'editTaskAlgorithmPointOption',
            params: {
              idKey: 'taskId'
            }
          },
          saveRoi: {
            api: 'editTaskAlgorithmPointRoi',
            params: {
              idKey: 'taskId'
            }
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'dialog',
      'button',
      'closeDialogName'
    ])
  },
  watch: {
    'button.value'(val) {
      this.clickButton(val)
    },
    closeDialogName(val) {
      if (val.split('-')[0] === 'AlgorithmPoint') {
        this.refreshDetail()
      }
    }
  },
  methods: {
    refreshDetail() {
      this.$parent.$parent.getTaskDetail()
    },
    clickButton(value) {
      switch (value) {
        case 'editAlgorithmPoint':
          this.showAlgorithmPointDialog()
          break
        case 'tagInput-enhancementAlgorithmGroup':
          this.openAlgorithmTagInput()
          break
        case 'chooseEnhancementAlgorithm':
          this.chooseEnhancementAlgorithm()
          break
        default:
      }
    },
    showAlgorithmPointDialog() {
      // 清空数据
      this.algorithmPointDialog = deepClone(this.algorithmPointDialogTemplate)

      const assignObj = {
        title: '算法及点位配置',
        show: true,
        name: 'DialogShell',
        width: '1200px',
        buttons: {
          buttons: [
            {
              label: '关闭',
              value: 'cancel',
              type: 'primary'
            }
          ]
        },
        component: this.algorithmPointDialog
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },

    chooseMaterial(tag) {
      const data = this.formListOption.data
      const tagData = tag ? [] : this.dialog.listenerClick.refs.tagData

      const materialList = []

      tagData.forEach(item => {
        materialList.push(item.id)
      })

      const params = {
        taskId: Number(this.$route.query.id),
        materialList: materialList
      }

      task.setTaskConfigMaterial(params)
        .then(res => {
          data.materialGroup = tagData

          this.$store.dispatch('dialog/initDialogData')
        })
    },

    openAlgorithmTagInput() {
      const resultData = deepClone(this.formListOption.data.algorithmGroup)

      resultData.forEach(result => {
        result.label = result.name
        result.id = result.taskId
        result.tagSvg = configuration.algorithmSvg[result.id] || 'normal'
      })

      const treeListDia = {
        name: 'TreeList',
        option: {
          type: '',
          bottomHead: '选择算法',
          placeholder: '搜索算法',
          resultNum: 1,
          tagClosable: true,
          resultLoding: false,
          tagData: this.formListOption.data.enhancementAlgorithmGroup,
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
              resultData: resultData
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
              value: 'chooseEnhancementAlgorithm',
              type: 'primary'
            }
          ]
        },
        component: treeListDia
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    chooseEnhancementAlgorithm(tag) {
      const data = this.formListOption.data
      const tagData = tag ? [] : this.dialog.listenerClick.refs.tagData

      const algorithmList = []

      tagData.forEach(item => {
        algorithmList.push(item.id)
      })

      const params = {
        taskId: Number(this.$route.query.id),
        algorithmList: algorithmList
      }

      task.setMaterialAlgorithm(params)
        .then(res => {
          data.enhancementAlgorithmGroup = tagData

          this.$store.dispatch('dialog/initDialogData')
        })
    }
  }
}
