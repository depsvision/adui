<template>
  <div v-loading="pageLoading" class="mail-service-container layout-bg">
    <div class="mail-service-buttons">
      <button-group
        ref="buttonGroup"
        :component-option="buttonGroupOption"
      />
      <warning-content v-if="mailWarning" class="mail-service-warning" content="邮件服务尚未设置，邮件推送服务无法正常使用" />
    </div>
    <div class="mail-service-layout common-tablebox-layout">
      <div class="mail-service-table common-tablebox-table">
        <form-table
          ref="formTable"
          :component-option="mailOption"
          @handleSwitchChange="handleSwitchChange"
        />
      </div>
      <div class="mail-service-pager common-tablebox-pager">
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

import index from './Mixins'
import sendSetting from './Mixins/sendSetting.js'

export default {
  name: 'MailService',
  components: { FormTable, ButtonGroup, WarningContent },
  mixins: [index, sendSetting],
  props: {},
  data() {
    return {
      pageLoading: false,
      action: 'add',
      mailWarning: false,
      buttonGroupOption: {
        buttons: [
          {
            label: '新建',
            value: 'add',
            type: 'primary'
          },
          {
            label: '邮件服务设置',
            value: 'mailSetting',
            class: '',
            plain: true
          }
        ]
      },
      mailOption: {
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
                  label: '编辑',
                  value: 'edit',
                  type: 'text'
                },
                {
                  label: '预览',
                  value: 'view',
                  type: 'text'
                },
                {
                  label: '删除',
                  value: 'delete',
                  type: 'text',
                  popoverclass: 'is-danger',
                  tip: '删除任务将无法恢复，需重新进行设置请确认是否删除',
                  svgIcon: 'warning',
                  width: 320
                }
              ]
            }
          },
          {
            minWidth: 90,
            align: 'left',
            label: '任务ID',
            prop: 'id',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            minWidth: 240,
            align: 'left',
            label: '任务名称',
            prop: 'taskName',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            width: 420,
            align: 'left',
            label: '邮箱地址',
            prop: 'address',
            is: 'TagAssembly',
            tooltip: {
              placement: 'top-start'
            }
          },
          {
            width: 180,
            align: 'left',
            label: '推送时间',
            prop: 'time',
            type: 'span'
          },
          {
            width: 160,
            align: 'left',
            label: '任务启用状态',
            prop: 'enabled',
            type: 'switch'
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
      this.getMailSetting()
      this.getMailData()
    },
    handleSizeChange(size) {
      this.tablePagerOption.pageSizes = size
      this.getMailData()
    },
    handleCurrentChange(page) {
      this.tablePagerOption.currentPage = page
      this.getMailData()
    },
    handlePrevClick(page) {
      this.tablePagerOption.currentPage = page
      this.getMailData()
    },
    handleNextClick(page) {
      this.tablePagerOption.currentPage = page
      this.getMailData()
    }
  }
}
</script>

<style scoped lang="scss">
.mail-service-container {
  display: flex;
  flex-flow: column;

  .mail-service-buttons {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .mail-service-warning {
      margin-left: 16px;
    }
  }

  .mail-service-layout{
    flex: 1;
  }

}
</style>
