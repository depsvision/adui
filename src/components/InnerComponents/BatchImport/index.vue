<template>
  <div class="batch-import-container">
    <div v-if="componentOption.importStage === 'operation'" class="import-operation">
      <div class="download-template-layout">
        <span class="import-operation-title">下载模板</span>
        <div class="import-operation-block">
          <div class="download-template">
            <el-button plain @click="downloadTemplate">下载模板</el-button>
          </div>
          <span class="import-operation-tip">您也可以将数据导出并修改后，直接上传</span>
        </div>
      </div>
      <div class="import-option-layout">
        <span class="import-operation-title">上传文件</span>
        <div class="import-operation-block">
          <div class="import-option">
            <common-upload :component-option="componentOption" @handleUploadStatus="handleUploadStatus">
              <el-button plain>{{ componentOption.uploadFiles && componentOption.uploadFiles.length === 0 ?'选择文件':'重新选择' }}</el-button>
            </common-upload>
          </div>
          <span class="import-operation-tip">{{ componentOption.upLoadTip || '请选择需要导入的文件' }}</span>
          <span v-show="componentOption.uploadFiles.length > 0" class="import-operation-tip--warning">{{ componentOption.importTip }}</span>
        </div>
      </div>
    </div>
    <div v-if="componentOption.importStage === 'information'" class="import-information">
      <head-slot
        :component-option="{label:'处理结果',class: 'is-weight'}"
      >
        <div class="import-information-result">
          <el-form ref="form" :model="componentOption.dealData" label-width="150px" label-position="left">
            <el-form-item>
              <span slot="label" class="form-item-label">
                <svg-icon icon-class="unordered-fill" />
                <span>新增数据：</span>
              </span>
              <svg-icon icon-class="success-small" class="svg-blue" />
              <span>{{ componentOption.dealData.insert }}</span>
            </el-form-item>
            <el-form-item>
              <span slot="label" class="form-item-label">
                <svg-icon icon-class="unordered-fill" />
                <span>覆盖数据：</span>
              </span>
              <svg-icon icon-class="success-small" class="svg-blue" />
              <span>{{ componentOption.dealData.update }}</span>
            </el-form-item>
            <el-form-item>
              <span slot="label" class="form-item-label">
                <svg-icon icon-class="unordered-fill" />
                <span>导入失败：</span>
              </span>
              <svg-icon icon-class="error-small" class="svg-error-small" />
              <span>{{ componentOption.dealData.error.length }}</span>
            </el-form-item>
          </el-form>
        </div>
      </head-slot>
      <head-slot
        v-if="componentOption.dealData.error.length>0 || componentOption.serveError"
        :component-option="{label:'失败原因',class: 'is-weight'}"
        class="error-result-head"
      >
        <div
          class="import-information-error"
          :class="[componentOption.serveError?'is-center':'']"
        >
          <svg-icon icon-class="warning" class="svg-warning" />
          <div class="import-information-error-content">
            <span v-if="componentOption.serveError" class="error-content-title">文件格式错误，请重新上传!</span>
            <div v-else class="error-content-block">
              <span class="error-content-title">数据格式与模版不匹配，请检查后重试</span>
              <span class="error-content-detail">
                <span>问题行：</span>
                <span v-for="(err,index) in componentOption.dealData.error" :key="index">{{ err + (index !==componentOption.dealData.error.length-1? ', ':'' ) }}</span>
              </span>
            </div>
          </div>
        </div>
      </head-slot>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import HeadSlot from '@/components/Slot/HeadSlot'
import CommonUpload from '@/components/Upload/CommonUpload'

export default {
  name: 'BatchImport',
  components: { HeadSlot, CommonUpload },
  props: {
    componentOption: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters([
      'dialog'
    ])
  },
  watch: {
    'componentOption.uploadFiles'(val) {
      this.dialog.buttons.buttons[0].disabled = !val.length > 0

      this.$nextTick(() => {
        this.dialog.self.$refs.buttonGroup.$forceUpdate()
      })
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {

    },
    async downloadTemplate() {
      this.$emit('downloadTemplate', 'template')

      this.$store.dispatch('button/simulateButton', 'downloadTemplate')
    },
    handleUploadStatus(info) {
      if (info.value === 'success') {
        this.$set(this.componentOption, 'info', info)
      } else if (info.value === 'error') {
        this.$set(this.componentOption, 'info', info)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.batch-import-container {
  width: 100%;

  .import-operation {
    .import-operation-title {
      font-size: 14px;
      color: rgba(14, 27, 46, 0.65);
      line-height: 36px;
      width: 120px;
      padding-right: 24px;
      box-sizing: border-box;
    }

    .import-operation-tip {
      font-size: 12px;
      line-height: 12px;
      color:rgba(14, 27, 46, .5);
    }

    .import-operation-tip--warning {
      position: absolute;
      bottom: -20px;
      width: 332px;
      line-height: 12px;
      font-size: 12px;
      color: #FF3A33;
    }
  }

  .download-template-layout,
  .import-option-layout {
    display: flex;

    .import-operation-block {
      position: relative;
      display: flex;
      flex-flow: column;

      .download-template,
      .import-option {
        margin-bottom: 8px;
      }
    }
  }

  .download-template-layout {
    margin-bottom: 16px;
  }

  .import-information {

    :deep( .head-slot-container ) {

      .head-slot-block {
        line-height: 36px;
        height: 36px;
        margin-bottom: 0;
      }

      &:last-of-type {
        margin-top: 16px;
      }

      .head-slot-text {
        filter: opacity(.85);
      }
    }

    .import-information-result {

      :deep( .el-form .el-form-item  ) {
        margin-bottom: 0;

        .el-form-item__label,
        .el-form-item__content {
          line-height: 36px;
        }

        .el-form-item__label {
          color: rgba(14, 27, 46, .65);

          svg {
            color: rgba(14, 27, 46, 1);
            margin-right: 4px;
          }
        }

        .el-form-item__content {
          display: flex;
          align-items: center;

          svg {
            font-size: 20px;
            margin-right: 8px;

            &.svg-blue {
              color: rgba(24, 114, 240, 1);
            }
          }
        }
      }

    }

    .error-result-head {

      :deep( .head-slot-block ) {
        margin-bottom: 8px;
      }
    }

    .import-information-error {
      position: relative;
      flex: 1;
      display: flex;
      background-color: rgba(245, 247, 250, 1);
      border-radius: 4px;
      padding: 21px 21px 12px 72px;

      &.is-center {
        align-items: center;
      }

      svg {
        position: absolute;
        top: 12px;
        left: 20px;
        font-size: 32px;
      }

      .import-information-error-content {

        .error-content-title {
          font-size: 14px;
          color: rgba(7, 14, 23, 0.85);
        }

        .error-content-block {
          display: flex;
          flex-flow: column;

          span {
            line-height: 14px;
          }

          .error-content-detail {
            color: rgba(14, 27, 46, 0.65);
            line-height: 18px;
            max-height: 54px;
            overflow-y: overlay;
            padding-right: 21px;
            margin-right: -21px;
            margin-top: 8px;
          }
        }
      }
    }
  }
}
</style>
