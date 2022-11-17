<template>
  <transition name="opacity-show">
    <div v-show="viewerOption.show" class="image-viwer-container">
      <div class="image-viwer__mask">
        <transition name="slide-bottom-10">
          <div v-show="viewerOption.show" class="image-viwer__content">
            <div
              :style="imgStyle"
              :class="[
                imageError || viewerOption.activeImg[viewerOption.imgKey] === ''?'is-error':'',
                viewerOption.lock?'is-locked':''
              ]"
              class="image-viwer__content__item"
              @mousedown="handleMouseDown"
              @mouseenter="inPicture = true"
              @mouseleave="inPicture = false"
            >
              <svg-painter
                ref="svgPainter"
                :component-option="viewerOption.activeImg"
                @getSvgPainterClipImage="getSvgPainterClipImage"
              >
                <template v-slot:painer>
                  <el-image
                    :src="viewerOption.activeImg[viewerOption.imgKey]"
                    class="image-viwer__img"
                    fit="contain"
                    @load="imgLoaded(viewerOption.activeImg)"
                    @error="imgError()"
                  >
                    <div slot="error" class="image-slot svg-slot">
                      <svg-icon :icon-class="viewerOption.activeImg[viewerOption.imgKey] === ''?'empty-image':'error-image-line'" />
                    </div>
                  </el-image>
                </template>
              </svg-painter>
              <MpegtsMonitor
                v-if="viewerOption.activeImg.mpegts"
                v-show="viewerOption.activeImg.mpegts.show"
                ref="mpegts"
                class="image-viwer__content__video"
                :component-option="viewerOption.activeImg.mpegts.option"
              />
            </div>
          </div>
        </transition>
        <transition name="slide-top-10">
          <div v-show="viewerOption.show" class="image-viwer__tools">
            <div
              v-for="(toolValue,toolKey,toolIndex) in finalTools"
              :key="toolIndex"
              class="image-viwer__tools__item"
              :class="[toolIndex !== Object.keys(finalTools).length -1?'image-viwer__tools__divide':'']"
            >
              <div
                v-for="(tool,index) in toolValue"
                :key="index"
                :class="splitClass(tool)"
                :style="tool.style"
                class="image-viwer__tools__item__component"
              >
                <component
                  :is="tool.is"
                  v-if="tool.is"
                  ref="component"
                  :component-option="tool.option"
                  @changeInput="changeInput"
                  v-on="$listeners"
                />
              </div>
            </div>
          </div>
        </transition>
      </div>
      <transition name="slide-left-all">
        <div v-show="viewerOption.show" class="image-viwer__sidebar">
          <div class="image-viwer__sidebar__header">
            <span class="slide-header__title">{{ viewerOption.imageHeader }}</span>
            <svg-icon icon-class="error-small" class="image-viwer__close" @click="handleClose" />
          </div>
          <div v-if="Object.keys(viewerOption.infoDisplay).length > 0" class="image-viwer__sidebar__info">
            <div class="image-viwer__sidebar__info__item">
              <el-collapse v-model="infoActive">
                <el-collapse-item name="info">
                  <template slot="title">
                    <div class="image-viwer__sidebar__inner__header">
                      <span class="slide-inner-header__title">{{ viewerOption.infoHeader }}</span>
                    </div>
                  </template>
                  <div class="image-viwer__sidebar__inner__info">
                    <div v-for="(value,key,disIndex) in viewerOption.infoDisplay" :key="key" class="slide-info-item">
                      <span class="slide-info-label">{{ value }}</span>
                      <component
                        :is="viewerOption.infoComponent[key] && viewerOption.infoComponent[key].is"
                        v-if="viewerOption.infoComponent"
                        ref="infoComponent"
                        :component-option="dealOption(viewerOption.infoComponent[key],key,disIndex,viewerOption.activeImg)"
                        @changeValue="value=>{changeComponentValue(value,key,viewerOption.activeImg)}"
                      />
                      <span
                        v-else
                        :ref="'infoBlock'+ key"
                        class="slide-info-content"
                        :class="[
                          viewerOption.infoSpecial[key] !== undefined?viewerOption.infoSpecial[key].class:'',
                          viewerOption.infoSpecial[key] !== undefined?viewerOption.activeImg[viewerOption.infoSpecial[key].key]:''
                        ]"
                      >
                        <span
                          :ref="'infoContent'+ key"
                          class="slide-info-content__overflow"
                          :class="[viewerOption.activeImg[key]?'has-text':'']"
                        >{{ viewerOption.activeImg[key] }}</span>
                      </span>
                      <el-tooltip v-if="overflow[key]" :content="viewerOption.activeImg[key]" placement="top">
                        <svg-icon icon-class="info-fill" class="slide-info-svg" />
                      </el-tooltip>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
          <el-collapse v-if="customize && customize.length>0" v-model="customizeActive" class="image-viwer__sidebar__customize">
            <el-collapse-item
              v-for="(cus,cusIndex) in customize"
              :key="cusIndex"
              class="image-viwer__sidebar__customize__item"
              :name="cus.name"
            >
              <template slot="title">
                <div class="image-viwer__sidebar__inner__header">
                  <span class="slide-inner-header__title">{{ cus.header }}</span>
                </div>
              </template>
              <div class="image-viwer__sidebar__inner__info">
                <component :is="cus.is" :component-option="cus.option" />
              </div>
            </el-collapse-item>
          </el-collapse>
          <div class="image-viwer__sidebar__content">
            <div class="image-viwer__sidebar__inner__header">
              <span class="slide-inner-header__title">{{ viewerOption.listHeader }}</span>
            </div>
            <div class="image-viwer__sidebar__content__block">
              <div
                v-for="(imgItem,imgIndex) in imageSvgList"
                :key="imgIndex"
                class="image-viwer__sidebar__content__item"
                :class="imgItemClass(imgItem)"
                @click="changeActiveImg(imgItem)"
              >
                <svg-painter :component-option="imgItem">
                  <template v-slot:painer>
                    <el-image
                      :src="imgItem[viewerOption.imgKey]"
                      fit="cover"
                    >
                      <div slot="error" class="image-slot svg-slot">
                        <svg-icon :icon-class="imgItem[viewerOption.imgKey] === ''?'empty-image':'error-image-line'" />
                      </div>
                    </el-image>
                  </template>
                </svg-painter>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { isFirefox, rafThrottle, on, off } from './utils'
