import setting from '@/api/setting'
import Storage from '@/utils/token'

export default {
  data() {
    return {
    }
  },
  methods: {
    handleUploadStatus(info) {
      if (info.value === 'success') {
        this.$messageInfo({
          type: 'success',
          message: '上传成功！'
        })
        this.updateSystemInfo()
      } else if (info.value === 'error') {
        this.$messageInfo({
          type: 'error',
          message: '上传失败！'
        })
      }
    },
    saveName() {
      setting.setSystemName({ name: this.systemNameOption.value })
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: '修改系统名称成功'
          })

          this.updateSystemInfo()

          this.systemNameOption.value = ''
        })
    },
    getSystemVBersion() {
      setting.getSystemVision()
        .then(res => {
          const { data } = res

          this.systemVersion[1].version = 'v ' + data.crip
          if (!data.crcs.length) {
            this.systemVersion[2].version = ['配置节点后展示']
          } else {
            this.systemVersion[2].version = []
            data.crcs.forEach(item => {
              this.systemVersion[2].version.push(`(${item.id})${item.ip}:${item.port} [${item.version ? item.version : '离线'}]`)
            })
          }
        })
    },
    updateSystemInfo() {
      setting.getLogoIco().then(res => {
        const { data } = res
        Storage.setSession('logo', JSON.stringify(data))
        this.$store.dispatch('storage/listenSessionStorage', { key: 'logo', value: data })
        document.title = document.title.split('-')[0] + '-' + data.name

        this.setSystemPlaceholder()
      })
    }
  }
}
