<template>
  <div class="import-img-cropper-container">
    <div class="upload-view-block">
      <div class="upload-img" :style="alignImg">
        <div
          class="upload-img-block"
          :class="[componentOption.cropper?'is-cropper-img':'']"
          :style="uploadStyle"
        >
          <image-assembly
            v-if="showImg"
            :component-option="componentOption"
            @changeValue="changeValue"
          />
          <div
            v-if="!componentOption.cropper && !componentOption.value"
            class="filter-img-no-picture"
            :style="{
              'margin-top':(componentOption.marginTop || 0) + 'px'
            }"
            @click="slapUpload"
          >
            <svg-icon :icon-class="componentOption.pictureSvg || 'plus'" />
          </div>
        </div>
        <div v-if="cropperImg" class="show-preview" :style="cropperedBlock">
          <div :style="previews.div" class="preview">
            <img ref="cropperImg" :src="cropperImg" :style="previews.img">
          </div>
        </div>
        <button-group
          v-if="componentOption.buttons && componentOption.value"
          ref="buttonGroup"
          class="upload-img-button"
          :component-option="componentOption.buttons"
        />
      </div>
      <div v-show="componentOption.cropper" class="import-img-cropper-buttons">
        <el-button link type="primary" @click="confirmCropper">更新头像</el-button>
        <common-upload ref="commonUpload" :component-option="componentOption.avatarUpload" @handleUploadStatus="handleUploadStatus">
          <el-button ref="uploadButton" link type="primary">重新上传</el-button>
        </common-upload>
      </div>
      <div
        v-show="componentOption.buttons.buttonTip.show"
        v-loading="componentOption.buttons.buttonTip.loading"
        class="upload-img-button-tip font-color"
        :class="componentOption.buttons.buttonTip.headColor"
        :style="{
          height:(componentOption.height || 64) + 'px',
          'margin-top':componentOption.height?'8px':''
        }"
      >
        <span class="has-text">{{ componentOption.buttons.buttonTip.head }}</span>
        <span>{{ componentOption.buttons.buttonTip.content }}</span>
      </div>
    </div>
    <div v-if="componentOption.cropper" class="cropper-block">
      <div class="avatar-cropper-block">
        <vue-cropper
          ref="cropper"
          :img="cropperImg"
          :output-size="componentOption.cropper.size"
          :output-type="componentOption.cropper.outputType"
          :fixed="componentOption.cropper.fixed"
          :info="componentOption.cropper.info"
          :fixed-number="componentOption.cropper.fixedNumber"
          :auto-crop="componentOption.cropper.autoCrop"
          :original="componentOption.cropper.original"
          :auto-crop-width="componentOption.cropper.autoCropWidth"
          :auto-crop-height="componentOption.cropper.autoCropHeight"
          :fixed-box="componentOption.cropper.fixedBox"
          :can-move="componentOption.cropper.canMove"
          :center-box="componentOption.cropper.centerBox"
          :can-scale="componentOption.cropper.canScale"
          @imgLoad="imgLoad"
          @realTime="realTime"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import ButtonGroup from '@/components/Button/ButtonGroup'
import ImageAssembly from '@/components/InnerComponents/ImageAssembly'
import CommonUpload from '@/components/Upload/CommonUpload'

