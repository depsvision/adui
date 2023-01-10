<template>
  <div ref="tableContainer" class="form-table-container" :class="[...(componentOption.containerClass ? componentOption.containerClass : [])]">
    <el-table
      ref="multipleTable"
      :key="reRenderTable"
      v-loading="componentOption.loading"
      :row-key="componentOption.rowKey"
      class="data-table"
      :class="[...(componentOption.tableClass ? componentOption.tableClass : [])]"
      :data="tableData"
      :border="componentOption.border"
      :max-height="componentOption.option && componentOption.option.maxHeight"
      :height="height"
      :row-class-name="setRowClass"
      :default-sort="componentOption.defaultSort"
      @cell-click="handleClickCell"
      @select="select"
      @select-all="selectAll"
      @selection-change="selectionChange"
    >
      <el-table-column
        v-if="componentOption.selectionColumn"
        :selectable="selectableRow"
        :class-name="(componentOption.selectionColumn.head || componentOption.selectionColumn.content)?'is-selection':'form-table-selection'"
        :align="componentOption.selectionColumn.align"
        :fixed="componentOption.selectionColumn.fixed"
        :width="componentOption.selectionColumn.width"
        type="selection"
      />
      <el-table-column
        v-if="componentOption.indexColumn"
        :align="componentOption.indexColumn.align"
        :label="componentOption.indexColumn.label"
        :fixed="componentOption.indexColumn.fixed"
        :width="componentOption.indexColumn.width"
        :show-overflow-tooltip="componentOption.indexColumn.showOverflowTooltip"
        type="index"
      />
      <el-table-column
        v-for="item in customizeHeader"
        :key="item.label"
        :type="item.type"
        :selectable="item.selectable"
        :width="item.width"
        :min-width="item.minWidth"
        :class-name="item.columnClass"
        :label="item.label"
        :prop="item.prop"
        :fixed="item.fixed"
        :align="item.align"
        :sortable="item.sortable"
        :sort-orders="item.sortOrders"
        :header-align="item.headerAlign"
        :show-overflow-tooltip="item.showOverflowTooltip"
      >
        <template #header="scope">
          <span :scope="scope" class="form-table-header-block">
            <span>{{ item.label }}</span>
            <slot :name="item.prop" />
          </span>
        </template>
        <template v-slot="scope">
          <el-tooltip
            :disabled="checkTextOverflow(item,scope) && (!item.tooltip || textOverflow(item,scope.row))"
            :content="item.tooltip && scope.row[item.prop + 'Content']"
            :placement="item.tooltip && item.tooltip.placement"
            :enterable="item.tooltip && item.tooltip.enterable"
          >
            <component
              :is="item.is || (scope.row.component && scope.row.component.find(i=>i.prop === item.prop).is)"
              v-if="item.is || (scope.row.component && scope.row.component.some(i=>i.prop === item.prop))"
              ref="component"
              :component-option="dealScope(item,scope)"
              @changeValue="value=>{changeComponentValue(value,item,scope)}"
            >
              <component
                :is="item.slotIs"
                v-if="item.slotIs"
                ref="slot"
                :component-option="item"
              />
            </component>

            <!-- 显示字段 或 按钮组 或显示字段 + 按钮组 -->
            <span
              v-else-if="item.type === 'span' || item.type === 'buttonGroup'"
              :ref="'block' + item.prop"
              v-loading="scope.row.spanLoading && scope.row.spanLoading.includes(item.prop)"
              :class="spanClass(item,scope.row)"
              class="table-span-button"
              :style="item.blockStyle"
            >
              <span
                v-if="item.prop"
                :ref="'spanSpan' + item.prop"
                class="table-span-button_span"
                :class="{'only-text':!item.buttonGroup,'has-text':scope.row[item.prop] && scope.row[item.prop] !== '-'}"
                :style="item.spanStyle"
              >
                <div
                  v-show="scope.row.loadingS === undefined ? false : scope.row.loadingS.includes(item.prop)"
                  v-loading-s
                  class="table-span-button__loading table-span-icon"
                />
                <svg-icon
                  v-if="scope.row.spanSvg && scope.row.spanSvg.includes(item.prop)"
                  :icon-class="scope.row[item.prop + 'Svg']"
                  :class="'svg-' + scope.row[item.prop + 'Svg']"
                  class="table-span-icon"
                />
                {{ spanString(scope.row,item) }}
              </span>
              <span
                v-if="item.buttonGroup && scope.row[item.prop] !== '' && scope.row[item.prop] !== '-'"
                :ref="'spanButton' + item.prop"
                :class="{'table-span-button_button':item.prop}"
                :style="item.buttonStyle"
              >
                <button-group
                  ref="buttonGroup"
                  :component-option="item.buttonGroup"
                  :scope="scope"
                  :disabled="item.disabled"
                />
              </span>
            </span>
            <span v-else-if="item.type === 'photo'">
              <div class="image-layout">
                <el-image
                  :src="scope.row[item.prop]"
                  @click="showImageViewer(scope.row,scope.$index,item)"
                >
                  <div slot="error" class="image-slot svg-slot">
                    <svg-icon :icon-class="scope.row[item.prop] === ''?'empty-image':'error-image-line'" />
                  </div>
                </el-image>
              </div>
            </span>
            <span v-else-if="item.type === 'switch'" :class="spanClass(item,scope.row)">
              <el-switch
                v-model="scope.row[item.prop]"
                :active-text="item.activeText"
                :inactive-text="item.inactiveText"
                :inactive-color="item.inactiveColor || 'rgba(218, 227, 240, 1)'"
                :disabled="item.disabled || accessButtons({ value: item.prop })"
                @change="value=>{handleSwitchChange(value,scope,item.prop)}"
              />
            </span>
            <span v-else-if="item.type === 'checkbox'">
              <el-checkbox
                v-model="scope.row[item.prop].value"
                :indeterminate="scope.row[item.prop].indeterminate"
                :disabled="item.disabled || accessButtons({ value: item.prop })"
                @change="value=>{handleCheckboxChange(value,scope,item.prop)}"
              >
                {{ scope.row[item.prop].label }}
              </el-checkbox>
            </span>
            <span v-else-if="item.type === 'progress'" class="form-table-progress">
              <el-progress
                v-if="scope.row[item.prop].value !== null"
                :type="item.progressType"
                :percentage="scope.row[item.prop].value"
                :width="item.progressWidth"
                :color="scope.row[item.prop].color"
                :show-text="item.showText"
                :stroke-width="item.strokeWidth"
                :stroke-linecap="item.strokeLinecap"
              />
              <span>{{ scope.row[item.prop].label }}</span>
            </span>

            <span v-else-if="item.type === 'inputCountNumber'">
              <el-input-number
                v-model="scope.row[item.prop]"
                :controls-position="item.controlsPosition"
                :step-strictly="item.stepStrictly"
                :size="item.size"
                :min="item.min"
                :max="item.max"
                :step="item.step"
                :precision="item.precision"
                :placeholder="item.placeholder"
                @change="handleInputCountNumberChange"
              />
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="componentOption.pager" class="form-table-pager">
      <el-pagination
        :current-page="componentOption.pager.currentPage"
        :page-sizes="componentOption.pager.pageSizesChoose"
        :page-size.sync="componentOption.pager.pageSizes"
        :layout="componentOption.pager.layout"
        :total="componentOption.pager.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @prev-click="handlePrevClick"
        @next-click="handleNextClick"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'
