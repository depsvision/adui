<template>
  <div class="algorithm-point-container inner-form-table">
    <div class="algorithm-point--algorithm">
      <div class="algorithm-point--algorithm-select">
        <span>算法及点位选择</span>
        <select-assembly
          :component-option="algorithm.select"
          @visibleChange="changeSelect"
          @removeTag="oldValue=>{changeSelect(false,oldValue)}"
        />
      </div>
      <form-table
        ref="algorithm"
        :component-option="algorithm.formTable"
        @handleCheckboxChange="handleCheckboxChange"
      />
    </div>
    <div class="algorithm-point--point">
      <div class="algorithm-point--point-top">
        <div class="algorithm-point--point-tag">
          <span>点位个性化配置</span>
          <el-tag v-show="point.tag.id !== -1">{{ point.tag.label }}</el-tag>
        </div>
        <el-input
          v-model.trim="point.search"
          size="default"
          placeholder="点位ID / 点位名称"
          clearable
          @input="searchPoint"
        >
          <i slot="suffix" class="el-input__icon el-icon-search" />
        </el-input>
      </div>
      <form-table
        ref="point"
        :component-option="point.formTable"
        @handleSwitchChange="handleSwitchChange"
      >
        <template v-slot:thresholdListName>
          <button-group
            ref="buttonGroup"
            class="algorithm-point-filter"
            :component-option="{
              buttons: [
                {
                  label: '',
                  svgIconLeft:'bingo-batch',
                  value: 'editthresholdAll',
                  type:'primary',
                  disabled:filterAllDisabled
                }
              ]
            }"
          />
        </template>
        <template v-slot:filterString>
          <button-group
            ref="buttonGroup"
            class="algorithm-point-filter"
            :component-option="{
              buttons: [
                {
                  label: '',
                  svgIconLeft:'bingo-batch',
                  value: 'editFilterAll',
                  type:'primary',
                  disabled:filterAllDisabled
                }
              ]
            }"
          />
        </template>
        <template v-slot:roiListName>
          <el-tooltip content="ROI默认为全屏分析" placement="top">
            <svg-icon icon-class="info-fill" class="algorithm-point-roi-info" />
          </el-tooltip>
          <button-group
            ref="buttonGroup"
            class="algorithm-point-filter"
            :component-option="{
              buttons: [
                {
                  label: '',
                  svgIconLeft:'bingo-batch',
                  value: 'showRoiAll',
                  type:'primary',
                  disabled:filterAllDisabled
                }
              ]
            }"
          />
        </template>
        <template v-slot:expandSetting>
          <button-group
            ref="buttonGroup"
            class="algorithm-point-filter"
            :component-option="{
              buttons: [
                {
                  label: '',
                  svgIconLeft:'bingo-batch',
                  value: 'editExpandAll',
                  type:'primary',
                  disabled:filterAllDisabled
                }
              ]
            }"
          />
        </template>
      </form-table>
    </div>
    <div v-if="componentOption.decode" class="algorithm-point--frame">
      <div>点位解码设置</div>
      <div class="algorithm-point--frame_content">
        <span>{{ frameConfig.range }}</span>
        <span>{{ frameConfig.frame }}</span>
        <button-group
          ref="buttonGroup"
          :component-option="frameConfig"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { deepClone, wktToJs } from '@/utils'
import { cleanRequestList } from '@/utils/interceptors'
import mixins from './Mixins'

import SelectAssembly from '@/components/InnerComponents/SelectAssembly'
import ButtonGroup from '@/components/Button/ButtonGroup'
import FormTable from '@/components/FormTable'

import task from '@/api/task'
import device from '@/api/device'

