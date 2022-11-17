
import log from '@/api/log'
import device from '@/api/device'
import Velocity from 'velocity-animate'

import configuration from '@/setting'

import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'

import { handleAlarmData } from '@/utils/algorithm'
import { cleanRequestList } from '@/utils/interceptors'

import Config from '@/setting'

export default {
  data() {
    return {
      newLength: 0,
      webcamMonitorOption: {
        mpegts: {
          url: ''
        },
        value: [],
        options: [],
        props: {}
      },
      realtime: {
        firstMoveInTime: null,
        picture: {},
        style: {
          animation: '',
          'animation-play-state': 'running'
        },
        data: []
      },
      realtimeCache: null,
      isMouseIn: false
    }
  },
  computed: {
    ...mapGetters([
      'button',
      'imageViewer'
    ])
  },
  watch: {
    'realtime.data': {
      handler(val) {
        this.setSvg()
      },
      deep: true
    },
    'button.value'(val) {
      this.clickButton(val)
    },
    'imageViewer.clipImage': {
      handler(val) {
        if (!this.imageViewer.activeImg || !this.imageViewer.activeImg.customize || !this.imageViewer.activeImg.customize.length) return
        const cards = this.imageViewer.activeImg.customize[0].option.cards

        if (cards && cards.length && val && val.length) {
          cards.forEach(ca => {
            const clip = val[0].find(cl => {
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
    clickButton(value) {
      const dealValue = value.split('-')

      switch (dealValue[0]) {
        case 'handleAlarm':
          this.handleAlarm(dealValue[1], dealValue[2])
          break
        default:
      }
    },
    getMonitorPointData() {
      device.getCameraMonitor()
        .then(res => {
          const { data } = res
          this.setMonitorPointOption(data)
          this.getClusterNode()
        })
    },
    setMonitorPointOption(data) {
      const { cameraList } = data
      cameraList.forEach((item, index) => {
        if (typeof item.source === 'undefined') {
          item.demo = true
          item.groupId = item.label
          item.valueId = item.label
          item.leaf = false
          item.children.forEach(task => {
            task.demo = true
            task.groupId = task.id + task.label
            task.valueId = task.id + task.label
            task.leaf = false
            task.children.forEach(algorithm => {
              algorithm.demo = true
              algorithm.label = algorithm.algorithmName + ' . ' + algorithm.cameraName
              algorithm.groupId = algorithm.url
              algorithm.valueId = algorithm.url
              algorithm.leaf = true
            })
          })
        }
      })
      this.webcamMonitorOption.options = cameraList

      const defaultParams = {
        parentId: '',
        page: 1,
        size: 99999
      }

      this.webcamMonitorOption.props = {
        value: 'valueId',
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node
          defaultParams.parentId = node.data.groupId
          const nodeChildren = []
          if ((level > 1 && !node.data.demo) || node.data.source) {
            node.data.children ? '' : node.data.leaf = false
            device.searchTreeNodeCamera(defaultParams).then(res => {
              res.data.cameraList.forEach(item => {
                if (item.status === 1) {
                  item.label = item.name
                  item.disabled = false
                } else {
                  item.label = item.name + '( 离线 )'
                  item.disabled = true
                }
                item.groupId = item.id
                item.valueId = Date.now() + '-' + item.id + '-' + item.name
                item.leaf = true
                nodeChildren.push(item)
              })
              resolve(nodeChildren)
            })
          } else {
            resolve(node)
          }
        }
      }

      setTimeout(() => {
        this.searchOnlineWebcam()
      }, 500)
    },
    searchOnlineWebcam() {
      const defaultParams = {
        parentId: 0,
        page: 1,
        size: 99999
      }
      this.tableLoading = true
      device.searchTreeNodeCamera(defaultParams).then(res => {
        const { data } = res
        const onlineWebcam = data.cameraList.find(item => item.status === 1)

        if (onlineWebcam) {
          this.selectMonitorPoint([Date.now() + '-' + onlineWebcam.id + '-' + onlineWebcam.name])
        }
      })
    },
    async selectMonitorPoint(value) {
      const isDemo = value[value.length - 1].split('-').length === 1

      if (isDemo) {
        this.webcamMonitorOption.mpegts.url = value[value.length - 1]
      } else {
        cleanRequestList(['device/camera/stream'])

        const cameraOption = value[value.length - 1].split('-')

        const videoCache = await this.$store.dispatch('video/getStreamUrl', {
          id: Number(cameraOption[1]),
          name: cameraOption[2]
        })

        if (videoCache) {
          this.webcamMonitorOption.mpegts.code = videoCache.code
          this.webcamMonitorOption.mpegts.url = videoCache.url
        } else {
          device.getDeviceCameraStream({ cameraId: Number(cameraOption[1]) })
            .then(res => {
              const { data } = res

              this.webcamMonitorOption.mpegts.code = data.code_type
              this.webcamMonitorOption.mpegts.url = data.url

              this.$store.dispatch('video/storeStreamUrl', {
                id: Number(cameraOption[1]),
                name: cameraOption[2],
                code: data.code_type,
                url: data.url
              })
            })
            .catch(err => {
              if (err !== 'cancel') {
                this.webcamMonitorOption.mpegts.code = ''
                this.webcamMonitorOption.mpegts.url = ''
              }
            })
        }
      }
    },
    changeRealTimeData(data) {
      const newData = data.filter(item => !this.realtimeCache.some(real => real.id === item.id))

      if (newData.length > 0 && newData.length < 21) {
        this.newLength = newData.length

        newData.reverse().forEach(item => {
          this.realtime.data.unshift(item)
        })
      } else {
        this.newLength = 20

        newData.slice(0, 20).reverse().forEach(item => {
          this.realtime.data.unshift(item)
        })
      }

      setTimeout(() => {
        this.realtime.data.length = 20
      })
    },
    getRealTimeData() {
      const that = this

      log.getRealtime({ pageSizes: 50 })
        .then(res => {
          const { logList } = res.data

          if (!this.realtime.data.length) {
            this.realtime.data = logList.slice(0, 20)
          } else {
            this.changeRealTimeData(logList)
          }

          this.realtimeCache = logList

          this.realtimeCache.forEach(item => {
            item.url = item.origin

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
            }

            item.tools = {
              alarm: [
                {
                  is: 'ButtonGroup',
                  class: 'image-viewer-button',
                  option: {
                    buttons: []
                  }
                }
              ]
            }

            item.resultRightActive = []

            item.tools.alarm[0].option.buttons.push({
              label: item.alertName,
              value: 'handleAlarm-' + 'result-' + item.result.taskId,
              plain: true,
              svgIconLeft: configuration.algorithmSvg[item.result.taskId] || 'normal',
              timer: 0,
              active: true
            })

            item.resultRightActive.push('result-' + item.result.taskId)

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

          setTimeout(() => {
            that.realtime.style.animation = 'realtimeProgress 5s linear 0s 1 normal'
          })
        })
        .catch(() => {
          setTimeout(() => {
            that.realtime.style.animation = 'realtimeProgress 5s linear 0s 1 normal'
          })
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
      alarmData.push(...handleAlarmData(obj.result, obj.alertName, 'rgb(255, 58, 51)', '#fff', allShow.result, rightShow.result, errorShow.result, 'result-'))
      return alarmData
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
    setSvg() {
      this.realtime.data.forEach(item => {
        const svg = Config.algorithmSvg[Number(item.alertType)]

        const svgColor = this.algorithmColorList.find(alg => alg.id === Number(item.alertType))

        if (svg) {
          this.$set(item, 'svg', svg)
        } else {
          this.$set(item, 'svg', 'normal')
        }

        if (svgColor) {
          this.$set(item, 'svgColor', svgColor.color)
        } else {
          this.$set(item, 'svgColor', '#F51818')
        }
      })
    },
    blink() {
      setTimeout(() => {
        if (!this.isMouseIn) {
          this.realtime.data.forEach((item, index) => {
            if (index < this.newLength) {
              this.$set(item, 'style', {
                animation: 'backgroundBlink 0.6s linear 0s 2 alternate'
              })
            }
          })
          this.realtime.data.length = 20
        }
      }, 500)
    },
    openImageViewer(data) {
      const imageViewer = {
        show: true,
        imageList: deepClone(this.realtimeCache),
        infoDisplay: {
          alertName: '异常类型',
          name: '点位名称',
          createdAt: '时间'
        }
      }

      const activeData = this.realtimeCache.find(item => item.id === data.id)
      const activeDataIndex = this.realtimeCache.findIndex(item => item.id === data.id)

      activeData.imgIndex = activeDataIndex

      this.$store.dispatch('image/setImageViewer', { key: 'activeImg', value: deepClone(activeData) })
      this.$store.dispatch('image/assignImageViewer', imageViewer)
    },
    overRealtimeItem(e, data, type) {
      if (type === 'move') {
        !this.realtime.firstMoveInTime && (this.realtime.firstMoveInTime = Date.now())
        e && this.$set(this.realtime.picture, 'e', e)
        const pictureHover = false // this.realtime.picture.hover

        const style = {}
        if (this.realtime.picture.e) {
          style.top = this.realtime.picture.e.clientY - 60 - 135 - 8 + 'px'
          style.left = this.realtime.picture.e.clientX - 120 + 'px'
          if (style.left <= 0) {
            style.left = 0 + 'px'
          }
        }

        if (Date.now() - this.realtime.firstMoveInTime > 400 && !pictureHover) {
          this.$set(this.realtime.picture, 'pictureStyle', style)
          this.$set(this.realtime.picture, 'hover', true)
        }
      } else if (type === 'leave') {
        this.$set(this.realtime.picture, 'hover', false)
        this.realtime.firstMoveInTime = null
      } else if (type === 'enter') {
        this.$set(this.realtime.picture, 'picture', data.picture)
        setTimeout(() => {
          this.overRealtimeItem(null, data, 'move')
        }, 500)
      }
    },
    controlTimerAnimation(type) {
      this.isMouseIn = type

      const status = type ? 'paused' : 'running'

      this.realtime.style['animation-play-state'] = status
    },
    goAlgorithmLog() {
      this.$router.push({ name: 'AlgorithmLog' })
    },
    loadRealtimeLastData() {
      if (this.realtimeCache) {
        const newDate = this.realtimeCache.slice(this.realtime.data.length, this.realtime.data.length + 1)[0]
        this.realtime.data.push(newDate)
      }
    },
    handleBeforeEnter(el) {
      if (!this.isMouseIn) {
        el.style.transform = 'translateY(-' + this.newLength * 64 + 'px)'
      }
    },
    handleEnter(el, done) {
      if (!this.isMouseIn) {
        Velocity(el,
          { transform: '' },
          { complete: done },
          100 * this.newLength
        )
      }
    }
  }
}

