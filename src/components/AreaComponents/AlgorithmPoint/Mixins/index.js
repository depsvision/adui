import task from '@/api/task'
import device from '@/api/device'

import { mapGetters } from 'vuex'
import { deepClone, jsToWkt } from '@/utils'
import { handleErrorCode } from '@/utils/error'

import Storage from '@/utils/token'

import axios from 'axios'

export default {
  data() {
    return {
      roiCameraId: -1,
      commonRadio: {
        value: true,
        radio: [
          {
            label: '关键帧',
            value: 'onlyIDR'
          },
          {
            label: '全帧',
            value: 'full'
          }
        ]
      },
      cameraRadioList: [],
      filterDialog: {},
      filterDialogTemplate: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {

          },
          form: [
            {
              type: 'switchAssembly',
              label: '预置图过滤',
              prop: 'presetStatus'
            },
            {
              type: 'switchAssembly',
              label: '自动过滤',
              prop: 'autoStatus'
            },
            {
              type: 'inputAssembly',
              label: '过滤阈值',
              style: {
                width: '180px'
              },
              prop: 'filterThresholdName',
              placeholder: '请输入过滤阈值，用逗号隔开'
            }
          ],
          labelPosition: 'left',
          labelWidth: '120px'
        }
      },

      expandDia: {},
      expandDiaTem: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            expand: JSON.stringify({}, null, 2)
          },
          form: [
            {
              type: 'inputAssembly',
              label: '扩展字段',
              inputType: 'textarea',
              autosize: {
                minRows: 8
              },
              prop: 'expand',
              placeholder: ''
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
    'filterDialog.option.data.presetStatus'(val) {
      const imgList = this.filterDialog.option.form[0].imgList
      if (imgList) {
        imgList.disabled = !val
      }

      if (this.filterDialog.option.data.filter) {
        if (val !== !!this.filterDialog.option.data.filter.preset) {
          this.filterDialog.option.data.presetStatusSelected = []
          if (val) {
            this.filterDialog.option.data.presetStatusImgList.forEach(item => {
              this.filterDialog.option.data.presetStatusSelected.push(item.filterId)
            })
          }
        }

        this.filterDialog.option.data.filter.preset = val ? 1 : 0
      }
    }
  },
  methods: {
    setCameraList() {
      if (!this.componentOption.decode) return

      this.cameraList = []
      this.algorithm.formTable.tableData.forEach(task => {
        task.configList.forEach(config => {
          if (!this.cameraList.includes(config.cameraId)) {
            this.cameraList.push(config.cameraId)
          }
        })
      })

      this.cameraRadioList = this.cameraRadioList.filter(radio => this.cameraList.includes(radio.cameraId))

      this.algorithm.formTable.tableData.forEach(task => {
        task.configList.forEach(config => {
          if (!this.cameraRadioList.some(radio => config.cameraId === radio.cameraId)) {
            if (config.tryOnlyDecodeIDR === undefined) {
              this.cameraRadioList.push({
                cameraId: config.cameraId,
                tryOnlyDecodeIDR: this.configData.camera.status === 1 ? (this.configData.camera.mode === 'onlyIDR') : true
              })
            } else {
              this.cameraRadioList.push({
                cameraId: config.cameraId,
                tryOnlyDecodeIDR: config.tryOnlyDecodeIDR
              })
            }
          }
        })
      })
    },
    editFrameConfig() {
      if (!this.cameraRadioList.length) {
        this.$messageInfo({
          type: 'warning',
          message: '暂无点位数据，请选择点位后再操作！'
        })

        return
      }

      const params = {
        taskId: this.$route.query.id,
        cameraList: this.cameraList
      }
      task.getTaskFrameData(params)
        .then(res => {
          this.showFrameConfig(res.data)
        })
    },
    showFrameConfig(data) {
      const frameOption = {
        name: 'CameraFrame',
        option: {
          modeRadio: {
            value: this.configData.camera.status,
            radio: [
              {
                label: '全局',
                value: 1
              },
              {
                label: '自定义',
                value: 2
              }
            ]
          },
          globalRadio: deepClone(this.commonRadio),
          intervalInput: {
            value: '',
            valueType: 'Number'
          },
          treeOption: {
            data: data.cameraTree,
            slotScope: true,
            expandOnClickNode: false,
            highlightCurrent: true,
            filterBlock: 'last',
            currentNode: 0,
            nodeKey: 'groupId',
            expandedKeys: [0],
            tooltip: {
              placement: 'top-start',
              enterable: false
            }
          },
          cameraList: deepClone(data.cameraList)
        }
      }

      frameOption.option.globalRadio.value = this.configData.camera.mode
      frameOption.option.intervalInput.value = this.configData.camera.status === 2 ? 0 : Number(this.configData.camera.extractionIntervalMS ?? 0)

      const assignObj = {
        title: '点位解码设置',
        show: true,
        name: 'DialogShell',
        modal: true,
        level: 2,
        clickClose: false,
        pressClose: false,
        showClose: true,
        appendToBody: true,
        width: '900px',
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '保存',
              value: 'saveFrameConfig',
              type: 'primary'
            }
          ]
        },
        component: frameOption
      }

      this.$store.dispatch('dialog/setDialogData', { key: 'dialog', value: assignObj })
    },
    saveFrameConfig() {
      const component = this.dialog.dialog.self.$refs.component

      if (component.componentOption.modeRadio.value === 1) {
        this.cameraRadioList = component.globalRadioList
      } else {
        this.cameraRadioList = component.componentOption.cameraList
      }

      this.cameraRadioList.forEach(item => {
        item.cameraId = String(item.cameraId)
      })

      const params = {
        taskId: this.$route.query.id,
        decodeMode: this.cameraRadioList
      }

      task.editTaskAlgorithmPointFrame(params)
        .then(res => {
          this.configData.camera.status = component.componentOption.modeRadio.value
          this.configData.camera.mode = component.componentOption.globalRadio.value

          if (this.configData.camera) {
            this.frameConfig.range = ['', '全局：', '自定义'][this.configData.camera.status]
            this.frameConfig.frame = this.configData.camera.status === 1 ? (this.configData.camera.mode === 'onlyIDR' ? '关键帧' : '全帧') : ''
          } else {
            this.frameConfig.range = '全局：'
            this.frameConfig.frame = '关键帧'
          }

          this.$store.dispatch('dialog/initDialogData', true)
        })
    },

    editFilter(type) {
      // 清空数据
      this.filterDialog = deepClone(this.filterDialogTemplate)

      const assignObj = {
        title: '报警过滤' + (type ? ' - 批量操作' : ''),
        show: true,
        name: 'DialogShell',
        modal: true,
        clickClose: false,
        pressClose: false,
        showClose: true,
        appendToBody: true,
        width: '592px',
        tip: {
          label: '开启报警过滤将会消耗较多系统资源，请根据需要酌情使用',
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
              label: '保存',
              value: type ? 'saveFilterAll' : 'saveFilter',
              type: 'primary'
            }
          ]
        },
        component: this.filterDialog
      }

      this.filterDialog.option.data = deepClone(this.buttonScope.row)

      const data = this.filterDialog.option.data

      if (!type) {
        this.filterDialog.option.form[0].imgList = {
          prop: 'filterId',
          fit: 'cover',
          disabled: !data.presetStatus
        }

        this.filterDialog.option.form[0].tip = !data.filterPicture ? '当前无预置图，请在“基础服务 - AI监控点位”中添加预置图' : '如需更换预置图，请在“基础服务 - AI监控点位”中进行更换管理'

        data.presetStatusImgList = data.filterPicture || []
        const selectedPicture = []

        data.presetStatusImgList.forEach(item => {
          selectedPicture.push(item.filterId)
        })
        data.presetStatusSelected = data.filter.picture || selectedPicture
      } else {
        const threshold = this.point.formTable.tableData[0].filter.threshold
        data.presetStatus = false
        data.autoStatus = false
        data.filterThresholdLength = threshold.length
        data.filterThresholdName = ''
        threshold.forEach((item, index) => {
          data.filterThresholdName += (index === 0 ? '' : ', ') + 0.5
        })
      }

      this.$store.dispatch('dialog/setDialogData', { key: 'dialog', value: assignObj })
    },
    saveFilter(type) {
      const data = this.filterDialog.option.data

      const thresholdSplit = data.filterThresholdName.split(',').map(item => Number(item))

      const isNumber = thresholdSplit.some(item => {
        return !(typeof item === 'number' && !isNaN(item))
      })

      if (isNumber) {
        this.$messageInfo({
          type: 'warning',
          message: '过滤阈值请输入数字并以英文逗号隔开'
        })

        return
      }

      if (thresholdSplit.length > data.filterThresholdLength) thresholdSplit.length = data.filterThresholdLength

      for (let i = 1; i < data.filterThresholdLength; i++) {
        if (!thresholdSplit[i]) {
          thresholdSplit[i] = 0
        }
      }

      const params = {
        taskId: this.$route.query.id,
        algorithm: String(this.point.tag.id),
        camera: type ? null : String(this.buttonScope.row.cameraId),
        filter: {
          preset: data.presetStatus ? 1 : 0,
          auto: data.autoStatus ? 1 : 0,
          picture: data.presetStatusSelected,
          threshold: thresholdSplit
        }
      }

      task.editTaskAlgorithmPointFilter(params)
        .then(async res => {
          if (!type) {
            const index = this.point.formTable.tableData.findIndex(item => item.cameraId === this.filterDialog.option.data.cameraId)

            const config = this.point.formTable.tableData[index]

            config.filter = params.filter
            config.presetStatus = !!config.filter.preset
            config.autoStatus = !!config.filter.auto
            config.filterThresholdName = config.filter.threshold.join(', ')
            config.filterThresholdLength = config.filter.threshold.length
            config.filterString = '预置图' + ['关闭', '开启'][config.filter.preset] + ', ' + '自动过滤' + ['关闭', '开启'][config.filter.auto]

            const task = this.algorithm.formTable.tableData.find(item => item.taskId === this.point.tag.id)
            const taskCache = this.taskListCache.find(item => item.taskId === this.point.tag.id)

            this.$set(task, 'configList', this.point.formTable.tableData)
            this.$set(taskCache, 'configList', this.point.formTable.tableData)
          } else {
            this.getTaskConfig(true)
          }

          this.$store.dispatch('dialog/initDialogData', true)
        })
    },

    showRoi(type) {
      const that = this
      this.roiCameraId = this.buttonScope.row.cameraId

      const roiOption = {
        name: 'Roi',
        option: {
          img: type ? '' : this.buttonScope.row.initPicture,
          initData: this.buttonScope.row.roiListArr || [],
          initShape: '',
          tools: [
            { type: 'drag', name: '平移', text: '平移', last: true },
            { type: 'repeal', name: '撤销', text: '撤销' },
            { type: 'clean', name: '清空', text: '清空' }
          ],
          drawTools: [
            // { type: 'rect', name: '矩形', text: '矩形' },
            { type: 'polygon', name: '多边形', text: '多边形' }
          ],
          isLock: false,
          isLoading: false,
          roiStyle: {
            height: '496px'
          },
          isMouseWheel: true,
          upload: function(file) {
            const accessToken = Storage.getLocal('accessToken') || ''

            const config = {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${accessToken}`
              }
            }

            const formData = new FormData()
            formData.append('type', 'cameraPicture')
            formData.append('file', file, file.name)

            return new Promise(resolve => {
              axios.post('api/file/', formData, config)
                .then(res => {
                  const { data, requestInfo } = res.data

                  if (requestInfo.flag) {
                    that.saveCameraPicture(data, type)

                    resolve(data.url)
                  } else {
                    handleErrorCode(data.errorCode)

                    resolve(null)
                  }
                })
                .catch(() => {
                  resolve(null)
                })
            })
          },
          dragImg: function() {
            return new Promise(resolve => {
              device.getCameraPicture({ cameraId: that.buttonScope.row.id, streamUrl: that.buttonScope.row.streamUrl })
                .then(res => {
                  const { data } = res

                  that.saveCameraPicture(data)

                  resolve(data.url)
                })
                .catch(() => {
                  resolve(null)
                })
            })
          }
        }
      }

      if (type) {
        roiOption.option.tools.push(
          { type: 'upload', name: '上传图片', text: '上传图片', right: true }
        )
      } else {
        roiOption.option.tools.push(
          { type: 'dragImg', name: '获取抓图', text: '获取抓图', svg: 'camera-fill', right: true },
          { type: 'upload', name: '上传图片', text: '上传图片' }
        )
      }

      const assignObj = {
        title: '绘制ROI' + (type ? ' - 批量操作' : ''),
        show: true,
        name: 'DialogShell',
        modal: true,
        level: 2,
        clickClose: false,
        pressClose: false,
        showClose: true,
        appendToBody: true,
        customClass: 'dialog--large',
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '保存',
              value: type ? 'saveRoiAll' : 'saveRoi',
              type: 'primary'
            }
          ]
        },
        component: roiOption
      }

      if (type) {
        assignObj.tip = {
          label: '批量操作将覆盖所有阈值设置, 如有个性化需要,请在批量操作后针对性修改',
          svg: 'warning',
          class: ['dialog-shell-tip', 'is-warning-tip']
        }
      }

      this.$store.dispatch('dialog/setDialogData', { key: 'dialog', value: assignObj })
    },
    saveRoi(type) {
      const config = this.point.formTable.tableData.find(item => item.cameraId === this.roiCameraId) || {}

      const refs = this.dialog.dialog.self.$refs

      this.$set(config, 'roiListArr', refs.component.getData())

      const roiList = []
      config.roiListArr.forEach((roi, index) => {
        roiList.push(jsToWkt(roi))
      })

      const apiConfig = this.componentOption.saveRoi

      const params = {
        algorithm: String(this.point.tag.id),
        camera: type ? null : String(this.buttonScope.row.cameraId),
        roiList: roiList
      }

      params[apiConfig.params.idKey] = String(this.$route.query.id)

      task[apiConfig.api](params)
        .then(res => {
          if (type) {
            this.getTaskConfig(true)
          } else {
            const task = this.algorithm.formTable.tableData.find(item => item.taskId === this.point.tag.id)
            const taskCache = this.taskListCache.find(item => item.taskId === this.point.tag.id)

            const roiListName = !roiList.length ? '默认' : '自定义'

            this.$set(config, 'roiList', roiList)

            this.$set(config, 'roiListName', roiListName)
            this.point.formTable.tableData = [...this.point.formTable.tableData]

            this.$set(task, 'configList', this.point.formTable.tableData)
            this.$set(taskCache, 'configList', this.point.formTable.tableData)
          }

          this.$store.dispatch('dialog/initDialogData', true)
        })
    },

    editExpand(type) {
      // 清空数据
      this.expandDia = deepClone(this.expandDiaTem)

      const assignObj = {
        title: '设置扩展字段' + (type ? ' - 批量操作' : ''),
        show: true,
        name: 'DialogShell',
        modal: true,
        level: 2,
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
              value: type ? 'saveExpandAll' : 'saveExpand',
              type: 'primary'
            }
          ]
        },
        component: this.expandDia
      }

      this.expandDia.option.data.cameraId = this.buttonScope.row.cameraId
      this.expandDia.option.data.expand = JSON.stringify(deepClone(this.buttonScope.row.option || {}), null, 2)

      if (type) {
        assignObj.tip = {
          label: '批量操作将覆盖所有阈值设置, 如有个性化需要,请在批量操作后针对性修改',
          svg: 'warning',
          class: ['dialog-shell-tip', 'is-warning-tip']
        }
      }

      this.$store.dispatch('dialog/setDialogData', { key: 'dialog', value: assignObj })
    },
    saveExpand(type) {
      const data = this.expandDia.option.data

      let expand = {}
      try {
        expand = JSON.parse(data.expand)
      } catch {
        this.$messageInfo({
          type: 'warning',
          message: '请按照正确的JSON格式填写，包括但不限于键值对双引号、英文标点符号等'
        })

        return
      }

      const apiConfig = this.componentOption.saveExpand

      const params = {
        algorithm: String(this.point.tag.id),
        cameraList: [],
        option: expand
      }

      params[apiConfig.params.idKey] = String(this.$route.query.id)

      if (type) {
        const cameraList = []

        this.point.formTable.tableData.forEach(camera => {
          cameraList.push(String(camera.cameraId))
        })

        params.cameraList = cameraList
      } else {
        params.cameraList = [String(this.buttonScope.row.cameraId)]
      }

      task[apiConfig.api](params)
        .then(res => {
          if (type) {
            this.getTaskConfig(true)
          } else {
            const config = this.point.formTable.tableData.find(item => item.cameraId === data.cameraId)

            this.$set(config, 'option', expand)
            this.$set(config, 'expandSetting', Object.keys(expand).length ? '自定义' : '默认')
          }

          this.$store.dispatch('dialog/initDialogData', true)
        })
    },

    saveCameraPicture(data, type) {
      let idList = []

      if (type) {
        this.point.formTable.tableData.forEach(camera => {
          idList.push(String(camera.cameraId))

          camera.initPicture = data.url
        })
      } else {
        idList = [this.roiCameraId]

        const config = this.point.formTable.tableData.find(item => item.cameraId === this.roiCameraId)
        this.$set(config, 'initPicture', data.url)
      }

      const task = this.algorithm.formTable.tableData.find(item => item.taskId === this.point.tag.id)
      const taskCache = this.taskListCache.find(item => item.taskId === this.point.tag.id)

      this.$set(task, 'configList', this.point.formTable.tableData)
      this.$set(taskCache, 'configList', this.point.formTable.tableData)

      device.saveDragPicture({ idList: idList, initPicture: data.path })
        .then(res => {})
    }
  }
}
