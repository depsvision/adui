<!--
 * @Descripttion:
 * @version:
 * @Author: Jianyong Wang
 * @Date: 2021-06-03 16:52:43
 * @LastEditors: Jianyong Wang
 * @LastEditTime: 2021-06-16 20:01:19
-->
<template>
  <div v-loading="componentOption.isLoading" class="roi-container bsizing">
    <div class="has-img">
      <header class="header flex-v-c bsizing">
        <!-- 绘制工具渲染 -->
        <div
          v-for="item in componentOption.drawTools"
          :key="item.type"
          :class="[
            'draw-shape tool-item bsizing',
            'draw-shape-' + item.type,
            item.last?'draw-shape-last' : '',
            componentOption.isLock ? 'disabled' : ''
          ]"
          @click="handleDraw(item.type)"
        >
          <div
            :class="[
              'tool-item-wrapper flex-v-c bsizing',
              item.type === shape && mode === 'draw' ? 'active' : ''
            ]"
            :style="{
              flexDirection: item.text ? 'column' : ''
            }"
          >
            <div
              :class="[
                'tool-icon',
                'tool-item-' + item.type + '-icon'
              ]"
            />
            <div class="tool-text">
              {{ item.text }}
            </div>
          </div>

        </div>

        <!-- 操作工具栏 -->
        <div
          v-for="item in componentOption.tools"
          :key="item.type"
          :class="[
            'operate-tool-item tool-item bsizing',
            'tool-item-' + item.type,
            item.last?'draw-shape-last' : '',
            item.right?'draw-right-first':''
          ]"
          @click="handleSelectTool(item.type)"
        >
          <el-slider
            v-if="item.type === 'progressBar'"
            v-model="scale"
            :min="min"
            :max="max"
            :step="step"
            :format-tooltip="formatTooltip"
            @change="setScale"
          />

          <div
            v-else
            :class="['tool-item-wrapper flex-v-c bsizing', item.type === mode ? 'active' : '']"
            :style="{
              flexDirection: item.text ? 'column' : ''
            }"
          >
            <svg-icon v-if="item.svg" :icon-class="item.svg" />
            <div v-else :class="['tool-icon', 'tool-item-' + item.type + '-icon']" />
            <div v-if="item.text" class="tool-text">
              {{ item.text }}
            </div>
          </div>
        </div>
      </header>
      <div class="roi-img bsizing" :style="componentOption.roiStyle" />
    </div>

    <input v-show="false" type="file" accept="image/*" class="none upload-input" @change="uploadInputChange">
  </div>
</template>

<script>
import LabelImg from './labelImg'
import { deepClone } from '@/utils'
import mousePoint from '@/assets/roi/mouse-point.png'
import mousePolyline from '@/assets/roi/mouse-polyline.png'
import mouseRect from '@/assets/roi/mouse-rect.png'
import mousePolygon from '@/assets/roi/mouse-polygon.png'

