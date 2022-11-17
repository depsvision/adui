<template>
  <div class="webcam-monitor-container">
    <div v-if="componentOption.tipList" class="video-description">
      <span v-for="tip in componentOption.tipList" :key="tip.label" :style="tip.style">{{ tip.label }}</span>
    </div>
    <div
      ref="videoContainer"
      class="video-block auto-flex-1"
      :class="videoControlsClass"
    >
      <div
        class="video-layout auto-flex-1"
      >
        <div v-if="['logo','loading','error'].includes(loadCondition)" class="video-mask flex-center-class">
          <div v-if="['logo','error'].includes(loadCondition)" class="logo-block">
            <el-image
              :src="logoUrl.img"
            >
              <div slot="error" class="image-slot">
                <el-image
                  :src="logoUrl.errImg"
                />
              </div>
            </el-image>
            <span v-if="loadCondition === 'error' && componentOption.error && componentOption.error.label" class="logo-error-label">{{ componentOption.error.label }}</span>
            <component
              :is="componentOption.error.component.is"
              v-if="loadCondition === 'error' && componentOption.error && componentOption.error.component"
              class="logo-error-component"
              :component-option="componentOption.error.component"
            />
          </div>
          <div v-if="loadCondition === 'loading'" class="loading-block">
            <div class="circle-block">
              <div class="circle circle-1" />
              <div class="circle circle-2" />
              <div class="circle circle-3" />
            </div>
            <span>正在加载中</span>
          </div>
        </div>
        <mpegts-h265
          v-if="videoCodeType === 'H265'"
          ref="H265Player"
          :url="mpegtsH265Option.url"
          @loadeddata="h265Loadeddata"
          @play="h265Playing"
        />
        <video v-else id="mpegts" :autoplay="autoplay" :muted="muted">
          您的浏览器不支持 video 标签,请升级浏览器
        </video>
      </div>
      <div
        class="video-control flex-center-class"
        :class="videoControlsClass"
        @mouseenter="videoStatus.isMouseInner = true"
        @mouseleave="videoStatus.isMouseInner = false"
      >
        <div class="video-play-pause">
          <svg-icon v-if="loadCondition !== 'play'" icon-class="play" :class="{'is-disabled': loadCondition !== 'pause'}" @click="playVideo" />
          <svg-icon v-if="loadCondition === 'play'" icon-class="pause" @click="pauseVideo" />
          <svg-icon v-if="componentOption.buttons && componentOption.buttons.includes('refresh')" icon-class="refresh-2-line" :class="{'is-disabled': loadCondition !== 'error'}" @click="refreshVideo" />
          <point-drop-down
            v-if="componentOption.video"
            ref="videoList"
            :component-option="componentOption.video"
            :class="{'is-disabled': loadCondition !== 'play' || loadCondition !== 'pause'}"
            @changeChoice="changeUrl"
          />
        </div>
        <div
          v-if="componentOption.hasProgress"
          ref="progress"
          class="video-progress"
          @click="seekVideo"
        >
          <div class="progress-played" :style="progressStyle.played" />
          <div class="progress-buffer" :style="progressStyle.buffer" />
          <div
            class="progress-button"
            :style="progressStyle.button"
            @mousedown="listenMouseEvent(true)"
          />
        </div>
        <div v-else class="auto-flex-1" />
        <div v-if="componentOption.hasProgress" class="video-time">
          <span>{{ timeData.current }}</span>
          <span>/</span>
          <span>{{ timeData.total }}</span>
        </div>
        <div class="video-audio-fullscreen">
          <svg-icon v-if="videoStatus.isMuted || !videoStatus.volume" icon-class="muted" :class="{'is-disabled': videoStatus.isMuted}" />
          <svg-icon v-else icon-class="audio" />
          <svg-icon v-if="!videoStatus.isFullScreen" icon-class="full-screen" @click="videoFullScreen(true)" />
          <svg-icon v-else icon-class="exit-full-screen" @click="videoFullScreen(false)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mpegtsJs from 'mpegts.js'
import mixins from './Mixins'

