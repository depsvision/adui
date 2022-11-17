<template>
  <div class="linkage-output-block">
    <head-slot :component-option="{label:'联动输出',class: 'is-outer'}">
      <form-list :component-option="formListOption">
        <template v-slot:callbackPush>
          <div class="linkage-output-inner-form">
            <button-group
              ref="buttonGroup"
              :component-option="callbackPushButtons"
            />
            <form-table
              ref="formTable"
              :component-option="callbackPush"
            />
          </div>
        </template>
      </form-list>
    </head-slot>
  </div>
</template>

<script>
import mixins from './Mixins'
import HeadSlot from '@/components/Slot/HeadSlot'
import FormList from '@/components/InnerComponents/FormList'
import ButtonGroup from '@/components/Button/ButtonGroup'
import FormTable from '@/components/FormTable'

export default {
  name: 'LinkageOutput',
  components: { HeadSlot, FormList, ButtonGroup, FormTable },
  mixins: [mixins],
  props: {},
  data() {
    return {
      formListOption: {
        data: {
          log: ''
        },
        form: [
          {
            type: 'spanAssembly',
            label: '报警日志',
            prop: 'log'
          },
          {
            type: 'dynamicSlot',
            label: 'Callback推送',
            prop: 'callbackPush'
          }
        ],
        labelWidth: '140px',
        labelPosition: 'left'
      },
      callbackPush: {
        tableData: [

        ],
        option: {
          height: 294
        },
        header: [
          {
            width: 200,
            align: 'left',
            fixed: 'right',
            label: '操作',
            type: 'buttonGroup',
            buttonGroup: {
              buttons: [
                {
                  label: '编辑',
                  value: 'editCallbackConfig',
                  type: 'text'
                },
                {
                  label: '删除',
                  value: 'removeCallbackConfig',
                  type: 'text',
                  class: 'is-danger',
                  popoverclass: 'is-danger',
                  tip: '请确认是否删除该条Callback推送！',
                  svgIcon: 'warning'
                }
              ]
            }
          },
          {
            minWidth: 240,
            align: 'left',
            label: '推送地址',
            prop: 'url',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            width: 120,
            align: 'left',
            label: '地址状态',
            prop: 'addressStatusName',
            type: 'span',
            class: 'status-mark'
          },
          {
            width: 200,
            align: 'left',
            label: '最新推送状态',
            prop: 'recentStatusName',
            type: 'span',
            class: 'status-mark',
            showOverflowTooltip: true
          },
          {
            width: 160,
            align: 'left',
            label: '推送间隔',
            prop: 'pushInterval',
            type: 'span'
          },
          {
            width: 260,
            align: 'left',
            label: '推送内容',
            prop: 'pushContent',
            type: 'span'
          }
          // {
          //   width: 80,
          //   align: 'left',
          //   label: '过滤规则',
          //   prop: 'filterRule',
          //   type: 'switch'
          // },
        ]
      },
      callbackPushButtons: {
        buttons: [
          {
            label: '新增',
            value: 'addCallbackConfig',
            class: 'small-buttons',
            plain: true
          },
          {
            label: '刷新',
            value: 'refreshCallbackConfig',
            class: 'small-buttons',
            plain: true
          }
        ]
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
.linkage-output-block {

  .linkage-output-inner-table {
    flex: 1;
    display: flex;
    flex-flow: column;
    min-height: 160px;
    max-height: 336px;
    padding-bottom: 16px;
    overflow: hidden;

    &>span {
      font-size: 14px;
      color: rgba(14, 27, 46, 1);
      margin-bottom: 16px;
    }

    .video-stream-table {
      flex: 1;
    }
  }

  .linkage-output-inner-form {
    width: 100%;

    .button-group-container {
      margin-bottom: 16px;
    }
  }
}
</style>