export default {
  components: {

  },
  props: {
    componentOption: {
      type: Object,
      default: function() {
        return {
          img: '',
          upload: async() => { return 1 },
          dragImg: async() => { return 1 },
          initData: [],
          save: () => {},
          // 操作工具
          tools: [
            { type: 'drag', name: '平移', text: '平移', last: true },
            // { type: 'shrink', name: '缩小', text: '' },
            // { type: 'progressBar', name: '进度条', text: '' },
            // { type: 'magnify', name: '放大', text: '' },
            { type: 'repeal', name: '撤销', text: '撤销' },
            { type: 'clean', name: '清空', text: '清空' },
            { type: 'dragImg', name: '获取抓图', text: '获取抓图', svg: 'camera', right: true },
            { type: 'upload', name: '上传图片', text: '上传图片' }
          ],
          //  绘制工具
          drawTools: [
            // { type: 'point', name: '点', text: '点', max: 10 }
            // { type: 'polyline', name: '线', text: '线' },
            { type: 'rect', name: '矩形', text: '矩形' },
            { type: 'polygon', name: '多边形', text: '多边形' }
          ],
          drawEnd: () => {},
          clean: () => {},
          //  初始化绘制形状
          initShape: '',
          //  画布是否锁定
          isLock: false
        }
      }
    }
  },
  data() {
    return {
      scale: 1,
      min: 1,
      max: 3,
      step: 0.1,
      mode: 'draw', //  模式 draw--绘制 drag--拖拽
      shape: '', //  绘制形状
      roiInstance: null,
      points: [],
      shapeIcon: {
        point: mousePoint,
        polyline: mousePolyline,
        rect: mouseRect,
        polygon: mousePolygon
      },
      drawedNum: {

      }
    }
  },
  watch: {
    // 'componentOption.img': {
    //   handler(val) {
    //     console.log('initRoi created watch', val)
    //     if (!val) {
    //       console.log('图片地址为空')
    //       return
    //     }

    //     if (this.roiInstance) {
    //       return
    //     }

    //     this.points = deepClone(this.componentOption.initData)

    //     this.$nextTick(() => {
    //       console.log('initRoi created watch')
    //       this.initRoi(val, this.componentOption.initData)
    //     })
    //   }
    // }
    'componentOption.isLock': {
      handler(val) {
        this.$nextTick(() => {
          if (!val) {
            this.handleDraw(this.componentOption.initShape)
          }
        })
      },
      immediate: true
    }
  },
  mounted() {
    console.log('roi mounted')
    if (!this.componentOption.img) {
      return
    }

    this.points = deepClone(this.componentOption.initData)
    this.initRoi(this.componentOption.img, this.componentOption.initData)
  },
  beforeDestroy() {
    this.dispose()
  },
  methods: {
    initRoi(img, initData) {
      this.componentOption.isLoading = true
      const shapeIcon = this.shapeIcon
      const el = this.$el.querySelector('.roi-img')
      const w = el.offsetWidth
      const h = el.offsetHeight
      const shape = this.componentOption.isLock ? '' : this.componentOption.initShape

      console.log('roi init this.isLock', this.componentOption.isLock)

      this.roiInstance = new LabelImg({
        el,
        w,
        h,
        shape,
        shapeIcon,
        imgOnloadCb: this.imgOnloadCb,
        showMask: this.componentOption.showMask,
        url: img,
        isLock: false,
        initData,
        isMouseWheel: this.componentOption.isMouseWheel,
        drawEnd: this.handleDrawEnd,
        maskInfo: {
          x: 0.178,
          y: 0.072,
          w: 0.546,
          h: 0.531,
          color: 'rgba(248, 47, 7, 0.3)'
        }
      })
    },
    //  背景图加载完成
    imgOnloadCb() {
      this.componentOption.isLoading = false
    },
    //  工具选择
    handleSelectTool(type) {
      const eventType = 'handle' + type.replace(type[0], type[0].toUpperCase())

      if (type === 'progressBar') {
        //  console.log('缩放条点击')
        return
      }

      this[eventType]()
    },
    //  绘画
    handleDraw(shape) {
      this.mode = 'draw'

      if (this.shape === shape) {
        return
      }

      this.shape = shape
      const instance = this.roiInstance

      if (!instance) {
        return
      }

      //  画布锁定
      if (this.componentOption.isLock) {
        console.log('roi lock')
        this.shape = ''
        instance.setType('draw')
        return
      }

      instance.setType('draw')
      instance.setDrawShape(shape)
      // instance.setAxisIsShow(true)
      instance.removeCurShapeEls()
    },
    //  绘制完成
    handleDrawEnd(shape, shapeInfo) {
      //  console.log('handleDrawEnd', shape, shapeInfo)
      const instance = this.roiInstance
      this.shape = ''
      instance.setType('draw')
      instance.setDrawShape('')

      const drawEnd = this.componentOption.drawEnd
      drawEnd && drawEnd(shapeInfo)

      this.points.push(shapeInfo)
    },
    //  拖拽
    handleDrag() {
      this.mode = 'drag'
      const instance = this.roiInstance

      if (!instance) {
        return
      }

      this.shape = ''
      instance.removeCurShapeEls()
      instance.setType('drag')
    },
    //  缩小
    handleShrink() {
      this.scale--

      if (this.scale <= this.min) {
        this.scale = this.min
      }

      this.setScale(this.scale)
    },
    //  放大
    handleMagnify() {
      this.scale++

      if (this.scale >= this.max) {
        this.scale = this.max
      }

      this.setScale(this.scale)
    },
    //  放大缩小函数
    setScale(scale) {
      const instance = this.roiInstance
      instance && instance.setScale(scale)
    },
    //  抓图按钮
    async  handleDragImg() {
      this.componentOption.isLoading = true
      const url = await this.componentOption.dragImg()
      this.componentOption.isLoading = false

      if (url) {
        if (!this.roiInstance) {
          this.$nextTick(() => {
            this.points = deepClone(this.componentOption.initData)
            this.initRoi(url, this.componentOption.initData)
          })
          return
        }

        this.handleSwitchImg(url)
      }
    },
    //  上传按钮
    handleUpload() {
      console.log('handleUpload')
      const uploadInput = this.$el.querySelector('.upload-input')
      uploadInput.click()
    },
    async uploadInputChange(e) {
      const file = e.target.files[0]
      //  console.log('uploadInputChange file', file)
      e.target.value = ''

      this.componentOption.isLoading = true
      const url = await this.componentOption.upload(file)
      this.componentOption.isLoading = false

      if (url) {
        if (!this.roiInstance) {
          this.$nextTick(() => {
            this.points = deepClone(this.componentOption.initData)
            this.initRoi(url, this.componentOption.initData)
          })
          return
        }

        this.handleSwitchImg(url)
      }
    },
    //  切换底图
    handleSwitchImg(url) {
      const instance = this.roiInstance

      this.scale = 1
      instance.setScale(1)
      //  this.handleClean()

      instance.addImg(url)
      console.log('清空并重新替换底图')
    },
    //  撤销
    handleRepeal() {
      const instance = this.roiInstance

      if (!instance) {
        return
      }

      instance.repeal()
      this.points.pop()

      console.log('撤销', this.points)
    },
    //  清空
    handleClean() {
      //  console.log('handleClean')
      const instance = this.roiInstance
      instance && instance.clean()
      this.points = []

      const clean = this.componentOption.clean
      clean && clean()
    },
    //  格式化显示
    formatTooltip(val) {
      return Math.floor(val * 100) + '%'
    },
    getData() {
      return this.points
    },
    dispose() {
      console.log('roi dispose')
      const instance = this.roiInstance
      instance && instance.dispose()
      this.roiInstance = null
    }
  }
}
</script>

