import log from '@/api/log'
import { deepClone } from '@/utils'

export default {
  data() {
    return {
      algorithmList: [],
      algorithmColorList: [],
      simulationLineData: [],
      commonLineSeries: {
        id: -1,
        name: '',
        type: 'line',
        smooth: true,
        symbol: 'none',
        emphasis: {
          focus: 'data'
        },
        itemStyle: {
          color: obj => {
            obj
          }
        },
        data: []
      }
    }
  },
  methods: {
    getLineData() {
      log.getAlarmStatisticsData()
        .then(res => {
          const { data } = res
          this.simulationLineData = data.res

          this.algorithmList = data.res[0].slice(1, data.res[0].length)

          this.setLineOption()

          this.sliderTimeLine(100)
        })
    },
    setLineOption() {
      const that = this

      const lineSeries = []
      this.algorithmColorList = []
      this.algorithmList.forEach(item => {
        const series = deepClone(this.commonLineSeries)
        series.id = item[0]
        series.name = item[1]
        series.itemStyle.color = function(obj) {
          if (!that.algorithmColorList.find(item => item.id === Number(obj.seriesId))) {
            that.algorithmColorList.push({
              id: Number(obj.seriesId),
              color: obj.color
            })
          }
        }
        lineSeries.push(series)
      })

      this.getRealTimeData()

      this.alarmStatisticsStandardTimeLine.option.series = lineSeries

      this.alarmStatisticsStandardTimeLine['change'] = Date.now()

      const allDate = []

      this.simulationLineData.forEach(item => {
        allDate.push(item[0])
      })

      this.lineMonthTimeData = [...new Set(deepClone(allDate).map(item => item[0] + ',' + item[1]))].map(item => item.split(',').map(str => Number(str)))

      this.lineMonthTimeData.sort((a, b) => {
        if (a[0] === b[0]) {
          return a[1] - b[1]
        } else {
          return a[0] - b[0]
        }
      })

      this.lineMonthAlarmData = []
      this.lineMonthTimeData.forEach((item, index) => {
        !this.lineMonthAlarmData[index] && (this.lineMonthAlarmData[index] = [])
        this.lineMonthAlarmData[index][0] = item
        this.alarmStatisticsStandardTimeLine.option.series.forEach((data, dataIndex) => {
          this.lineMonthAlarmData[index][dataIndex + 1] = this.simulationLineData.filter(all => {
            return all[0].slice(0, 2).join('-') === item.join('-')
          }).reduce((total, num) => {
            return total + num[dataIndex + 1][2]
          }, 0)
        })
      })
    },
    sliderTimeLine(value) {
      this.alarmStatisticsStandardTimeLine.option.xAxis.axisTick.show = true
      this.alarmStatisticsStandardTimeLine.option.xAxis.axisLabel.interval = 'auto'
      switch (value) {
        case 100:
          this.dealType = 'day'
          this.dealLineDay(7)
          this.alarmStatisticsOption.tip = '条/天'
          break
        case 80:
          this.dealType = 'day'
          this.dealLineDay(15)
          this.alarmStatisticsOption.tip = '条/天'
          break
        case 60:
          this.dealType = 'day'
          this.dealLineDay(0, true)
          this.alarmStatisticsOption.tip = '条/天'
          break
        case 40:
          this.dealType = 'month'
          this.dealLineDay(12)
          this.alarmStatisticsOption.tip = '条/月'
          break
        case 20:
          this.alarmStatisticsStandardTimeLine.option.xAxis.axisTick.show = false
          this.alarmStatisticsStandardTimeLine.option.xAxis.axisLabel.interval = 0
          this.dealLineQuarterly()
          this.alarmStatisticsOption.tip = '条/月'
          break
        case 0:
          this.alarmStatisticsStandardTimeLine.option.xAxis.axisTick.show = false
          this.alarmStatisticsStandardTimeLine.option.xAxis.axisLabel.interval = 0
          this.dealLineYear()
          this.alarmStatisticsOption.tip = '条/月'
          break
        default:
      }
      this.alarmStatisticsStandardTimeLine['change'] = Date.now()

      this.$nextTick(() => {
        // const lineSlider = this.$refs.lineSlider

        // lineSlider.$refs.button1.hideTooltip()
      })
    },
    dealLineDay(time, current) {
      const currentDay = current ? this.$dayjs().date() : null

      const xData = []
      for (let i = currentDay || time; i > 0; i--) {
        if (this.dealType === 'day') {
          xData.push(this.$dayjs().subtract(i - 1, 'd').format('YYYY-M-D'))
        } else if (this.dealType === 'month') {
          xData.push(this.$dayjs().subtract(i - 1, 'M').format('YYYY-M'))
        }
      }
      this.alarmStatisticsStandardTimeLine.option.xAxis.data = xData

      let allData = []
      if (this.dealType === 'day') {
        allData = this.simulationLineData
      } else {
        allData = this.lineMonthAlarmData
      }

      const seriescacheData = []

      xData.forEach(item => {
        const hasX = allData.find(series => {
          return series[0].join('-') === item
        })
        if (hasX) {
          seriescacheData.push(hasX)
        } else {
          const zeroData = []
          zeroData[0] = item.split('-').map(time => Number(time))
          this.algorithmList.forEach(alg => {
            if (this.dealType === 'day') {
              zeroData.push([alg[0], alg[1], 0])
            } else {
              zeroData.push(0)
            }
          })
          seriescacheData.push(zeroData)
        }
      })

      const seriesData = []
      seriescacheData.forEach(item => {
        item.forEach((data, index) => {
          let pushData = data
          this.dealType === 'day' && (pushData = data[2])
          if (index) {
            !seriesData[index - 1] && (seriesData[index - 1] = [])
            seriesData[index - 1].push(pushData)
          }
        })
      })

      this.alarmStatisticsStandardTimeLine.option.series.forEach((item, index) => {
        item.data = seriesData[index]
      })
    },
    dealLineQuarterly() {
      const timeData = deepClone(this.lineMonthTimeData)
      const currentYear = this.$dayjs().year()
      const currentMonth = this.$dayjs().month()
      const currentQuarterly = Math.ceil(currentMonth / 3)
      const moreThanYear = 6 - currentQuarterly > 4 ? 2 : 1

      const xData = timeData.filter(item => {
        if (item[0] === currentYear) {
          return true
        } else if (item[0] === currentYear - 1) {
          if (moreThanYear === 1) {
            return item[1] > 12 - (6 - currentQuarterly) * 3
          } else {
            return true
          }
        } else {
          return moreThanYear === 2 ? item[1] > 9 : false
        }
      })

      this.alarmStatisticsStandardTimeLine.option.xAxis.data = xData.map(item => {
        return item[0] + '-' + item[1]
      })

      const seriescacheData = []
      xData.forEach(item => {
        seriescacheData.push(this.lineMonthAlarmData.find(series => {
          return series[0].join('-') === item.join('-')
        }))
      })

      const seriesData = []
      seriescacheData.forEach(item => {
        item.forEach((data, index) => {
          if (index) {
            !seriesData[index - 1] && (seriesData[index - 1] = [])
            seriesData[index - 1].push(data)
          }
        })
      })

      this.alarmStatisticsStandardTimeLine.option.series.forEach((item, index) => {
        item.data = seriesData[index]
      })
    },
    dealLineYear() {
      const xData = deepClone(this.lineMonthTimeData)
      this.alarmStatisticsStandardTimeLine.option.xAxis.data = xData

      this.alarmStatisticsStandardTimeLine.option.xAxis.data = xData.map(item => {
        return item[0] + '-' + item[1]
      })

      const seriescacheData = []
      xData.forEach(item => {
        seriescacheData.push(this.lineMonthAlarmData.find(series => {
          return series[0].join('-') === item.join('-')
        }))
      })

      const seriesData = []
      seriescacheData.forEach(item => {
        item.forEach((data, index) => {
          if (index) {
            !seriesData[index - 1] && (seriesData[index - 1] = [])
            seriesData[index - 1].push(data)
          }
        })
      })

      this.alarmStatisticsStandardTimeLine.option.series.forEach((item, index) => {
        item.data = seriesData[index]
      })
    },
    dealLineAll() {
      const xData = []
      const lineAlarmData = []

      this.alarmStatisticsStandardTimeLine.option.series.forEach(item => {
        lineAlarmData.push([])
      })

      this.simulationLineData.forEach(item => {
        xData.push(item[0])
        item.forEach((data, index) => {
          index !== 0 && lineAlarmData[index - 1].push(data[2])
        })
      })
      this.alarmStatisticsStandardTimeLine.option.xAxis.data = xData

      this.alarmStatisticsStandardTimeLine.option.series.forEach((item, index) => {
        item.data = deepClone(lineAlarmData[index])
      })
    },
    changeXAxis(value, index) {
      let xAxis = value
      switch (this.alarmStatisticsOption.slider) {
        case 40:
          xAxis = this.dealLineMonthXAxis(value)
          break
        case 20:
          xAxis = this.dealLineQuarterlyXAxis(value)
          break
        case 0:
          xAxis = this.dealLineYearXAxis(value, index)
          break
        default:
      }

      return xAxis
    },
    dealLineMonthXAxis(value) {
      const xAxis = value.split('-')

      return xAxis[0] + '年 ' + xAxis[1] + '月'
    },
    dealLineQuarterlyXAxis(value) {
      const xAxis = value.split('-')

      if (xAxis[1] === '1') {
        return xAxis[0] + '年 ' + '1季度'
      } else if (xAxis[1] === '4') {
        return xAxis[0] + '年 ' + '2季度'
      } else if (xAxis[1] === '7') {
        return xAxis[0] + '年 ' + '3季度'
      } else if (xAxis[1] === '10') {
        return xAxis[0] + '年 ' + '4季度'
      }
    },
    dealLineYearXAxis(value, index) {
      const xAxis = value.split('-')

      if (xAxis[1] === '1') {
        return xAxis[0] + '年 '
      } else if ((index === 0 || index === this.lineMonthTimeData.length - 1) && xAxis[1] !== '2' && xAxis[1] !== '12') {
        return value
      }
    }
  }
}