import { deepClone } from '@/utils'

import ButtonGroup from '@/components/Button/ButtonGroup'
import SliderAssembly from '@/components/InnerComponents/SliderAssembly'
import SvgPainter from '@/components/SvgPainter'
import FaceLinkage from '@/components/ImageViewer/CustomizeSlider/FaceLinkage'
import SelectAssembly from '@/components/InnerComponents/SelectAssembly'
import MpegtsMonitor from '@/components/MpegtsMonitor'

const mousewheelEventName = isFirefox() ? 'DOMMouseScroll' : 'mousewheel'

export default {
  name: 'ImageViewer',
  components: {
    ButtonGroup,
    SliderAssembly,
    SvgPainter,
    FaceLinkage,
    SelectAssembly,
    MpegtsMonitor
  },
  props: {
    componentOption: {
      type: Object,
      default: function() {
        return {}
      }
    },
    // 图片查看器显示
    show: {
      type: Boolean,
      default: false
    },
    // 图片src动态key
    imgKey: {
      type: String,
      default: 'url'
    },
    // 右侧总标题
    imageHeader: {
      type: String,
      default: '图片查看'
    },
    // 右侧信息区域标题
    infoHeader: {
      type: String,
      default: '分析结果'
    },
    // 右侧图片区域标题
    listHeader: {
      type: String,
      default: '列表'
    },
    // 右侧信息栏显示键值对，键与传入图片data内键值对应，值为新西兰显示部分label
    infoDisplay: {
      type: Object,
      default: function() {
        return {}
      }
    },
    infoComponent: {
      type: [null, Object],
      default: null
    },
    infoSpecial: {
      type: Object,
      default: function() {
        return {}
      }
    },
    // 右侧图片显示列表数组
    imageList: {
      type: Array,
      default: function() {
        return []
      }
    },
    // 下方自定义工具栏统一工具（配合动态组件使用）
    imageTools: {
      type: Object,
      default: function() {
        return {}
      }
    },
    // 是否插入到body下
    appendToBody: {
      type: Boolean,
      default: false
    },
    // 正在查看的图片数据
    activeImg: {
      type: Object,
      default: function() {
        return {}
      }
    },
    clipImage: {
      type: Array,
      default: function() {
        return []
      }
    },
    // 是否锁定图片
    lock: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      infoActive: ['info'],
      viewerOption: {
        show: false,
        imgKey: 'url',
        imageHeader: '',
        listHeader: '',
        infoHeader: '',
        infoDisplay: {},
        infoComponent: null,
        infoSpecial: {},
        imageList: [],
        imageTools: {},
        appendToBody: false,
        activeImg: {},
        clipImage: [],
        lock: false
      },
      defaultTools: {
        switch: [
          {
            is: 'ButtonGroup',
            class: 'image-viwer-switch',
            option: {
              buttons: [
                {
                  value: 'prev',
                  type: 'text',
                  svgIconLeft: 'arrow-left-line',
                  timer: 0,
                  disabled: false
                },
                {
                  value: 'next',
                  type: 'text',
                  svgIconLeft: 'arrow-right-line',
                  timer: 0,
                  disabled: false
                }
              ],
              class: []
            }
          }
        ],
        zoom: [
          {
            is: 'ButtonGroup',
            option: {
              buttons: [
                {
                  value: 'zoomOut',
                  type: 'text',
                  svgIconLeft: 'zoom-out',
                  timer: 0,
                  disabled: false
                }
              ],
              class: []
            }
          },
          {
            is: 'SliderAssembly',
            class: 'image-viwer-zoom-slider',
            option: {
              min: -50,
              max: 500,
              step: 1,
              value: 100,
              dealInput: function(value) {
                if (value <= 100) {
                  this.step = 3
                } else {
                  this.step = 1
                }
              },
              formatTooltip: function(value) {
                let result = value

                if (value < 100) {
                  result = value + (100 - value) * 2 / 3
                }

                return result + '%'
              }
            }
          },
          {
            is: 'ButtonGroup',
            option: {
              buttons: [
                {
                  value: 'zoomIn',
                  type: 'text',
                  svgIconLeft: 'zoom-in',
                  timer: 0,
                  disabled: false
                }
              ],
              class: []
            }
          }
        ]
      },
      overflow: {},
      isFirst: false,
      isLast: false,
      transform: {
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      },
      zoomTimer: null,
      inPicture: false,
      isDragSlider: false,
      watchTime: 0,
      imageError: false,
      imageSvgList: [],
      customize: [],
      customizeActive: []
    }
  },
  computed: {
    ...mapGetters([
      'button',
      'imageViewer'
    ]),
    finalTools() {
      let tools = {}

      tools = { ...this.defaultTools, ...this.viewerOption.imageTools }

      if (this.viewerOption.activeImg.tools) {
        tools = { ...tools, ...this.viewerOption.activeImg.tools }
      }

      return tools
    },
    imgItemClass() {
      return imgItem => {
        const classGroup = {}

        const isActive = this.viewerOption.activeImg.imgIndex === imgItem.imgIndex

        if (isActive) {
          classGroup['is-active'] = true
        }

        return classGroup
      }
    },
    splitClass() {
      return toolClass => {
        const classGroup = {}

        toolClass.class && toolClass.class.split(' ').forEach(item => {
          classGroup[item] = true
        })

        return classGroup
      }
    },
    dealOption() {
      return (props, key, index, image) => {
        const result = props

        result.value = image[key]

        this.$refs.infoComponent && this.$refs.infoComponent.length && this.$refs.infoComponent[index].$forceUpdate()

        return result
      }
    },
    imgStyle() {
      const { scale, offsetX, offsetY, enableTransition } = this.transform
      const style = {
        transform: `scale(${scale}) translateX(${offsetX / scale}px) translateY(${offsetY / scale}px)`,
        transition: enableTransition ? 'transform .3s' : ''
      }
      return style
    },
    forbidEvent() {
      let forbid = false

      const activeImg = this.viewerOption.activeImg

      if (activeImg.mpegts && activeImg.mpegts.show) {
        forbid = true
      }

      return forbid
    }
  },
  watch: {
    'button.value'(val) {
      this.clickTool(val)
    },
    'viewerOption.show'(val) {
      if (val) {
        this.deviceSupportInstall()

        this.init()

        this.$nextTick(() => {
          this.calcWidth()
        })
      }
    },
    'viewerOption.activeImg': {
      handler(val) {
        this.customize = []
        if (val) {
          const activeImg = this.viewerOption.activeImg

          if (!activeImg.customize) {
            activeImg.customize = []
          }

          this.customize = this.customize.concat(...activeImg.customize)
          activeImg.img = activeImg[this.viewerOption.imgKey]
          activeImg.fill = 'contain'
          activeImg.clip = true
          activeImg.show = true

          this.$nextTick(() => {
            this.isFirst = this.finalTools.switch[0].option.buttons[0].disabled = val.imgIndex === 0
            this.isLast = this.finalTools.switch[0].option.buttons[1].disabled = val.imgIndex === this.imageSvgList.length - 1
          })
        }

        this.customizeActive = []
        this.customize.forEach(cus => {
          this.customizeActive.push(cus.name)
        })
      },
      deep: true
    },
    'viewerOption.lock'(val) {
      this.$set(this.viewerOption.activeImg, 'model', val ? 'painter' : 'viewer')

      this.$set(this.viewerOption.activeImg, 'drawOption', {
        fill: 'none',
        'stroke-width': 2,
        stroke: 'rgb(255, 58, 51)'
      })

      this.viewerOption.activeImg = deepClone(this.viewerOption.activeImg)
    },
    'viewerOption.imageList': {
      handler(val) {
        this.imageSvgList = []

        if (val) {
          val.forEach((image, imgIndex) => {
            this.imageSvgList.push({
              img: image[this.viewerOption.imgKey],
              fill: 'cover',
              show: true,
              imgIndex: imgIndex,
              ...image
            })
          })
        }
      },
      deep: true
    },
    'transform.scale'(val) {
      const slider = this.finalTools.zoom[1]

      let sliderValue = 0
      if (val >= 1) {
        sliderValue = Number((val * 100).toFixed(0))
      } else {
        sliderValue = Number((100 - (100 - val * 100) * 3).toFixed(0))
      }

      slider.option.value = sliderValue

      this.finalTools.zoom[0].option.buttons[0].disabled = this.transform.scale === 0.5

      this.finalTools.zoom[2].option.buttons[0].disabled = this.transform.scale === 5

      if (this.isDragSlider) return

      slider.option.refs.setPosition(0)

      clearTimeout(this.zoomTimer)
      this.zoomTimer = null
      this.zoomTimer = setTimeout(function() {
        slider.option.refs.$refs.button1.hideTooltip()
      }, 1000)
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {

  },
  methods: {
    init() {
      if (Object.keys(this.componentOption).length) {
        this.viewerOption = this.componentOption
      } else if (this.imageList.length) {
        this.viewerOption = this
      } else {
        this.viewerOption = this.imageViewer || deepClone(this.reset())
      }

      if (this.viewerOption.appendToBody) {
        document.body.appendChild(this.$el)
      }

      this.getImageViewRef()
    },
    reset() {
      return {
        show: false,
        imageHeader: '图片查看',
        imgKey: 'url',
        listHeader: '列表',
        infoHeader: '分析结果',
        infoDisplay: {},
        infoComponent: null,
        infoSpecial: {},
        imageList: [],
        imageTools: {},
        appendToBody: false,
        activeImg: {},
        clipImage: [],
        lock: false
      }
    },

    getImageViewRef() {
      this.$nextTick(() => {
        this.$emit('getImageViewRef', this.$refs)

        this.$store.dispatch('image/getImageViewRef', this.$refs)
      })
    },

    changeComponentValue(value, key, image) {
      const activeImage = this.viewerOption.imageList[image.imgIndex]

      activeImage[key] = value

      image[key] = value

      this.$store.dispatch('button/simulateButton', 'changeComponentValue')
      this.$store.dispatch('button/assignScopeData', image)
    },

    clickTool(value) {
      const { transform } = this
      let zoomRate = 0.1
      switch (value) {
        case 'prev':
          this.switchActiveImg('prev')
          break
        case 'next':
          this.switchActiveImg('next')
          break
        case 'zoomIn':
          zoomRate = transform.scale >= 1 ? (transform.scale >= 2 ? (transform.scale >= 3 ? 1 : 0.5) : 0.25) : 0.1
          this.handleActions('zoomIn', {
            zoomRate: zoomRate,
            enableTransition: true
          })
          break
        case 'zoomOut':
          zoomRate = transform.scale > 1 ? (transform.scale >= 2 ? (transform.scale >= 3 ? 1 : 0.5) : 0.25) : 0.1
          this.handleActions('zoomOut', {
            zoomRate: zoomRate,
            enableTransition: true
          })
          break
        default:
      }
    },
    deviceSupportInstall() {
      this._keyDownHandler = rafThrottle(e => {
        const keyCode = e.keyCode
        switch (keyCode) {
          // ESC
          case 27:
            this.handleClose()
            break
          // LEFT_ARROW
          case 37:
            this.switchActiveImg('prev')
            break
          // UP_ARROW
          case 38:
            this.handleActions('zoomIn')
            break
          // RIGHT_ARROW
          case 39:
            this.switchActiveImg('next')
            break
          // DOWN_ARROW
          case 40:
            this.handleActions('zoomOut')
            break
        }
      })

      this._mouseWheelHandler = rafThrottle(e => {
        if (!this.inPicture) return

        const delta = e.wheelDelta ? e.wheelDelta : -e.detail
        const { transform } = this

        if (delta > 0) {
          this.handleActions('zoomIn', {
            zoomRate: transform.scale >= 2 ? 0.25 : 0.1,
            enableTransition: true
          })
        } else {
          this.handleActions('zoomOut', {
            zoomRate: transform.scale > 2 ? 0.25 : 0.1,
            enableTransition: true
          })
        }
      })

      on(document, 'keydown', this._keyDownHandler)
      on(document, mousewheelEventName, this._mouseWheelHandler)

      // on(document.querySelector)
    },
    deviceSupportUninstall() {
      off(document, 'keydown', this._keyDownHandler)
      off(document, mousewheelEventName, this._mouseWheelHandler)
      this._keyDownHandler = null
      this._mouseWheelHandler = null
    },
    handleActions(action, options = {}) {
      if (this.forbidEvent) {
        return
      }

      this.isDragSlider = false
      const { transform } = this

      const scale = action === 'zoomIn' ? (transform.scale >= 2 ? 0.25 : 0.1) : (transform.scale > 2 ? 0.25 : 0.1)
      const { zoomRate, enableTransition } = {
        zoomRate: scale,
        enableTransition: true,
        ...options
      }
      switch (action) {
        case 'zoomOut':
          if (transform.scale > 0.5) {
            let scale = transform.scale - zoomRate
            if (scale < 0.5) scale = 0.5
            transform.scale = parseFloat(scale.toFixed(3))
          }
          break
        case 'zoomIn':
          if (transform.scale < 5) {
            let scale = transform.scale + zoomRate
            if (scale > 5) scale = 5
            transform.scale = parseFloat(scale.toFixed(3))
          }
          break
      }
      transform.enableTransition = enableTransition
    },
    handleMouseDown(e) {
      if (this.forbidEvent) {
        return
      }

      if (e.button !== 0) return
      if (this.viewerOption.lock) return

      const { offsetX, offsetY } = this.transform
      const startX = e.pageX
      const startY = e.pageY
      this._dragHandler = rafThrottle(ev => {
        this.transform.offsetX = offsetX + ev.pageX - startX
        this.transform.offsetY = offsetY + ev.pageY - startY
        this.transform.enableTransition = false
      })
      on(document, 'mousemove', this._dragHandler)
      on(document, 'mouseup', ev => {
        off(document, 'mousemove', this._dragHandler)
      })

      e.preventDefault()
    },
    changeActiveImg(imgItem) {
      this.viewerOption.clipImage = []

      this.viewerOption.activeImg = deepClone(imgItem)

      this.$nextTick(() => {
        this.calcWidth()
      })
    },
    switchActiveImg(type) {
      if (this.forbidEvent) {
        return
      }

      this.viewerOption.clipImage = []

      let activeCache = {}

      if (type === 'prev') {
        if (this.isFirst) return

        activeCache = deepClone(this.imageSvgList[this.viewerOption.activeImg.imgIndex - 1])
      } else if (type === 'next') {
        if (this.isLast) return

        activeCache = deepClone(this.imageSvgList[this.viewerOption.activeImg.imgIndex + 1])
      }

      this.viewerOption.activeImg = activeCache

      this.$nextTick(() => {
        this.calcWidth()
      })
    },
    calcWidth() {
      const keys = Object.keys(this.viewerOption.infoDisplay)
      keys.forEach(key => {
        const blockWidth = this.$refs['infoBlock' + key] && this.$refs['infoBlock' + key][0].offsetWidth
        const contentWidth = this.$refs['infoContent' + key] && this.$refs['infoContent' + key][0].offsetWidth

        this.$set(this.overflow, key, contentWidth > blockWidth)
      })
    },
    changeInput(value) {
      this.isDragSlider = true

      if (this.viewerOption.show) {
        const { transform } = this

        let scale = 1
        if (value >= 100) {
          scale = value / 100
        } else {
          scale = (value + (100 - value) * 2 / 3) / 100
        }

        transform.scale = parseFloat(scale.toFixed(3))
      }
    },
    imgLoaded(img) {
      this.$set(img, 'loaded', true)

      this.imageError = false
    },
    imgError() {
      this.imageError = true
    },
    getSvgPainterClipImage(clip) {
      this.$set(this.viewerOption, 'clipImage', clip)
      this.$store.dispatch('image/setImageViewer', { key: 'clipImage', value: this.viewerOption.clipImage })
    },

    dispose() {
      this.transform = {
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      }
    },
    handleClose() {
      this.deviceSupportUninstall()

      this.dispose()

      this.$store.dispatch('image/initImageViewer')
    }
  }
}
</script>

<style lang="scss">
.image-viwer-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  background-color: rgba(17, 18, 18, .3);
  overflow: hidden;
  z-index: 1200;

  .image-viwer__mask {
    position: relative;
    flex: 1;
    display: flex;
    justify-content: center;
    overflow: hidden;

    .image-viwer__content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      .image-viwer__content__item {
        max-height: 60%;
        max-width: 100%;
        display: flex;
        border: 4px solid rgba(17, 18, 18, 0);

        .image-viwer__img {
          flex: unset;

          .el-image__inner {
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
          }
        }

        &.is-error {
          height: 60%;
          aspect-ratio: 16 / 9;

          .image-viwer__img {
            flex: 1;
          }
        }

        &.is-locked {
          border: 4px solid rgba(24, 114, 240, 1);
        }

        .image-viwer__content__video {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 100;
        }
      }
    }

    .image-viwer__tools {
      position: absolute;
      min-height: 56px;
      max-width: 900px;
      display: flex;
      align-items: center;
      background-color: #fff;
      box-shadow: 0px 0px 5px -1px rgba(7, 14, 23, 0.35);
      border-radius: 8px;
      bottom: 5%;

      .image-viwer__tools__item {
        display: flex;
        padding: 4px 16px;

        &.image-viwer__tools__divide {
          border-right: 1px solid rgba(14, 27, 46, 0.15);
        }

        .image-viwer__tools__item__component {
          display: flex;
          align-items: center;
          line-height: 1;

          &.image-viwer-switch {

            .button-span-layout {

              &+.button-span-layout {
                margin-left: 8px;
              }
            }
          }

          &.image-viwer-zoom-slider {
            width: 100px;
            margin: 0 8px;

            .slider-assembly-container {

              .el-slider__runway {
                height: 2px;
                background-color: rgba(14, 27, 46, 0.1);
                margin: 0;

                .el-slider__bar {
                  height: 2px;
                  background-color: rgba(27, 53, 89, 1);
                }

                .el-slider__button-wrapper {
                  height: 10px;
                  width: 6px;
                  top: -4px;

                  .el-slider__button {
                    width: 6px;
                    height: 10px;
                    border:1px solid rgba(27, 53, 89, 1);
                    background-color: rgba(27, 53, 89, 1);
                    border-radius: 2px;
                    transform: scale(1);
                  }
                }
              }
            }
          }
        }

        .el-button {

          svg {
            font-size: 16px;
            color: rgba(27, 53, 89, 1);
            border-radius: 4px;
            padding: 4px;

            &:hover {
              color: #1872f0;

              background-color: rgba(24, 114, 240, 0.1);
            }
          }

          &.is-active {
            color: rgba(245, 249, 255, 1);
            background-color: rgba(24, 114, 240, 1);

            svg {
              color: rgba(245, 249, 255, 1);
            }
          }

          &.is-disabled {

            svg:hover {
              color: rgba(27, 53, 89, 1);

              background-color: unset;
            }
          }
        }

        .image-viewer-button {

          .button-group-container {
            display: inline-block;

            .button-span-layout {
              display: inline-block;
              overflow: hidden;
              margin-right: 4px;

              &:last-of-type {
                margin-right: 0;
              }

              &+.button-span-layout {
                margin-left: 0;
              }
            }
          }

          .el-button {
            font-size: 12px;
            border-color: #fff;
            padding: 8px 15px;

            svg {
              font-size: 12px;
              padding: 0;
              margin-right: 4px;
            }

            &:hover {
              cursor: pointer;
              color: rgba(14, 27, 46, 1);
              background-color: rgba(24, 114, 240, 0.1);
            }

            &.is-active {
              color: rgba(245, 249, 255, 1);
              background-color: rgba(24, 114, 240, 1);

              svg {
                color: rgba(245, 249, 255, 1);
              }
            }
          }
        }
      }
    }
  }

  .image-viwer__sidebar {
    width: 300px;
    display: flex;
    flex-flow: column;
    background-color: #fff;
    box-shadow: 0px 0px 5px -1px rgba(7, 14, 23, 0.35);

    .el-collapse {
      border:none;

      .el-collapse-item__header {
        height: 36px;
        line-height: 36px;
        border: none;

        .el-icon-arrow-right {

          &::before {
            content: "\e6df";
          }

          &.is-active {
            transform: rotate(180deg);
          }
        }
      }

      .el-collapse-item__wrap {
        overflow: unset;
        border: none;

        .el-collapse-item__content {
          padding-bottom: 0;
        }
      }
    }

    .image-viwer__sidebar__header {
      position: relative;
      padding: 16px 24px;

      .slide-header__title {
        font-size: 18px;
        color: rgba(14, 27, 46, 1);
      }

      .image-viwer__close {
        position: absolute;
        top: 13px;
        right: 20px;
        font-size: 16px;
        padding: 4px;

        &:hover {
          cursor: pointer;
          color: rgba(255, 58, 51, 1);
        }
      }
    }

    .image-viwer__sidebar__info {
      margin: 0 24px 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(14, 27, 46, 0.15);

      .image-viwer__sidebar__info__item {

        .image-viwer__sidebar__inner__header {
          padding: 0;
        }

        .image-viwer__sidebar__inner__info {

          .slide-info-item {
            display: flex;
            align-items: center;
            line-height: 36px;
            font-size: 14px;
            overflow: hidden;

            .slide-info-label {
              color: rgba(14, 27, 46, 0.45);
              min-width: 80px;
              padding-right: 24px;
              box-sizing: border-box;
            }

            .slide-info-content {
              flex: 1;
              color: rgba(14, 27, 46, 0.85);
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }

            .slide-info-svg {
              font-size: 16px;
              color: rgba(218, 227, 240, 1);
              margin-left: 12px;
            }
          }
        }
      }
    }

    .image-viwer__sidebar__customize {
      margin: 0 24px 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(14, 27, 46, 0.15);

      .image-viwer__sidebar__customize__item {

        .image-viwer__sidebar__inner__header {
          padding: 0;
        }
      }

    }

    .image-viwer__sidebar__content {
      flex: 1;
      display: flex;
      flex-flow: column;
      overflow: hidden;

      .image-viwer__sidebar__content__block {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 0 21px;
        margin-bottom: 8px;
        overflow-y: overlay;

        &::after {
          content: "";
          width: calc((100% - 12px) / 3);
          height: 0;
          visibility: hidden;
        }

        .image-viwer__sidebar__content__item {
          position: relative;
          width: calc((100% - 12px) / 3);
          aspect-ratio: 1 / 1;
          display: flex;
          border: 2px solid #fff;
          margin-bottom: 6px;
          padding: 1px;
          overflow: hidden;

          &::before {
            content: " ";
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background-color: rgba(255,255,255,.5);
            z-index: 5;
          }

          &:hover {
            cursor: pointer;
            border: 2px solid rgba(24, 114, 240, 1);
          }

          &.is-active {
            border: 2px solid rgba(24, 114, 240, 1);

            &::before {
              content: unset;
            }
          }
        }
      }
    }

    .image-viwer__sidebar__inner__header {
      line-height: 36px;
      padding: 0 24px;

      .slide-inner-header__title {
        font-size: 14px;
        font-weight: 600;
        color: rgba(14, 27, 46, 0.85);
      }
    }
  }
}
</style>