export default {
  name: 'AlgorithmPoint',
  components: { ButtonGroup, SelectAssembly, FormTable },
  mixins: [mixins],
  props: {
    componentOption: {
      type: Object,
      default: function() {
        return {

        }
      }
    }
  },
  data() {
    return {
      filterAllDisabled: false,
      configData: null,
      taskListCache: [],
      cameraList: [],
      algorithm: {
        select: {
          value: [],
          size: 'default',
          placeholder: '请选择算法',
          multiple: true,
          selectStyle: {
            width: '300px'
          },
          collapseTags: true,
          option: []
        },
        formTable: {
          option: {
            height: 192
          },
          tableData: [],
          header: [
            {
              minWidth: 240,
              align: 'left',
              label: '算法类型',
              prop: 'name',
              type: 'span'
            },
            {
              minWidth: 360,
              align: 'left',
              label: '已选分析点位',
              prop: 'pointList',
              type: 'span',
              buttonGroup: {
                buttons: [
                  {
                    label: '选择点位',
                    value: 'showTreeList',
                    link: true,
                    type: 'primary'
                  }
                ]
              }
            },
            {
              width: 160,
              align: 'left',
              label: '点位个性化设置',
              type: 'span',
              buttonGroup: {
                buttons: [
                  {
                    label: '点击选中',
                    value: 'choosePoint',
                    type: 'primary',
                    link: true
                  },
                  {
                    label: '已选中',
                    value: 'choosed',
                    type: 'primary',
                    link: true
                  }
                ]
              }
            },
            {
              width: 160,
              align: 'left',
              prop: 'enableStatus',
              label: '精细化开关',
              type: 'checkbox'
            }
          ]
        }
      },
      point: {
        search: '',
        tag: {
          id: -1,
          label: '默认'
        },
        formTable: {
          option: {
            height: 192
          },
          tableData: [],
          header: [
            {
              fixed: 'left',
              width: 60,
              align: 'left',
              label: 'ID',
              prop: 'cameraId',
              type: 'span',
              hide: false
            },
            {
              minWidth: 110,
              fixed: 'left',
              align: 'left',
              label: '点位名称',
              prop: 'name',
              type: 'span',
              showOverflowTooltip: true,
              hide: false
            },
            {
              minWidth: 180,
              align: 'left',
              label: '流媒体',
              prop: 'streamUrl',
              type: 'span',
              showOverflowTooltip: true,
              hide: false
            },
            {
              width: 70,
              align: 'left',
              label: '状态',
              prop: 'statusName',
              type: 'span',
              class: 'status-mark',
              hide: false
            },
            {
              minWidth: 140,
              align: 'left',
              label: '算法阈值',
              edit: true,
              prop: 'thresholdListName',
              type: 'span',
              hide: false,
              tooltip: {
                placement: 'top-start'
              },
              buttonGroup: {
                buttons: [
                  {
                    label: '修改',
                    value: 'editThreshold',
                    type: 'text'
                  }
                ]
              }
            },
            {
              width: 240,
              align: 'left',
              label: '报警过滤',
              edit: true,
              prop: 'filterString',
              type: 'span',
              hide: false,
              buttonGroup: {
                buttons: [
                  {
                    label: '修改',
                    value: 'editFilter',
                    type: 'primary'
                  }
                ]
              }
            },
            {
              width: 120,
              align: 'left',
              label: 'ROI',
              prop: 'roiListName',
              type: 'span',
              hide: false,
              spanStyle: {
                width: '42px'
              },
              buttonGroup: {
                buttons: [
                  {
                    label: '设置',
                    value: 'showRoi',
                    type: 'text'
                  }
                ]
              }
            },
            {
              width: 120,
              align: 'left',
              label: '扩展设置',
              prop: 'expandSetting',
              type: 'span',
              hide: false,
              spanStyle: {
                width: '42px'
              },
              buttonGroup: {
                buttons: [
                  {
                    label: '设置',
                    value: 'editExpand',
                    type: 'text'
                  }
                ]
              }
            },
            {
              width: 160,
              fixed: 'right',
              align: 'left',
              prop: 'enableStatus',
              label: '精细化开关',
              type: 'switch',
              hide: false
            }
          ]
        }
      },
      frameConfig: {
        range: '全局: ',
        frame: '关键帧',
        buttons: [
          {
            label: '修改',
            value: 'editFrameConfig',
            plain: true
          }
        ]
      },
      thresholdDialog: {},
      thresholdDialogTemplate: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            thresholdListName: ''
          },
          form: [
            {
              type: 'inputAssembly',
              label: '算法阈值',
              prop: 'thresholdListName',
              placeholder: '请输入算法阈值，用逗号隔开'
            }
          ],
          labelPosition: 'left',
          labelWidth: '120px'
        }
      },
      monitorTreeData: null
    }
  },
  computed: {
    ...mapGetters([
      'button',
      'dialog',
      'buttonScope'
    ])
  },
  watch: {
    'button.value'(val) {
      this.clickButton(val)
    },
    'dialog.listenerClick.time': {
      handler(val) {
        this.getPointData(val)
      },
      deep: true
    },
    'point.formTable.tableData': {
      handler(val) {
        if (val) {
          this.filterAllDisabled = !val.length
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.setPointHead()

      this.getAlgorithm()
      this.getMonitorPointTree()

      this.getTaskConfig()

      this.$nextTick(() => {
        this.dialog.refs = this
      })
    },
    clickButton(value) {
      switch (value) {
        case 'showTreeList':
          this.showTreeList()
          break
        case 'choosePoint':
          this.choosePoint()
          break

        case 'editThreshold':
          this.editThresholdDia()
          break
        case 'editthresholdAll':
          this.editThresholdDia('all')
          break
        case 'saveThreshold':
          this.saveThreshold()
          break
        case 'saveThresholdAll':
          this.saveThreshold('all')
          break
        case 'savePointData':
          this.savePointData()
          break

        case 'showRoi':
          this.showRoi()
          break
        case 'showRoiAll':
          this.showRoi('all')
          break
        case 'saveRoi':
          this.saveRoi()
          break
        case 'saveRoiAll':
          this.saveRoi('all')
          break

        case 'editExpand':
          this.editExpand()
          break
        case 'editExpandAll':
          this.editExpand('all')
          break
        case 'saveExpand':
          this.saveExpand()
          break
        case 'saveExpandAll':
          this.saveExpand('all')
          break

        case 'editFrameConfig':
          this.editFrameConfig()
          break
        case 'saveFrameConfig':
          this.saveFrameConfig()
          break

        case 'editFilter':
          this.editFilter()
          break
        case 'editFilterAll':
          this.editFilter('all')
          break
        case 'saveFilter':
          this.saveFilter()
          break
        case 'saveFilterAll':
          this.saveFilter('all')
          break
        default:
      }
    },

    setPointHead() {
      this.componentOption.pointHideHead && this.componentOption.pointHideHead.forEach(head => {
        const hideHead = this.point.formTable.header.find(item => item.prop === head)

        hideHead.hide = true
      })
    },

    getAlgorithm() {
      task.taskSub()
        .then(res => {
          const { taskList } = res.data

          taskList.forEach(item => {
            item.label = item.name
            item.value = item.task_key
          })

          this.algorithm.select.option = taskList
        })
    },
    getMonitorPointTree() {
      device.getCameraTree()
        .then(res => {
          const { treeData } = res.data
          this.monitorTreeData = treeData
        })
    },
    getTaskConfig(type) {
      const apiConfig = this.componentOption.getConfig
      const params = {}
      params[apiConfig.params.idKey] = this.$route.query.id

      task[apiConfig.api](params)
        .then(res => {
          const { data } = res

          this.configData = deepClone(data.config)

          if (type) {
            const task = this.configData.taskList.find(item => item.taskId === this.point.tag.id)

            this.point.formTable.tableData = this.setNeedData(task.configList)
          } else {
            this.dealAlgorithmData()
          }
        })
    },
    setNeedData(list) {
      list.forEach(item => {
        item.streamUrl = item.streamUrl || '--'

        const statusHeader = this.point.formTable.header.find(item => item.prop === 'statusName')
        statusHeader.class = item.status === null ? '' : 'status-mark'
        item.statusName = ['离线', '在线'][item.status] || '--'
        item.statusNameClass = ['is-grey', 'is-green'][item.status] || ''

        item.thresholdListName = (item.thresholdList && item.thresholdList.join(', ')) || ''
        item.thresholdListNameContent = (item.thresholdList && item.thresholdList.join(', ')) || ''
        item.roiListName = (item.roiList && item.roiList.length === 0) || !item.roiList ? '默认' : '自定义'
        item.roiListArr = item.roiListArr || []
        item.thresholdLength = (item.thresholdList && item.thresholdList.length) || 0

        if (item.filter) {
          item.filterString = '预置图' + ['关闭', '开启'][item.filter.preset] + ', ' + '自动过滤' + ['关闭', '开启'][item.filter.auto]
          item.presetStatus = !!item.filter.preset
          item.autoStatus = !!item.filter.auto
          item.filterThresholdName = item.filter.threshold.join(', ')
          item.filterThresholdLength = item.filter.threshold.length
        } else {
          item.filterString = ''
        }

        item.roiList && item.roiList.forEach((roi, index) => {
          item.roiListArr.push({ shape: 'polygon', points: wktToJs(roi) })
        })

        item.enableStatus = !!item.enable

        item.expandSetting = Object.keys(item.option || {}).length ? '自定义' : '默认'
      })

      return list
    },
    changeSelect(type, oldValue) {
      if (!type) {
        const removeAlgorithm = oldValue.filter(value => !this.algorithm.select.value.includes(value))

        if (removeAlgorithm.length > 0) {
          const removeAlgorithmName = []
          this.algorithm.select.option.forEach(task => {
            if (removeAlgorithm.includes(task.task_key)) {
              removeAlgorithmName.push(task.name)
            }
          })

          this.$confirm('取消勾选 <span class="is-red--text">' + removeAlgorithmName.join(', ') + '</span> 将失去配置内容，请确认是否取消', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            type: 'warning',
            customClass: 'dialog--mini'
          })
            .then(() => {
              this.saveAlgorithm()
            })
            .catch(() => {
              this.algorithm.select.value = oldValue
            })
        } else {
          this.saveAlgorithm()
        }
      }
    },

    saveAlgorithm() {
      const apiConfig = this.componentOption.saveAlgorithm

      const params = {
        algorithmList: this.algorithm.select.value.map(item => String(item))
      }

      params[apiConfig.params.idKey] = this.$route.query.id

      task[apiConfig.api](params)
        .then(res => {
          this.point.tag.id = -1

          this.point.search = ''

          this.point.formTable.tableData = []

          this.getTaskConfig()
        })
    },
    dealAlgorithmData() {
      if (this.configData.camera) {
        this.frameConfig.range = ['', '全局: ', '自定义'][this.configData.camera.status]
        this.frameConfig.frame = this.configData.camera.status === 1 ? (this.configData.camera.mode === 'onlyIDR' ? '关键帧' : '全帧') : ''
      } else {
        this.frameConfig.range = '全局: '
        this.frameConfig.frame = '关键帧'
      }

      this.algorithm.select.value = []

      this.taskListCache = deepClone(this.configData.taskList || [])

      this.taskListCache.forEach(item => {
        const checkBoxStatus = this.checkBoxStatus(item.configList)

        item.enableStatus = {
          value: [false, true, false][checkBoxStatus],
          indeterminate: [false, false, true][checkBoxStatus],
          label: ['未启用', '全部启用', '部分启用'][checkBoxStatus]
        }

        item.pointList = ''
        item.hide = ['choosed']
        this.algorithm.select.value.push(item.taskId)

        if (item.configList.length === 0) {
          item.pointList += '一'
        } else if (item.configList.length < 3) {
          item.configList.forEach((config, index) => {
            item.pointList += (index > 0 ? ', ' : '') + config.name
          })
        } else {
          item.pointList += item.configList[0].name + ', ' + item.configList[1].name + '...等' + item.configList.length + '个'
        }
      })

      this.algorithm.formTable.tableData = deepClone(this.taskListCache)

      this.setCameraList()
    },
    checkBoxStatus(data = []) {
      const isEveryTrue = data.every(item => !!item.enable)
      const isEveryFalse = data.every(item => !item.enable)

      return isEveryTrue ? 1 : (isEveryFalse ? 0 : 2)
    },
    choosePoint() {
      this.point.tag.id = this.buttonScope.row.taskId
      this.point.tag.label = this.buttonScope.row.name

      this.point.search = ''

      this.algorithm.formTable.tableData.forEach(item => {
        if (item.taskId === this.buttonScope.row.taskId) {
          this.$set(item, 'hide', ['choosePoint'])
          this.$set(item, 'rowClass', 'is-active')
        } else {
          this.$set(item, 'hide', ['choosed'])
          this.$set(item, 'rowClass', '')
        }
      })

      this.algorithm.formTable.tableData = [...this.algorithm.formTable.tableData]

      const configList = deepClone(this.buttonScope.row.configList)

      this.point.formTable.tableData = this.setNeedData(configList)
    },
    showTreeList() {
      this.buttonScope.row.configList.forEach(item => {
        item.tagType = 'node'
        item.tagSvg = 'webcam-line'
        item.tagColor = 'blue'
        item.nodeKey = 'id'
        item.label = item.name
        item.id = item.cameraId
      })

      const treeListDia = {
        name: 'TreeList',
        option: {
          bottomHead: '选择点位',
          placeholder: '搜索点位',
          tagClosable: true,
          resultLoding: false,
          tagData: this.buttonScope.row.configList,
          tabData: [
            {
              id: 'tree',
              label: '点位',
              filterBlock: 'rightTree',
              treeData: this.monitorTreeData,
              resultData: []
            }
          ],
          treeOption: {
            data: [],
            slotScope: true,
            expandOnClickNode: false,
            highlightCurrent: true,
            currentNode: 0,
            nodeKey: 'groupId',
            expandedKeys: [0],
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
            tagSvg: 'webcam-line',
            tagColor: 'blue'
          }
        }
      }

      const assignObj = {
        title: '选择分析点位',
        show: true,
        name: 'DialogShell',
        modal: true,
        clickClose: false,
        pressClose: false,
        showClose: true,
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
              value: 'savePointData',
              type: 'primary'
            }
          ]
        },
        component: treeListDia
      }

      this.$store.dispatch('dialog/setDialogData', { key: 'dialog', value: assignObj })
    },
    getPointData() {
      cleanRequestList(['device/camera/group/sub'])

      const that = this
      const tree = this.dialog.listenerClick.refs.currentNode

      const defaultParams = {
        parentId: tree.groupId,
        page: 1,
        size: 99999
      }

      const apiConfig = this.componentOption.getPointData

      defaultParams.type = apiConfig.params.typeValue

      that.dialog.dialog.component.option.resultLoding = true
      device.searchTreeNodeCamera(defaultParams)
        .then(res => {
          const { cameraList } = res.data

          cameraList.forEach(item => {
            item.label = item.name
            item.pointType = item.type
            item.type = null
          })

          that.dialog.dialog.component.option.tabData[0].resultData = cameraList
          that.dialog.dialog.component.option.resultOption.data = cameraList
          that.dialog.dialog.component.option.resultLoding = false

          this.$nextTick(() => {
            this.dialog.listenerClick.refs.setTreeChecked()
          })
        })
        .catch(() => {
          that.dialog.dialog.component && (that.dialog.dialog.component.option.resultLoding = false)
        })
    },
    savePointData() {
      const pointIdList = []
      this.dialog.listenerClick.refs.tagData.forEach(item => {
        pointIdList.push(String(item.id))
      })

      const apiConfig = this.componentOption.savePointData

      const params = {
        algorithm: String(this.buttonScope.row.taskId),
        cameraList: pointIdList
      }

      params[apiConfig.params.idKey] = this.$route.query.id

      task[apiConfig.api](params)
        .then(res => {
          this.$store.dispatch('dialog/initDialogData', true)

          this.point.tag.id = -1

          this.point.search = ''

          this.point.formTable.tableData = []

          this.getTaskConfig()
        })
    },
    editThresholdDia(type) {
      // 清空数据
      this.thresholdDialog = deepClone(this.thresholdDialogTemplate)

      const assignObj = {
        title: '修改算法阈值' + (type ? ' - 批量操作' : ''),
        show: true,
        name: 'DialogShell',
        modal: true,
        clickClose: false,
        pressClose: false,
        showClose: true,
        appendToBody: true,
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
              value: type ? 'saveThresholdAll' : 'saveThreshold',
              type: 'primary'
            }
          ]
        },
        component: this.thresholdDialog
      }

      if (type) {
        assignObj.tip = {
          label: '批量操作将覆盖所有阈值设置, 如有个性化需要,请在批量操作后针对性修改',
          svg: 'warning',
          class: ['dialog-shell-tip', 'is-warning-tip']
        }
      }

      let thresholdData = deepClone(this.buttonScope.row)

      if (type) {
        const algorithm = this.algorithm.select.option.find(item => item.task_key === this.point.tag.id) ?? this.point.formTable.tableData[0]
        const thresholdList = algorithm ? algorithm.threshold_list : this.point.formTable.tableData[0].thresholdList

        thresholdData = {
          thresholdListName: thresholdList.join(', ') || ''
        }
      }

      this.thresholdDialog.option.data = thresholdData

      this.$store.dispatch('dialog/setDialogData', { key: 'dialog', value: assignObj })
    },
    saveThreshold(type) {
      const data = this.thresholdDialog.option.data

      const thresholdSplit = data.thresholdListName.split(',').map(item => Number(item))

      const isNumber = thresholdSplit.some(item => {
        return !(typeof item === 'number' && !isNaN(item))
      })

      if (isNumber) {
        this.$messageInfo({
          type: 'warning',
          message: '请输入数字并以英文逗号隔开'
        })

        return
      }

      if (thresholdSplit.length > data.thresholdLength) thresholdSplit.length = data.thresholdLength

      for (let i = 1; i < data.thresholdLength; i++) {
        if (!thresholdSplit[i]) {
          thresholdSplit[i] = 0
        }
      }

      const apiConfig = this.componentOption.saveThreshold

      const params = {
        algorithm: String(this.point.tag.id),
        camera: type ? null : String(this.buttonScope.row.cameraId),
        threshold: thresholdSplit
      }

      params[apiConfig.params.idKey] = String(this.$route.query.id)

      task[apiConfig.api](params)
        .then(res => {
          if (type) {
            this.getTaskConfig(true)
          } else {
            const config = this.point.formTable.tableData.find(item => item.cameraId === this.thresholdDialog.option.data.cameraId)

            this.$set(config, 'thresholdList', thresholdSplit)
            this.$set(config, 'thresholdListName', thresholdSplit.join(', '))
            this.$set(config, 'thresholdListNameContent', thresholdSplit.join(', '))

            const task = this.algorithm.formTable.tableData.find(item => item.taskId === this.point.tag.id)
            const taskCache = this.taskListCache.find(item => item.taskId === this.point.tag.id)

            this.$set(task, 'configList', this.point.formTable.tableData)
            this.$set(taskCache, 'configList', this.point.formTable.tableData)
          }

          this.$store.dispatch('dialog/initDialogData', true)
        })
    },
    searchPoint() {
      const task = this.algorithm.formTable.tableData.find(item => item.taskId === this.point.tag.id)
      const filterData = deepClone(task.configList)

      this.point.formTable.tableData = this.setNeedData(filterData)

      this.point.formTable.tableData = filterData.filter(item => {
        return item.id.toString().includes(this.point.search) || item.name.toString().includes(this.point.search)
      })
    },

    handleSwitchChange(value, scope) {
      const apiConfig = this.componentOption.editStreamline

      const params = {
        algorithm: String(this.point.tag.id),
        enable: value ? 1 : 0,
        cameraList: [String(scope.row.cameraId)]
      }

      params[apiConfig.params.idKey] = String(this.$route.query.id)

      task[apiConfig.api](params)
        .then(res => {
          const camera = this.point.formTable.tableData.find(item => item.cameraId === scope.row.cameraId)
          camera.enable = params.enable

          const task = this.algorithm.formTable.tableData.find(item => item.taskId === this.point.tag.id)
          const config = task.configList.find(item => item.cameraId === scope.row.cameraId)
          config.enable = params.enable

          this.setEnableCheckBox()
        })
        .catch(() => {
          const camera = this.point.formTable.tableData.find(item => item.cameraId === scope.row.cameraId)

          camera.enableStatus = !value
        })
    },
    setEnableCheckBox(scope) {
      let taskId = this.point.tag.id

      if (scope) {
        taskId = scope.row.taskId
      }
      const task = this.algorithm.formTable.tableData.find(item => item.taskId === taskId)

      const checkBoxStatus = this.checkBoxStatus(task.configList)

      task.enableStatus = {
        value: [false, true, false][checkBoxStatus],
        indeterminate: [false, false, true][checkBoxStatus],
        label: ['未启用', '全部启用', '部分启用'][checkBoxStatus]
      }
    },
    handleCheckboxChange(value, scope) {
      const taskTd = this.algorithm.formTable.tableData.find(item => item.taskId === scope.row.taskId)

      const cameraList = []

      scope.row.configList.forEach(item => {
        cameraList.push(String(item.cameraId))
      })

      const apiConfig = this.componentOption.editStreamline

      const params = {
        algorithm: String(scope.row.taskId),
        enable: value ? 1 : 0,
        cameraList: cameraList
      }

      params[apiConfig.params.idKey] = String(this.$route.query.id)

      task[apiConfig.api](params)
        .then(res => {
          taskTd.configList.forEach(item => {
            item.enable = params.enable
          })

          if (this.point.tag.id === taskTd.taskId) {
            this.point.formTable.tableData.forEach(item => {
              item.enable = params.enable
              item.enableStatus = value
            })
          }

          this.setEnableCheckBox(scope)
        })
        .catch(() => {
          const checkBoxStatus = this.checkBoxStatus(taskTd.configList)

          taskTd.enableStatus = {
            value: [false, true, false][checkBoxStatus],
            indeterminate: [false, false, true][checkBoxStatus],
            label: ['未启用', '全部启用', '部分启用'][checkBoxStatus]
          }
        })
    }
  }
}
</script>

