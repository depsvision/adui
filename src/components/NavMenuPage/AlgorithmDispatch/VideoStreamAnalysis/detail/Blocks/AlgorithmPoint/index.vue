<template>
  <div class="algorithm-point-block">
    <head-slot :component-option="{label:'算法及点位',class: 'is-outer'}">
      <form-list :component-option="formListOption">
        <template v-slot:algorithmPoint>
          <div class="algorithm-point-inner-form inner-form-layout">
            <form-list :component-option="algorithmPoint" />
            <button-group
              ref="buttonGroup"
              class="small-buttons"
              :component-option="algorithmPointButtons"
            />
          </div>
        </template>
      </form-list>
    </head-slot>
  </div>
</template>

<script>
import mixins from './Mixins'
import materialTagInput from '@/mixins/task/materialTagInput'

import HeadSlot from '@/components/Slot/HeadSlot'
import FormList from '@/components/InnerComponents/FormList'
import ButtonGroup from '@/components/Button/ButtonGroup'

export default {
  name: 'AlgorithmPoint',
  components: { HeadSlot, FormList, ButtonGroup },
  mixins: [mixins, materialTagInput],
  props: {
  },
  data() {
    return {
      formListOption: {
        data: {
          enhancementAlgorithmGroup: [],
          materialGroup: [],
          algorithmTip: '请根据实际算法支持能力选择, 否则不会生效'
        },
        form: [
          {
            type: 'dynamicSlot',
            label: '算法及点位',
            prop: 'algorithmPoint'
          },
          {
            type: 'tagInput',
            label: '算法增强',
            svg: 'list-file-line',
            prop: 'enhancementAlgorithmGroup',
            suffixIcon: 'el-icon-caret-bottom',
            size: 'medium',
            tagInputStyle: {
              width: '304px'
            },
            placeholder: '请选择算法',
            removeTag: this.chooseEnhancementAlgorithm,
            back: {
              type: 'spanAssembly',
              prop: 'algorithmTip',
              backStyle: {
                'margin-left': '8px'
              },
              spanStyle: {
                color: 'rgba(7, 14, 23, 0.55)',
                'font-size': '12px',
                'line-height': 1.5
              }
            },
            bottom: {
              type: 'tagInput',
              svg: 'file-1-line',
              prop: 'materialGroup',
              suffixIcon: 'el-icon-caret-bottom',
              size: 'medium',
              tagInputStyle: {
                width: '304px'
              },
              placeholder: '请选择合集',
              removeTag: this.chooseMaterial
            }
          }
        ],
        labelWidth: '140px',
        labelPosition: 'left'
      },
      algorithmPoint: {
        class: 'is-block-inner',
        data: {
          algorithmPoint: ''
        },
        form: [
          {
            type: 'spanAssembly',
            label: '算法及点位',
            prop: 'algorithmPoint'
          }
        ],
        labelWidth: '94px',
        labelPosition: 'right'
      },
      algorithmPointButtons: {
        buttons: [
          {
            label: '修改',
            value: 'editAlgorithmPoint',
            plain: true
          },
          {
            label: '更新关联点位状态',
            value: 'updatePointStatus',
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
.algorithm-point-block {

  .algorithm-point-inner-form {

    .form-list-container {
      margin-bottom: 24px;
    }
  }
}
</style>
