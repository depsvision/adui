import setting from '@/api/setting'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      uploadType: 'default',
      audioUpload: {
        action: 'file/',
        data: {
          type: 'alertVoice'
        },
        accept: '.wav'
      }
    }
  },
  computed: {
    ...mapGetters([
      'button',
      'buttonScope',
      'voiceOption'
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
        case 'listenDefault':
          this.auditionVoice('default')
          break
        case 'listenItem':
          this.auditionVoice()
          break
        case 'replaceDefault':
          this.replaceVoice('default')
          break
        case 'replaceItem':
          this.replaceVoice()
          break
        case 'deleteDefault':
          this.deleteVoice('default')
          break
        case 'deleteItem':
          this.deleteVoice()
          break
        default:
      }
    },
    setVoiceNotify(value, type) {
      this.$store.dispatch('audio/setVoiceOption', { key: type, value: value })

      setting.setAlarmVoiceNotify({ voice: this.voiceOption.voice ? 1 : 0, pop: this.voiceOption.notify ? 1 : 0 })
    },
    getAlarmVoiceData() {
      this.pageLoading = true

      setting.getAlarmVoiceData()
        .then(res => {
          const { data } = res

          const defaultVoice = data.default
          this.defaultVoice.name = defaultVoice.alertVoiceName || 'default.mp3'
          if (defaultVoice.alertVoiceName) {
            this.defaultVoice.url = defaultVoice.alertVoiceUrl
          } else {
            this.$set(this.buttonGroupOption.buttons[2], 'disabled', true)
            this.$set(this.buttonGroupOption.buttons[2], 'class', 'is-default')
          }

          this.algorithmLogOption.tableData = data.algorithm
          this.algorithmLogOption.tableData.forEach(item => {
            const hasDefaultVoice = this.voiceOption.algorithm.some(voice => item.taskValue === voice.str)
            if (!item.alertVoiceUrl) {
              if (hasDefaultVoice) {
                item.alertVoiceName = item.taskValue + '.wav'
              } else {
                item.alertVoiceName = 'default.mp3'
              }

              this.$set(item, 'disabled', ['deleteItem'])
              this.$set(item, 'alertVoiceNameClass', 'is-default')
            }
          })

          this.pageLoading = false
        })
        .catch(() => {
          this.pageLoading = false
        })
    },
    auditionVoice(type) {
      this.$store.dispatch('audio/setVoiceOption', { key: 'isAudition', value: true })
      if (type === 'default') {
        this.$store.dispatch('audio/setVoiceBroadcast', [{ cn: '默认', en: type, url: this.defaultVoice.url }])
      } else {
        this.$store.dispatch('audio/setVoiceBroadcast', [{ cn: '', en: this.buttonScope.row.taskValue, url: this.buttonScope.row.alertVoiceUrl }])
      }
    },
    replaceVoice(type) {
      if (type === 'default') {
        this.uploadType = 'default'
        this.audioUpload.data.taskKey = -1
      } else {
        this.uploadType = 'item'
        this.audioUpload.data.taskKey = this.buttonScope.row.algorithmId
      }
      this.$refs.uploadButton.$el.click()
    },
    deleteVoice(type) {
      setting.deleteAlarmVoice({ algorithmId: type === 'default' ? 'default' : this.buttonScope.row.algorithmId })
        .then(res => {
          if (type === 'default') {
            this.defaultVoice.name = 'default.mp3'
            this.defaultVoice.url = ''
            this.$set(this.buttonGroupOption.buttons[2], 'disabled', true)
            this.$set(this.buttonGroupOption.buttons[2], 'class', 'is-default')
          } else {
            const itemVoice = this.algorithmLogOption.tableData.find(item => item.algorithmId === this.buttonScope.row.algorithmId)
            const hasDefaultVoice = this.voiceOption.algorithm.some(voice => itemVoice.taskValue === voice.str)
            if (hasDefaultVoice) {
              this.$set(itemVoice, 'alertVoiceName', itemVoice.taskValue + '.wav')
            } else {
              this.$set(itemVoice, 'alertVoiceName', 'default.mp3')
            }

            this.$set(itemVoice, 'alertVoiceUrl', null)
            this.$set(itemVoice, 'disabled', ['deleteItem'])
            this.$set(itemVoice, 'alertVoiceNameClass', 'is-default')
          }

          this.$messageInfo({
            type: 'success',
            message: '删除成功！'
          })
        })
    },
    handleUploadStatus(info) {
      if (info.value === 'success') {
        const params = {
          algorithmId: this.uploadType === 'default' ? 'default' : this.buttonScope.row.algorithmId,
          data: {
            name: info.arg[0].name,
            path: info.arg[0].response.data.path
          }
        }

        setting.replaceAlarmVoice(params)
          .then(res => {
            this.$messageInfo({
              type: 'success',
              message: '上传成功！'
            })

            if (this.uploadType === 'default') {
              this.defaultVoice.name = info.arg[0].name
              this.defaultVoice.url = info.arg[0].response.data.url
              this.$set(this.buttonGroupOption.buttons[2], 'disabled', false)
              this.$set(this.buttonGroupOption.buttons[2], 'class', '')
            } else {
              const itemVoice = this.algorithmLogOption.tableData.find(item => item.algorithmId === this.buttonScope.row.algorithmId)
              this.$set(itemVoice, 'alertVoiceName', info.arg[0].name)
              this.$set(itemVoice, 'alertVoiceUrl', info.arg[0].response.data.url)
              this.$set(itemVoice, 'disabled', [])
              this.$set(itemVoice, 'alertVoiceNameClass', '')
            }
          })
          .catch(() => {
            this.$messageInfo({
              type: 'error',
              message: '上传失败！'
            })
          })
      } else if (info.value === 'error') {
        this.$messageInfo({
          type: 'error',
          message: '上传失败！'
        })
      }
    }
  }
}
