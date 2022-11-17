<template>
  <div v-loading="pageLoading" class="algorithm-linkage-container layout-bg">
    <div class="algorithm-linkage-buttons common-tablebox--top_button-group">
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
    <div class="algorithm-linkage-layout common-tablebox-layout">
      <div class="algorithm-linkage-table common-tablebox-table">
        <form-table
          ref="formTable"
          :component-option="serveTableOption"
        />
      </div>
      <div class="algorithm-linkage-pager common-tablebox-pager">
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
  name: 'AlgorithmLinkage',
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
            width: 40,
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
            width: 120,
            align: 'left',
            label: '一级任务类型',
            prop: 'sourceTypeName',
            type: 'span',
            class: 'font-color'
          },
          {
            width: 110,
            align: 'left',
            label: '一级任务ID',
            prop: 'sourceId',
            type: 'span',
            class: 'status-mark'
          },
          {
            minWidth: 140,
            align: 'left',
            label: '联动算法类型',
            prop: 'associateType',
            type: 'span',
            class: 'status-mark',
            showOverflowTooltip: true
          },
          {
            width: 160,
            align: 'left',
            label: '创建时间',
            prop: 'createdAt',
            type: 'span',
            class: 'font-color'
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
            minWidth: 140,
            align: 'left',
            label: '任务提醒',
            prop: 'remindName',
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
  methods: {
    init() {
      this.pageLoading = true
      this.getAlgorithmLinkageData()
    },
    handleSizeChange(size) {
      this.tablePagerOption.pageSizes = size
      this.pageLoading = true
      this.getAlgorithmLinkageData()
    },
    handleCurrentChange(page) {
      this.tablePagerOption.currentPage = page
      this.pageLoading = true
      this.getAlgorithmLinkageData()
    },
    handlePrevClick(page) {
      this.tablePagerOption.currentPage = page
      this.pageLoading = true
      this.getAlgorithmLinkageData()
    },
    handleNextClick(page) {
      this.tablePagerOption.currentPage = page
      this.pageLoading = true
      this.getAlgorithmLinkageData()
    }
  }
}
</script>

<style scoped lang="scss">
.algorithm-linkage-container {
  display: flex;
  flex-flow: column;

  .algorithm-linkage-buttons {
    display: flex;
    margin-bottom: 20px;

    .license-warning {
      margin-left: 16px
    }
  }

  .algorithm-linkage-layout{
    flex: 1;
  }

}
</style>