import { mapGetters } from 'vuex'
import { on, off } from '@/components/ImageViewer/utils'

import PointDropDown from '@/components/InnerComponents/PointDropDown'
import MpegtsH265 from './MpegtsH265'
import ButtonGroup from '@/components/Button/ButtonGroup'

import pngColor from '@/directive/png-color'

export default {
  name: 'MpegtsMonitor',
  components: { PointDropDown, MpegtsH265, ButtonGroup },
  directives: { pngColor },
  mixins: [mixins],
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
      pngBgColor: '',
      playUrl: null,
      videoCodeType: 'H264',
      monitorElement: null,
      flvPlayer: null,
      logoUrl: {
        img: '',
        errImg: import('@/assets/image/logoImage/logoBlue.png')
      },
      loadCondition: 'logo',
      progressStyle: {
        played: {},
        buffer: {},
        button: {}
      },
      pressButton: false,
      playedPercentage: 0,
      timeData: {
        current: '00:00',
        total: '00:00'
      },
      mpegtsH265Option: {
        url: ''
      },
      jessibucaCache: null,
      resolutionWidth: 1920
    }
  },
  computed: {
    ...mapGetters([
      'videoId',
      'screenResolution',
      'session'
    ]),

    autoplay() {
      return this.componentOption.autoplay ?? true
    },
    muted() {
      return this.componentOption.muted ?? true
    },

    videoControlsClass() {
      const videoBlockClass = this.componentOption.videoBlockClass ?? []

      const classGroup = [
        (this.componentOption.isInnerScreen ?? false) || this.videoStatus.isFullScreen ? 'is-full-screen' : '',
        ((this.componentOption.isInnerScreen ?? false) || this.videoStatus.isFullScreen) && this.videoStatus.isMouseInner ? 'is-mouse-inner' : '',
        !this.videoStatus.isMouseStop ? 'is-mouse-move' : '',
        this.videoStatus.isMouseStop ? 'is-mouse-stop' : '',
        this.resolutionWidth <= 1356 && this.componentOption.isInnerScreen ? 'is-inner-small' : '',
        ...videoBlockClass
      ]
      return classGroup
    }
  },
  watch: {
    'componentOption.url': {
      handler(val) {
        if (val) {
          this.watchVideoUrl(val)
        } else {
          this.dispose()

          this.disposeJessibucaCache()

          this.disposeH265Player()
        }
      },
      immediate: true
    },
    'screenResolution.width'(val) {
      if (val) {
        this.resolutionWidth = val
      }
    },
    'screenResolution.height'(val) {
      if (this.videoStatus.isFullScreen) {
        this.videoStatus.isFullScreen = document.mozFullScreen ||
                                      document.webkitIsFullScreen ||
                                      document.webkitFullScreen ||
                                      document.msFullScreen
      }
    },
    'session.logo': {
      handler(val) {
        this.setHomeLogo()
      },
      deep: true
    },
    'videoStatus.isFullScreen'(val) {
      this.dealWebbcamParams(val)
    }
  },
  beforeDestroy() {
    this.dispose()

    this.disposeJessibucaCache()
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.setHomeLogo()

      this.getVideoBlock()
    },
    getVideoBlock() {
      this.$nextTick(() => {
        this.videoContainer = this.$refs.videoContainer
      })
    },
    dispose() {
      this.disposeFlvPlayer()

      this.disposeH265Player()

      this.disposeJessibucaCache()
    },

    disposeFlvPlayer() {
      if (this.flvPlayer) {
        this.componentOption.hasProgress && this.initVideoOption()

        this.flvPlayer.unload()
        this.flvPlayer.detachMediaElement()
        this.flvPlayer.destroy()
        this.flvPlayer = null
      }
    },

    setCondition(condition) {
      this.loadCondition = condition
    },

    watchVideoUrl(url) {
      if (this.componentOption.code === 'http-flv') {
        this.setCondition('loading')

        this.disposeJessibucaCache()

        this.$nextTick(() => {
          const container = document.createElement('div')
          container.style.display = 'none'

          const option = {
            container: container
          }

          this.jessibucaCache = new window.Jessibuca(option)

          this.jessibucaCache.on('flvType', type => {
            this.checkFlvTypeToChoose(type, url)

            this.disposeJessibucaCache()
          })

          this.jessibucaCache.on('error', () => {
            this.setCondition('error')
          })

          this.jessibucaCache.play(url)
        })
      } else {
        this.checkFlvTypeToChoose(this.componentOption.code, url)
      }
    },

    checkFlvTypeToChoose(type, url) {
      if (type === 'H265') {
        this.videoCodeType = type

        this.mpegtsH265Option.url = url
      } else {
        this.disposeH265Player()

        this.disposeJessibucaCache()

        this.videoCodeType = type

        this.playUrl = url

        this.$nextTick(() => {
          this.videoInit()
        })
      }
    },
    refreshVideo() {
      this.watchVideoUrl(this.componentOption.url)
    },

    disposeJessibucaCache() {
      if (this.jessibucaCache) {
        this.jessibucaCache.destroy()

        this.jessibucaCache = null
      }
    },

    // h265
    h265Loadeddata() {
      this.setCondition('loading')
    },
    h265Playing() {
      this.setCondition('play')
    },
    disposeH265Player() {
      this.mpegtsH265Option.url = ''

      const H265Player = this.$refs.H265Player

      H265Player && H265Player.dispose()
    },

    // h265
    videoInit() {
      if (!this.flvPlayer) {
        this.monitorElement = document.getElementById('mpegts')
        this.reCreateFlv()
        this.playMonitor()
      } else {
        this.flvPlayer.unload()
        this.reCreateFlv()

        this.setCondition('logo')

        this.flvPlayer.load()
      }
    },

    setHomeLogo() {
      if (this.session.logo && this.session.logo.logo.length > 0) {
        this.logoUrl.img = this.session.logo.logo + '?' + Date.now()
      }
    },
    reCreateFlv() {
      let createOption = {
        enableWorker: true,
        enableStashBuffer: false,
        autoCleanupSourceBuffer: true,
        liveBufferLatencyChasing: true,
        liveBufferLatencyMaxLatency: 0.6,
        liveBufferLatencyMinRemain: 0.2,
        // autoCleanupMinBackwardDuration: 2,
        // autoCleanupMaxBackwardDuration: 5,
        lazyLoad: false,
        lazyLoadMaxDuration: 1,
        lazyLoadRecoverDuration: 1,
        stashInitialSize: 4
        // deferLoadAfterSourceOpen: false,
      }

      if (this.componentOption.createOption) {
        createOption = this.componentOption.createOption
      }

      this.flvPlayer = mpegtsJs.createPlayer({
        type: this.componentOption.type ?? 'flv',
        isLive: this.componentOption.isLive ?? true,
        hasAudio: this.componentOption.hasAudio ?? false,
        hasVideo: this.componentOption.hasVideo ?? true,
        url: this.playUrl
      }, createOption)

      this.flvPlayer.attachMediaElement(this.monitorElement)
      this.addVideoFunction()
    },
    playVideo() {
      if (this.videoCodeType === 'H265') {
        const H265Player = this.$refs.H265Player

        H265Player && H265Player.playVideo()
      } else {
        this.flvPlayer.play()
      }

      this.setCondition('play')
    },
    pauseVideo() {
      if (this.videoCodeType === 'H265') {
        const H265Player = this.$refs.H265Player

        H265Player && H265Player.pauseVideo()
      } else {
        this.flvPlayer.pause()
      }

      this.setCondition('pause')
    },
    addVideoFunction() {
      // 开始加载视频
      this.monitorElement.onloadstart = () => {
        this.setCondition('loading')
      }

      this.monitorElement.onloadeddata = () => {
        if (!this.autoplay) {
          this.setCondition('pause')

          if (this.componentOption.hasProgress) {
            this.changeProgress()

            this.componentOption.videoCanPlay && this.componentOption.videoCanPlay()
          }
        } else {
          this.setCondition('play')
        }
      }

      this.monitorElement.onplay = () => {
        this.setCondition('play')
      }

      this.monitorElement.onpause = () => {
        this.setCondition('pause')
      }

      this.monitorElement.onended = () => {
        this.initVideoOption(true)
      }

      this.monitorElement.ontimeupdate = () => {
        if (this.flvPlayer && this.loadCondition === 'play' && this.componentOption.hasProgress) {
          !this.pressButton && this.changeProgress(true)
        }
      }

      this.monitorElement.onerror = () => {
        this.setCondition('error')
      }

      this.flvPlayer.on('error', err => {
        err
        this.setCondition('error')
      })
    },
    playMonitor() {
      if (mpegtsJs.getFeatureList().mseLivePlayback) {
        this.flvPlayer.load()

        this.$nextTick(() => {
          if (this.autoplay) {
            this.flvPlayer.play()
          }
        })
      } else {
        this.$messageInfo({
          showClose: true,
          message: '您当前的浏览器版本过低！请升级浏览器版本后再尝试',
          type: 'warning'
        })
      }
    },
    initVideoOption(type) {
      if (this.flvPlayer) {
        this.flvPlayer.pause()
        this.flvPlayer.currentTime = 0
        this.playedPercentage = 0
        if (!this.pressButton) {
          this.progressStyle.played = {}
          this.progressStyle.button = {}
          this.progressStyle.buffer = {}

          this.timeData.current = '00:00'
          !type && (this.timeData.total = '00:00')
        }
      }
    },
    changeProgress(animation) {
      const duration = this.flvPlayer.duration
      const currentTime = this.flvPlayer.currentTime
      const buffered = this.flvPlayer.buffered

      this.playedPercentage = currentTime / duration

      const bufferPercentage = buffered.end(buffered.length - 1) / duration

      this.progressStyle.buffer = {
        transform: `scaleX(${bufferPercentage})`
      }

      this.setProgressOption(animation)
      this.setVideoTime(currentTime)
    },
    setProgressOption(animation) {
      this.progressStyle.played = {
        transform: `scaleX(${this.playedPercentage})`,
        transition: animation ? 'transform .1s linear' : ''
      }

      const progress = this.$refs.progress
      const width = progress.offsetWidth

      this.progressStyle.button = {
        transform: `translateX(${width * this.playedPercentage - 4}px)`,
        transition: animation ? 'transform .1s linear' : ''
      }
    },
    setVideoTime(current) {
      const duration = this.flvPlayer.duration

      const totalOption = {
        hours: this.$dayjs.duration(duration * 1000).hours(),
        minutes: this.$dayjs.duration(duration * 1000).minutes(),
        seconds: this.$dayjs.duration(duration * 1000).seconds()
      }

      const currentOption = {
        hours: this.$dayjs.duration(current * 1000).hours(),
        minutes: this.$dayjs.duration(current * 1000).minutes(),
        seconds: this.$dayjs.duration(current * 1000).seconds()
      }

      const totalTime = this.$dayjs.duration({
        hours: totalOption.hours,
        minutes: totalOption.minutes,
        seconds: totalOption.seconds
      }).format(totalOption.hours ? 'HH:mm:ss' : 'mm:ss')

      if (totalTime !== this.timeData.total) {
        this.timeData.total = totalTime
      }

      const currentTime = this.$dayjs.duration({
        hours: currentOption.hours,
        minutes: currentOption.minutes,
        seconds: currentOption.seconds
      }).format(currentOption.hours ? 'HH:mm:ss' : 'mm:ss')

      this.timeData.current = currentTime
    },
    seekVideo(e) {
      if (this.flvPlayer && (this.loadCondition === 'play' || this.loadCondition === 'pause')) {
        const duration = this.flvPlayer.duration
        const progress = this.$refs.progress
        let seekTime = 0
        if (e) {
          seekTime = e.layerX / progress.offsetWidth * duration

          this.flvPlayer.currentTime = seekTime

          this.changeProgress()
        } else {
          seekTime = this.playedPercentage * duration

          this.flvPlayer.currentTime = seekTime
        }
      }
    },
    listenMouseEvent() {
      this.pressButton = true

      on(document, 'mousemove', this.getMouseOption)
      on(document, 'mouseup', this.handleMouseUp)
    },
    getMouseOption(e) {
      const duration = this.flvPlayer.duration
      const progress = this.$refs.progress
      const progressToLeft = progress.getBoundingClientRect().left

      let mouseToProgress = e.clientX - progressToLeft

      if (mouseToProgress < 0) {
        mouseToProgress = 0
      }

      if (mouseToProgress > progress.offsetWidth) {
        mouseToProgress = progress.offsetWidth
      }

      this.playedPercentage = mouseToProgress / progress.offsetWidth

      const currentTime = this.playedPercentage * duration

      this.setProgressOption()
      this.setVideoTime(currentTime)
    },
    handleMouseUp() {
      this.pressButton = false
      this.seekVideo()
      off(document, 'mousemove', this.getMouseOption)
      off(document, 'mouseup', this.handleMouseUp)
    }
  }
}
</script>

