import callback from '@/api/callback'
import task from '@/api/task'

import configuration from '@/setting'
import { handleAlarmData } from '@/utils/algorithm'

import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'
import { cleanRequestList } from '@/utils/interceptors'

import header from '@/assets/image/backGroundImage/mail-header-bg.webp'
import footer from '@/assets/image/backGroundImage/mail-footer-bg.webp'

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

      mailViewDia: {},
      mailViewDiaTemplate: {
        name: 'MailTemplate',
        option: {
          style: {
            block: {
              width: '360px'
            },
            header: {
              'background-image': 'url(' + header + ')',
              height: '80px'
            },
            footer: {
              'background-image': 'url(' + footer + ')',
              height: '80px'
            },
            startNode: {
              background: 'rgba(24, 114, 240, 1)'
            },
            endNode: {
              background: 'rgba(24, 204, 240, 1)'
            },
            totalNode: {
              background: 'rgba(255, 58, 51, 1)'
            },
            tail: {
              background: 'linear-gradient(180deg, #1872F0 0%, #18CCF0 100%)'
            }
          },
          title: {
            head: '',
            foot: ''
          },
          time: {
            start: '',
            end: '',
            total: '',
            svg: 'time-single-line',
            title: '报警记录汇总时间段',
            startText: '起始时间',
            endText: '结束时间',
            totalText: '累计时长'
          },
          data: [],
          screenshot: {
            label: '报警截图预览',
            tip: '（部分）',
            screenList: []
          }
        }
      },
      lineOption: {
        color: ['#4141DB', '#F58249', '#F54949', '#3AC2A0', '#4983F5', '#F5CA49', '#4EC213', '#8349F5', '#DB41C2', '#DB5716', '#CC1414', '#A87611'],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          type: 'scroll',
          width: '100%',
          icon: 'circle',
          left: 'center',
          itemGap: 16,
          itemWidth: 6,
          itemHeight: 6
        },
        grid: {
          left: 10,
          right: 10,
          top: 28,
          bottom: 0,
          containLabel: true
        },
        xAxis: {
          axisTick: {
            show: false
          },
          lineStyle: {
            color: 'rgba(14, 27, 46, 0.15)'
          },
          data: []
        },
        yAxis: {
          type: 'value',
          axisLine: { show: true },
          lineStyle: {
            color: 'rgba(14, 27, 46, 0.15)'
          }
        },
        series: []
      },
      pieOption: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          height: '100%',
          bottom: 'center',
          right: 10,
          padding: 0,
          icon: 'circle',
          itemGap: 16,
          itemWidth: 6,
          itemHeight: 6,
          avoidLabelOverlap: false,
          formatter: function(name) {
            return [].join('')
          },
          textStyle: {
            rich: {
              text: {
                width: 45,
                color: 'rgba(14, 27, 46, 0.65)',
                padding: [0, 0, 8, 0]
              },
              value: {
                width: 35,
                fontWeight: 600,
                color: 'rgba(14, 27, 46, 0.85)'
              }
            }
          }
        }
      },
      reportInfoTem: [
        {
          id: 10,
          label: '人流统计',
          tip: ' （累计流入）',
          chart: {},
          style: {
            height: '168px',
            padding: '16px'
          }
        },
        {
          id: 20,
          label: '热力分布',
          tip: ' （百分比）',
          chart: {},
          style: {
            height: '168px',
            padding: '16px'
          }
        },
        {
          id: 30,
          label: '报警次数统计表',
          style: {
            padding: '16px'
          }
        },
        {
          id: 40,
          label: '报警次数实时统计',
          chart: {},
          style: {
            height: '168px',
            padding: '16px'
          }
        },
        {
          id: 50,
          label: '报警次数统计分布饼图',
          chart: {},
          style: {
            height: '224px',
            padding: '32px'
          }
        },
        {
          id: 60,
          label: '报警点位分布Top5柱形图',
          chart: {},
          style: {
            height: '168px',
            padding: '16px'
          }
        }
      ],
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
      'button',
      'streamSaver',
      'buttonScope',
      'imageViewer',
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
    }
  },
  methods: {
    cleanOtherRequest(requset) {
      const requestList = ['callback/log/search', 'email/report', 'callback/log/shuadh_search', 'callback/log/oil_log_search']

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

        case 'viewMail':
          this.viewMail()
          break
        case 'rePush':
          this.rePushMail()
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

        case 'revokeAlarm':
          this.revokeAlarm()
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
          label: this.buttonScope.row.pushTime,
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
      mpegts.show = active
      button.active = active

      this.MpegtsMonitor.option.isInnerScreen = active
      this.imageViewerRef.mpegts.dealWebbcamParams(active)
      if (!active) {
        this.imageViewerRef.mpegts.initVideoOption()
      }
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
            this.callbackSearchForm[1].option = data.taskList
            this.cloudSearchForm[1].option = data.taskList
            resolve()
          })
          .catch(() => {
            resolve()
          })
      })
    },
    setChartOption() {
      this.reportInfoTem[0].chart.option = deepClone(this.lineOption)
      this.reportInfoTem[0].chart.ref = 'flow'

      this.reportInfoTem[1].chart.option = deepClone(this.lineOption)
      this.reportInfoTem[1].chart.ref = 'heat'

      this.reportInfoTem[3].chart.option = deepClone(this.lineOption)
      this.reportInfoTem[3].chart.ref = 'alarmLine'

      this.reportInfoTem[4].chart.option = deepClone(this.pieOption)
      this.reportInfoTem[4].chart.ref = 'alarmPie'

      this.reportInfoTem[5].chart.option = deepClone(this.lineOption)
      this.reportInfoTem[5].chart.ref = 'alarmBar'
    },

    dealSearchCondition() {
      if (this.searchConditionOption.data.date) {
        this.searchConditionOption.data.startDate = this.searchConditionOption.data.date[0]
        this.searchConditionOption.data.endDate = this.searchConditionOption.data.date[1]
      } else {
        this.searchConditionOption.data.startDate = ''
        this.searchConditionOption.data.endDate = ''
      }

      if (this.activeTab === 'callback') {
        this.getPushLogData(this.searchConditionOption.data)
        this.hasSerachedOption = deepClone(this.searchConditionOption.data)
      } else if (this.activeTab === 'mail') {
        this.getMailLogData(this.searchConditionOption.data)
      } else if (this.activeTab === 'cloud') {
        this.getCloudLogData(this.searchConditionOption.data)
      } else if (this.activeTab === 'oil') {
        this.getOilLogData(this.searchConditionOption.data)
      }
    },
    getPushLogData(search) {
      this.cleanOtherRequest('callback/log/search')

      let params = {
        keyword: '',
        type: '',
        startDate: '',
        endDate: '',
        page: this.tablePagerOption.currentPage,
        size: this.tablePagerOption.pageSizes
      }

      if (search) {
        params = Object.assign(params, search)
      }

      this.pageLoading = true

      callback.searchPushLog(params)
        .then(res => {
          const { data } = res
          this.algorithmLogOption.tableData = data.callbackList

          this.algorithmLogOption.tableData.forEach(item => {
            item.taskId = `${['', 'V', 'I'][item.taskType]} : ${item.taskId}`

            item.other = item.other ?? '否'

            if (item.result) {
              item.resultData = '成功'
              item.resultDataClass = ' is-green'
            } else {
              item.resultData = '失败'
              item.resultDataClass = ' is-red'
            }
          })

          this.algorithmLogOption.imageViewer = {
            show: true,
            imageList: this.algorithmLogOption.tableData,
            imgKey: 'picture',
            infoHeader: '推送结果',
            infoDisplay: {
              alertType: '异常类型',
              taskId: '关联任务ID',
              callbackUrl: 'Callback地址',
              cameraId: '点位ID',
              cameraUrl: '流地址',
              pushTime: '时间',
              resultData: '推送结果',
              other: '扩展信息'
            },
            infoSpecial: {
              resultData: {
                class: 'font-color',
                key: 'resultDataClass'
              }
            }
          }

          this.tablePagerOption = Object.assign(this.tablePagerOption, data.pageVO)

          if (!search) {
            this.totalAll = data.pageVO.total
          }

          this.dealAlarmData()

          this.pageLoading = false
        })
        .catch(() => {
          this.pageLoading = false
        })
    },
    dealAlarmData() {
      this.algorithmLogOption.tableData.forEach(item => {
        item.tools = {}

        if (item.taskType === 1) {
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
        }

        if (item.taskType === 2 && item.resultJson) {
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

          item.resultJson.forEach(task => {
            const buttonTask = this.callbackSearchForm[1].option.find(item => item.value === task.taskId)

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

          item.data = this.filterAlarmData(item, null, item.resultRightActive)
        }
      })
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

      this.imageViewer.activeImg.data = this.filterAlarmData(this.imageViewer.activeImg, null, this.imageViewer.activeImg.resultRightActive)
    },
    filterAlarmData(obj, allShow = [], rightShow = [], errorShow = []) {
      const alarmData = []

      obj.resultJson.forEach(task => {
        const alarmTask = this.callbackSearchForm[1].option.find(item => item.value === task.taskId)

        alarmData.push(...handleAlarmData(task, alarmTask.label, 'rgb(255, 58, 51)', '#fff', allShow, rightShow, errorShow, 'result-'))
      })

      return alarmData
    },

    getMailLogData(search) {
      this.cleanOtherRequest('email/report')

      let params = {
        keyword: '',
        startDate: '',
        endDate: '',
        page: this.tablePagerOption.currentPage,
        size: this.tablePagerOption.pageSizes
      }

      if (search) {
        params = Object.assign(params, search)
      }

      this.pageLoading = true

      task.getMailLog(params)
        .then(res => {
          const { reportList } = res.data

          reportList.forEach(re => {
            re.taskId = re.relatedTasks.join(', ')
            re.resultData = re.reportStatus ? '成功' : '失败'
            re.resultDataClass = re.reportStatus ? ' is-green' : ' is-red'

            re.start = this.$dayjs(re.collectStartTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY年MM月DD日 HH:mm:ss')
            re.end = this.$dayjs(re.collectEndTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY年MM月DD日 HH:mm:ss')
            const diff = this.$dayjs(re.end, 'YYYY年MM月DD日 HH:mm:ss').diff(this.$dayjs(re.start, 'YYYY年MM月DD日 HH:mm:ss'), 'm')
            re.total = Math.floor(diff / 60) + '小时' + diff % 60 + '分'

            re.multiple = 2
            re.addressTag = []
            re.addressList.forEach(item => {
              re.addressTag.push({
                label: item,
                value: item,
                class: 'tag-blue',
                style: {
                  'max-width': '180px'
                },
                disableTransitions: true
              })
            })
            re.addressContent = re.addressList.join(', ')

            re.pushTime = this.$dayjs(re.end, 'YYYY年MM月DD日 HH:mm:ss').format('YYYY-MM-DD | HH:mm:ss')

            re.screenList = []

            const reportInfo = []
            re.reportResult.forEach(list => {
              const key = Object.keys(list)[0]
              const cacheReportInfo = deepClone(this.reportInfoTem)
              const report = cacheReportInfo.find(item => item.id === Number(key))

              switch (key) {
                case '10':case '20':case '40':
                  if (list[key] && list[key].length) {
                    report.chart.option.xAxis.data = Object.keys(list[key][0].point_data).map(date => this.$dayjs(date, 'YYYY-MM-DD HH:mm:ss').format('MM-DD HH:mm'))
                    report.chart.option.series = []
                    list[key].forEach(point => {
                      report.chart.option.series.push({
                        name: point.cameraName || point.alertName,
                        type: 'line',
                        smooth: true,
                        symbol: 'none',
                        emphasis: {
                          focus: 'data'
                        },
                        data: Object.values(point.point_data)
                      })
                    })
                    reportInfo.push(report)
                  }
                  break
                case '30':
                  if (list[key] && list[key].length) {
                    report.table = {
                      th: ['算法ID', '算法类型', '报警次数']
                    }
                    report.table.td = []
                    list[key].forEach(td => {
                      report.table.td.push([td.id, td.name, td.count])
                    })

                    reportInfo.push(report)
                  }
                  break
                case '50':
                  if (list[key] && Object.keys(list[key]).length) {
                    report.chart.option.series = [
                      {
                        name: '',
                        type: 'pie',
                        radius: ['0', '90%'],
                        center: ['32%', '50%'],
                        label: {
                          show: false
                        },
                        data: []
                      }
                    ]
                    Object.keys(list[key]).forEach(al => {
                      report.chart.option.series[0].data.push({
                        name: list[key][al].name,
                        value: (list[key][al].proportion * 100).toFixed(2)
                      })
                    })

                    report.chart.option.legend.formatter = function(name) {
                      return [
                        '{text|' + name + '}',
                        '{value|' + report.chart.option.series[0].data.find(d => d.name === name).value + '%}'
                      ].join('\n')
                    }

                    reportInfo.push(report)
                  }
                  break
                case '60':
                  if (list[key] && list[key].length) {
                    report.chart.option.tooltip.axisPointer = {
                      type: 'shadow'
                    }

                    report.chart.option.xAxis.data = []
                    report.chart.option.series = []

                    Object.keys(list[key][0][1].point_data).forEach(al => {
                      report.chart.option.series.push({
                        name: list[key][0][1].point_data[al].alertName,
                        type: 'bar',
                        data: [],
                        emphasis: {
                          focus: 'series'
                        }
                      })
                    })

                    list[key].forEach(po => {
                      report.chart.option.xAxis.data.push(po[1].cameraName)

                      Object.keys(po[1].point_data).forEach((al, alIndex) => {
                        if (report.chart.option.series[alIndex] && report.chart.option.series[alIndex].data) {
                          report.chart.option.series[alIndex].data.push({
                            name: po[1].point_data[al].alertName,
                            value: po[1].point_data[al].count
                          })
                        }
                      })
                    })

                    reportInfo.push(report)
                  }
                  break
                default:
                  if (list[key] && Object.keys(list[key]).length) {
                    Object.keys(list[key]).forEach(al => {
                      list[key][al].point_data.forEach(pointData => {
                        re.screenList.push({
                          image: pointData.file_picture,
                          time: this.$dayjs(pointData.createdAt, 'YYYY年MM月DD日 HH:mm:ss').format('YYYY-MM-DD | HH:mm:ss'),
                          algorithm: {
                            id: al,
                            label: list[key][al].alertName
                          },
                          point: {
                            id: pointData.cameraId,
                            label: pointData.cameraName
                          }
                        })
                      })
                    })
                  }
                  break
              }
            })
            re.reportInfo = reportInfo
          })

          this.algorithmLogOption.tableData = reportList

          this.tablePagerOption = Object.assign(this.tablePagerOption, res.data.pageVO)

          this.pageLoading = false
        })
    },

    getCloudLogData(search) {
      this.cleanOtherRequest('callback/log/shuadh_search')

      let params = {
        keyword: '',
        type: '',
        startDate: '',
        endDate: '',
        page: this.tablePagerOption.currentPage,
        size: this.tablePagerOption.pageSizes
      }

      if (search) {
        params = Object.assign(params, search)
      }

      this.pageLoading = true

      callback.searchCloudLogData(params)
        .then(res => {
          const { data } = res

          this.algorithmLogOption.tableData = data.callbackList

          this.algorithmLogOption.tableData.forEach(item => {
            item.alarmId = item.alarmId || '--'
            item.deviceMac = item.deviceMac || '--'
            item.deviceCuei = item.deviceCuei || '--'
            item.alarmTime = item.alarmTime || '--'
            item.endAlarmTime = item.endAlarmTime || '--'

            if (item.businessStatusString !== null) {
              item.businessStatusString = ['未营业', '营业中'][item.businessStatus]
              item.businessStatusStringClass = [' is-red', '  is-green'][item.businessStatus]
            } else {
              item.businessStatusString = '--'
              item.businessStatusStringClass = ''
            }

            if (item.pushStatus) {
              item.pushStatusString = '成功'
              item.pushStatusStringClass = ' is-green'
            } else {
              item.pushStatusString = '失败'
              item.pushStatusStringClass = ' is-red'
            }
          })

          this.algorithmLogOption.imageViewer = {
            show: true,
            imageList: this.algorithmLogOption.tableData,
            imgKey: 'picture',
            infoHeader: '推送结果',
            infoDisplay: {
              taskId: '关联任务ID',
              cameraId: '点位ID',
              algorithmId: '平台算法ID',
              alarmId: '输出报警ID',
              deviceMac: '输出告警 MAC',
              deviceCuei: '输出告警设备 CUEI',
              alarmTime: '输出告警时间',
              endAlarmTime: '输出告警结束时间',
              businessStatusString: '输出营业状态',
              pushStatusString: '推送结果'
            },
            infoSpecial: {
              businessStatusString: {
                class: 'font-color',
                key: 'businessStatusStringClass'
              },
              pushStatusString: {
                class: 'font-color',
                key: 'pushStatusStringClass'
              }
            }
          }

          this.tablePagerOption = Object.assign(this.tablePagerOption, data.pageVO)

          if (!search) {
            this.totalAll = data.pageVO.total
          }

          this.pageLoading = false
        })
        .catch(() => {
          this.pageLoading = false
        })
    },

    getOilLogData(search) {
      this.cleanOtherRequest('callback/log/oil_log_search')

      let params = {
        keyword: '',
        type: '',
        startDate: '',
        endDate: '',
        page: this.tablePagerOption.currentPage,
        size: this.tablePagerOption.pageSizes
      }

      if (search) {
        params = Object.assign(params, search)
      }

      this.pageLoading = true

      callback.searchOilLogData(params)
        .then(res => {
          const { data } = res

          this.algorithmLogOption.tableData = data.callbackList

          this.algorithmLogOption.tableData.forEach(item => {
            this.dealOilData(item)
          })

          this.algorithmLogOption.imageViewer = {
            show: true,
            imageList: this.algorithmLogOption.tableData,
            infoHeader: '推送结果',
            infoDisplay: {
              taskId: '关联任务ID',
              cameraId: '点位ID',
              algorithmId: '平台算法ID',
              alarmId: '输出报警ID',
              alarmTypeName: '输出报警类型',
              alarmActionString: '输出报警动作',
              videoInteAnalysisCode: '输出视频智能分析编码',
              channelCode: '输出设备国标通道',
              alarmTime: '输出告警时间',
              eliminateAlarmTime: '输出销警时间',
              pushStatusString: '推送结果'
            },
            infoSpecial: {
              pushStatusString: {
                class: 'font-color',
                key: 'pushStatusStringClass'
              }
            }
          }

          this.tablePagerOption = Object.assign(this.tablePagerOption, data.pageVO)

          if (!search) {
            this.totalAll = data.pageVO.total
          }

          this.pageLoading = false
        })
        .catch(() => {
          this.pageLoading = false
        })
    },
    dealOilData(data) {
      if (data.pushStatus) {
        data.pushStatusString = '成功'
        data.pushStatusStringClass = ' is-green'
      } else {
        data.pushStatusString = '失败'
        data.pushStatusStringClass = ' is-red'
      }

      if (!data.alarmAction) {
        data.revokeAlarm = ' '
        data.revokeAlarmClass = ''
        data.hide = []
      } else {
        data.revokeAlarm = '已销警'
        data.revokeAlarmClass = ' is-grey'
        data.hide = ['revokeAlarm']
      }

      data.alarmActionString = ['报警触发', '报警消失'][data.alarmAction] || '--'
      data.alarmId = data.alarmId || '--'
      data.alarmTypeName = data.alarmTypeName || '--'
      data.videoInteAnalysisCode = data.videoInteAnalysisCode || '--'
      data.channelCode = data.channelCode || '--'
      data.alarmTime = data.alarmTime || '--'
      data.eliminateAlarmTime = data.eliminateAlarmTime || '--'

      return data
    },
    revokeAlarm() {
      const params = {
        log_id: this.buttonScope.row.id
      }

      callback.revokeOilAlarm(params)
        .then(res => {
          const { data } = res

          const oilRevokeIndex = this.algorithmLogOption.tableData.findIndex(td => td.id === this.buttonScope.row.id)

          const dealData = this.dealOilData(data)

          this.$set(this.algorithmLogOption.tableData, oilRevokeIndex, dealData)

          this.$messageInfo({
            message: '销警成功!',
            type: 'success'
          })

          this.getOilLogData()
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
      let params = {}

      if (this.exportDialog.option.data.exportLog === 2) {
        params.exportType = 'batch_selection'
        params.idList = []
        this.$refs.formTable.selectedData.forEach(item => {
          params.idList.push(item.id)
        })
      } else if (this.exportDialog.option.data.exportLog === 1) {
        params = this.hasSerachedOption
        params.exportType = 'conditional_filtering'
      } else {
        params.exportType = 'conditional_filtering'
      }

      const exportTotal = [this.totalAll, this.tablePagerOption.total, this.$refs.formTable.selectedData.length][this.exportDialog.option.data.exportLog]

      callback.exportPushLog(params, { method: 'POST', cache: 'no-cache' })
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

    viewMail() {
      // 清空数据
      this.mailViewDia = deepClone(this.mailViewDiaTemplate)

      const assignObj = {
        title: '预览邮件',
        show: true,
        name: 'DialogShell',
        width: '500px',
        buttons: {
          buttons: [
            {
              label: '关闭',
              value: 'cancel',
              type: 'primary'
            }
          ]
        },
        component: {}
      }

      const data = this.buttonScope.row
      const mailTem = this.mailViewDia.option

      mailTem.title.head = data.customizeHeader
      mailTem.title.foot = data.customizeTail

      mailTem.time.start = data.start
      mailTem.time.end = data.end
      mailTem.time.total = data.total

      mailTem.data = data.reportInfo

      mailTem.screenshot.screenList = data.screenList

      assignObj.component = this.mailViewDia

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    rePushMail() {

    }
  }
}