<style scoped lang="scss">
.algorithm-point-container {

  .algorithm-point--algorithm {
    display: flex;
    flex-flow: column;
    margin-bottom: 16px;
    overflow: hidden;

    .algorithm-point--algorithm-select {
      display: flex;
      align-items: center;
      line-height: 36px;
      margin-bottom: 8px;

      &>span {
        font-size: 14px;
        color: rgba(14, 27, 46, .85);
        width: 120px;
        box-sizing: border-box;
      }

      :deep(.select-assembly-container) {

        .el-tag {
          color: rgba(24, 114, 240, 1);
          background-color: rgba(24, 114, 240, .05);
          border-color: rgba(24, 114, 240, .2);

          .el-tag__close {

            &::before {
              color: rgba(24, 114, 240, 1);
            }

            &:hover {
              background-color: rgba(24, 114, 240, .8);

              &::before {
                color: #fff;
              }
            }
          }
        }
      }
    }

    .form-table-container {
      flex: 1;
      width: auto;
      margin-left: 120px;
    }
  }

  .algorithm-point--point {
    margin-bottom: 24px;

    .algorithm-point--point-top {
      display: flex;
      justify-content: space-between;
      line-height: 36px;
      margin-bottom: 8px;

      .algorithm-point--point-tag {
        display: flex;
        align-items: center;

        &>span {
          color: rgba(14, 27, 46, .85);

          &:first-child {
            width: 120px;
          }
        }

        .el-tag {
          color: rgba(24, 114, 240, 1);
          background-color: rgba(24, 114, 240, .05);
          border-color: rgba(24, 114, 240, .2);
        }
      }

      .el-input {
        width: 300px;
      }
    }

    .algorithm-point-filter {
      margin-left: 12px;

      ::deep(.el-button) {
        font-size: 14px;
        padding: 4px;
      }
    }

    .algorithm-point-roi-info {
      color: rgba(218, 227, 240, 1);
      margin-left: 12px;

      &:hover {
        cursor: pointer;
      }
    }

    .form-table-container {
      flex: 1;
      width: auto;
      margin-left: 120px;
    }
  }
  .algorithm-point--frame {
    display: flex;

    &>div:first-child {
      font-size: 14px;
      color: rgba(14, 27, 46, .85);
      width: 120px;
      line-height: 36px;
    }

    .algorithm-point--frame_content {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #0E1B2E;

      span {

        &:last-of-type {
          margin-right: 24px;
        }
      }

      :deep(.el-button) {

        padding: 7px 12px;
      }
    }
  }
}
</style>