<style scoped lang="scss">
.webcam-monitor-container {
  width: 100%;
  position: relative;
  display: flex;
  flex-flow: column;

  .video-description {
    line-height: 14px;
    margin-bottom: 16px;
  }

  .video-block {
    position: relative;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    .video-layout{
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      display: flex;
      justify-content: center;
      background-color: #000;
      overflow: hidden;

      .video-mask {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        flex-flow: column;
        background-color: rgba(14, 27, 46, 1);

        .logo-block {

          ::v-deep .el-image {

            img {
              max-height: 32px;
            }
          }

          .logo-error-label {
            font-size: 12px;
            color: rgba(200, 202, 204, 1);
            margin-top: 16px;
          }

          .logo-error-component {
            margin-top: 32px;
          }
        }

        .loading-block,
        .logo-block {
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
        }

        .circle-block {
          position: relative;
          width: 40px;
          height: 40px;
          display: flex;
          justify-content: center;
          animation: rotate 1.5s linear 0s infinite normal;

          .circle {
            position: absolute;
            width: 12px;
            height: 12px;
            background-color: rgba(245, 249, 255, 1);
            border-radius: 50%;
            -webkit-backface-visibility: hidden;
            -moz-backface-visibility: hidden;
            -ms-backface-visibility: hidden;
            backface-visibility: hidden;

            -webkit-perspective: 1000;
            -moz-perspective: 1000;
            -ms-perspective: 1000;
            perspective: 1000;

          }

          .circle-1 {
            animation: circleLoadingTop 1.5s cubic-bezier(.55,0,.80,1) 0s infinite normal;
          }

          .circle-2 {
            animation: circleLoadingLeft 1.5s cubic-bezier(.55,0,.80,1) 0s infinite normal;
          }

          .circle-3 {
            animation: circleLoadingRight 1.5s cubic-bezier(.55,0,.80,1) 0s infinite normal;
          }

          &+span {
            font-size: 14px;
            color: rgba(245, 249, 255, 1);
            margin-top: 24px;
          }
        }
      }

      video{
        width: 100%;
        height: 100%;
        pointer-events: none;

        &::-webkit-media-controls {
          display: none !important;
        }
      }

      .mpegts-h265 {
        width: 100%;
        height: 100%;
        pointer-events: none;
      }
    }

    &.is-mouse-stop {

      &:hover {
        cursor: none !important;
      }
    }

    &.is-mouse-inner {

      &:hover {
        cursor: unset !important;
      }
    }
  }

  .video-control {
    position: relative;
    height: 40px;
    width: 100%;
    background-color: rgba(14, 27, 46, .05);
    border-radius: 4px;
    margin-top: 8px;

    svg {
      font-size: 20px;
      color: rgba(14, 27, 46, 1);
      border-radius: 4px;
      padding: 4px;

      &:hover{
        cursor: pointer;
        color: rgba(24, 114, 240, 1);
        background-color: rgba(24, 114, 240, .1);
      }

      &.is-disabled {
        pointer-events: none;
        color: rgba(14, 27, 46, .5);
        background-color: unset;
      }

      &+svg {
        margin-left: 8px;
      }
    }

    ::v-deep .point-drop-down-container {
      margin-left: 8px;

      .point-dropdown-block {

        &>span {
          color: rgba(14, 27, 46, 1);
          display: inline-block;
          width: 20px;
          height: 20px;
          padding: 4px;

          &:hover {
            cursor: pointer;
            color: rgba(24, 114, 240, 1);
            background-color: rgba(24, 114, 240, .1);
          }

          svg {
            font-size: 20px;
          }
        }
      }
    }

    .video-play-pause,
    .video-audio-fullscreen {
      display: flex;
      align-items: center;
    }

    .video-play-pause {
      margin-left: 12px;
    }

    .video-progress {
      position: relative;
      flex: 1;
      height: 4px;
      margin: 0 24px;
      background-color: rgba(14, 27, 46, 0.1);
      border-radius: 1px;
      user-select: none;

      &:hover {
        cursor: pointer;
      }

      .progress-played,
      .progress-buffer{
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        transform: scaleX(0);
        border-radius: 1px;
        user-select: none;
      }

      .progress-played {
        transform-origin: 0 0;
        will-change: transform;
        background-color: rgba(27, 53, 89, 1);
      }

      .progress-buffer {
        transform-origin: 0 0;
        will-change: transform;
        background-color: rgba(27, 53, 89, .2);
      }

      .progress-button {
        position: relative;
        top: -2px;
        height: 8px;
        width: 8px;
        border-radius: 50%;
        background-color: rgba(27, 53, 89, 1);
        transform: translateX(-4px);
        user-select: none;
      }
    }

    .video-time {
      margin-right: 24px;

      &>span {
        font-size: 14px;
        color: rgba(27, 53, 89, 1);
        user-select: none;

        &:nth-child(2) {
          padding: 0 2px;
        }
      }
    }

    .video-audio-fullscreen {
      margin-right: 12px;
    }

    &.is-full-screen,
    &.is-inner {
      svg {
        color: rgba(245, 249, 255, 1);

        &:hover {
          color: rgba(245, 249, 255, 1);
          background-color: rgba(245, 249, 255, .1);
        }

        &.is-disabled {
          pointer-events: none;
          color: rgba(245, 249, 255, .5);
          background-color: unset;
        }
      }

      ::v-deep .point-drop-down-container {

        .point-dropdown-block {

          &>span {
            color: rgba(245, 249, 255, 1);
            display: inline-block;
            width: 20px;
            height: 20px;
            padding: 4px;

            &:hover {
              cursor: pointer;
              color: rgba(245, 249, 255, 1);
              background-color: rgba(245, 249, 255, .1);
            }

            svg {
              font-size: 20px;
            }
          }
        }
      }

      .video-progress {
        background: rgba(27,53,89,0.20);

        .progress-played {
          background-color:rgba(255, 255, 255, 1);
        }

        .progress-buffer {
          background-color:rgba(255, 255, 255, .2);
        }

        .progress-button {
          background-color:rgba(255, 255, 255, 1);
        }
      }

      .video-time {

        &>span {
          color: rgba(255, 255, 255, 1);
        }
      }
    }

    &.is-inner {
      position: absolute;
      bottom: 8px;
      width: calc(100% - 16px);
      background-color: rgba(27,53,89,0.10);
      border: 1px solid rgba(255,255,255,0.20);
      backdrop-filter: saturate(180%) blur(20px);
      margin-top: 0;
    }

    &.is-full-screen {
      position: absolute;
      bottom: 9%;
      width: 480px;
      height: 64px;
      opacity: 0;
      border-radius: 8px;
      background-color: rgba(14, 27, 46, 0.35);
      backdrop-filter: saturate(180%) blur(20px);
      transition-property: none;
      transition-duration: .4s;
      transition-timing-function: ease-in-out;
      margin-top: 0;

      &.is-mouse-stop {
        opacity: 0;
      }

      &.is-mouse-move {
        transition-property: bottom,opacity;
        opacity: 1;
        bottom: 10%;
      }

      &.is-mouse-inner {
        opacity: 1;
        bottom: 10%;
      }
    }

    &.is-inner-small {
      width: 100%;
    }
  }
}
</style>
