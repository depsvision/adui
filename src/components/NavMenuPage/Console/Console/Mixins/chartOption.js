import { deepClone } from '@/utils'

export default {
  data() {
    return {
      calculateServicePie: {},
      taskActivatingStatusPie: {},
      taskActivatedStatusBar: {
        option: {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            left: 'center',
            bottom: '0',
            padding: 0,
            itemGap: 16,
            itemWidth: 8,
            itemHeight: 8,
            inactiveBorderColor: '#fff'
          },
          grid: {
            left: '0',
            right: '0',
            bottom: '52px',
            containLabel: true
          },
          xAxis: {
            show: false,
            type: 'value'
          },
          yAxis: {
            show: false,
            type: 'category'
          },
          series: [
            {
              name: '异常',
              type: 'bar',
              stack: 'total',
              barWidth: 18,
              itemStyle: {
                color: 'rgba(255, 58, 51, 1)',
                borderRadius: 3,
                borderColor: '#fff',
                borderWidth: 1
              },
              emphasis: {
                focus: 'series'
              },
              data: [{ value: 0, name: '异常' }]
            },
            {
              name: '正常',
              type: 'bar',
              stack: 'total',
              barWidth: 18,
              itemStyle: {
                color: 'rgba(106, 77, 255, 1)',
                borderRadius: 3,
                borderColor: '#fff',
                borderWidth: 1
              },
              emphasis: {
                focus: 'series'
              },
              data: [{ value: 0, name: '正常' }]
            },
            {
              name: '注意',
              type: 'bar',
              stack: 'total',
              barWidth: 18,
              itemStyle: {
                color: 'rgba(255, 217, 102, 1)',
                borderRadius: 3,
                borderColor: '#fff',
                borderWidth: 1
              },
              emphasis: {
                focus: 'series'
              },
              data: [{ value: 0, name: '注意' }]
            }
          ]
        }
      },
      commonPieOption: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          // orient: 'vertical',
          bottom: 'center',
          padding: 0,
          itemGap: 8,
          itemWidth: 8,
          itemHeight: 8,
          inactiveBorderColor: '#fff',
          formatter: function(name) {
            return [].join('')
          },
          textStyle: {
            color: 'rgba(14, 27, 46, .7)',
            rich: {
              text: {
                width: 45,
                align: 'left'
              },
              value: {
                width: 35,
                align: 'right'
              }
            }
          }
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['40%', '80%'],
            center: ['26%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 6,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false
            },
            emphasis: {
              focus: 'data',
              label: {
                show: false
              }
            },
            data: []
          }
        ]
      }
    }
  },
  methods: {
    getCalculateServiceData() {
      this.calculateServicePie.ref = 'calculateServicePie'
      this.calculateServicePie.option = deepClone(this.commonPieOption)
      this.calculateServicePie.option.legend.left = '60%'
      this.calculateServicePie.option.series[0].data = [
        { value: 0, name: '可用服务', itemStyle: {}},
        { value: 0, name: '锁定服务', itemStyle: {}},
        { value: 0, name: '运行中服务', itemStyle: {}},
        { value: 0, name: '离线服务', itemStyle: {}}
      ]
      this.calculateServicePie.option.series[0].radius = ['32%', '68%']
      this.calculateServicePie.option.series[0].center = ['30%', '50%']
    },
    taskActivatingStatusData() {
      const pieColor = ['#C3C2CC', '#6A4DFF', '#AA99FF', '#3F3380', '#776BB3']
      this.taskActivatingStatusPie.ref = 'taskActivatingStatusPie'
      this.taskActivatingStatusPie.option = deepClone(this.commonPieOption)
      this.taskActivatingStatusPie.option.legend.height = 80
      this.taskActivatingStatusPie.option.legend.left = '60%'
      this.taskActivatingStatusPie.option.series[0].data = [
        { value: 0, name: '已停用', itemStyle: {}},
        { value: 0, name: '已启用', itemStyle: {}},
        { value: 0, name: '启用中', itemStyle: {}},
        { value: 0, name: '停用中', itemStyle: {}},
        { value: 0, name: '待机中', itemStyle: {}}
      ]
      this.taskActivatingStatusPie.option.series[0].data.forEach((item, index) => {
        item.itemStyle.color = pieColor[index]
      })
    },
    taskActivatedStatusData() {
      this.taskActivatedStatusBar.ref = 'taskActivatedStatusPie'
    }
  }
}

