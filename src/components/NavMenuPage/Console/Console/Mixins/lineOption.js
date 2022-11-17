import { deepClone } from '@/utils'
// import configuration from '@/setting'

export default {
  data() {
    return {
      alarmStatisticsOption: {
        // value: 1,
        // radio: [
        //   {
        //     label: '全时折线',
        //     value: 0
        //   },
        //   {
        //     label: '分时折线',
        //     value: 1
        //   }
        // ],
        // disabled: false,
        tip: '条/天',
        slider: 100
      },
      firstLineColor: ['#4141DB', '#F54949', '#3AC2A0', '#F5CA49', '#4EC213', '#DB41C2'],
      secondLineColor: ['#4141DB', '#F58249', '#F54949', '#3AC2A0', '#4983F5', '#F5CA49', '#4EC213', '#8349F5', '#DB41C2', '#DB5716', '#CC1414', '#A87611'],
      alarmStatisticsStandardTimeLine: {
        option: {
          tooltip: {
            trigger: 'axis',
            extraCssText: 'top: 0',
            appendToBody: true,
            className: 'console-alarm-line-tooltip',
            enterable: true
          },
          legend: {
            type: 'scroll',
            width: '50%',
            icon: 'roundRect',
            left: 'center',
            bottom: 0,
            itemGap: 40,
            itemWidth: 8,
            itemHeight: 8,
            inactiveBorderColor: '#fff',
            selected: {}
          },
          grid: {
            left: 48,
            right: 48,
            top: 20,
            bottom: 40,
            containLabel: true
          },
          xAxis: {
            boundaryGap: false,
            axisTick: {
              show: true
            },
            axisLabel: {
              interval: 'auto',
              formatter: (value, index) => { return this.changeXAxis(value, index) }
            },
            data: []
          },
          yAxis: {
            type: 'value'
          },
          series: []
        }
      },
      lineLegendSelected: {},
      lineMonthTimeData: [],
      lineMonthAlarmData: []
    }
  },
  watch: {
    'alarmStatisticsStandardTimeLine.option.series': {
      handler(val) {
        if (val) {
          this.alarmStatisticsStandardTimeLine.option.color = val.length < 7 ? this.firstLineColor : this.secondLineColor
        }
      },
      immediate: true
    },
    lineLegendSelected: {
      handler(val) {
        this.alarmStatisticsStandardTimeLine.option.legend.selected = val
      },
      deep: true
    }
  },
  methods: {
    showTimeTooltip(value) {
      let tooltip = '天'
      switch (value) {
        case 0:
          tooltip = '年'
          break
        case 20:
          tooltip = '季度'
          break
        case 40:
          tooltip = '月'
          break
        case 60:
          tooltip = '当月'
          break
        case 80:
          tooltip = '15天'
          break
        case 100:
          tooltip = '天'
          break
        default:
          break
      }
      return tooltip
    },
    alarmStatisticsData() {
      this.alarmStatisticsStandardTimeLine.ref = 'alarmStatisticsStandardTimeLine'
    },
    handleChartFun(arg) {
      this.lineLegendSelected = deepClone(arg.params.selected)
    }
    // changeLineType(value) {
    //   if (value) {
    //     this.alarmStatisticsOption.disabled = false
    //     this.sliderTimeLine(this.alarmStatisticsOption.slider)
    //   } else {
    //     this.alarmStatisticsOption.disabled = true
    //     this.sliderTimeLine(200)
    //   }
    // }
  }
}

