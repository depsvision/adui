<template>
  <div v-loading="pageLoading" class="picture-analysis-container layout-bg">
    <div class="picture-analysis-buttons common-tablebox--top_button-group">
      <button-group
        ref="buttonGroup"
        :component-option="buttonGroupOption"
      />
      <warning-content
        v-show="false"
        class="license-warning"
        content="license用量已超出, 部分服务可能无法启动,"
        :buttons="[{
          label: '查看详情',
          value: 'toLicenseSetting',
          type: 'text'
        }]"
        :closeable="true"
      />
    </div>
    <div class="picture-analysis-layout common-tablebox-layout">
      <div class="picture-analysis-table common-tablebox-table">
        <form-table
          ref="formTable"
          :component-option="serveTableOption"
        />
      </div>
      <div class="picture-analysis-pager common-tablebox-pager">
        <el-pagination
          :current-page="tablePagerOption.currentPage"
          :page-sizes="tablePagerOption.pageSizesChoose"
          :page-size.sync="tablePagerOption.pageSizes"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tablePagerOption.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          @prev-click="handlePrevClick"
          @next-click="handleNextClick"
        />
      </div>
    </div>
    <common-upload v-show="false" ref="commonUpload" :component-option="uploadOption" @handleUploadStatus="handleUploadStatus">
      <el-button ref="upload">上传图片</el-button>
    </common-upload>
  </div>
</template>

<script>
import ButtonGroup from '@/components/Button/ButtonGroup'
import FormTable from '@/components/FormTable'
import CommonUpload from '@/components/Upload/CommonUpload'
import WarningContent from '@/components/WarningContent'

import mixins from './Mixins'
import testImage from '@/components/NavMenuPage/AlgorithmDispatch/PictureAnalysis/detail/Blocks/AnalysisSetting/Mixins/testImage'
import taskStart from '@/components/NavMenuPage/AlgorithmDispatch/PictureAnalysis/detail/Blocks/OperationManagement/Mixins'

export default {
  name: 'PictureAnalysis',
  components: { FormTable, ButtonGroup, CommonUpload, WarningContent },
  mixins: [mixins, testImage, taskStart],
  props: {},
  data() {
    return {
      pageLoading: false,
      buttonGroupOption: {
        buttons: [
          {
            label: '新建',
            value: 'new',
            type: 'primary'
          }
        ]
      },
      serveTableOption: {
        tableData: [],
        header: [
          {
            width: 180,
            align: 'left',
            fixed: 'right',
            label: '操作',
            type: 'buttonGroup',
            buttonGroup: {
              buttons: [
                {
                  label: '详情',
                  value: 'detail',
                  type: 'text'
                },
                {
                  label: '测试',
                  value: 'openTestInput',
                  type: 'text'
                },
                {
                  label: '启用',
                  value: 'start',
                  type: 'text'
                },
                {
                  label: '停用',
                  value: 'stop',
                  type: 'text',
                  class: 'is-danger'
                }
              ]
            }
          },
          {
            width: 80,
            align: 'left',
            label: 'ID',
            prop: 'id',
            type: 'span'
          },
          {
            minWidth: 180,
            align: 'left',
            label: '任务名称',
            prop: 'name',
            type: 'span',
            spanStyle: {
              'white-space': 'normal',
              'line-height': 1.5
            }
          },
          {
            minWidth: 280,
            align: 'left',
            label: '算法任务',
            prop: 'algorithmTasks',
            is: 'TagAssembly',
            style: {
              'flex-wrap': 'wrap',
              'margin-bottom': '-6px'
            }
          },
          {
            width: 160,
            align: 'left',
            label: '创建时间',
            prop: 'createdAt',
            type: 'span'
          },
          {
            width: 110,
            align: 'left',
            label: '任务启用状态',
            prop: 'statusName',
            type: 'span',
            class: 'font-color'
          },
          {
            width: 110,
            align: 'left',
            label: '服务健康状态',
            prop: 'serviceHealthName',
            type: 'span',
            class: 'status-mark'
          }
        ]
      },
      tablePagerOption: {
        pageSizesChoose: [10, 20, 50, 100],
        currentPage: 1,
        pageSizes: 10,
        total: 0
      }
    }
  },
  created() {
    this.init()
  },
  beforeDestroy() {
    if (this.pictureTimer) {
      clearInterval(this.pictureTimer)

      this.pictureTimer = null
    }

    if (this.serveTimer) {
      clearInterval(this.serveTimer)

      this.serveTimer = null
    }
  },
  methods: {
    init() {
      this.pageLoading = true
      this.getPictureAnalysisData()
    },
    handleSizeChange(size) {
      this.tablePagerOption.pageSizes = size
      this.pageLoading = true
      this.getPictureAnalysisData()
    },
    handleCurrentChange(page) {
      this.tablePagerOption.currentPage = page
      this.pageLoading = true
      this.getPictureAnalysisData()
    },
    handlePrevClick(page) {
      this.tablePagerOption.currentPage = page
      this.pageLoading = true
      this.getPictureAnalysisData()
    },
    handleNextClick(page) {
      this.tablePagerOption.currentPage = page
      this.pageLoading = true
      this.getPictureAnalysisData()
    }
  }
}
</script>

<style scoped lang="scss">
.picture-analysis-container {
  display: flex;
  flex-flow: column;

  .picture-analysis-buttons {
    display: flex;
    margin-bottom: 20px;

    .license-warning {
      margin-left: 16px
    }
  }

  .picture-analysis-layout{
    flex: 1;
  }

}
</style>