import Authority from '@/mixins/authority'

import ButtonGroup from '@/components/Button/ButtonGroup'
import SvgPainter from '@/components/SvgPainter'
import ImageAssembly from '@/components/InnerComponents/ImageAssembly'
import TagAssembly from '@/components/InnerComponents/TagAssembly'

import loadingS from '@/directive/loading-s'

export default {
  name: 'FormTable',
  components: { ButtonGroup, SvgPainter, ImageAssembly, TagAssembly },
  directives: { loadingS },
  mixins: [Authority],
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
      reRenderTable: '0',
      tableHeight: 96,
      selectedData: [],
      imageIndex: 0,
      hasFirstHeight: false
    }
  },
  computed: {
    ...mapGetters([
      'screenResolution',
      'searchConditionExpand'
    ]),
    customizeHeader() {
      return this.componentOption.header.filter(head => !head.hide)
    },
    tableData() {
      if (this.componentOption.pager) {
        return this.componentOption.cacheData
      } else {
        return this.componentOption.tableData
      }
    },
    textOverflow() {
      return (item, row) => {
        if (!row.textOverflow) {
          if (row[item.prop + 'Content'] && !item.buttonGroup) {
            return false
          } else {
            return true
          }
        } else {
          !row.textOverflow.includes(item.prop)
        }
      }
    },
    spanString() {
      return (row, item) => {
        let result = row[item.prop]

        if (row.isPassword && row.isPassword.includes(item.prop)) {
          result = '••••••'
        }

        return result
      }
    },
    dealScope() {
      return (item, scope) => {
        const result = deepClone(scope.row)

        const { prop, hasValue, ...left } = item

        result.prop = prop

        if (hasValue) {
          result.value = scope.row[prop]
        }

        Object.keys(left).forEach(key => {
          result[key] = item[key]
        })

        return result
      }
    },
    height() {
      if (this.componentOption.tableData.length > 0 &&
          this.componentOption.option &&
          this.componentOption.option.maxHeight) {
        if (this.hasFirstHeight) {
          return ''
        } else {
          return null
        }
      } else {
        if (this.componentOption.option && this.componentOption.option.height) {
          return this.componentOption.option.height
        } else if (this.componentOption.defaultHeight) {
          if (this.hasFirstHeight) {
            return ''
          } else {
            return null
          }
        } else {
          return this.tableHeight
        }
      }
    },
    spanClass() {
      return (item, row) => {
        const classGroup = {}
        item.class && item.class.split(' ').forEach(item => {
          classGroup[item] = true
        })

        item.spanClass && item.spanClass.split(' ').forEach(item => {
          classGroup[item] = true
        })

        row[item.prop + 'Class'] && row[item.prop + 'Class'].split(' ').forEach(item => {
          classGroup[item] = true
        })

        return classGroup
      }
    }
  },
  watch: {
    screenResolution: {
      handler(val) {
        this.resizeTableHeight()
      },
      deep: true,
      immediate: true
    },
    searchConditionExpand(val) {
      this.tableHeight = 300
      setTimeout(() => {
        this.resizeTableHeight()
      }, 300)
    },
    'componentOption.tableData': {
      handler(val) {
        this.dealSelection()
      },
      deep: true
    },
    'componentOption.selectedData': {
      handler(val) {
        if (val) {
          this.toggleSelection(val)
        }
      },
      deep: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.dealSelection()
    },
    dealSelection() {
      this.$nextTick(() => {
        if (this.componentOption.selectionColumn) {
          if (this.componentOption.selectionColumn.head) {
            const head = document.querySelector('th.is-selection:not(.is-hidden) .cell')

            const headSpan = document.createElement('span')
            headSpan.innerHTML = this.componentOption.selectionColumn.head
            headSpan.className = 'table-selection-text'

            if (head.children.length === 1) {
              head.appendChild(headSpan)
            }
          }

          if (this.componentOption.selectionColumn.content) {
            const content = document.querySelectorAll('td.is-selection:not(.is-hidden) .cell')

            for (let i = 0; i < content.length; i++) {
              const contentSpan = document.createElement('span')
              contentSpan.innerHTML = this.componentOption.selectionColumn.content
              contentSpan.className = 'table-selection-text'

              if (content[i].children.length === 1) {
                content[i].appendChild(contentSpan)
              }
            }
          }
        }
      })
    },
    async checkTextOverflow(item, scope) {
      await this.$nextTick(() => {
        const block = this.$refs['block' + item.prop]
        const button = this.$refs['spanButton' + item.prop]
        const span = this.$refs['spanSpan' + item.prop]

        let width = 0

        if (span && span[scope.$index]) {
          width += span[scope.$index].offsetWidth
        }

        if (button && button[scope.$index]) {
          width += 24 + button[scope.$index].offsetWidth
        }

        if (button && block && scope.row[item.prop + 'Content'] && width === block[scope.$index].offsetWidth) {
          if (!scope.row.textOverflow) {
            this.$set(scope.row, 'textOverflow', [])
          }

          !scope.row.textOverflow.includes(item.prop) && scope.row.textOverflow.push(item.prop)
        }
      })
    },
    toggleSelection(rows) {
      rows.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row)
      })
    },

    handleClickCell(row, column, cell, event) {
      this.$emit('cell-lick', row, column, cell, event)
    },
    resizeTableHeight() {
      const that = this

      // 每次计算前先给个比较小的数值防止上次table的高度撑开外层高度
      this.tableHeight = 96

      this.$nextTick(() => {
        this.hasFirstHeight = true
        this.tableHeight = that.$refs.tableContainer.offsetHeight
      })
    },
    handleSwitchChange(value, scope, prop) {
      this.$emit('handleSwitchChange', value, scope, prop)
    },
    handleCheckboxChange(value, scope, prop) {
      this.$emit('handleCheckboxChange', value, scope, prop)
    },
    changeComponentValue(value, item, scope) {
      scope.row[item.prop] = value
    },
    selectableRow(row, index) {
      if (row.rowDisabled) {
        return 0
      } else {
        return 1
      }
    },

    select(row) {
      this.selectedData = row
    },
    selectAll(scope) {
      this.selectedData = scope
    },
    selectionChange(selection) {
      this.selectedData = selection
      this.handleTableEmit('selectionChange', selection)
    },
    handleInputCountNumberChange(value) {
      this.$emit('handleInputCountNumberChange', value)
    },
    handleTableEmit(value, ...arg) {
      this.$emit('handleTableEvent', { value: value, arg: arg })
    },
    setRowClass({ row, index }) {
      return row.rowClass
    },
    showImageViewer(row, index, item) {
      row.imgIndex = index

      if (item.imgKey) {
        this.componentOption.imageViewer.imgKey = item.imgKey
      }

      this.$store.dispatch('image/setImageViewer', { key: 'activeImg', value: deepClone(row) })
      this.$store.dispatch('image/assignImageViewer', this.componentOption.imageViewer)
    },
    handleSizeChange(size) {

    },
    handleCurrentChange(page) {
      const size = this.componentOption.pager.pageSizes

      this.componentOption.cacheData = this.componentOption.tableData.slice(size * (page - 1), size * page)
    },
    handlePrevClick(page) {
      const size = this.componentOption.pager.pageSizes

      this.componentOption.cacheData = this.componentOption.tableData.slice(size * (page - 1), size * page)
    },
    handleNextClick(page) {
      const size = this.componentOption.pager.pageSizes

      this.componentOption.cacheData = this.componentOption.tableData.slice(size * (page - 1), size * page)
    }
  }
}
</script>

