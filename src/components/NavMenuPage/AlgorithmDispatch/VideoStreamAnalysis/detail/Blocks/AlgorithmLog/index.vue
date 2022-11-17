<template>
  <div class="algorithm-log-block">
    <head-slot :component-option="{label:'算法日志',class: 'is-outer'}">
      <form-list :component-option="formListOption">
        <template v-slot:filterCondition>
          <div class="algorithm-log-inner-form small-buttons">
            <span class="form-tip is-warning-tip">
              <svg-icon icon-class="warning" />
              未选择算法及条件默认不过滤
            </span>
            <button-group
              ref="buttonGroup"
              :component-option="filterConditionButtons"
            />
            <condition-group
              v-for="(condition,conditionIndex) in filterCondition"
              ref="conditionGroup"
              :key="conditionIndex"
              :component-option="dealCondition(condition,conditionIndex)"
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
import ConditionGroup from '@/components/AreaComponents/ConditionGroup'

export default {
  name: 'AlgorithmLog',
  components: { HeadSlot, FormList, ButtonGroup, ConditionGroup },
  mixins: [mixins],
  props: {
  },
  data() {
    return {
      formListOption: {
        data: {

        },
        form: [
          {
            type: 'dynamicSlot',
            label: '过滤条件',
            prop: 'filterCondition'
          }
        ],
        labelWidth: '140px',
        labelPosition: 'left'
      },
      filterConditionButtons: {
        buttons: [
          {
            label: '新增条件',
            value: 'addCondition',
            plain: true
          },
          {
            label: '应用',
            value: 'applyCondition',
            type: 'primary'
          }
        ]
      },
      filterConditionTemplate: {
        initShowInput: false,
        head: {
          name: '条件组',
          buttons: {
            buttons: [
              {
                type: 'text',
                value: 'deleteFilterCondition',
                svgIconLeft: 'delete-line',
                class: 'is-black',
                left: 0
              }
            ]
          }
        },
        condition: {
          labelStyle: {
            width: '80px',
            'text-align': 'right',
            'padding-right': '24px'
          },
          algorithm: {
            label: '算法',
            content: {
              prop: 'algorithm',
              algorithmTag: [],
              closable: true,
              tagClass: 'hover-point',
              disableTransitions: true,
              popover: {
                visible: false,
                type: 'select',
                title: '新增算法',
                placeholder: '选择算法',
                content: '',
                option: [],
                visibleArrow: false,
                width: 256
              }
            }
          },
          rule: {
            value: {
              formula: [],
              script: ''
            },
            label: '警告规则',
            buttons: {
              buttons: [
                {
                  label: '配置',
                  value: 'ruleConfig',
                  plain: true
                }
              ]
            },
            tip: '',
            pushData: []
          },
          judgment: {
            label: '报警判定',
            input: [
              {
                value: 0,
                lastValue: '',
                width: 100,
                type: 'number',
                unit: '秒',
                placeholder: '统计间隔',
                text: '内触发规则超过'
              },
              {
                value: 1,
                lastValue: '',
                width: 100,
                type: 'number',
                unit: '次',
                placeholder: '统计次数',
                text: '则认为报警'
              }
            ]
          }
        }
      },
      filterCondition: [],
      algorithm: [],
      unusedAlgorithm: []
    }
  },
  computed: {
    dealCondition() {
      return (condition, conditionIndex) => {
        condition.id = conditionIndex

        condition.condition.algorithm.content.id = conditionIndex
        return condition
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
.algorithm-log-block {

  .algorithm-log-inner-form {
    flex: 1;
    width: 100%;
    display: flex;
    flex-flow: column;
    overflow: hidden;

    .button-group-container {
      margin-bottom: 8px;
    }

    .condition-group-container {
      margin-bottom: 16px;

      &:last-of-type {
        margin-bottom: 0;
      }
    }
  }
}
</style>
