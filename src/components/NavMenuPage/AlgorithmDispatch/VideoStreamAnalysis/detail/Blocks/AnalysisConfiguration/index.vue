<template>
  <div class="analysis-configuration-block">
    <head-slot :component-option="{label:'分析配置',class: 'is-outer'}">
      <form-list :component-option="formListOption">
        <template v-slot:analysisConfiguration>
          <div class="analysis-configuration-inner-form inner-form-layout">
            <form-list :component-option="analysisConfiguration" />
            <button-group
              ref="buttonGroup"
              class="small-buttons"
              :component-option="analysisConfigurationButtons"
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

export default {
  name: 'AnalysisConfiguration',
  components: { HeadSlot, FormList, ButtonGroup },
  mixins: [mixins],
  props: {},
  data() {
    return {
      formListOption: {
        form: [
          {
            type: 'dynamicSlot',
            label: '分析配置',
            prop: 'analysisConfiguration'
          }
        ],
        labelWidth: '140px',
        labelPosition: 'left'
      },
      analysisConfiguration: {
        class: 'is-block-inner',
        data: {
          analysisFrammeRate: '默认所有',
          analysisInterval: '',
          analysisCallback: '默认报警结果及原始图片'
        },
        form: [
          {
            type: 'spanAssembly',
            label: '分析帧率',
            prop: 'analysisFrammeRate'
          },
          {
            type: 'spanAssembly',
            label: '报警返回间隔',
            prop: 'analysisInterval'
          },
          {
            type: 'spanAssembly',
            label: '报警返回内容',
            prop: 'analysisCallback'
          }
        ],
        labelWidth: '108px',
        labelPosition: 'right'
      },
      analysisConfigurationButtons: {
        buttons: [
          {
            label: '修改',
            value: 'editAnalysisConfig',
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
.analysis-configuration-block {

  .analysis-configuration-inner-form {

    .form-list-container {
      margin-bottom: 24px;
    }
  }
}
</style>
