<template>
  <div class="common-upload-container">
    <el-upload
      ref="upload"
      class="common-upload-block"
      :class="{'can-remove':!componentOption.canRemove}"
      :action="uploadUrl()"
      :headers="uploadHeaders"
      :limit="componentOption.limit"
      :data="componentOption.data"
      :drag="componentOption.drag"
      :show-file-list="componentOption.showFileList"
      :file-list="componentOption.fileList"
      :accept="componentOption.accept"
      :multiple="componentOption.multiple"
      :list-type="componentOption.listType"
      :auto-upload="componentOption.autoUpload"
      :on-change="getUploadStatus"
      :on-exceed="onExceed"
      :before-upload="beforeUpload"
    >
      <slot :slot="componentOption.slot" />
    </el-upload>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { handleErrorCode } from '@/utils/error'

import Storage from '@/utils/token'

export default {
  name: 'CommonUpload',
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

    }
  },
  computed: {
    ...mapGetters([
      'button'
    ]),
    uploadHeaders() {
      const accessToken = Storage.getLocal('accessToken') || ''

      return {
        Authorization: `Bearer ${accessToken}`
      }
    }
  },
  watch: {
    'button.value'(val) {
      this.clickButton(val)
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getFileList()
    },
    clickButton(value) {
      switch (value) {
        case 'manualUpload':
          this.manualUpload()
          break
        default:
      }
    },
    getFileList() {
      this.componentOption.uploadFiles = this.$refs.upload.uploadFiles
    },
    uploadUrl() {
      const url = location.origin
      return url + '/api/' + this.componentOption.action
    },
    getUploadStatus(file, fileList) {
      if (file.status === 'ready') {
        if (fileList.length > 1 && !this.componentOption.notShiftFile) {
          fileList.shift()
        }
        this.handleUploadEmit('ready', file, fileList)
      } else if (file.status === 'success') {
        this.$refs.upload.clearFiles()

        if (fileList[0].response.requestInfo.flag) {
          this.handleUploadEmit('success', file, fileList)
        } else {
          handleErrorCode(fileList[0].response.data.errorCode)

          this.handleUploadEmit('error', file, fileList)
        }
      } else if (file.status === 'error') {
        this.handleUploadEmit('error', file, fileList)
      }
    },
    beforeUpload(file) {
      file
    },
    onExceed(file, fileList) {
      this.handleUploadEmit('exceed', file, fileList)
    },
    handleUploadEmit(value, ...arg) {
      this.$emit('handleUploadStatus', { value: value, arg: arg })
    },
    clearFiles() {
      this.$refs.upload.clearFiles()
    },
    manualUpload() {
      this.$refs.upload.submit()
    }
  }
}
</script>

<style scoped lang="scss">
.common-upload-container{

  ::v-deep .common-upload-block {
    display: flex;

    .el-upload-list {
      position: relative;
      display: flex;
      flex-flow: column;
      justify-content: center;
      margin-left: 16px;

      .el-upload-list__item {
        position: fixed;
        width: auto;
        max-width: 206px;
        margin: 0;

        .el-upload-list__item-name {
          font-size: 13px;
          color: #0E1B2E;
          padding-left: 0;
          margin-right: 0;

          [class^=el-icon] {
            margin-right: 8px;
          }
        }
      }
    }

    &.can-remove {
      .el-upload-list {
        pointer-events: none;
      }
    }
  }
}
</style>
