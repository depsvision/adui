import log from '@/api/log'
import task from '@/api/task'

import configuration from '@/setting'

import { deepClone } from '@/utils'
import { handleAlarmData } from '@/utils/algorithm'
import { mapGetters } from 'vuex'
import { cleanRequestList } from '@/utils/interceptors'

export default {
  data() {
    return {
      exportDialog: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            exportLog: 0
          },
          form: [
            {
              type: 'radioAssembly',
              label: '导出数据条数',
              prop: 'exportLog',
              radio: []
            }
          ],
          labelPosition: 'left',
          labelWidth: '120px'
        }
      },
      radioTemplate: [
        {
          label: '全部',
          value: 0,
          disabled: false
        },
        {
          label: '已筛选',
          value: 1,
          disabled: false
        },
        {
          label: '已选中',
          value: 2,
          disabled: false
        }
      ],
      hasSerachedOption: {},
      totalAll: 0,
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
      },
      cleanData: null,
      autoClearCache: {},
      autoClearCacheTemplate: {
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
      MpegtsMonitor: {
        name: 'MpegtsMonitor',
        option: {
          url: '',
          tipList: [],
          type: 'mp4',
          isLive: false,
          autoplay: false,
          hasProgress: true,
          createOption: {
            enableWorker: true,
            lazyLoad: false
          },
          isInnerScreen: true
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'dialog',
      'button',
      'buttonScope',
      'imageViewer',
      'streamSaver',
      'imageViewerRef'
    ])
  },
  watch: {
    'button.value'(val) {
      this.clickButton(val)
    },
    totalAll: {
      handler(val) {
        this.$set(this.buttonGroupOption.buttons[0], 'disabled', !val)
      },
      immediate: true
    },
    cleanData(val) {
      if (val && val.autoClean) {
        this.$set(this.cacheClearOption.buttons.buttons[0], 'label', '自动清理已启用')
        this.$set(this.cacheClearOption.buttons.buttons[0], 'class', 'is-black is-activated')
      } else {
        this.$set(this.cacheClearOption.buttons.buttons[0], 'label', '自动清理未启用')
        this.$set(this.cacheClearOption.buttons.buttons[0], 'class', 'is-black')
      }
    },
    'imageViewer.clipImage': {
      handler(val) {
        if (!this.imageViewer.activeImg || !this.imageViewer.activeImg.customize || !this.imageViewer.activeImg.customize.length) return
        const cards = this.imageViewer.activeImg.customize[0].option.cards

        if (cards && cards.length && val) {
          cards.forEach(ca => {
            const clip = val.find(cl => {
              return cl.position === ca.position
            })

            if (clip) {
              ca.clip.url = clip.url
              ca.clip.loading = false
            }
          })
        }
      },
      deep: true
    }
  },
  methods: {
    cleanOtherRequest(requset) {
      const requestList = ['log/search', 'log/image/search']

      const cleanRequsetArr = requestList.filter(req => req !== requset)
      cleanRequestList(cleanRequsetArr)
    },

    clickButton(value) {
      const dealValue = value.split('-')

      switch (dealValue[0]) {
        case 'search':
          this.dealSearchCondition()
          break
        case 'export':
          this.showExport()
          break
        case 'finalExport':
          this.exportLog()
          break
        case 'clear':
          this.showClearCache()
          break
        case 'clearCache':
          this.clearCacheDate()
          break
        case 'autoClean':
          this.showAutoClean()
          break
        case 'saveAutoClean':
          this.saveAutoClean()
          break

        case 'handleAlarm':
          this.handleAlarm(dealValue[1], dealValue[2])
          break
        case 'videoClip':
          this.openVideoClip()
          break
        case 'showImageViewerVideo':
          this.showImageViewerVideo()
          break
        case 'downloadVideo':
          this.downloadVideo()
          break
        default:
      }
    },

    openVideoClip() {
      const assignObj = {
        title: '录制片段',
        show: true,
        name: 'DialogShell',
        customClass: 'dialog--medium dialog-height--medium',
        component: this.MpegtsMonitor
      }

      this.MpegtsMonitor.option.url = this.buttonScope.row.video
      this.MpegtsMonitor.option.tipList = [
        {
          label: this.buttonScope.row.alertType,
          style: {
            'font-size': '14px',
            color: 'rgba(14, 27, 46, 0.85)'
          }
        },
        {
          label: this.buttonScope.row.createdAt,
          style: {
            'font-size': '12px',
            color: 'rgba(14, 27, 46, 0.5)',
            'margin-left': '16px'
          }
        }
      ]
      this.MpegtsMonitor.option.error = {
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
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    downloadVideo() {
      const a = document.createElement('a')
      a.href = this.MpegtsMonitor.option.url
      a.click()
    },
    showImageViewerVideo() {
      const mpegts = this.imageViewer.activeImg.mpegts
      const button = this.imageViewer.activeImg.tools.video[0].option.buttons[0]

      const active = !button.active
      button.active = active

      this.MpegtsMonitor.option.isInnerScreen = active
      this.imageViewerRef.mpegts.dealWebbcamParams(active)
      if (!active) {
        this.imageViewerRef.mpegts.initVideoOption()
      }

      mpegts.show = active
    },

    getTaskSubData() {
      return new Promise(resolve => {
        task.taskSub()
          .then(res => {
            const { data } = res
            data.taskList.forEach(item => {
              item.label = item.name
              item.value = item.task_key
            })

            this.videoSearchForm[2].option = data.taskList
            this.pictureSearchForm[2].option = data.taskList

            resolve()
          })
          .catch(() => {
            resolve()
          })
      })
    },
    dealSearchCondition() {
      if (this.searchConditionOption.data.date) {
        this.searchConditionOption.data.startDate = this.searchConditionOption.data.date[0]
        this.searchConditionOption.data.endDate = this.searchConditionOption.data.date[1]
      } else {
        this.searchConditionOption.data.startDate = ''
        this.searchConditionOption.data.endDate = ''
      }

      if (this.activeTab === 'video') {
        this.searchAlgorithmLog(this.searchConditionOption.data)
        this.hasSerachedOption = deepClone(this.searchConditionOption.data)
      } else {
        this.getLogData(this.searchConditionOption.data)
        this.hasSerachedOption = deepClone(this.searchConditionOption.data)
      }
    },
    searchAlgorithmLog(search) {
      this.cleanOtherRequest('log/search')

      let params = {
        alertType: '',
        startDate: '',
        endDate: '',
        page: this.tablePagerOption.currentPage,
        size: this.tablePagerOption.pageSizes
      }

      if (search) {
        params = Object.assign(params, search)
      }

      this.pageLoading = true

      log.searchException(params)
        .then(res => {
          const { data } = res

          this.algorithmLogOption.tableData = data.list

          this.algorithmLogOption.imageViewer = {
            show: true,
            imageList: data.list,
            imgKey: 'origin',
            infoHeader: '分析结果',
            infoDisplay: {
              alertId: '算法ID',
              alertType: '异常类型',
              taskId: '关联任务ID',
              cameraId: '点位ID',
              cameraName: '点位名称',
              createdAt: '时间',
              other: '扩展信息'
            }
          }

          this.dealTableData(data, search)

          this.pageLoading = false
        })
        .catch(() => {
          this.pageLoading = false
        })

      // 获取自动清理数据
      this.getLogAutoClean()
    },
    getLogData(search) {
      this.cleanOtherRequest('log/image/search')

      let params = {
        alertType: '',
        startDate: '',
        endDate: '',
        page: this.tablePagerOption.currentPage,
        size: this.tablePagerOption.pageSizes
      }

      if (search) {
        params = Object.assign(params, search)
      }

      this.pageLoading = true

      log.getLogData(params)
        .then(res => {
          const { data } = res

          data.list.forEach(item => {
            item.alertId = item.alertId.split(',').join(', ')
          })

          this.algorithmLogOption.tableData = data.list

          this.algorithmLogOption.imageViewer = {
            show: true,
            imageList: data.list,
            imgKey: 'origin',
            infoHeader: '分析结果',
            infoDisplay: {
              alertId: '算法ID',
              alertType: '识别算法',
              taskId: '关联任务ID',
              // cameraId: '点位ID',
              isWarning: '是否有报警',
              createdAt: '输入时间',
              other: '扩展信息'
            }
          }

          this.dealTableData(data, search)

          this.pageLoading = false
        })
        .catch(() => {
          this.pageLoading = false
        })
    },
    dealTableData(data, search) {
      this.algorithmLogOption.tableData.forEach(item => {
        if (this.activeTab === 'picture') {
          item.isWarning = item.whetherAlert ? '有' : '无'
        }

        item.other = item.other ?? '否'

        if (item.associateId !== null) {
          item.associateName = item.associateId + ', ' + item.associateType

          if (item.associateResult) {
            item.customize = [
              {
                name: 'face',
                header: '算法联动',
                is: 'FaceLinkage',
                option: {
                  title: {
                    label: '算法联动',
                    value: [item.associateName]
                  },
                  cardStyle: {
                    'max-height': '300px'
                  },
                  cards: []
                }
              }
            ]

            let associateRightActive = []
            item.associateResult.forEach(ass => {
              associateRightActive.push('associate-' + ass.taskId)
              associateRightActive = [...new Set(associateRightActive)]

              if (ass.taskResult && ass.taskResult.objectList) {
                ass.taskResult.objectList.forEach(obj => {
                  if (obj.classId) {
                    const pshData = {
                      clip: {
                        url: '',
                        loading: true
                      },
                      imagesList: []
                    }

                    obj.res.forEach((res, resIndex) => {
                      pshData.imagesList.push({
                        name: res.name,
                        url: res.photo,
                        idLabel: '匹配ID',
                        id: res.id,
                        scoreLabel: '分数',
                        score: res.score.toFixed(2),
                        tagLabel: '人脸标签'
                      })

                      if (res.tag.fixTag.length || res.tag.tagList.length) {
                        pshData.imagesList[resIndex].tags = {
                          prop: 'face',
                          faceTag: []
                        }

                        res.tag.fixTag.forEach(t => {
                          pshData.imagesList[resIndex].tags.faceTag.push({
                            label: t.name,
                            value: t.id,
                            class: 'tag-blue',
                            disableTransitions: true
                          })
                        })

                        res.tag.tagList.forEach(t => {
                          pshData.imagesList[resIndex].tags.faceTag.push({
                            label: t.name,
                            value: t.id,
                            class: 'tag-purple',
                            disableTransitions: true
                          })
                        })
                      }
                    })
                    pshData.position = obj.rect.x + '.' + obj.rect.y + '-' + obj.rect.width + '-' + obj.rect.height

                    item.customize[0].option.cards.push(pshData)
                  }
                })
              }
            })

            item.associateRightActive = associateRightActive
          }
        } else {
          item.associateName = '无'
        }

        item.tools = {}

        if (item.video) {
          item.videoString = ' '

          item.tools.video = [
            {
              is: 'ButtonGroup',
              option: {
                buttons: [
                  {
                    value: 'showImageViewerVideo',
                    svgIconLeft: 'part-video-line',
                    type: 'text',
                    timer: 0,
                    active: false
                  }
                ]
              }
            }
          ]

          item.mpegts = {
            show: false,
            option: {
              url: item.video,
              autoplay: false,
              type: 'mp4',
              isLive: false,
              hasProgress: true,
              createOption: {
                enableWorker: true,
                lazyLoad: false
              },
              error: {
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
              }
            }
          }
        } else {
          item.videoString = '-'
        }

        item.tools.alarm = [
          {
            is: 'ButtonGroup',
            class: 'image-viewer-button',
            option: {
              buttons: []
            }
          }
        ]

        item.resultRightActive = []

        if (this.activeTab === 'video') {
          item.tools.alarm[0].option.buttons.push({
            label: item.alertType,
            value: 'handleAlarm-' + 'result-' + item.result.taskId,
            plain: true,
            svgIconLeft: configuration.algorithmSvg[item.result.taskId] || 'normal',
            timer: 0,
            active: true
          })

          item.resultRightActive.push('result-' + item.result.taskId)
        } else if (this.activeTab === 'picture') {
          item.result && item.result.forEach(task => {
            const buttonTask = this.pictureSearchForm[2].option.find(item => item.value === task.taskId)

            item.tools.alarm[0].option.buttons.push({
              label: buttonTask.label,
              value: 'handleAlarm-' + 'result-' + task.taskId,
              plain: true,
              svgIconLeft: configuration.algorithmSvg[task.taskId] || 'normal',
              timer: 0,
              active: true
            })

            item.resultRightActive.push('result-' + task.taskId)
          })
        }

        if (item.associateResult && item.associateResult.length) {
          item.tools.alarm[0].option.buttons.push({
            label: item.associateType,
            value: 'handleAlarm-' + 'associate-' + item.associateResult[0].taskId,
            plain: true,
            svgIconLeft: configuration.algorithmSvg[item.associateResult[0].taskId] || 'normal',
            timer: 0,
            active: true
          })
        }

        item.deviation = 0.05

        item.data = this.creatAlarmData(item, null, {
          result: item.resultRightActive,
          associate: item.associateRightActive
        })
      })

      this.tablePagerOption = Object.assign(this.tablePagerOption, data.pageVO)

      if (!search) {
        this.totalAll = data.pageVO.total
      }
    },
    handleAlarm(type, taskId) {
      const option = this.imageViewer.activeImg.tools.alarm[0].option

      const button = option.buttons.find(bu => bu.value.split('-')[1] === type && bu.value.split('-')[2] === taskId)

      button.active = !button.active

      if (button.active) {
        this.imageViewer.activeImg[type + 'RightActive'].push(type + '-' + Number(taskId))
      } else {
        this.imageViewer.activeImg[type + 'RightActive'] = this.imageViewer.activeImg[type + 'RightActive'].filter(res => res !== (type + '-' + taskId))
      }

      this.imageViewer.activeImg.data = this.creatAlarmData(this.imageViewer.activeImg, {}, {
        result: this.imageViewer.activeImg.resultRightActive,
        associate: this.imageViewer.activeImg.associateRightActive
      })
    },
    creatAlarmData(obj, allShow, rightShow, errorShow) {
      const alarmData = []

      allShow = allShow || {}
      rightShow = rightShow || {}
      errorShow = errorShow || {}

      if (obj.associateId !== null && obj.associateResult) {
        obj.associateResult.forEach(ass => {
          alarmData.push(...handleAlarmData(ass, '未知用户', 'rgb(119, 51, 255)', '#fff', allShow.associate, rightShow.associate, errorShow.associate, 'associate-'))
        })
      }

      if (this.activeTab === 'video') {
        alarmData.push(...handleAlarmData(obj.result, obj.alertType, 'rgb(255, 58, 51)', '#fff', allShow.result, rightShow.result, errorShow.result, 'result-'))
      } else if (this.activeTab === 'picture') {
        obj.result && obj.result.forEach(task => {
          const alarmTask = this.pictureSearchForm[2].option.find(item => item.value === task.taskId)

          alarmData.push(...handleAlarmData(task, alarmTask.label, 'rgb(255, 58, 51)', '#fff', allShow.result, rightShow.result, errorShow.result, 'result-'))
        })
      }

      return alarmData
    },

    getLogAutoClean() {
      log.getLogAutoClean()
        .then(res => {
          const { data } = res

          this.cleanData = data.auto
          this.cleanData.autoClean = !!this.cleanData.autoClean

          const occupy = data.space.block - data.space.available
          this.cacheClearOption.info[1].label = occupy.toFixed(1) + ' GB'
          this.cacheClearOption.info[2].label = '/ ' + data.space.block.toFixed(1) + ' GB'
          this.cacheClearOption.circle.percentage = Number(((occupy / data.space.block) * 100).toFixed(1))
          this.cacheClearOption.circle.percentageText = this.cacheClearOption.circle.percentage + '%'
          this.cacheClearOption.circle.color = this.cacheClearOption.circle.percentage > 90 ? '#FF3A33' : '#1872F0'
        })
    },
    isSerached() {
      const searchLength = Object.keys(this.hasSerachedOption)
      if (searchLength.length > 0) {
        return searchLength.some(item => {
          return this.hasSerachedOption[item] !== '' && this.hasSerachedOption[item] !== null
        })
      } else {
        return false
      }
    },
    showExport() {
      this.exportDialog.option.form[0].radio = JSON.parse(JSON.stringify(this.radioTemplate))
      this.exportDialog.option.form[0].radio[0].label += ' ( ' + this.totalAll + ' 条 )'
      this.exportDialog.option.form[0].radio[1].label += ' ( ' + this.tablePagerOption.total + ' 条 )'
      this.exportDialog.option.form[0].radio[2].label += ' ( ' + this.$refs.formTable.selectedData.length + ' 条 )'

      if (this.$refs.formTable.selectedData.length > 0) {
        this.exportDialog.option.data.exportLog = 2
      } else if (this.isSerached()) {
        this.exportDialog.option.data.exportLog = 1
      } else {
        this.exportDialog.option.data.exportLog = 0
      }

      this.exportDialog.option.form[0].radio[0].disabled = this.totalAll === 0
      this.exportDialog.option.form[0].radio[1].disabled = this.tablePagerOption.total === 0
      this.exportDialog.option.form[0].radio[2].disabled = this.$refs.formTable.selectedData.length === 0

      const assignObj = {
        title: '导出日志',
        show: true,
        name: 'DialogShell',
        width: '590px',
        tip: {
          label: '导出过程中对浏览器进行刷新将会中断导出操作，请尽量避免刷新行为',
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
              label: '立即导出',
              value: 'finalExport',
              type: 'primary'
            }
          ]
        },
        component: this.exportDialog
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    exportLog() {
      const params = {}

      if (this.exportDialog.option.data.exportLog === 2) {
        params.exportType = 'batch_selection'
        params.idList = []
        this.$refs.formTable.selectedData.forEach(item => {
          params.idList.push(item.id)
        })
      } else if (this.exportDialog.option.data.exportLog === 1) {
        params.exportType = 'conditional_filtering'
        params.keyword = this.hasSerachedOption.keyword
        params.cameraId = this.hasSerachedOption.cameraId
        params.type = this.hasSerachedOption.alertType
        params.startDate = this.hasSerachedOption.startDate
        params.endDate = this.hasSerachedOption.endDate
      } else {
        params.exportType = 'conditional_filtering'
      }

      this.dialog.buttons.buttons[1].disabled = true
      this.dialog.self.$refs.buttonGroup.$forceUpdate()

      const exportTotal = [this.totalAll, this.tablePagerOption.total, this.$refs.formTable.selectedData.length][this.exportDialog.option.data.exportLog]

      let exportUrl = 'log/export'

      if (this.activeTab === 'picture') {
        exportUrl = 'log/image/export'
      }

      log.exportLogs(exportUrl, params, { method: 'POST', cache: 'no-cache' })
        .then(res => {
          const title = decodeURI(res.headers.get('title'))

          const fileStream = this.$streamSaver.createWriteStream(title, {
            size: res.headers.get('content-length')
          })

          const time = Date.now()
          this.$store.dispatch('streamsaver/setWriter', { writer: fileStream.getWriter(), time: time })

          const reader = res.body.getReader()
          const pump = () => reader.read()
            .then(pumpRes => {
              if (pumpRes.done) {
                this.streamSaver.writer[time].close()

                this.$messageInfo({
                  message: '成功导出' + title + '，共' + exportTotal + '条',
                  type: 'success',
                  duration: 3000
                })

                this.$store.dispatch('streamsaver/deleteWriter', time)
              } else {
                this.streamSaver.writer[time].write(pumpRes.value).then(pump())
              }
            })

          pump()
        })

      this.$store.dispatch('dialog/initDialogData')
    },
    showClearCache() {
      this.clearCache.option.data.date = ''

      const assignObj = {
        title: '清理缓存',
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
              label: '清理',
              value: 'clearCache',
              type: 'primary'
            }
          ]
        },
        component: this.clearCache
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    clearCacheDate() {
      this.clearCache.option.ref.validate(valid => {
        if (valid) {
          const params = {
            startDate: this.clearCache.option.data.date[0],
            endDate: this.clearCache.option.data.date[1]
          }

          this.dialog.buttons.buttons[1].disabled = true
          this.dialog.self.$refs.buttonGroup.$forceUpdate()
          log.deleteLog(params)
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

              this.dialog.buttons.buttons[1].disabled = false
              this.dialog.self.$refs.buttonGroup.$forceUpdate()
              this.$store.dispatch('dialog/initDialogData')

              this.init()
            })
        }
      })
    },
    showAutoClean() {
      // 清空数据
      this.autoClearCache = deepClone(this.autoClearCacheTemplate)

      const assignObj = {
        title: '自动清理',
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
              value: 'saveAutoClean',
              type: 'primary'
            }
          ]
        },
        component: this.autoClearCache
      }

      this.autoClearCache.option.data = deepClone(this.cleanData)

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    saveAutoClean() {
      log.postAutoClean(this.autoClearCache.option.data)
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: '设置自动清理成功!'
          })

          this.$store.dispatch('dialog/initDialogData')

          this.cleanData = this.autoClearCache.option.data
        })
    }
  }
}
