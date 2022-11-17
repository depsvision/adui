<template>
  <div class="callback-output-container layout-bg">
    <div class="callback-output-buttons">
      <button-group
        ref="buttonGroup"
        :component-option="buttonGroupOption"
      />
    </div>
    <div v-loading="pageLoading" class="callback-output-layout common-tablebox-layout">
      <div class="callback-output-table common-tablebox-table">
        <form-table
          ref="formTable"
          :component-option="callbackOption"
        />
      </div>
      <div class="callback-output-pager common-tablebox-pager">
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
import mixins from './Mixins'

export default {
  name: 'CallbackOutput',
  components: { FormTable, ButtonGroup },
  mixins: [mixins],
  props: {},
  data() {
    return {
      pageLoading: false,
      action: 'add',
      buttonGroupOption: {
        buttons: [
          {
            label: '新建 Callback',
            value: 'add',
            type: 'primary'
          }
        ]
      },
      callbackOption: {
        tableData: [],
        header: [
          {
            width: 120,
            align: 'left',
            fixed: 'right',
            label: '操作',
            type: 'buttonGroup',
            buttonGroup: {
              buttons: [
                {
                  label: '编辑',
                  value: 'edit',
                  type: 'text'
                },
                {
                  label: '删除',
                  value: 'delete',
                  type: 'text',
                  class: 'is-danger'
                }
              ]
            }
          },
          {
            minWidth: 240,
            align: 'left',
            label: '名称',
            prop: 'name',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            minWidth: 300,
            align: 'left',
            label: 'Callback地址',
            prop: 'url',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            minWidth: 125,
            align: 'left',
            label: '关联任务',
            prop: 'tasksName',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            minWidth: 140,
            align: 'left',
            label: '测试 (模拟发送)',
            prop: 'testStatus',
            type: 'span',
            class: 'status-mark',
            buttonGroup: {
              buttons: [
                {
                  label: '测试',
                  value: 'openTest',
                  type: 'text'
                }
              ]
            }
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
      this.getCallbackTemplate()
      this.getOssList()
      this.getCallbackData()
    },
    handleSizeChange(size) {
      this.tablePagerOption.pageSizes = size
      this.getCallbackData()
    },
    handleCurrentChange(page) {
      this.tablePagerOption.currentPage = page
      this.getCallbackData()
    },
    handlePrevClick(page) {
      this.tablePagerOption.currentPage = page
      this.getCallbackData()
    },
    handleNextClick(page) {
      this.tablePagerOption.currentPage = page
      this.getCallbackData()
    }
  }
}
</script>

<style scoped lang="scss">
.callback-output-container {
  display: flex;
  flex-flow: column;

  .callback-output-buttons {
    margin-bottom: 20px;
  }

  .callback-output-layout{
    flex: 1;
  }

}
</style>