export default {
  name: 'ImportImgCropper',
  components: { VueCropper, ButtonGroup, ImageAssembly, CommonUpload },
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
      reader: null,
      previews: {},
      cropperImg: null,
      cropperedBlock: {}
    }
  },
  computed: {
    showImg() {
      if (this.componentOption.cropper) {
        return !this.cropperImg
      } else {
        return this.componentOption.value
      }
    },
    uploadStyle() {
      const style = {
        width: (this.componentOption.width || 64) + 'px',
        height: '64px'
      }

      if (this.componentOption.width && this.componentOption.height && this.componentOption.value) {
        style.width = this.componentOption.width + 'px'
        style.height = this.componentOption.height + 'px'
        style['margin-top'] = '8px'
      }

      return style
    }
  },
  mounted() {
    this.imgReader()
    this.init()
  },
  methods: {
    init() {
    },
    slapUpload() {
      this.$refs.uploadButton.$el.click()
    },
    alignImg() {
      const style = {}
      style['justify-content'] = this.componentOption.position || ''

      if (this.componentOption.cropper) {
        style['justify-content'] = 'center'
      }

      return style
    },
    imgLoad(status) {
      if (status === 'success') {
        const cropper = this.$refs.cropper
        let wh = ''
        if (cropper.trueWidth < cropper.trueHeight) {
          wh = cropper.trueWidth * cropper.scale
        } else {
          wh = cropper.trueHeight * cropper.scale
        }
        cropper.changeCrop(wh, wh)
      }
    },
    realTime(data) {
      this.cropperedBlock = {
        width: data.w + 'px',
        height: data.h + 'px',
        zoom: 48 / data.h
      }
      this.previews = data
    },
    dealImg(file) {
      this.reader.readAsArrayBuffer(file)
    },
    imgReader() {
      this.reader = new FileReader()
      this.reader.onload = e => {
        let data
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        this.cropperImg = data
      }
    },
    confirmCropper() {
      const that = this
      if (this.cropperImg) {
        this.$refs.cropper.getCropBlob(data => {
          that.$refs.commonUpload.$refs.upload.handleStart(data)
        })
      } else {
        this.$messageInfo({
          type: 'warning',
          message: '请先上传图片！'
        })
      }
    },
    cancelCropper() {
      this.cropperImg = null
    },
    handleUploadStatus(info) {
      if (info.value === 'ready') {
        if (Object.prototype.toString.call(info.arg[0].raw) === '[object Blob]') {
          info.arg[0].raw.name = 'cropper.jpeg'
          // file.raw = new File([file.raw], 'cropper.jpeg', {
          //   type: file.raw.type
          // })
          this.$refs.commonUpload.$refs.upload.$children[0].post(info.arg[0].raw)
        } else {
          if (this.componentOption.cropper) {
            this.dealImg(info.arg[0].raw)
          }
        }
      } else if (info.value === 'success') {
        this.componentOption.value = info.arg[0].response.data.url
        this.componentOption[this.componentOption.prop + 'Path'] = info.arg[0].response.data.path
        this.$emit('changeValue', info.arg[0].response.data.url, this.componentOption)

        this.cropperImg = null
      } else if (info.value === 'error') {
        this.$messageInfo({
          type: 'error',
          message: '上传失败！'
        })
      }
    },
    changeValue(val) {
      this.componentOption[this.componentOption.prop + 'Path'] = ''
      this.$emit('changeValue', val)
    }
  }
}
</script>

<style scoped lang="scss">
.import-img-cropper-container {
  display: flex;
  align-items: center;

  .upload-view-block {
    flex: 1;
    display: flex;

    .upload-img {
      position: relative;
      display: flex;
      flex-flow: column;

      .upload-img-block {
        display: flex;

        &.is-cropper-img {
          :deep( .el-image ) {

            img {
              height: 48px;
              width: 48px;
              border-radius: 50%;
            }
          }
        }

        .filter-img-no-picture {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(27, 53, 89, 0.2);
          border: 1px solid rgba(27, 53, 89, 0.2);
          border-radius: 4px;

          &:hover {
            color: #1872F0;;
            border-color: #1872F0;
            cursor: pointer;

            svg {
              color: #1872F0;
            }
          }

          svg {
            font-size: 24px;
            color: #868D96;
          }
        }
      }

      .show-preview {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        overflow: hidden;
        border-radius: 50%;
      }

      :deep( .upload-img-button ) {
        line-height: 1;
        margin-top: 24px;

        .el-button {
          span {
            font-size: 12px;
            display: flex;
            align-items: center;
          }
        }
      }
    }

    .import-img-cropper-buttons {
      display: flex;
      justify-content: center;
      margin-top: 24px;

      .common-upload-container {
        margin-left: 24px;
      }
    }

    .upload-img-button-tip {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-flow: column;
      margin-left: 24px;
      padding: 0 20px;

      span {

        &:first-child {
          line-height: 14px;
          font-size: 14px;
        }

        &:last-of-type {
          line-height: 20px;
          font-size: 12px;
          color: rgba(14, 27, 46, 0.65);
          margin-top: 8px;
        }
      }

      :deep( .el-loading-mask  ) {

        .el-loading-spinner {
          display: flex;
          align-items: center;
          justify-content: center;

          svg {
            width: 24px;
            height: 24px;
          }
        }
      }
    }
  }

  .cropper-block {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    :deep( .avatar-cropper-block ) {
      width: 150px;
      height: 150px;

      .cropper-box {
        background-color: #000;
      }
      .point1,.point3,.point6,.point8 {
        width: 10px;
        height: 10px;
        border: 1px solid #fff;
        border-radius: unset;
      }
      .point1 {
        top: -12px;
        left: -12px;
      }
      .point3 {
        top: -12px;
        right: -12px;
      }
      .point6 {
        bottom: -12px;
        left: -12px;
      }
      .point8 {
        bottom: -12px;
        right: -12px;
      }
      .crop-point {
        background-color: unset;
      }
      .cropper-view-box {
        outline: 1px solid #fff;
      }
    }
  }
}
</style>
