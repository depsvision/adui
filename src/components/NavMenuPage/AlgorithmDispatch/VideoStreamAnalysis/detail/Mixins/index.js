import task from '@/api/task'

import configuration from '@/setting'

import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      taskData: null,
      taskTimer: null
    }
  },
  computed: {
    ...mapGetters([
      'button'
    ])
  },
  watch: {
    'button.value'(val) {
      this.clickButton(val)
    }
  },
  methods: {
    clickButton(value) {
      switch (value) {
        case 'deleteTask':
          this.deleteTask()
          break
        default:
      }
    },
    getTaskDetail(notRotation) {
      task.getTaskDetail({ taskId: this.$route.query.id })
        .then(res => {
          const { data } = res

          this.taskData = data

          this.assignTaskData(notRotation)

          this.pageLoading = false
        })
        .catch(() => {
          this.pageLoading = false
        })
    },
    deleteTask() {
      this.$prompt('请输入“任务名称”以确认删除，该操作无法撤销，请确认自己的操作符合预期', '删除任务', {
        confirmButtonText: '删除',
        confirmButtonClass: 'is-danger',
        dangerouslyUseHTMLString: true,
        cancelButtonText: '取消',
        customClass: 'dialog--mini',
        inputValidator: (string) => {
          if (string.trim() !== this.taskData.name) {
            return '输入内容与任务名称不一致'
          } else {
            return true
          }
        },
        inputPlaceholder: '输入 “任务名称” 以确认删除'
      }).then(async() => {
        task.taskRemove({ taskId: Number(this.$route.query.id) })
          .then(res => {
            this.$messageInfo({
              type: 'success',
              message: '删除成功！'
            })

            this.$router.push({ name: 'VideoStreamAnalysis' })
          })
      })
    },
    assignTaskData(notRotation) {
      if (!this.taskData) return

      this.assignBasicInformation()

      this.assignOperationManagement()

      this.assignAlgorithmPoint()

      this.assignAnalysisConfiguration()

      this.assignIntelligentComputingNode()

      this.assignOpenAbility()

      if (!notRotation) {
        this.assignDemoVideoStream()

        this.assignVideoClip()

        this.assignAlgorithmLog()
      }

      if (!this.taskTimer) {
        this.taskTimer = setInterval(() => {
          this.getTaskDetail(true)
        }, 6000)
      }
    },
    assignBasicInformation() {
      const formListOption = this.$refs.basicInformation.formListOption
      formListOption.data.name = this.taskData.name
      formListOption.data.id = this.taskData.id
    },
    assignOperationManagement() {
      const formListOption = this.$refs.operationManagement.formListOption
      formListOption.data.serviceId = this.taskData.service.id
      formListOption.data.runningStatus = this.taskData.runningStatus
      formListOption.data.runningStatusName = ['已停用', '已启用', '启用中', '停用中', '待机中'][this.taskData.runningStatus]
      formListOption.form[0].class = 'small-buttons status-mark' + [' is-grey', ' is-blue', ' is-yellow', ' is-orange', ' is-green'][this.taskData.runningStatus]
      formListOption.form[0].buttons.buttons[0].label = ['启用', '停用', '停用', '停用', '停用'][this.taskData.runningStatus]
      formListOption.form[0].buttons.buttons[0].value = ['editTaskStatus', 'stopTaskStatus', 'stopTaskStatus', 'stopTaskStatus', 'stopTaskStatus'][this.taskData.runningStatus]

      formListOption.data.enableTime = this.taskData.enableTime
      formListOption.data.enableTimeValue = this.taskData.enableTime ? 1 : 0
      formListOption.data.enableTimeName = this.taskData.enableTime ? '自定义时间段' : '7 x 24小时'
      formListOption.data.weekday = this.taskData.enableTime ? this.taskData.enableTime.weekday : []
      formListOption.data.time = this.taskData.enableTime ? this.taskData.enableTime.time : [[]]

      formListOption.data.healthStatusName = ['异常', '正常', '注意'][this.taskData.healthStatus] || '无'
      formListOption.form[2].class = 'small-buttons status-mark' + ([' is-red', ' is-green', ' is-orange'][this.taskData.healthStatus] || ' is-grey')
      formListOption.form[2].buttons.buttons[0].disabled = this.taskData.healthStatus === undefined

      // formListOption.data.health = this.taskData.health
      // formListOption.data.degree = this.taskData.health.degree
      // formListOption.data.healthName = ['宽松', '常规'][this.taskData.health.degree] +
      //                                 ' ( 检查间隔==' + this.taskData.health.interval + ' min, ' +
      //                                 '检查服务离线次数==' + this.taskData.health.healOffCheckTimes +
      //                                 ', 检查服务异常次数==' + this.taskData.health.checkTimes +
      //                                 ' )'

      formListOption.data.configUpdate = this.taskData.delivery.configUpdate || '一'
      const compare = this.$dayjs(this.taskData.delivery.configUpdate, 'YYYY-MM-DD HH:mm:ss').isBefore(this.$dayjs(this.taskData.delivery.deliveryTime, 'YYYY-MM-DD HH:mm:ss'))
      const isEqual = this.taskData.delivery.configUpdate !== '' && this.taskData.delivery.configUpdate === this.taskData.delivery.deliveryTime
      if (this.taskData.delivery.configUpdate === '') {
        formListOption.data.configIssue = '一'
        formListOption.data.issueNew = '一'
      } else {
        formListOption.data.configIssue = (isEqual || compare) ? '已下发最新配置' : '未下发最新配置'
        formListOption.data.issueNew = (isEqual || compare) ? '是' : '否 ( 在非运行时段将自动下发，您也可以手动下发以确保最新配置，但该操作需要先停止任务 )'
      }

      formListOption.data.running = ['否', '是'][this.taskData.delivery.running] || '一'
      formListOption.data.deliveryTime = this.taskData.delivery.deliveryTime || '一'
      formListOption.data.success = ['否', '是'][this.taskData.delivery.success] || '一'
      formListOption.data.mode = ['', '自动下发', '手动下发'][this.taskData.delivery.mode] || '一'
    },
    assignAlgorithmPoint() {
      const algorithmPoint = this.$refs.algorithmPoint.algorithmPoint

      const formListOption = this.$refs.algorithmPoint.formListOption

      formListOption.data.algorithmGroup = []

      algorithmPoint.data.algorithmPoint = !this.taskData.config.taskList.length ? '无' : ''
      this.taskData.config.taskList.forEach(item => {
        algorithmPoint.data.algorithmPoint += item.name + ' ( ' + item.configList.length + ' ) ;'
        formListOption.data.algorithmGroup.push(item)
      })

      formListOption.data.enhancementAlgorithmGroup = this.taskData.material.algorithmId !== null ? [
        {
          label: this.taskData.material.algorithmName,
          id: this.taskData.material.algorithmId,
          tagSvg: configuration.algorithmSvg[this.taskData.material.algorithmId] || 'normal',
          tagColor: 'blue',
          nodeKey: 'id',
          tagType: 'node'
        }
      ] : []

      formListOption.data.materialGroup = this.taskData.material.id !== null ? [
        {
          label: this.taskData.material.name,
          id: this.taskData.material.id,
          tagSvg: 'file-1-line',
          tagColor: 'blue',
          nodeKey: 'id',
          tagType: 'node'
        }
      ] : []
    },
    assignAlgorithmLog() {
      const algorithmLog = this.$refs.algorithmLog

      algorithmLog.algorithm = []

      this.taskData.config.taskList.forEach(item => {
        algorithmLog.algorithm.push({
          label: item.name,
          value: item.taskId
        })
      })

      const filterCondition = []
      const usedAlgorithmId = []

      if (this.taskData.log) {
        this.taskData.log.forEach((item) => {
          item.algorithm.forEach(alId => {
            const findAlgorithm = algorithmLog.algorithm.find(f => f.value === alId)

            if (findAlgorithm) {
              usedAlgorithmId.push(alId)
            }
          })
        })
      }

      algorithmLog.unusedAlgorithm = algorithmLog.algorithm.filter(item => !usedAlgorithmId.includes(item.value))

      if (this.taskData.log) {
        this.taskData.log.forEach((item, itemIndex) => {
          filterCondition.push(deepClone(algorithmLog.filterConditionTemplate))
          filterCondition[itemIndex].id = item.id
          filterCondition[itemIndex].head.name = item.name

          const algorithm = filterCondition[itemIndex].condition.algorithm
          algorithm.content.popover.option = algorithmLog.unusedAlgorithm

          item.algorithm.forEach(alId => {
            const findAlgorithm = algorithmLog.algorithm.find(f => f.value === alId)

            if (findAlgorithm) {
              algorithm.content.algorithmTag.push({
                parentId: item.id,
                id: findAlgorithm.value,
                label: findAlgorithm.label,
                value: findAlgorithm.value + findAlgorithm.label,
                class: 'tag-grey'
              })
            }
          })

          const rule = filterCondition[itemIndex].condition.rule
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

          const judgment = filterCondition[itemIndex].condition.judgment
          judgment.input[0].value = item.interval
          judgment.input[0].lastValue = item.interval
          judgment.input[1].value = item.count
          judgment.input[1].lastValue = item.count
        })
      }

      algorithmLog.filterCondition = filterCondition
    },
    assignAnalysisConfiguration() {
      const analysisConfiguration = this.$refs.analysisConfiguration.analysisConfiguration

      analysisConfiguration.data.interval = this.taskData.analysis.interval
      analysisConfiguration.data.analysisInterval = this.taskData.analysis.interval + ' s'
    },
    assignIntelligentComputingNode() {
      const formListOption = this.$refs.intelligentComputingNode.formListOption

      formListOption.data.id = this.taskData.service.id
      formListOption.data.autoSchedule = [false, true][this.taskData.service.autoSchedule]
      // formListOption.form[0].switchTip = ['', '自动调度已开启，将为您自动选择可用节点'][this.taskData.service.autoSchedule]

      formListOption.data.service = this.taskData.service
      if (this.taskData.service.ip) {
        formListOption.data.taskNode = ['', '自动 ( '][this.taskData.service.autoSchedule] +
                                      this.taskData.service.name +
                                      '-' +
                                      this.taskData.service.id +
                                      ['', ' )'][this.taskData.service.autoSchedule]
      } else {
        formListOption.data.taskNode = '无'
      }
      formListOption.form[0].buttons.buttons[0].disabled = !!this.taskData.runningStatus

      formListOption.data.status = this.taskData.service.status || '无'
      formListOption.form[1].class = 'status-mark' + ([' is-green', ' is-grey', ' is-blue', ' is-orange'][['run', 'stop', 'starting', 'ending'].indexOf(this.taskData.service.status)] || ' is-grey')

      formListOption.data.health = ['异常', '正常', '注意'][this.taskData.service.health] || '无'
      formListOption.form[2].class = 'small-buttons status-mark' + ([' is-red', ' is-green', ' is-orange'][this.taskData.service.health] || ' is-grey')
      formListOption.form[2].buttons.buttons[0].disabled = !(this.taskData.service.health !== undefined)
    },
    assignOpenAbility() {
      const callbackPush = this.$refs.openAbility.callbackPush

      const contentObj = {
        1: '结果数据',
        2: '原始图片',
        4: '绘制结果图片'
      }

      this.taskData.open.callback.forEach(item => {
        item.addressStatusName = ['离线', '在线'][item.addressStatus]
        item.recentStatusName = ['失败', '成功'][item.recentStatus] || '无'
        item.recentStatusName += item.recentStatus !== undefined ? (' ' + item.recentTime) : ''
        item.addressStatusNameClass = [' is-grey', ' is-green'][item.addressStatus]
        item.recentStatusNameClass = [' is-grey', ' is-green'][item.recentStatus] || ' is-grey'
        item.pushInterval = item.interval + ' s'
        item.contentArr = [1, 2, 4].filter(con => (con & item.content) === con)
        item.pushContent = !item.contentArr.length ? '无' : ''
        item.contentArr.forEach((con, index) => {
          item.pushContent += (index === 0 ? '' : ', ') + contentObj[con]
        })

        if ((item.content & 8) === 8) {
          item.alarmVideoClip = true
          item.alarmVideoClipRadio = 1
          item.alarmVideoClipStatus = '发送本地文件路径'
        } else if ((item.content & 8) === 8) {
          item.alarmVideoClip = true
          item.alarmVideoClipRadio = 2
          item.alarmVideoClipStatus = '发送视频文件'
        } else {
          item.alarmVideoClip = false
          item.alarmVideoClipStatus = '关'
        }
      })

      callbackPush.tableData = this.taskData.open.callback
    },

    assignDemoVideoStream() {
      const demoVideoStream = this.$refs.openAbility.demoVideoStream

      this.taskData.open.videoPush.forEach(item => {
        item.openPushStatus = !!item.openPush
        item.forwardLength = item.forward.urlList.length
        item.disabled = item.openPush && item.url ? [] : ['view']
        item.forwardSwitch = !!item.forward.switch
        item.forwardUrlList = item.forward.urlList
      })

      demoVideoStream.tableData = deepClone(this.taskData.open.videoPush)
      demoVideoStream.cacheData = demoVideoStream.tableData.slice(0, demoVideoStream.pager.pageSizes)
      demoVideoStream.pager.currentPage = 1
      demoVideoStream.pager.total = demoVideoStream.tableData.length || 0
    },

    assignVideoClip() {
      const alarmVideoClip = this.$refs.openAbility.alarmVideoClip

      alarmVideoClip.data.startStatus = !!this.taskData.open.record.enable
      alarmVideoClip.data.minInterval = this.taskData.open.record.interval
      alarmVideoClip.data.recordDuration = {
        left: -this.taskData.open.record.before,
        right: this.taskData.open.record.duration
      }

      const form = alarmVideoClip.form
      form[1].disabled = !!this.taskData.runningStatus
      form[2].disabled = !!this.taskData.runningStatus
      form[3].left.disabled = !!this.taskData.runningStatus
      form[3].right.disabled = !!this.taskData.runningStatus

      const lastVideoClipValue = this.$refs.openAbility.lastVideoClipValue
      lastVideoClipValue.minInterval = this.taskData.open.record.interval
      lastVideoClipValue.recordDuration = {
        left: -this.taskData.open.record.before,
        right: this.taskData.open.record.duration
      }
    }
  }
}
