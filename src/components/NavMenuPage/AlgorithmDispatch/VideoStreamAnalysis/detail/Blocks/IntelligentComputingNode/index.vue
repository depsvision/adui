<template>
  <div class="intelligent-computing-node-block">
    <head-slot :component-option="{label:'计算服务',class: 'is-outer'}">
      <form-list :component-option="formListOption" />
    </head-slot>
  </div>
</template>

<script>
import mixins from './Mixins'
import HeadSlot from '@/components/Slot/HeadSlot'
import FormList from '@/components/InnerComponents/FormList'

export default {
  name: 'IntelligentComputingNode',
  components: { HeadSlot, FormList },
  mixins: [mixins],
  props: {},
  data() {
    return {
      formListOption: {
        data: {
          autoSchedule: false,
          taskNode: '',
          status: '',
          health: ''
        },
        form: [
          // {
          //   type: 'switchAssembly',
          //   label: '自动调度',
          //   prop: 'autoSchedule',
          //   disabled: false,
          //   class: 'switch-fixed-height',
          //   switchTip: ''
          // },
          {
            type: 'spanAssembly',
            label: '当前任务执行节点',
            prop: 'taskNode',
            class: 'small-buttons',
            buttons: {
              buttons: [
                {
                  label: '修改',
                  value: 'editTaskNode',
                  disabled: true,
                  plain: true,
                  loading: false
                },
                {
                  label: '强制释放',
                  value: 'forceRelease',
                  plain: true
                }
              ]
            }
          },
          {
            type: 'spanAssembly',
            label: '服务运行状态',
            prop: 'status',
            class: 'status-mark'
          },
          {
            type: 'spanAssembly',
            label: '服务健康状态',
            prop: 'health',
            class: 'small-buttons status-mark',
            buttons: {
              buttons: [
                {
                  label: '详情',
                  value: 'serviceDetail',
                  plain: true,
                  disabled: false
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

</style>
