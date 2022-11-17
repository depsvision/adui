<template>
  <div class="object-storage-container layout-bg">
    <div v-loading="pageLoading" class="flex-column-class auto-flex-1">
      <div class="object-storage-buttons">
        <button-group
          ref="buttonGroup"
          :component-option="buttonGroupOption"
        />
      </div>
      <div class="object-storage-layout common-tablebox-layout">
        <div class="object-storage-table common-tablebox-table">
          <form-table
            ref="formTable"
            :component-option="ossOption"
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
  name: 'ObjectStorage',
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
      ossOption: {
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
                  label: '验证',
                  value: 'test',
                  type: 'text'
                },
                {
                  label: '编辑',
                  value: 'edit',
                  type: 'text'
                },
                {
                  label: '删除',
                  value: 'deleteOss',
                  type: 'text',
                  class: 'is-danger'
                }
              ]
            }
          },
          {
            minWidth: 160,
            align: 'left',
            label: '系统名称',
            prop: 'name',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            minWidth: 140,
            align: 'left',
            label: '服务类型',
            prop: 'platform',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            minWidth: 100,
            align: 'left',
            label: '区域',
            prop: 'region',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            minWidth: 360,
            align: 'left',
            label: '域名',
            prop: 'domain',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            minWidth: 120,
            align: 'left',
            label: '保存路径',
            prop: 'path',
            type: 'span',
            showOverflowTooltip: true
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
      this.getOssData()
    }
  }
}
</script>

<style scoped lang="scss">
.object-storage-container {
  display: flex;
  flex-flow: column;

  .object-storage-buttons {
    margin-bottom: 20px;
  }

  .object-storage-layout{
    flex: 1;
  }

}
</style>
