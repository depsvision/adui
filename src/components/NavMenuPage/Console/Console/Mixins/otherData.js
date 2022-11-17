import device from '@/api/device'

export default {
  data() {
    return {}
  },
  methods: {
    getClusterNode(node) {
      device.getMasterNodes()
        .then(res => {
          const { nodeList } = res.data

          nodeList.forEach(item => {
            item.statusName = ['离线', '在线'][item.status]
            item.svg = ['webcam-offline', 'node'][item.status]
          })

          this.nodeList = nodeList

          this.nodeList.unshift(this.masterNode)

          if (node) {
            this.changeNode(node, true)
          } else {
            this.changeNode(this.masterNode, false, true)
          }
        })
    },
    getMasterStatus() {
      device.getMasterStatus()
        .then(res => {
          const { data } = res
          this.statusList[0].percentage = Math.floor(data.master.cpu)
          this.statusList[1].percentage = Math.floor((data.master.memory.block - data.master.memory.available) / data.master.memory.block * 100)
          this.statusList[2].percentage = Math.floor((data.master.disk.block - data.master.disk.available) / data.master.disk.block * 100)
        })
    },
    getCameraPointStatus() {
      device.getCameraStatus()
        .then(res => {
          const { data } = res
          this.webcamPoint.online.end = data.count.online
          this.webcamPoint.offline.end = data.count.offline
          this.$refs.online.start()
          this.$refs.offline.start()

          setTimeout(() => {
            this.webcamPoint.online.start = this.webcamPoint.online.end
            this.webcamPoint.offline.start = this.webcamPoint.offline.end
          }, 3500)

          // pieData
          this.getTaskRunStatus()
        })
    }
  }
}

