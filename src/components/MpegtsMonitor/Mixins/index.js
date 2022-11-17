export default {
  data() {
    return {
      videoStatus: {
        isFullScreen: false,
        isMuted: true,
        volume: 0,
        isMouseInner: false,
        isMouseStop: false,
        timer: null
      },
      mouseFunction: null
    }
  },
  methods: {
    changeUrl(data) {
      this.componentOption.url = data.url

      const label = data.label.split(' ')
      label.forEach((item, index) => {
        this.componentOption.tipList[index].label = item
      })
    },
    videoFullScreen(type) {
      if (type) {
        if (this.videoContainer.requestFullscreen) {
          this.videoContainer.requestFullscreen()
        } else if (this.videoContainer.mozRequestFullScreen) {
          this.videoContainer.mozRequestFullScreen()
        } else if (this.videoContainer.msRequestFullscreen) {
          this.videoContainer.msRequestFullscreen()
        } else if (this.videoContainer.oRequestFullscreen) {
          this.videoContainer.oRequestFullscreen()
        } else if (this.videoContainer.webkitRequestFullscreen) {
          this.videoContainer.webkitRequestFullScreen()
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.oRequestFullscreen) {
          document.oCancelFullScreen()
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen()
        }
      }

      this.videoStatus.isFullScreen = type
    },
    dealWebbcamParams(val) {
      if (val) {
        if (!this.mouseFunction) {
          this.mouseFunction = () => {
            this.videoStatus.isMouseStop = false
            clearTimeout(this.videoStatus.timer)
            this.videoStatus.timer = null
            this.videoStatus.timer = setTimeout(() => {
              this.videoStatus.isMouseStop = true
            }, 2000)
          }
        }

        this.mouseFunction()
        this.videoContainer.addEventListener('mousemove', this.mouseFunction)
      } else {
        this.videoContainer.removeEventListener('mousemove', this.mouseFunction)
        this.videoStatus.isMouseStop = false
        if (this.videoStatus.timer) {
          clearTimeout(this.videoStatus.timer)
        }
        this.videoStatus.timer = null
        this.mouseFunction = null
      }

      if (this.componentOption.video) {
        this.$set(this.componentOption.video, 'dropdownClass', val ? 'full-screen-ele' : '')
        this.$set(this.componentOption.video, 'fullScreen', val)
      }
    }
  }
}
