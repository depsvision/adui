<template>
  <div class="custom-combination-container">
    <div class="custom-combination-transform">
      <div class="custom-combination-transform__tab">
        <span
          v-for="tab in transform"
          :key="tab.value"
          class="tab-item"
          :class="[activeTab === tab.value?'is-active':'']"
          @click="changeTab(tab)"
        >
          {{ tab.label }}
        </span>
      </div>
    </div>
    <div ref="container" class="custom-combination-content">
      <el-input
        ref="content"
        v-model="componentOption[componentOption.elementOption.nodeKey || 'value'].script"
        :placeholder="showPlaceholder"
        type="textarea"
        :style="componentOption.inputStyle"
        :class="[activeTab === 'script'?'is-script':'']"
        :readonly="activeTab !== 'script'"
      />
      <puzzle v-show="activeTab === 'formula'" ref="formula" class="content-formula" :component-option="componentOption" />
    </div>
    <div class="custom-combination-element">
      <div
        v-for="(ele,eleIndex) in componentOption.element"
        :key="eleIndex"
        class="element-item"
      >
        <div class="element-item-head">{{ ele.head }}</div>
        <div
          class="element-item-tree"
          :style="{...componentOption.eleStyle,...ele.style}"
          :class="[ele.disabled?'is-disabled':'']"
        >
          <div v-if="ele.disabled" class="disabled-block" />
          <common-tree
            ref="commonTree"
            :component-option="treeOption(ele)"
            @handleEvent="obj=>{treeEvent(obj,ele)}"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import resizeEle from 'element-resize-detector'

import { deepClone } from '@/utils'
import CommonTree from '@/components/Tree/CommonTree'
import Puzzle from '@/components/CustomCombination/Puzzle'

export default {
  name: 'CustomCombination',
  components: { CommonTree, Puzzle },
  mixins: [],
  props: {
    componentOption: {
      type: Object,
      default: function() {
        return {
          style: {}
        }
      }
    }
  },
  data() {
    return {
      activeTab: '',
      defaultTab: [
        {
          label: '公式',
          value: 'formula'
        },
        {
          label: '脚本',
          value: 'script'
        }
      ],
      erd: null
    }
  },
  computed: {
    transform() {
      let result = []

      let optionTransform = []

      if (this.componentOption.transform) {
        optionTransform = deepClone(this.componentOption.transform)
      }

      result = [...this.defaultTab, ...optionTransform]

      return result
    },
    treeOption() {
      return ele => {
        let option = {}
        if (this.componentOption.elementOption) {
          option = deepClone(this.componentOption.elementOption)
        }

        const result = {
          ...option,
          slotScope: true,
          highlightCurrent: false,
          treeClass: ['not-highlight', 'expand-highlight'],
          tooltip: {
            placement: 'top-start',
            enterable: false
          }
        }

        if (ele.dataGroup) {
          result.dataGroup = ele.dataGroup || []
        } else {
          result.data = ele.data || []
        }

        return result
      }
    },
    showPlaceholder() {
      let result = this.componentOption.placeholder

      if (this.componentOption[this.componentOption.elementOption.nodeKey || 'value'] &&
      this.componentOption[this.componentOption.elementOption.nodeKey || 'value'].formula &&
      this.componentOption[this.componentOption.elementOption.nodeKey || 'value'].formula.length) {
        result = ''
      }

      return result
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.resizeContent()

      this.bindContainer()

      this.changeTab(this.transform[0])
    },
    resizeContent() {
      const content = this.$refs.content.$el
      const formula = this.$refs.formula.$el

      const contentStyle = window.getComputedStyle(content, null)

      formula.style.height = Number(contentStyle.height.replace('px', '')) - 8 + 'px'
    },
    bindContainer() {
      const container = this.$refs.container
      this.erd = resizeEle()

      this.erd.listenTo(container, ele => {
        this.resizeContent()
      })
    },
    changeTab(tab) {
      this.activeTab = tab.value

      switch (tab.value) {
        case 'formula':
          break
        case 'script':
          this.scriptEvent()
          break
        default:
          break
      }

      this.$store.dispatch('button/simulateButton', tab.value)
    },
    treeEvent(obj, ele) {
      switch (obj.eName) {
        case 'node-click':
          this.clickNode(obj.arg, ele)
          break
        default:
          break
      }
    },
    clickNode(params, ele) {
      if (this.activeTab === 'formula' && params[1].isLeaf) {
        const data = deepClone(params[0])

        const addData = Object.assign(data, {
          label: (params[0].svg || params[0].isEditable) ? '' : params[0].label,
          class: deepClone(ele.class)
        })

        this.$refs.formula.addPuzzle(addData)
      }
    },
    scriptEvent() {
      // this.$refs.content.focus()
    }
  }
}
</script>

<style scoped lang="scss">
.custom-combination-container {
  display: flex;
  flex-flow: column;

  .custom-combination-transform {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;

    .custom-combination-transform__tab {
      line-height: 24px;
      background-color: rgba(7, 14, 23, 0.05);
      border-radius: 4px;
      padding: 4px;

      .tab-item {
        font-size: 12px;
        color: rgba(14, 27, 46, 1);
        border-radius: 4px;
        padding: 6px 10px;
        margin-right: 4px;

        &:last-of-type {
          margin-right: 0;
        }

        &:hover {
          background-color: rgba(0, 106, 255, .05);
          cursor: pointer;
        }

        &.is-active {
          color: rgba(245, 249, 255, 1);
          background-color: rgba(24, 114, 240, 1);
        }
      }
    }
  }

  .custom-combination-content {
    line-height: 1;
    position: relative;
    margin-bottom: 16px;
    overflow: hidden;

    .el-textarea {
      pointer-events: none;

      // &.is-script {
      //   pointer-events: unset;
      // }

      :deep( .el-textarea__inner ) {
        min-height: 98px !important;
        padding: 8px 16px;
      }
    }

    .content-formula {
      position: absolute;
      top: 0;
      left: 0;
      padding: 4px 16px;
      width: 100%;
      box-sizing: border-box;
      background-color: #fff;
      border: 1px solid #DCDFE6;
      border-radius: 4px;
      border-bottom: none;
    }
  }

  .custom-combination-element {
    display: flex;

    .element-item {
      margin-right: 8px;

      &:last-of-type {
        margin-right: 0;
      }

      .element-item-head {
        font-size: 14px;
        line-height: 1;
        color: rgba(14, 27, 46, 0.65);
        margin-bottom: 8px;
      }

      .element-item-tree {
        position: relative;
        border: 1px solid rgba(27, 53, 89, 0.2);
        border-radius: 4px;
        overflow: auto;

        .disabled-block {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          z-index: 1;

          &:hover {
            cursor: not-allowed;
          }
        }

        &.is-disabled {

          :deep( .el-tree ) {
            .tree-item-label, .tree-item-right {
              color: rgba(14, 27, 46, 0.35);
            }
          }

        }

        .common-tree-container {
          overflow-y: overlay;
          padding: 4px 0;

          :deep( .el-tree ) {

            .el-tree-node {

              .el-tree-node__content {
                height: 32px;
                flex-direction: row-reverse;
                padding-right: 10px;

                &::before,
                &::after {
                  content: none;
                }

                .el-tree-node__expand-icon {

                  &::before {
                    content: "\e6e0";
                  }
                }

                .custom-tree-node {
                  height: 32px;
                  margin-left: 16px;

                  .el-tooltip {
                    line-height: 32px;
                    font-size: 14px;
                    color: rgba(14, 27, 46, 0.85);
                  }

                  .tree-item-right {

                    svg {
                      height: 10px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
