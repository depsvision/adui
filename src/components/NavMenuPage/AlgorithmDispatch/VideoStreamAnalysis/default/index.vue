<template>
  <div v-loading="pageLoading" class="video-stream-analysis-container layout-bg">
    <div class="video-stream-analysis-buttons">
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
    <div class="video-stream-analysis-layout common-tablebox-layout">
      <div class="video-stream-analysis-table common-tablebox-table">
        <form-table
          ref="formTable"
          :component-option="serveTableOption"
        />
      </div>
      <div class="video-stream-analysis-pager common-tablebox-pager">
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
  </div>
</template>

<script>
import ButtonGroup from '@/components/Button/ButtonGroup'
import FormTable from '@/components/FormTable'
import WarningContent from '@/components/WarningContent'

import mixins from './Mixins'

export default {
  name: 'VideoStreamAnalysis',
  components: { FormTable, ButtonGroup, WarningContent },
  mixins: [mixins],
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
            label: '管理',
            type: 'buttonGroup',
            buttonGroup: {
              buttons: [
                {
                  label: '详情',
                  value: 'detail',
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
                },
                {
                  label: '演示视频',
                  value: 'demoVideo',
                  type: 'text'
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
            minWidth: 260,
            align: 'left',
            label: '任务名称',
            prop: 'name',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            minWidth: 105,
            align: 'left',
            label: '任务启用状态',
            prop: 'statusName',
            type: 'span',
            class: 'font-color'
          },
          {
            minWidth: 105,
            align: 'left',
            label: '任务健康状态',
            prop: 'taskHealName',
            type: 'span',
            class: 'status-mark'
          },
          // {
          //   minWidth: 80,
          //   align: 'left',
          //   label: '自动调度',
          //   prop: 'autoScheduleName',
          //   type: 'span'
          // },
          {
            minWidth: 105,
            align: 'left',
            label: '服务健康状态',
            prop: 'serviceHealthName',
            type: 'span',
            class: 'status-mark'
          },
          {
            minWidth: 110,
            align: 'left',
            label: 'Callback输出',
            prop: 'callbackName',
            type: 'span',
            class: 'font-color'
          },
          {
            minWidth: 105,
            align: 'left',
            label: '分析结果推流',
            prop: 'pushName',
            type: 'span',
            class: 'font-color'
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
    if (this.taskTimer) {
      clearInterval(this.taskTimer)

      this.taskTimer = null
    }

    if (this.serveTimer) {
      clearInterval(this.serveTimer)

      this.serveTimer = null
    }
  },
  methods: {
    init() {
      this.pageLoading = true
      this.getVideoStreamData()
    },
    handleSizeChange(size) {
      this.tablePagerOption.pageSizes = size
      this.pageLoading = true
      this.getVideoStreamData()
    },
    handleCurrentChange(page) {
      this.tablePagerOption.currentPage = page
      this.pageLoading = true
      this.getVideoStreamData()
    },
    handlePrevClick(page) {
      this.tablePagerOption.currentPage = page
      this.pageLoading = true
      this.getVideoStreamData()
    },
    handleNextClick(page) {
      this.tablePagerOption.currentPage = page
      this.pageLoading = true
      this.getVideoStreamData()
    }
  }
}
</script>

<style scoped lang="scss">
.video-stream-analysis-container {
  display: flex;
  flex-flow: column;

  .video-stream-analysis-buttons {
    display: flex;
    margin-bottom: 20px;

    .license-warning {
      margin-left: 16px
    }
  }

  .video-stream-analysis-layout{
    flex: 1;
  }

}
</style>
