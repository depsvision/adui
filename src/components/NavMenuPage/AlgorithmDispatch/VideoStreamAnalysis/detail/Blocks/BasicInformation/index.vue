<template>
  <div class="basic-information-block">
    <head-slot :component-option="{label:'基本信息',class: 'is-outer'}">
      <form-list :component-option="formListOption" />
    </head-slot>
  </div>
</template>

<script>
import mixins from './Mixins'
import HeadSlot from '@/components/Slot/HeadSlot'
import FormList from '@/components/InnerComponents/FormList'

export default {
  name: 'BasicInformation',
  components: { HeadSlot, FormList },
  mixins: [mixins],
  props: {},
  data() {
    return {
      formListOption: {
        data: {
          name: ''
        },
        form: [
          {
            type: 'spanAssembly',
            label: '任务ID',
            prop: 'id'
          },
          {
            type: 'spanAssembly',
            label: '任务名称',
            prop: 'name',
            class: 'small-buttons',
            buttons: {
              buttons: [
                {
                  label: '修改',
                  value: 'editTaskName',
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
  mounted() {
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
