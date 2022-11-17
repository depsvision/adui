<template>
  <div class="voice-broadcast-layout">
    <audio
      ref="voiceBroadcast"
      src=""
      controls
      autoplay
      muted
    />
  </div>
</template>

<script>
import defaultVoice from '@/assets/audio/default.mp3'

import { mapGetters } from 'vuex'

export default {
  name: 'VoiceBroadcast',
  props: {
    componentOption: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      audio: {},
      notify: ''
    }
  },
  computed: {
    ...mapGetters([
      'voiceBroadcast',
      'voiceOption'
    ])
  },
  watch: {
    voiceBroadcast: {
      handler(val) {
        if (val && val.length > 0) {
          this.dealNotify(val)

          if (this.voiceOption.voice || this.voiceOption.isAudition) {
            if (val[0].url) {
              this.audio.src = val[0].url
            } else {
              const voice = this.voiceOption.algorithm.find(item => item.str === val[0].en)
              this.notify = ''

              if (voice) {
                this.audio.src = voice.voice
              } else {
                this.audio.src = defaultVoice
              }

              this.voiceOption.voice || this.voiceOption.isAudition && this.audio.play()
            }
          }

          if (this.voiceOption.notify && !this.voiceOption.isAudition) {
            this.voiceOption.notify && this.$notify({
              title: '异常提醒',
              message: '发现' + this.notify + '报警, 请及时处理',
              type: 'warning',
              offset: 60,
              duration: 3000
            })
          }
        } else {
          this.audio.src = ''
          this.notify = ''
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.getAudio()
        this.audioEvent()
      })
    },
    dealNotify(value) {
      this.notify = ''

      value.forEach((item, index) => {
        index !== value.length - 1 ? this.notify += item.cn + '、' : this.notify += item.cn
      })
    },
    getAudio() {
      this.audio = this.$refs.voiceBroadcast
    },
    audioEvent() {
      const that = this

      this.audio.onended = function() {
        if (that.voiceOption.isAudition) {
          that.$store.dispatch('audio/setVoiceOption', { key: 'isAudition', value: false })
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.voice-broadcast-layout {
  position: absolute;
  z-index: -1;
}
</style>
