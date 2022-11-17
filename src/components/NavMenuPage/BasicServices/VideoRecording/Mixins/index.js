import device from '@/api/device'

import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'

import { cleanRequestList } from '@/utils/interceptors'

import TimeLine from '@/components/TimeLine/index'

export default {
  data() {
    return {
      recordSettingConfig: {
        auto: {
          autoClean: false,
          delRatio: 20,
          threshold: 80
        },
        recordingNodes: []
      },
      recordSettingDia: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          loading: false,
          data: {
            openRecordNumber: '',
            autoClean: '未开启'
          },
          form: [
            {
              type: 'spanAssembly',
              label: '开启录像',
              prop: 'openRecordNumber',
              spanStyle: {
                'margin-right': '24px'
              },
              buttons: {
                buttons: [
                  {
                    label: '修改',
                    value: 'editRecordCamera',
                    type: 'text',
                    class: 'is-black',
                    svgIconLeft: 'regulator-line'
                  }
                ]
              }
            },
            {
              type: 'spanAssembly',
              label: '自动缓存清理',
              prop: 'autoClean',
              spanStyle: {
                'margin-right': '24px'
              },
              buttons: {
                buttons: [
                  {
                    label: '修改',
                    value: 'editAutoClean',
                    type: 'text',
                    class: 'is-black',
                    svgIconLeft: 'regulator-line'
                  }
                ]
              }
            },
            {
              type: 'spanAssembly',
              label: '手动缓存清理',
              prop: 'handleClean',
              buttons: {
                buttons: [
                  {
                    label: '执行',
                    value: 'editHandleClean',
                    type: 'text',
                    class: 'is-black',
                    svgIconLeft: 'clearing-up-line'
                  }
                ]
              }
            }
          ],
          labelPosition: 'left',
          labelWidth: '120px'
        }
      },

      autoClearCache: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            autoClean: false,
            delRatio: 20,
            threshold: 80
          },
          form: [
            {
              type: 'switchAssembly',
              label: '自动清理',
              prop: 'autoClean'
            },
            {
              type: 'sliderAssembly',
              label: '当存储空间用量达到',
              prop: 'threshold',
              labelWidth: '150px',
              min: 50,
              max: 90,
              unit: '%'
            },
            {
              type: 'sliderAssembly',
              label: '自动清理缓存比例',
              prop: 'delRatio',
              labelWidth: '150px',
              min: 20,
              max: 50,
              unit: '%'
            }
          ],
          labelPosition: 'left',
          labelWidth: '150px'
        }
      },

      clearCache: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            date: ''
          },
          rule: {
            date: [
              { required: true, message: '请选择日期', trigger: 'blur' }
            ]
          },
          form: [
            {
              type: 'datePicker',
              label: '选择日期',
              prop: 'date',
              data: 'daterange',
              width: '100%',
              startPlaceholder: '开始时间',
              endPlaceholder: '结束时间',
              valueFormat: 'yyyy-MM-dd',
              pickerOptions: {
                disabledDate(time) {
                  return time.getTime() > Date.now()
                },
                shortcuts: [{
                  text: '最近一周',
                  onClick(picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                    picker.$emit('pick', [start, end])
                  }
                }, {
                  text: '最近一个月',
                  onClick(picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                    picker.$emit('pick', [start, end])
                  }
                }, {
                  text: '最近三个月',
                  onClick(picker) {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                    picker.$emit('pick', [start, end])
                  }
                }]
              }
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
    }
  },
  methods: {
    clickButton(value) {
      switch (value) {
        case 'recordSetting':
          this.recordSetting()
          break
        case 'downloadVideo':
          this.downloadVideo()
          break

        case 'editRecordCamera':
          this.showRecordCamera()
          break
        case 'savePointGroup':
          this.savePointData()
          break

        case 'editAutoClean':
          this.showAutoClean()
          break
        case 'saveAutoClean':
          this.saveAutoClean()
          break

        case 'editHandleClean':
          this.showClearCache()
          break
        case 'clearCache':
          this.clearCacheDate()
          break
        default:
      }
    },

    recordSetting() {
      const assignObj = {
        title: '录像设置',
        show: true,
        name: 'DialogShell',
        width: '568px',
        buttons: {
          buttons: [
            {
              label: '关闭',
              value: 'cancel',
              type: 'primary'
            }
          ]
        },
        component: this.recordSettingDia
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)

      this.getRecordSettingData()
    },
    getRecordSettingData() {
      const option = this.recordSettingDia.option

      option.loading = true

      device.getVideoRecordSetting()
        .then(res => {
          option.loading = false

          this.recordSettingConfig = res.data

          this.recordSettingDia.option.data.autoClean = ['未开启', '已开启'][this.recordSettingConfig.auto.autoClean]

          this.recordSettingConfig.recordingNodes.forEach(item => {
            item.tagType = 'node'
            item.tagSvg = 'webcam-line'
            item.tagColor = 'blue'
            item.nodeKey = 'id'
            item.label = item.name
          })
          this.recordSettingDia.option.data.openRecordNumber = `${this.recordSettingConfig.recordingNodes.length}个点位`
        })
        .catch(() => {
          option.loading = false
        })
    },

    showRecordCamera() {
      const treeListDia = {
        name: 'TreeList',
        option: {
          bottomHead: '选择点位',
          placeholder: '搜索点位',
          tagClosable: true,
          treeLoding: false,
          tagData: this.recordSettingConfig.recordingNodes,
          tabData: [
            {
              id: 'tree',
              label: '组织架构',
              filterBlock: 'rightTree',
              treeData: this.treeOption.data
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
        title: '选择监控设备',
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
              value: 'savePointGroup',
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

      if (!this.dialog.listenerClick) return

      const that = this
      const tree = this.dialog.listenerClick.refs.currentNode

      const defaultParams = {
        parentId: tree.groupId,
        type: 1,
        page: 1,
        size: 99999
      }

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
      const cameraIds = []
      this.dialog.listenerClick.refs.tagData.forEach(item => {
        cameraIds.push(item.id)
      })

      const stopCameraIds = this.recordSettingConfig.recordingNodes.filter(camera => !cameraIds.includes(camera.id)).map(item => item.id)

      const params = {
        cameraIds: cameraIds,
        stopCameraIds: stopCameraIds
      }

      device.editVideoRecordCamera(params)
        .then(res => {
          this.$store.dispatch('dialog/initDialogData', true)

          this.recordSettingConfig.recordingNodes = this.dialog.listenerClick.refs.tagData
          this.recordSettingDia.option.data.openRecordNumber = `${this.recordSettingConfig.recordingNodes.length}个点位`

          this.init()
        })
    },

    showAutoClean() {
      // 清空数据
      this.autoClearCache.option.data = deepClone(this.recordSettingConfig.auto)
      this.autoClearCache.option.data.autoClean = !!this.autoClearCache.option.data.autoClean

      const assignObj = {
        title: '自动清理',
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
              value: 'saveAutoClean',
              type: 'primary'
            }
          ]
        },
        component: this.autoClearCache
      }

      this.$store.dispatch('dialog/setDialogData', { key: 'dialog', value: assignObj })
    },
    saveAutoClean() {
      this.autoClearCache.option.data.autoClean = this.autoClearCache.option.data.autoClean ? 1 : 0

      device.editVideoRecordAutoClean(this.autoClearCache.option.data)
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: '设置自动清理成功!'
          })

          this.$store.dispatch('dialog/initDialogData', true)

          this.recordSettingConfig.auto = this.autoClearCache.option.data
          this.recordSettingDia.option.data.autoClean = ['未开启', '已开启'][this.recordSettingConfig.auto.autoClean]
        })
    },

    showClearCache() {
      this.clearCache.option.data.date = ''

      const assignObj = {
        title: '清理缓存',
        show: true,
        name: 'DialogShell',
        modal: true,
        clickClose: false,
        pressClose: false,
        showClose: true,
        appendToBody: true,
        level: 2,
        customClass: 'dialog--mini',
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '清理',
              value: 'clearCache',
              type: 'primary'
            }
          ]
        },
        component: this.clearCache
      }

      this.$store.dispatch('dialog/setDialogData', { key: 'dialog', value: assignObj })
    },
    clearCacheDate() {
      this.clearCache.option.ref.validate(valid => {
        if (valid) {
          const params = {
            startDate: this.clearCache.option.data.date[0],
            endDate: this.clearCache.option.data.date[1]
          }

          this.dialog.dialog.buttons.buttons[1].loading = true
          this.dialog.dialog.self.$refs.buttonGroup.$forceUpdate()
          device.deleteVideoRecord(params)
            .then(res => {
              let freeUp = Math.abs(res.data.freeUp)

              if (freeUp <= 1024) {
                freeUp = freeUp.toFixed(2) + ' KB'
              } else if (freeUp / 1024 <= 1024) {
                freeUp = (freeUp / 1024).toFixed(2) + ' MB'
              } else {
                freeUp = (freeUp / (1024 * 1024)).toFixed(2) + ' GB'
              }

              this.$messageInfo({
                type: 'success',
                message: '操作成功,共释放了 ' + freeUp + ' 空间'
              })

              this.dialog.dialog.buttons.buttons[1].loading = false
              this.dialog.dialog.self.$refs.buttonGroup.$forceUpdate()
              this.$store.dispatch('dialog/initDialogData', true)

              this.init()
            })
        }
      })
    },

    async setCameraRecordDetail() {
      this.tableLoading = true

      await this.getCameraRecordData()

      this.tableLoading = false

      this.setVideo()
    },
    getCameraRecordData() {
      const params = {
        cameraId: this.currentNode.id
      }

      return new Promise(resolve => {
        device.getCameraRecordDetail(params)
          .then(res => {
            const { data } = res.data

            this.currentNode = Object.assign(this.currentNode, data)

            this.dealCameraRecordData(this.currentNode)

            this.resetTreeNode()

            resolve(true)
          })
          .catch(() => {
            resolve(false)
          })
      })
    },
    resetTreeNode() {
      const node = this.tree.getNode(this.currentNode.groupId)

      node.setData(this.currentNode)
    },

    setVideo() {
      cleanRequestList(['device/camera/stream'])

      this.dispose()

      switch (this.activeTab) {
        case 'mpegts':
          this.mpegtsOption = {
            code: '',
            url: '',
            isInnerScreen: true
          }

          this.setMpegts()
          break
        case 'recording':
          this.mpegtsOption = {
            code: '',
            url: '',
            type: 'mp4',
            isLive: false,
            autoplay: false,
            hasProgress: true,
            createOption: {
              enableWorker: true,
              lazyLoad: false
            },
            isInnerScreen: true,
            videoCanPlay: this.videoCanPlay
          }

          this.recordListOption.play.label = ''
          this.recordListOption.play.url = ''
          this.recordListOption.play.id = null

          this.setRecordElement()
          break
        default:
          break
      }
    },
    async setMpegts(result) {
      const mpegtsPlayer = this.$refs.mpegtsPlayer

      mpegtsPlayer.setCondition('loading')
      mpegtsPlayer.dealWebbcamParams(true)

      const videoCache = await this.$store.dispatch('video/getStreamUrl', {
        id: this.currentNode.id,
        name: this.currentNode.name
      })

      if (videoCache) {
        this.mpegtsOption.code = videoCache.code
        this.mpegtsOption.url = videoCache.url
      } else {
        device.getDeviceCameraStream({ cameraId: this.currentNode.id })
          .then(res => {
            const { data } = res

            this.mpegtsOption.code = data.code_type
            this.mpegtsOption.url = data.url

            this.$store.dispatch('video/storeStreamUrl', {
              id: this.currentNode.id,
              name: this.currentNode.name,
              code: data.code_type,
              url: data.url
            })
          })
          .catch(err => {
            if (err !== 'cancel') this.dispose()
          })
      }
    },

    setRecordElement() {
      this.setTimeLine()
    },

    jumpDay(button) {
      if (button.disabled) return
      button.target && this.axis.jumpTime(button.target)
    },
    backToNow() {
      const endTime = this.$dayjs()

      this.axis.jumpTime(endTime)
    },

    setTimeLine() {
      const option = {
        container: this.$refs.timeLine,
        dayContainer: this.$refs.dayDistribute,
        pointerColor: 'rgba(255, 58, 51, 1)',
        fontFamily: 'siyuanblack',
        record: this.currentNode.record,
        pointerTimeCallback: this.setPointerTime,
        pointerBlockDataCallback: this.setPointerVideoList
      }

      this.axis = new TimeLine(option)
    },

    setPointerTime(time) {
      this.timeLineOption.button.middle.date = time.format('YYYY/MM/DD')
      this.timeLineOption.button.middle.time = time.format('HH:mm:ss')

      const button = this.timeLineOption.button
      button.left.target = time.subtract(24, 'h').startOf('day')
      button.right.target = time.add(24, 'h').startOf('day').add(1, 's')

      const nowZero = this.$dayjs().startOf('day')
      button.right.disabled = nowZero.isSame(time) || nowZero.isBefore(time)
    },
    setPointerVideoList(list) {
      list.forEach(item => {
        item.value = item.snapUrl || ''
        item.emptySvg = 'part-video-line'
        item.startTime = this.$dayjs.unix(item.start)
        item.endTime = item.startTime.add(item.duration, 's')
        item.label = `${item.startTime.format('HH:mm:ss')}-${item.endTime.format('HH:mm:ss')}`
      })

      this.recordListOption.list = list
    },

    playVideo(video) {
      this.recordListOption.play.id = video.id
      this.recordListOption.play.label = `${video.startTime.format('YYYY/MM/DD HH:mm:ss')}-${video.endTime.format('YYYY/MM/DD HH:mm:ss')}`
      this.recordListOption.play.url = video.url

      if (!video.isH265) {
        this.mpegtsOption.url = video.url
      } else {
        const mpegtsPlayer = this.$refs.mpegtsPlayer

        mpegtsPlayer && mpegtsPlayer.setCondition('error')
      }

      this.$set(this.mpegtsOption, 'error', {
        label: '当前播放器不支持该视频流的编码格式, 可下载到本地查看',
        component: {
          is: 'ButtonGroup',
          buttons: [
            {
              label: '下载视频',
              value: 'downloadVideo',
              plain: true,
              class: 'is-light'
            }
          ]
        }
      })
    },
    videoCanPlay() {
      this.$nextTick(() => {
        const mpegtsPlayer = this.$refs.mpegtsPlayer

        mpegtsPlayer.dealWebbcamParams(true)
        mpegtsPlayer.playVideo()
      })
    },
    downloadVideo() {
      const a = document.createElement('a')
      a.href = this.recordListOption.play.url
      a.click()
    },

    dispose() {
      const mpegtsPlayer = this.$refs.mpegtsPlayer

      if (mpegtsPlayer) {
        mpegtsPlayer.dealWebbcamParams(false)

        mpegtsPlayer.setCondition('error')

        mpegtsPlayer.dispose()
      }

      this.mpegtsOption.code = ''
      this.mpegtsOption.url = ''

      if (this.axis) {
        this.axis.dispose()
        this.axis = null
      }
    }
  }
}
