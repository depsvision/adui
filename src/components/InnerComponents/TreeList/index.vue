<template>
  <div class="tree-list-container">
    <div class="choosed-block">
      <div class="choosed-head">
        <span>已选择</span>
      </div>
      <div class="choosed-display-block">
        <div class="choosed-display">
          <el-tag
            v-for="tag in tagData"
            :key="tag[tag.nodeKey]"
            :type="tag.type"
            :color="componentOption.tagColor"
            :effect="componentOption.tagEffect"
            :closable="componentOption.tagClosable"
            :class="[tag.tagColor?'tag-'+ tag.tagColor:'']"
            :disable-transitions="!!componentOption.resultNum || !!componentOption.treeNum"
            @close="removeTag(tag)"
          >
            <svg-icon v-if="tag.tagSvg" class="tag-svg" :icon-class="tag.tagSvg" />
            <span>{{ tag.label }}</span>
            <span v-if="tag.rightSpan" class="tag-rightSpan">{{ tag.rightSpan }}</span>
          </el-tag>
        </div>
      </div>
    </div>
    <div class="choice-block">
      <div class="choice-head">
        <span>{{ componentOption.bottomHead }}</span>
        <div class="choice-search-block display-flex-layout">
          <span class="choice-search-input">
            <el-input v-model="searchValue" size="medium" :placeholder="componentOption.placeholder" clearable>
              <i slot="suffix" class="el-input__icon el-icon-search" />
            </el-input>
          </span>
        </div>
      </div>
      <div class="choice-display-block">
        <el-tabs tab-position="left" :before-leave="setCurrentTab">
          <el-tab-pane v-for="(tab,tabIndex) in componentOption.tabData" :key="tabIndex">
            <span slot="label" class="tab-span"><svg-icon v-if="tab.tabSvg" class="tab-svg" :icon-class="tab.tabSvg" />{{ tab.label }}</span>
          </el-tab-pane>
        </el-tabs>
        <div class="tab-content">
          <div class="tab-tree">
            <common-tree
              v-if="componentOption.treeOption"
              ref="leftTree"
              v-loading="componentOption.treeLoading"
              :component-option="componentOption.treeOption"
              @handleEvent="treeEvent"
            />
          </div>
          <div class="tab-result" :class="[componentOption.resultLoding?'is-loading':'']">
            <common-tree
              v-if="componentOption.resultOption"
              ref="rightTree"
              v-loading="componentOption.resultLoding"
              :component-option="dealResultOption"
              @handleEvent="resultEvent"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommonTree from '@/components/Tree/CommonTree'
import { deepClone } from '@/utils'

