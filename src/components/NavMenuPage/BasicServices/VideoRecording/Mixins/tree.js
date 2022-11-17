import device from '@/api/device'

import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      currentNode: {},
      tree: ''
    }
  },
  computed: {
    ...mapGetters([
      'buttonScope'
    ])
  },
  watch: {

  },
  methods: {
    treeEvent(params) {
      switch (params.eName) {
        case 'node-click':
          this.clickNode(params.arg[0])
          break
        case 'loadNode':
          this.loadNode(params.arg[0], params.arg[1])
          break
        case 'nodeCollapse':
          this.handleNodeCollapse(...params.arg)
          break
        default:
      }
    },
    clickNode(currentNode) {
      this.searchValue = ''

      if (currentNode) {
        this.currentNode = currentNode
      } else {
        this.currentNode = this.tree.getCurrentNode()
      }

      this.tree.setCurrentKey(this.currentNode.groupId)

      this.activeTab = 'mpegts'

      if (this.isPoint) {
        this.setCameraRecordDetail()
      } else {
        this.dispose()
      }
    },
    searchCameraTree() {
      return new Promise((resolve, reject) => {
        this.treeLoading = true
        device.getCameraTree()
          .then(res => {
            const { treeData } = res.data

            this.treeOption.data = treeData
            this.treeLoading = false

            resolve()
          })
          .catch(() => {
            this.treeLoading = false

            reject()
          })
      })
    },
    async afterChangeNode(node) {
      await this.searchCameraTree(node)

      this.$nextTick(() => {
        this.clickNode()
      })
    },

    handleNodeCollapse(data, node) {
      this.resetLoadedNode(node)
    },
    resetLoadedNode(node) {
      if (node.level > 1) {
        node.loaded = false
      }
    },
    async loadNode(node, callback) {
      if (node.level === 0) return callback([])

      const defaultTreeData = deepClone(this.treeOption.data)
      const defaultNodeData = this.getNodeChildren(defaultTreeData, node.data.groupId, 'groupId')

      let resultData = []

      if (node.level === 1) {
        resultData = defaultNodeData ? deepClone(defaultNodeData) : []
      } else {
        const nodeCameraData = await this.getNodeCameraData(node)

        resultData = [...deepClone(defaultNodeData), ...deepClone(nodeCameraData)]
      }

      callback(resultData)
    },
    getNodeChildren(data, id, key) {
      const nodeKey = key ?? 'id'

      const resultData = []

      data.forEach(item => {
        if (item[nodeKey] === id && item.children) {
          resultData.push(...item.children)
        } else if (item.children) {
          resultData.push(...this.getNodeChildren(item.children, id, nodeKey))
        }
      })

      return resultData
    },
    getNodeCameraData(node) {
      return new Promise(resolve => {
        const params = {
          parentId: Number(node.data.groupId)
        }

        device.getCamerasRecordStatus(params)
          .then(res => {
            const { cameraList } = res.data

            cameraList.forEach(camera => {
              camera.label = camera.name
              camera.leaf = true

              camera.groupId = `${node.data.groupId}-${camera.id}`

              this.dealCameraRecordData(camera)
            })

            resolve(cameraList)
          })
          .catch(() => {
            resolve([])
          })
      })
    },
    dealCameraRecordData(camera) {
      camera.isStart = camera.isRecording ? 1 : 0
      camera.isCache = camera.hasRecordFile ? 1 : 0

      const headSvg = camera.isRecording ? 'video-line' : 'video-ban-line'
      camera.headSvg = {
        default: headSvg,
        isActive: headSvg
      }
      camera.headSvg.tooltip = `
        <div class="status-mark ${camera.status ? 'is-green' : 'is-red'} tooltip-status-block">
          <span class="tooltip-status-title" style="width: 82px">点位状态</span>
          <span class="has-text tooltip-status-content">${camera.status ? '在线' : '离线'}</span>
        </div>
        <div class="status-mark ${camera.isRecording ? 'is-green' : 'is-red'} tooltip-status-block">
          <span class="tooltip-status-title" style="width: 82px">录像开启</span>
          <span class="has-text tooltip-status-content">${camera.isRecording ? '已' : '未'}开启</span>
        </div>
        <div class="status-mark ${camera.hasRecordFile ? 'is-green' : 'is-red'} tooltip-status-block">
          <span class="tooltip-status-title" style="width: 82px">录像缓存</span>
          <span class="has-text tooltip-status-content">${camera.hasRecordFile ? '已' : '未'}缓存</span>
        </div>
      `
      camera.svg = camera.hasRecordFile ? 'video-cache-line' : null

      camera.streamUrl = camera.streamUrl ?? ''
      camera.record = []

      camera.cameraRecords && camera.cameraRecords.forEach(record => {
        camera.record.push({
          id: record.id,
          start: record.startTime,
          duration: record.timeLen,
          url: record.url,
          snapUrl: record.snapUrl,
          isH265: record.isH265
        })
      })
    }
  }
}
