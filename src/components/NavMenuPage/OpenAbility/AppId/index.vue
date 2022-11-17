<template>
  <div class="app-id-container layout-bg">
    <div v-loading="pageLoading" class="flex-column-class auto-flex-1">
      <div class="app-id-buttons">
        <button-group
          ref="buttonGroup"
          :component-option="buttonGroupOption"
        />
      </div>
      <div class="app-id-layout common-tablebox-layout">
        <div class="app-id-table common-tablebox-table">
          <form-table
            ref="formTable"
            :component-option="appIdOption"
          />
        </div>
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
            label: '新增',
            value: 'add',
            type: 'primary'
          }
        ]
      },
      appIdOption: {
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
            minWidth: 300,
            align: 'left',
            label: '应用名称',
            prop: 'name',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            minWidth: 280,
            align: 'left',
            label: 'APP ID',
            prop: 'appId',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            minWidth: 280,
            align: 'left',
            label: 'APP Secret',
            prop: 'appSecret',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            width: 200,
            align: 'left',
            label: '扩展应用',
            prop: 'enableName',
            class: 'font-color',
            type: 'span',
            buttonGroup: {
              buttons: [
                {
                  label: '设置',
                  value: 'appSetting',
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
      this.getAppIdData()
    }
  }
}
</script>

<style scoped lang="scss">
.app-id-container {
  display: flex;
  flex-flow: column;

  .app-id-buttons {
    margin-bottom: 20px;
  }

  .app-id-layout{
    flex: 1;
  }

}
</style>
