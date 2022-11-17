import device from '@/api/device'
import task from '@/api/task'

export default {
  data() {
    return {
      clusterLoading: false
    }
  },
  methods: {
    getNodeServicePie(node, type) {
      if (!type) {
        this.clusterLoading = true
      }

      device.getNodeServiceStatus({ nodeId: node.id })
        .then(res => {
          const { data } = res

          this.calculateServicePie.option.series[0].data[0].value = data.serviceStatus.free
          this.calculateServicePie.option.series[0].data[1].value = data.serviceStatus.lock
          this.calculateServicePie.option.series[0].data[2].value = data.serviceStatus.run
          this.calculateServicePie.option.series[0].data[3].value = data.serviceStatus.offline

          this.calculateServicePie.option.legend.formatter = function(name) {
            return [
              '{text|' + name + '}',
              '{value|' + [data.serviceStatus.free, data.serviceStatus.lock, data.serviceStatus.run, data.serviceStatus.offline][['可用服务', '锁定服务', '运行中服务', '离线服务'].indexOf(name)] + '}'
            ].join('')
          }

          this.clusterLoading = false

          this.$set(this.calculateServicePie, 'change', Date.now())

          const statusList = [
            {
              svg: 'cpu',
              name: 'CPU状态',
              percentage: Number(data.machineStatus.cpu.toFixed(0))
            },
            {
              svg: 'ram',
              name: '内存占用',
              percentage: Number(data.machineStatus.memory.toFixed(0))
            }
          ]

          this.statusList = statusList
        })
        .catch(() => {
          this.clusterLoading = false
        })
    },
    getTaskRunStatus() {
      task.taskStatus()
        .then(res => {
          const { data } = res

          this.taskActivatingStatusPie.option.series[0].data.forEach((item, index) => {
            item.value = data.taskRunningState.find(task => task.status === index).count
          })

          this.taskActivatingStatusPie.option.legend.formatter = function(name) {
            return [
              '{text|' + name + '}',
              '{value|' + data.taskRunningState[['已停用', '已启用', '启用中', '停用中', '待机中'].indexOf(name)].count + '}'
            ].join('')
          }

          this.$set(this.taskActivatingStatusPie, 'change', Date.now())

          this.taskActivatedStatusBar.option.series.forEach((item, index) => {
            item.data[0].value = data.taskHealth.find(task => task.status === index).count
          })

          this.$set(this.taskActivatedStatusBar, 'change', Date.now())
        })
    }
  }
}

