import task from '@/api/task'

import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      linkageData: null
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
        case 'deleteLinkage':
          this.deleteLinkage()
          break
        default:
      }
    },
    getLinkageDetail() {
      task.getAlgorithmLinkageDetail({ id: this.$route.query.id })
        .then(res => {
          const { data } = res

          this.linkageData = data

          this.assignlinkageData()

          this.pageLoading = false
        })
        .catch(() => {
          this.pageLoading = false
        })
    },
    deleteLinkage() {
      this.$prompt('请输入“任务名称”以确认删除，该操作无法撤销，请确认自己的操作符合预期', '删除任务', {
        confirmButtonText: '删除',
        confirmButtonClass: 'is-danger',
        cancelButtonText: '取消',
        customClass: 'dialog--mini',
        inputValidator: (string) => {
          if (string.trim() !== this.linkageData.name) {
            return '输入内容与任务名称不一致'
          } else {
            return true
          }
        },
        inputPlaceholder: '输入 “任务名称” 以确认删除'
      }).then(async() => {
        task.deleteAlgorithmLinkage({ id: Number(this.$route.query.id) })
          .then(res => {
            this.$messageInfo({
              type: 'success',
              message: '删除成功！'
            })

            this.$router.push({ name: 'AlgorithmLinkage' })
          })
      })
    },
    assignlinkageData() {
      if (!this.linkageData) return

      this.assignBasicInformation()

      this.assignAlgorithmLinkage()

      this.assignLinkageOutput()
    },
    assignBasicInformation() {
      const formListOption = this.$refs.basicInformation.formListOption

      formListOption.data.name = this.linkageData.name
      formListOption.data.id = this.linkageData.id
      formListOption.data.status = this.linkageData.status
      formListOption.data.statusName = ['已停用', '已启用'][this.linkageData.status]
      formListOption.form[2].class = 'small-buttons status-mark' + [' is-grey', ' is-blue'][this.linkageData.status]
      formListOption.form[2].buttons.buttons[0].label = ['启用', '停用'][this.linkageData.status]
      formListOption.form[2].buttons.buttons[0].value = ['editTaskStatus', 'stopTaskStatus'][this.linkageData.status]
    },
    assignAlgorithmLinkage() {
      const firstLevel = this.$refs.algorithmLinkage.firstLevel

      firstLevel.data.source = this.linkageData.source
      firstLevel.data.type = this.linkageData.source.type
      firstLevel.data.typeName = ['无', '视频流分析任务', '图片分析任务'][this.linkageData.source.type] || '无'
      firstLevel.data.id = this.linkageData.source.id
      firstLevel.data.task = this.linkageData.source.id
      firstLevel.data.linkageObject = this.linkageData.source.customize
      firstLevel.form[1].spanTip = '   ( ' + ['一级任务不存在', '正常', '任务变动'][this.linkageData.source.remind] + ' )'
      firstLevel.form[1].tipStyle = [{ 'font-size': '14px', color: '#FF3A33' }, { 'font-size': '14px', color: '#0e1b2e' }, { 'font-size': '14px', color: '#FF9159' }][this.linkageData.source.remind]

      firstLevel.data.name = this.linkageData.source.name
      firstLevel.data.algorithm = this.linkageData.source.config
      firstLevel.data.algorithmArr = []

      firstLevel.data.algorithm.forEach(al => {
        let name = al.algorithm + '/' + al.algorithmName + '·'

        name += ' ('

        al.camera.forEach((ca, caindex) => {
          name += ca.id + '/' + ca.name + (caindex === al.camera.length - 1 ? '' : ', ')
        })

        name += ')'

        firstLevel.data.algorithmArr.push({
          label: name
        })
      })

      firstLevel.data.object = this.linkageData.source.object
      firstLevel.data.objectName = ['所有对象', '仅报警对象'][this.linkageData.source.object]

      const linkage = this.$refs.algorithmLinkage.linkage

      if (this.linkageData.scene === 2) {
        linkage.data.linkageId = 2
        linkage.data.linkageAlgirithm = '加油站AI助力'
        linkage.data.associate = this.linkageData.associate
        let isSet = false
        linkage.data.associate.forEach(ass => {
          if (ass.conditions.length) {
            isSet = true
          }
        })
        linkage.data.sceneConfig = isSet ? '已设置' : '未设置'
        linkage.form[1].hide = true
        linkage.form[2].hide = false
      } else if (this.linkageData.scene === 1) {
        linkage.data.linkageId = 1
        linkage.data.algorithm = (this.linkageData.associate.config && this.linkageData.associate.config.algorithm) || 24
        linkage.data.linkageAlgirithm = this.linkageData.associate.config && this.linkageData.associate.config.algorithmName || '人脸'
        linkage.data.department = (this.linkageData.associate.config && this.linkageData.associate.config.department) || 0
        linkage.data.departmentName = this.linkageData.associate.config && this.linkageData.associate.config.departmentName
        linkage.data.serviceId = this.linkageData.associate && this.linkageData.associate.serviceId
        linkage.data.featureExtract = linkage.data.serviceId === null ? '未设置' : '已设置'
        linkage.form[1].hide = false
        linkage.form[2].hide = true
      }
    },
    assignLinkageOutput() {
      const formListOption = this.$refs.linkageOutput.formListOption

      formListOption.data.log = '关联至一级任务结果'

      const callbackPush = this.$refs.linkageOutput.callbackPush

      const contentObj = {
        1: '结果数据',
        2: '原始图片',
        4: '绘制结果图片'
      }

      this.linkageData.callback.forEach(item => {
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
      })

      callbackPush.tableData = this.linkageData.callback
    }
  }
}
