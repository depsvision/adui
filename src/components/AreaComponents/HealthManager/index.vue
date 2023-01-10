<template>
  <div class="health-manager-container">
    <div class="health-manager-top">
      <warning-content
        v-if="componentOption.warning"
        :content="componentOption.warning.content"
        :style="componentOption.warning.style"
      />
    </div>
    <div class="health-manager-bottom">
      <div class="health-manager-bottom__content">
        <draggable-slot
          :component-option="componentOption.rule"
          class="bottom-content-rules"
        >
          <div
            v-for="rule in componentOption.rule.value"
            :key="rule.ruleId"
            class="rule-item"
            :class="[rule.forbid?'':(componentOption.rule.draggable || 'is-draggable')]"
          >
            <div class="rule-item-head">
              <div class="rule-head-text">
                <svg-icon :icon-class="componentOption.rule.headSvg" class="rule-head-svg" />
                <span class="rule-head-label">{{ rule.label }}</span>
                <span class="rule-head-tip">{{ rule.tip }}</span>
              </div>
              <div class="rule-head-operation">
                <button-group
                  ref="buttonGroup"
                  :component-option="componentOption.rule.buttons"
                  :scope="rule"
                />

                <switch-assembly :component-option="rule.switch" />
              </div>
            </div>

            <div class="rule-item-detail">
              <div class="rule-detail-head">
                <svg-icon icon-class="unordered-fill" class="rule-detail-svg" />
                <span>{{ componentOption.rule.detail.label }}</span>
              </div>
              <div class="rule-detail-frequency rule-detail-item">
                <svg-icon icon-class="unordered-line" class="rule-detail-svg" />
                <div class="rule-detail-label">{{ componentOption.rule.detail.frequency }}</div>
                <puzzle-item
                  v-for="(frequency,frequencyIndex) in rule.frequencyData"
                  :key="frequency.value + frequencyIndex"
                  :component-option="frequency"
                  :is-view="true"
                />
              </div>
              <div class="rule-detail-judge rule-detail-item">
                <svg-icon icon-class="unordered-line" class="rule-detail-svg" />
                <div class="rule-detail-label">{{ componentOption.rule.detail.judge }}</div>
                <puzzle-item
                  v-for="(judge,judgeIndex) in rule.judgeData"
                  :key="judge.value + judgeIndex"
                  :component-option="judge"
                  :is-view="true"
                />
              </div>
              <div class="rule-detail-execute rule-detail-item">
                <svg-icon icon-class="unordered-line" class="rule-detail-svg" />
                <div class="rule-detail-label">{{ componentOption.rule.detail.execute }}</div>
                <puzzle-item
                  v-for="(execute,executeIndex) in rule.executeData"
                  :key="execute.value + executeIndex"
                  :component-option="execute"
                  :is-view="true"
                />
              </div>
            </div>
          </div>
        </draggable-slot>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonGroup from '@/components/Button/ButtonGroup'
import PuzzleItem from '@/components/CustomCombination/Puzzle/PuzzleItem'
import DraggableSlot from '@/components/Slot/DraggableSlot'
import WarningContent from '@/components/WarningContent'
import switchAssembly from '@/components/InnerComponents/SwitchAssembly'

export default {
  name: 'HealthManager',
  components: {
    ButtonGroup,
    PuzzleItem,
    DraggableSlot,
    WarningContent,
    switchAssembly
  },
  props: {
    componentOption: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      judgeTag: {
        judgeTag: [
          {

            label: '条件'
          }
        ],
        prop: 'judge'
      },
      executeTag: {
        executeTag: [
          {

          }
        ],
        prop: 'execute'
      }
    }
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
.health-manager-container {
  display: flex;
  flex-flow: column;
  overflow: hidden;
  width: 100%;

  .health-manager-bottom {
    flex: 1;
    display: flex;
    flex-flow: column;
    overflow: hidden;

    .health-manager-bottom__content {
      position: relative;
      flex: 1;
      display: flex;
      overflow: overlay;

      .bottom-content-rules {
        width: 100%;
        display: flex;
        z-index: 2;

        :deep(.draggable-layout) {
          flex: 1;

          &>span {
            display: flex;
            flex-flow: column;
          }
        }

        .rule-item {
          display: flex;
          flex-flow: column;
          margin-top: 16px;

          .rule-item-head {
            display: flex;
            align-items: center;
            height: 40px;
            background-color: #F5F7FA;
            border-radius: 4px;
            padding: 0 16px;
            margin-bottom: 8px;

            .rule-head-text {
              flex: 1;
              color: rgba(7, 14, 23, 0.85);
            }

            .rule-head-svg {
              font-size: 16px;
              margin-right: 4px;
            }

            .rule-head-label {
              font-size: 14px;
              margin-right: 16px;
            }

            .rule-head-tip {
              font-size: 12px;
              color: rgba(14, 27, 46, 0.55);
            }

            .rule-head-operation {
              display: flex;
            }

            .switch-assembly-container {
              margin-left: 32px;
            }
          }

          .rule-item-detail {
            line-height: 36px;

            .rule-detail-svg {
              font-size: 14px;
              margin-right: 4px;
            }

            .rule-detail-head {

              &>span {
                font-size: 14px;
                font-weight: 900;
                color: rgba(14, 27, 46, 0.85);
              }
            }

            .rule-detail-item {
              display: flex;
              align-items: center;
              color: rgba(14, 27, 46, 0.65);
              border-left: 2px solid rgba(14,27,46,0.10);
              padding-left: 8px;
              margin-left: 6px;
            }

            .rule-detail-label {
              margin-right: 32px;
            }
          }
        }
      }
    }
  }
}
</style>
