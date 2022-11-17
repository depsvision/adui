<template>
  <div class="operation-management-block">
    <head-slot :component-option="{label:'运行管理',class: 'is-outer'}">
      <form-list :component-option="formListOption" />
    </head-slot>
    <input v-show="false" ref="fileImport" type="file" accept=".json" @change="fileLoad">
  </div>
</template>

<script>
import mixins from './Mixins'
import taskStatus from './Mixins/taskStatus'
import taskTime from './Mixins/taskTime'
// import healthLevel from './Mixins/healthLevel'
import taskHealthStatus from './Mixins/taskHealthStatus'

import HeadSlot from '@/components/Slot/HeadSlot'
import FormList from '@/components/InnerComponents/FormList'

export default {
  name: 'OperationManagement',
  components: { HeadSlot, FormList },
  mixins: [mixins, taskStatus, taskTime, taskHealthStatus],
  props: {
  },
  data() {
    return {
      formListOption: {
        data: {
          runningStatusName: '',
          enableTimeName: '',
          taskHealth: '',
          health: '',
          configIssue: ''
        },
        form: [
          {
            type: 'spanAssembly',
            label: '任务启用状态',
            prop: 'runningStatusName',
            class: 'small-buttons status-mark',
            buttons: {
              buttons: [
                {
                  label: '启用',
                  value: 'editTaskStatus',
                  plain: true
                }
              ]
            }
          },
          {
            type: 'spanAssembly',
            label: '任务启用时间',
            prop: 'enableTimeName',
            class: 'small-buttons',
            buttons: {
              buttons: [
                {
                  label: '设置',
                  value: 'setTaskTime',
                  plain: true
                }
              ]
            }
          },
          {
            type: 'spanAssembly',
            label: '任务健康状态',
            prop: 'healthStatusName',
            class: 'small-buttons status-mark',
            buttons: {
              buttons: [
                {
                  label: '详情',
                  value: 'viewTaskHealthStatus',
                  plain: true,
                  disabled: false
                }
              ]
            }
          },
          // {
          //   type: 'spanAssembly',
          //   label: '健康修复等级',
          //   prop: 'healthName',
          //   class: 'small-buttons',
          //   buttons: {
          //     buttons: [
          //       {
          //         label: '修改',
          //         value: 'editHealthLevel',
          //         plain: true
          //       }
          //     ]
          //   }
          // },
          {
            type: 'spanAssembly',
            label: '配置文件下发',
            prop: 'configIssue',
            class: 'small-buttons',
            buttons: {
              buttons: [
                {
                  label: '查看',
                  value: 'viewConfig',
                  plain: true
                }
              ]
            }
          }
        ],
        labelWidth: '140px',
        labelPosition: 'left'
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {

    }
  }
}
</script>

<style scoped lang="scss">
.operation-management-block {

  .operation-management-inner-form {

    .version-comparison-head-slot {
      margin-bottom: 24px;
    }

    .issue-record-head-slot {
      margin-bottom: 24px;
    }
  }
}
</style>