<style scoped lang="scss">
.form-table-container {
  width: 100%;
  height: 100%;

  :deep( .el-table ) {

    .form-table-header-block {

      &>div {
        display: inline-block;
      }
    }

    .table-span-button {
      display: flex;
      align-items: center;

      .table-span-button_span,
      .table-span-button_button {
        display: inline-block;
      }

      .table-span-button_span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        .table-span-button__loading {
          display: inline-block;
          vertical-align: middle;
        }

        .table-span-icon {
          margin-right: 4px;
        }
      }

      .table-span-button_button {
        margin-left: 24px;
      }

      .only-text {
        width: 100%;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }

    .form-table-progress {
      display: flex;
      align-items: center;

      .el-progress {
        margin-right: 8px;
      }
    }

    .cell {

      &.el-tooltip {

        .table-span-button_span {
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
        }
      }

      .el-loading-mask {

        .el-loading-spinner {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateY(-50%);
          margin-top: 0;
        }

        svg {
          width: 24px;
          height: 24px;
        }
      }
    }

    .is-selection {

      .cell {

        .el-checkbox {
          display: inline-block;

          &+.table-selection-text {
            display: inline-block;
            margin-left: 8px;
          }
        }
      }
    }

    .form-table-selection {

      .cell {
        overflow: unset;
        text-overflow: unset;
      }
    }
  }

  .form-table-pager {
    display: flex;
    justify-content: flex-end;
    padding-top: 12px;
  }
}

.image-layout {
  display: flex;
  justify-content: center;

  .el-image {
    width: 64px;
    height: 36px;
    border: 2px solid #fff;
    border-radius: 4px;

    &:hover {
      cursor: pointer;
      border: 2px solid #1872F0;
    }
  }
}

:deep( .el-image ) {
  &:hover {
    cursor: pointer;
  }
}

@media screen and (max-width: 1920px) {}

@media screen and (max-width: 1680px) {}

@media screen and (max-width: 1440px) {

  /* componentOption -- data-table */

}

@media screen and (max-width: 1366px) {}

@media screen and (max-width: 1280px) {}
</style>