<style lang="scss">
  .roi-container {
    height: 100%;
    position: relative;

    .has-img {
      display: flex;
      flex-direction: column;
      height: 100%;

      .header {
        height: 40px;
        display: flex;
        align-items: center;
        background: #F5F7FA;
        border-radius: 4px;
        white-space: nowrap;
        overflow-x: overlay;
        overflow-y: hidden;
        position: relative;
        padding: 4px 8px;

        .tool-item {
          display: inline-block;
          margin-right: 8px;
          color: rgba(14, 27, 46, 1);
          font-size: 12px;
        }

        .tool-item-wrapper {
          min-width: 40px;
          height: 40px;
          display: flex;
          flex-flow: column;
          align-items: center;
          padding: 2px 6px 4px 6px;
          // flex-direction: column;
          cursor: pointer;
          border-radius: 4px;

          .tool-icon {
            width: 20px;
            height: 20px;
          }

          svg {
            font-size: 20px;
          }

          .tool-text {
            margin-top: 4px;
            line-height: 1;
          }

          &:hover {
            background: rgba(14, 27, 46, 0.05);
          }
          .tool-item-point-icon {
            background: url('../../assets/roi/point.png') no-repeat center center;
            background-size: contain;
          }
          .tool-item-polyline-icon {
            background: url('../../assets/roi/polyline.png') no-repeat center center;
            background-size: contain;
          }
          .tool-item-rect-icon {
            background: url('../../assets/roi/rect.png') no-repeat center center;
            background-size: contain;
          }
          .tool-item-polygon-icon {
            background: url('../../assets/roi/polygon.png') no-repeat center center;
            background-size: contain;
          }
          .tool-item-drag-icon {
            background: url('../../assets/roi/drag.png') no-repeat center center;
            background-size: contain;
          }
          .tool-item-shrink-icon {
            background: url('../../assets/roi/shrink.png') no-repeat center center;
            background-size: contain;
          }
          .tool-item-magnify-icon {
            background: url('../../assets/roi/magnify.png') no-repeat center center;
            background-size: contain;
          }
          .tool-item-repeal-icon {
            background: url('../../assets/roi/repeal.png') no-repeat center center;
            background-size: contain;
          }
          .tool-item-clean-icon {
            background: url('../../assets/roi/clean.png') no-repeat center center;
            background-size: contain;
          }
          .tool-item-upload-icon {
            background: url('../../assets/roi/upload.png') no-repeat center center;
            background-size: contain;
          }

          &:active {
            color: rgba(24, 114, 240, 1);

            .tool-item-shrink-icon {
              background: url('../../assets/roi/shrink-active.png') no-repeat center center;
              background-size: contain;
            }
            .tool-item-magnify-icon {
              background: url('../../assets/roi/magnify-active.png') no-repeat center center;
              background-size: contain;
            }
            .tool-item-repeal-icon {
              background: url('../../assets/roi/repeal-active.png') no-repeat center center;
              background-size: contain;
            }
            .tool-item-clean-icon {
              background: url('../../assets/roi/clean-active.png') no-repeat center center;
              background-size: contain;
            }
            .tool-item-upload-icon {
              background: url('../../assets/roi/upload-active.png') no-repeat center center;
              background-size: contain;
            }
          }
          &.active {
            .tool-item-point-icon {
              background: url('../../assets/roi/point-active.png') no-repeat center center;
              background-size: contain;
            }
            .tool-item-polyline-icon {
              background: url('../../assets/roi/polyline-active.png') no-repeat center center;
              background-size: contain;
            }
            .tool-item-rect-icon {
              background: url('../../assets/roi/rect-active.png') no-repeat center center;
              background-size: contain;
            }
            .tool-item-polygon-icon {
              background: url('../../assets/roi/polygon-active.png') no-repeat center center;
              background-size: contain;
            }
            .tool-item-drag-icon {
              background: url('../../assets/roi/drag-active.png') no-repeat center center;
              background-size: contain;
            }
          }
        }
        .draw-shape .tool-item-wrapper.active, .tool-item-drag .tool-item-wrapper.active {
          .tool-text {
            color: rgba(24, 114, 240, 1);
          }
        }

        .tool-item-magnify {
          &:before {
            right: -4px;
          }
        }

        .tool-item-magnify, .tool-item-shrink {
          .tool-item-wrapper {
            width: 24px;
            height: 24px;
            padding: 0;
            justify-content: center;
          }
        }
        .tool-item-progressBar, .tool-item-shrink {
          margin-right: 4px;
        }

        .el-slider {
          width: 100px;

          .el-slider__button  {
            width: 8px;
            height: 8px;
            background-color: rgba(24, 114, 240, 1);
            border: none;
          }
          .el-slider__runway, .el-slider__bar {
            height: 2px;
          }
          .el-slider__bar {
            background: #1872F0;
          }
        }

        .draw-shape-last {
          margin-right: 17px;
          position: relative;

          &:before {
            display: block;
            content: "";
            width: 1px;
            height: 28px;
            background: rgba(14, 27, 46, 0.1);
            position: absolute;
            top: 50%;
            right: -8px;
            transform: translateY(-50%);
          }
        }

        .draw-right-first {
          margin-left: auto;
        }
      }

      .roi-img {
        width: 100%;
        margin-top: 16px;
        overflow: hidden;
        background: linear-gradient(to right,rgba(14, 27, 46, 0.1) 1px,transparent 1px),
          linear-gradient(to bottom,rgba(14, 27, 46, 0.1) 1px,transparent 1px);
        background-repeat: repeat;
        background-size: 10px 10px;
        border: 1px solid rgba(14, 27, 46, 1);
      }
    }

    .el-loading-mask {

      .el-loading-spinner {
        top:calc(50% + 32px)
      }
    }
  }
</style>