export default {
  name: 'TreeList',
  components: { CommonTree },
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
      currentNode: null,
      tagData: [],
      treeTagData: [],
      resultTagData: [],
      leftTree: null,
      rightTree: null,
      searchValue: '',
      currentTab: null,
      cacheTreeOption: null,
      cacheResultOption: null
    }
  },
  computed: {
    dealResultOption() {
      const option = deepClone(this.componentOption.resultOption)
      let data = []

      if (this.currentTab && this.currentTab.resultData && this.currentTab.resultData.length) {
        data = JSON.parse(JSON.stringify(this.componentOption.resultOption.data))
        data.unshift({
          label: '全部'
        })
        data[0][this.componentOption.resultOption.nodeKey] = 'checkAll'

        if (this.componentOption.resultNum !== undefined && this.componentOption.resultNum > 0) {
          data[0].disabled = true
        }
      }

      option.infinite = option.infinite ?? 50
      option.checkOnClickNode = true

      option.data = data
      return option
    }
  },
  watch: {
    searchValue(val) {
      this.filterData(val)
    },
    'componentOption.tagData': {
      handler(val) {
        if (val) {
          this.tagData = val
          this.tagData && this.tagData.forEach(item => {
            if (item.tagType === 'tree') {
              this.treeTagData.push(item)
            } else if (item.tagType === 'node') {
              this.resultTagData.push(item)
            }
          })
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {

    },
    treeEvent(params) {
      switch (params.eName) {
        case 'clickCheck':
          this.changeTag(params.arg, 'tree')
          break
        case 'node-click':
          this.clickNode()
          break
        default:
      }
    },
    resultEvent(params) {
      switch (params.eName) {
        case 'clickCheck':
          this.changeTag(params.arg, 'result')
          break
        case 'loadCacheData':
          this.$nextTick(() => {
            this.setTreeChecked()
          })
          break
        default:
      }
    },
    clickNode() {
      this.currentNode = this.leftTree.getCurrentNode()
      this.searchValue = ''
      this.$store.dispatch('dialog/setDialogData', { key: 'listenerClick', value: { time: Date.now(), refs: this }})
    },
    changeTag(params, block) {
      if (block === 'tree') {
        params[0].tagType = 'tree'
        params[0].tagSvg = this.componentOption.treeOption.tagSvg
        params[0].tagColor = this.componentOption.treeOption.tagColor
        params[0].nodeKey = this.componentOption.treeOption.nodeKey
        if (this.leftTree.getNode(params[0]).checked) {
          this.treeTagData.push(params[0])

          if (this.componentOption.treeNum !== undefined && this.componentOption.treeNum > 0) {
            this.treeTagData = this.treeTagData.slice(this.treeTagData.length - this.componentOption.treeNum)
          }

          this.tagData = this.treeTagData.concat(this.resultTagData)
        } else {
          this.removeTag(params[0])
        }
      } else if (block === 'result') {
        if (this.rightTree.getNode(params[0]).key === 'checkAll') {
          const nodeKey = this.componentOption.resultOption.nodeKey
          const resultData = this.componentOption.resultOption.data

          if (this.rightTree.getNode(params[0]).checked) {
            // 项目可能会出现几万条数据，双循环会变成 亿级 的对比，使用对象快速检索
            const resultTagKeysObject = {}
            this.resultTagData.forEach(item => {
              resultTagKeysObject[item[nodeKey]] = item
            })

            resultData.forEach(data => {
              if (!resultTagKeysObject[data[nodeKey]]) {
                this.resultTagData.push(data)
              }
            })
          } else {
            this.rightTree.setCheckedNodes([])

            // 项目可能会出现几万条数据，双循环会变成 亿级 的对比，使用对象快速检索
            const resultDataKeysObject = {}
            resultData.forEach(item => {
              resultDataKeysObject[item[nodeKey]] = item
            })

            const cacheResultTagData = []
            this.resultTagData.forEach((data) => {
              if (!resultDataKeysObject[data[nodeKey]]) {
                cacheResultTagData.push(data)
              }
            })

            this.resultTagData = cacheResultTagData
          }

          this.resultTagData.forEach(item => {
            item.tagType = 'node'
            item.tagSvg = item.tagSvg || this.componentOption.resultOption.tagSvg
            item.tagColor = this.componentOption.resultOption.tagColor
            item.nodeKey = this.componentOption.resultOption.nodeKey
          })
          this.tagData = this.treeTagData.concat(this.resultTagData)
        } else {
          params[0].tagType = 'node'
          params[0].tagSvg = params[0].tagSvg || this.componentOption.resultOption.tagSvg
          params[0].tagColor = this.componentOption.resultOption.tagColor
          params[0].nodeKey = this.componentOption.resultOption.nodeKey
          // 处理tag和勾选状态
          if (this.rightTree.getNode(params[0]).checked) {
            this.resultTagData.push(params[0])

            if (this.componentOption.resultNum !== undefined && this.componentOption.resultNum > 0) {
              this.resultTagData = this.resultTagData.slice(this.resultTagData.length - this.componentOption.resultNum)
            }

            this.tagData = this.treeTagData.concat(this.resultTagData)
          } else {
            this.removeTag(params[0])
          }
        }
      }

      this.$nextTick(() => {
        this.setTreeChecked()
      })
    },
    removeTag(tag) {
      if (tag.tagType === 'tree') {
        this.treeTagData.splice(this.treeTagData.findIndex(item => Number(item[this.componentOption.treeOption.nodeKey]) === Number(tag[this.componentOption.treeOption.nodeKey])), 1)
      } else if (tag.tagType === 'node') {
        this.resultTagData.splice(this.resultTagData.findIndex(item => Number(item[this.componentOption.resultOption.nodeKey]) === Number(tag[this.componentOption.resultOption.nodeKey])), 1)
      }

      this.setTreeChecked()

      if (tag.tagType === 'node') {
        this.setCheckAll()
      }
      this.tagData = this.treeTagData.concat(this.resultTagData)
    },
    setCurrentTab(active, oldActive) {
      this.currentTab = this.componentOption.tabData[active]

      if (!this.cacheTreeOption && this.currentTab && this.currentTab.treeData) {
        this.cacheTreeOption = deepClone(this.componentOption.treeOption)
      }

      if (!this.cacheResultOption && this.currentTab && this.currentTab.resultData) {
        this.cacheResultOption = deepClone(this.componentOption.resultOption)
      }

      if (this.componentOption.treeOption) {
        this.cacheTreeOption && (this.componentOption.treeOption = deepClone(this.cacheTreeOption))
        this.componentOption.treeOption = Object.assign(this.componentOption.treeOption, this.currentTab.treeOption)

        this.currentTab.treeData && (this.componentOption.treeOption.data = this.currentTab.treeData)
      }

      if (this.componentOption.resultOption) {
        this.cacheResultOption && (this.componentOption.resultOption = deepClone(this.cacheResultOption))
        this.componentOption.resultOption = Object.assign(this.componentOption.resultOption, this.currentTab.resultOption)

        this.currentTab.resultData && (this.componentOption.resultOption.data = this.currentTab.resultData)
      }

      this.$nextTick(async() => {
        this.setTree()
        this.clickNode()
        this.setTreeChecked()
      })
    },
    setTree() {
      this.componentOption.treeOption && (this.leftTree = this.$refs.leftTree.$refs.tree[0])
      this.componentOption.resultOption && (this.rightTree = this.$refs.rightTree.$refs.tree[0])
    },
    setTreeChecked() {
      this.leftTree && this.leftTree.showCheckbox && this.leftTree.setCheckedNodes(this.treeTagData)

      this.rightTree && this.rightTree.showCheckbox && this.rightTree.setCheckedNodes(this.resultTagData)

      this.setCheckAll()
    },
    setCheckAll() {
      if (!this.rightTree || !this.rightTree.getNode('checkAll')) return

      const resultData = this.componentOption.resultOption.data
      const nodeKey = this.componentOption.resultOption.nodeKey

      const resultTagKeysObject = {}
      this.resultTagData.forEach(item => {
        resultTagKeysObject[item[nodeKey]] = item
      })

      let checkedLength = 0
      resultData.forEach(result => {
        if (resultTagKeysObject[result[nodeKey]]) {
          checkedLength++
        }
      })

      if (checkedLength === resultData.length) {
        this.rightTree.getNode('checkAll').indeterminate = false
        this.rightTree.getNode('checkAll').checked = true
      } else if (checkedLength === 0) {
        this.rightTree.getNode('checkAll').indeterminate = false
        this.rightTree.getNode('checkAll').checked = false
      } else {
        this.rightTree.getNode('checkAll').indeterminate = true
        this.rightTree.getNode('checkAll').checked = false
      }
    },
    filterData(val) {
      if (this.currentTab.filterBlock === 'leftTree' || this.currentTab.filterBlock === 'rightTree') {
        this.$refs[this.currentTab.filterBlock].filterText = val
      } else if (this.currentTab.filterBlock === 'all') {
        this.$refs['leftTree'].filterText = val
        this.$refs['rightTree'].filterText = val
      } else if (this.currentTab.filterBlock === 'last') {
        this.leftTree.showCheckbox ? this.$refs['leftTree'].filterText = val : ''
        this.rightTree.showCheckbox ? this.$refs['rightTree'].filterText = val : ''
      }
      this.$nextTick(() => {
        this.setTreeChecked()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.tree-list-container {
  width: 100%;

  ::v-deep .custom-tree-node {
    width: calc(100% - 35px);
  }

  .choosed-display-block {
    height: 96px;
    margin-bottom: 24px;
    overflow: hidden;

    .choosed-display {
      height: 100%;
      padding: 6px 12px;
      padding-right: 0;
      padding-bottom: 0;
      overflow-y: overlay;
      overflow-x: hidden;
    }

    ::v-deep .el-tag {
      margin-right:8px;
      margin-bottom: 6px;

      .tag-rightSpan {
        margin-left: 8px;
      }

      .tag-svg {
        font-size: 12px;
        margin-right: 4px;
      }
    }
  }

  .choice-display-block {
    height: 300px;
    display: flex;
    flex: 1;
    overflow: hidden;

    .el-tabs {
      height: 100%;
      border-right: 1px solid rgba(27, 53, 89, .2);

      ::v-deep .el-tabs__header  {
        margin-right: 0;
        .el-tabs__nav-wrap {
          border-right: 1px solid rgba(27, 53, 89, .2);
        }
      }

      ::v-deep .el-tabs__content {
        display: none;
      }
    }

    ::v-deep .tab-content {
      flex: 1;
      display: flex;
      overflow: hidden;

      .tab-tree {
        min-width: 186px;
        flex: 1;
        border-right: 1px solid rgba(27, 53, 89, .2);
      }

      .tab-result {
        width: 56%;

        &.is-loading {
          pointer-events: none;
        }

        .el-tree-node__expand-icon.is-leaf {
          display: none;
        }
      }

      .el-tree {
        background-color: unset;

        .el-tree-node__content {

          &::before,
          &::after {
            width: 16px;
          }
        }
      }
    }
  }

  .choosed-display-block,
  .choice-display-block {
    border-radius: 4px;
    box-shadow: rgba(27, 53, 89 ,.2) 0px 0px 0px 1px;
  }

  .choosed-head {
    display: flex;
    line-height: 1;
    margin-bottom: 16px;
    span {
      font-size: 14px;
      color: rgba(14, 27, 46, .85);
    }
  }

  .choice-head {
    display: flex;
    flex-flow: column;
    margin-bottom: 16px;

    &>span {
      font-size: 14px;
      line-height: 1;
      color: rgba(14, 27, 46, .85);
      margin-bottom: 16px;
    }
  }

  .choice-search-block {
    width: 250px;
    align-items: center;

    .choice-search-input {
      width: 214px;
      ::v-deep .el-input {
        width: 214px;
      }
      .el-icon-search {
        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  ::v-deep .el-tabs__item {
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: rgba(14, 27, 46, 1);
    border-bottom: 1px solid rgba(27, 53, 89, .2);

    &.is-active {
      color: #fff;
      background-color: rgba(24, 114, 240, 1);
    }
  }

  ::v-deep .el-tabs__nav-wrap::after {
    background-color:unset;

  }

  ::v-deep .el-tabs--left .el-tabs__item.is-left {
    text-align: center;
  }

  ::v-deep .el-tabs--left .el-tabs__active-bar.is-left,
  ::v-deep .el-tabs--left .el-tabs__nav-wrap.is-left::after {
    left: 0;
    right: auto;
    top: 1px;
  }

  ::v-deep .el-tabs__active-bar {
    display: none;
  }
}

@media screen and (max-width: 1920px) {}

@media screen and (max-width: 1680px) {}

@media screen and (max-width: 1570px) {

  /* TreeList --  */

}

@media screen and (max-width: 1440px) {}

@media screen and (max-width: 1366px) {}

@media screen and (max-width: 1280px) {}
</style>
