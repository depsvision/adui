<template>
  <div ref="container" class="mpegts-h265" />
</template>

<script>
// eslint-disable-next-line no-unused-vars
import jessibuca from './jessibuca'

export default {
  name: 'MpegtsH265',
  props: {
    url: {
      type: String,
      default: ''
    },
    errorTimeout: {
      type: Number,
      default: 10000
    }
  },
  data() {
    return {
      jessibuca: null,
      errorTimer: null
    }
  },
  watch: {
    url: {
      handler(val) {
        this.playH265Flv()
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.dispose()
  },
  methods: {
    playH265Flv() {
      if (!this.url) {
        return
      }

      this.$nextTick(() => {
        this.dispose()

        const option = {
          container: this.$refs.container
        }

        this.jessibuca = new window.Jessibuca(option)
        this.addJessibucaEvent()
        this.jessibuca.play(this.url)
      })
    },
    addJessibucaEvent() {
      this.jessibuca.on('load', () => {
        this.$emit('loadeddata')
      })

      this.jessibuca.on('start', () => {
        this.$emit('play')
      })

      this.jessibuca.on('timeout', () => {
        console.log('timeout')
        this.playTimeout('timeout')
      })

      this.jessibuca.on('loadingTimeout', () => {
        console.log('loadingTimeout')
        this.playTimeout('loadingTimeout')
      })

      this.jessibuca.on('delayTimeout', () => {
        console.log('delayTimeout')
        this.playTimeout('delayTimeout')
      })

      this.jessibuca.on('error', error => {
        console.log('error', error)
        this.playError(error)
      })
    },

    playVideo() {
      this.jessibuca.play()
    },
    pauseVideo() {
      this.jessibuca.pause()
    },

    playTimeout(type) {
      this.dispose()
      this.playH265Flv()
    },
    playError(playError) {
      if (this.errorTimer) return

      this.errorTimer = setTimeout(() => {
        this.dispose()
        this.playH265Flv()
      }, this.errorTimeout)
    },

    dispose() {
      if (this.jessibuca) {
        this.jessibuca.destroy()

        this.jessibuca = null
      }

      if (this.errorTimer) {
        clearTimeout(this.errorTimer)
        this.errorTimer = null
      }
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
