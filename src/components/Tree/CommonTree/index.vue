<template>
    <div v-infinite-scroll="loadCacheData" :infinite-scroll-disabled="disabledLoadCacheData"
        class="common-tree-container">
        <div v-if="componentOption.filterInput && !componentOption.filterInput.hide" class="filter-input">
            <el-input v-model="filterText" :size="componentOption.filterInput.size"
                :suffix-icon="componentOption.filterInput.suffixIcon"
                :placeholder="componentOption.filterInput.placeholder" />
            <svg-icon v-if="componentOption.inputAfterSvg" :icon-class="componentOption.inputAfterSvg"
                :class="[accessButtons({ value: componentOption.inputAfterSvg }) ? 'is-disabled' : '']"
                class="filter-input-after-svg" @click="clickInputAfterSvg" />
        </div>
        <div v-for="(dataItem, dataItemIndex) in dataGroup" :key="dataItemIndex" class="tree-block">
            <div v-if="dataItem.head" class="tree-item-head">{{ dataItem.head }}</div>
            <el-tree ref="tree" :data="dataItem.data" :props="componentOption.props" :node-key="componentOption.nodeKey"
                :accordion="componentOption.accordion" :empty-text="componentOption.emptyText"
                :show-checkbox="componentOption.showCheckbox" :check-strictly="componentOption.checkStrictly"
                :default-expand-all="componentOption.expandAll" :current-node-key="componentOption.currentNode"
                :expand-on-click-node="componentOption.expandOnClickNode"
                :highlight-current="componentOption.highlightCurrent"
                :default-expanded-keys="componentOption.expandedKeys"
                :default-checked-keys="componentOption.checkedKeys"
                :check-on-click-node="componentOption.checkOnClickNode" :filter-node-method="filterNode"
                :indent="componentOption.indent || 8" :lazy="componentOption.lazy" :load="loadNode"
                :draggable="componentOption.draggable" :allow-drop="allowDrop" :allow-drag="allowDrag"
                :render-content="componentOption.slotScope ? null : renderContent" :class="componentOption.treeClass"
                @node-click="handleNodeClick" @node-drag-end="endDrag" @check-change="handleClickCheckChange">
                <template #default="{ node, data }">
                    <span class="custom-tree-node tree-display" :class="[node.data.nodeDisabled ? 'is-disabled' : '']"
                        @mouseenter="showHideOptions(node, true)" @mouseleave="showHideOptions(node, false)">
                        <span class="tree-item-left">
                            <span v-show="node.environment !== 'edit'" class="tree-item-label">
                                <el-tooltip :placement="componentOption.headSvg && componentOption.headSvg.placement"
                                    :enterable="componentOption.headSvg && componentOption.headSvg.enterable"
                                    :disabled="svgTooltipDisabled(node.data)"
                                    :popper-class="componentOption.headSvg && componentOption.headSvg.popperClass"
                                    transition="fade-show">
                                    <template v-slot:content>
                                        <div>
                                            <div v-html="node.data.headSvg && node.data.headSvg.tooltip || ''" />
                                        </div>
                                    </template>
                                    <div class="tree-item-svg">
                                        <svg-icon v-if="node.data.headSvg || componentOption.headSvg"
                                            :icon-class="labelSvg(node)"
                                            :component-option="node.data.svgOption || componentOption.svgOption || {}"
                                            class="tree-item-svg-svg" />
                                        <span v-if="node.data.headSvg && node.data.headSvg.badge"
                                            class="tree-item-svg-badge" />
                                    </div>
                                </el-tooltip>
                                <el-tooltip ref="tooltip" :content="node.label"
                                    :placement="componentOption.tooltip.placement"
                                    :effect="componentOption.tooltip.effect"
                                    :enterable="componentOption.tooltip.enterable"
                                    :disabled="detectWidth(node) && node.tootipDisabled" transition="fade-show">
                                    <div :ref="'div' + node.id" class="tree-item-content">
                                        <span :ref="'span' + node.id">{{ node.label }}</span>
                                    </div>

                                </el-tooltip>
                            </span>
                            <span @click.stop>
                                <el-input class="el-input__inner" v-show="node.environment === 'edit'"
                                    :ref="'input' + node.id" v-model.trim="node.data.label" size="small"
                                    @blur="saveNode(node, 'blur')" />
                            </span>
                        </span>
                        <span class="tree-item-right">
                            <svg-icon v-if="node.data.svg" :icon-class="node.data.svg" class="tree-item-right-svg" />
                            <el-tooltip v-if="node.data.rightSpan" :content="node.data.rightSpan" placement="top-start"
                                :enterable="false">
                                <span class="tree-item-rightSpan">
                                    {{ node.data.rightSpan }}
                                </span>
                            </el-tooltip>
                            <span v-show="componentOption.totalNum &&
    (!(currentHoverNode.key === node.key) || !componentOption.iconOption) &&
    node.environment !== 'edit' &&
    !(node.data.loadingS || node.data.svg)" class="tree-item-num" :class="{ 'isIcon': componentOption.iconOption }">
                                {{ getTotalNum(node) }}
                            </span>
                            <span v-if="componentOption.iconOption" class="drop-icon" @click.stop>
                                <transition name="fold">
                                    <div
                                        v-if="Object.keys(currentHoverNode).length > 0 && currentHoverNode.key === node.key">
                                        <el-button link type="primary" v-if="node.environment !== 'edit' &&
    permissibleConditions(componentOption.open, node) &&
    !accessButtons({ value: 'openTree' })" icon="plus" @click="handleClickCommand({
    command: 'open',
    data: node
})" />
                                        <el-button link type="primary" v-if="node.environment !== 'edit' &&
    permissibleConditions(componentOption.append, node) &&
    !accessButtons({ value: 'appendTree' })" icon="plus" @click="handleClickCommand({
    command: 'add',
    data: node
})" />
                                        <el-button link type="primary" v-if="node.environment !== 'edit' &&
    permissibleConditions(componentOption.edit, node) &&
    !accessButtons({ value: 'editTree' })" icon="edit" @click="handleClickCommand({
    command: 'edit',
    data: node
})" />
                                        <el-button link type="primary" v-if="node.environment === 'edit' &&
    !accessButtons({ value: 'saveTree' })" icon="check" @click="saveNode(node, 'click')" />
                                        <el-button link type="danger" v-if="node.environment !== 'edit' &&
    permissibleConditions(componentOption.delete, node) &&
    !accessButtons({ value: 'deleteTree' })" class="is-danger" icon="delete" @click="removeNode(node)" />

                                        <el-button link type="primary" v-if="permissibleConditions(null, node) &&
    !accessButtons({ value: 'refreshTree' })" icon="refresh-left" @click="handleClickCommand({
    command: 'refresh',
    data: node
})" />
                                    </div>
                                </transition>
                                <svg-icon v-show="node.data.loadingS || node.data.svg" v-loading-s="node.data.loadingS"
                                    :icon-class="node.data.svg || ''" class="drop-icon-svg" />
                            </span>
                            <point-drop-down
                                v-if="componentOption.dropOption && componentOption.dropOption.dropData && componentOption.dropOption.dropData.length > 0"
                                :component-option="componentOption.dropData" />
                        </span>
                    </span>
                </template>

            </el-tree>
        </div>
    </div>
</template>

<script>
import Authority from '@/mixins/authority'
import PointDropDown from '@/components/InnerComponents/PointDropDown'
import { recursionTreeTotal, trimObject } from '@/utils'
import { mapGetters } from 'vuex'

import loadingS from '@/directive/loading-s'
import { deepClone } from '../../HeatMap/utils'
import { Plus, Edit, RefreshLeft, Delete } from '@element-plus/icons-vue'

export default {
    name: 'CommonTree',
    components: { PointDropDown },
    directives: { loadingS },
    mixins: [Authority],
    props: {
        componentOption: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data() {
        return {
            currentHoverNode: {},
            filterText: '',
            refTree: {},
            savebehavior: '',
            initialNodeData: '',
            cacheData: [],
            filterCacheData: []
        }
    },
    computed: {
        ...mapGetters([
            'authority'
        ]),
        dataGroup() {
            if (this.componentOption.dataGroup) {
                return this.componentOption.dataGroup
            } else {
                if (this.componentOption.infinite) {
                    return [
                        {
                            data: this.cacheData
                        }
                    ]
                } else {
                    return [
                        {
                            data: this.componentOption.data
                        }
                    ]
                }
            }
        },
        getTotalNum() {
            return (node) => {
                if (node.data.children && node.key !== 0) {
                    node.data.total = (node.data.count ?? 0) + recursionTreeTotal(node.data, 0, 'children', 'count')
                    return node.data.total
                } else {
                    node.data.total = (node.data.count ?? 0)
                    return node.data.count
                }
            }
        },
        labelSvg() {
            return node => {
                if (node.isCurrent) {
                    if (node.data.headSvg) {
                        return node.data.headSvg.isActive
                    } else {
                        return this.componentOption.headSvg.isActive
                    }
                } else {
                    if (node.data.headSvg) {
                        return node.data.headSvg.default
                    } else {
                        return this.componentOption.headSvg.default
                    }
                }
            }
        },
        disabledLoadCacheData() {
            let disable = true

            if (this.componentOption.infinite) {
                disable = this.cacheData.length === this.componentOption.data.length
            }

            return disable
        },
        svgTooltipDisabled() {
            return data => {
                let result = true

                const isComponentOptionJudge = this.componentOption.headSvg && this.componentOption.headSvg.tooltip

                const isDataJudge = data.headSvg && data.headSvg.tooltip

                const disabledDataTooltip = data.headSvg && data.headSvg.tooltip

                if (isComponentOptionJudge || isDataJudge) {
                    if (disabledDataTooltip) {
                        result = false
                    }
                }

                return result
            }
        }
    },
    watch: {
        'componentOption.data': {
            handler(val) {
                if (this.componentOption.infinite) {
                    this.cacheData = deepClone(this.componentOption.data.slice(0, this.componentOption.infinite))
                }
            },
            immediate: true,
            deep: true
        },
        filterText(val) {
            if (this.componentOption.infinite) {
                this.handleFilterData(val)
            } else {
                this.$refs.tree[0].filter(val)
            }
        }
    },
    mounted() {
        this.getTreeRef()
    },
    methods: {
        getTreeRef() {
            this.$nextTick(() => {
                this.refTree = this.$refs.tree[0]
            })
        },

        loadCacheData() {
            let sliceData = []
            if (this.filterText) {
                sliceData = this.filterCacheData
            } else {
                sliceData = this.componentOption.data
            }
            const newDate = deepClone(sliceData.slice(this.cacheData.length, this.cacheData.length + this.componentOption.infinite))
            this.cacheData.push(...newDate)

            this.handleEvent('loadCacheData', newDate)
        },

        permissibleConditions(operation, node) {
            let readonly = false

            const path = this.refTree.getNodePath(node.data)

            if (path[0]) {
                readonly = path[0].readonly
            }

            if (operation && operation.type && operation.arr && !readonly) {
                if (operation.type === 'include') {
                    return operation.arr.includes(node.key)
                } else if (operation.type === 'except') {
                    return !operation.arr.includes(node.key)
                }
            } else if (
                typeof operation !== 'undefined' &&
                !operation &&
                readonly &&
                path.length === 1 &&
                !node.data.loadingS) {
                return true
            } else {
                return false
            }
        },
        filterDropData(node) {
            const dropTitleData = JSON.parse(JSON.stringify(this.componentOption.dropData))
            if (!node.key && node.key === 0) {
                dropTitleData.pop()
            }
            return dropTitleData
        },
        renderContent(h, { node, data, store }) {
            if (this.componentOption.renderContentHtml) {
                return this.componentOption.renderContentHtml
            } else {
                // return (<span class='el-tree-node__label'>{node.label}</span>)
            }
        },
        filterNode(value, data, node) {
            if (!value) return true
            if (!this.componentOption.filterInput.require) {
                return data.label.indexOf(value) !== -1 || node.key === 0 || node.key === 'checkAll'
            } else {
                let filterResult = false
                filterResult = this.componentOption.filterInput.require.some(item => data[item].indexOf(value) !== -1) || node.key === 0 || node.key === 'checkAll'
                return filterResult
            }
        },
        handleFilterData(val) {
            if (val) {
                const nodeKey = this.componentOption.nodeKey
                this.filterCacheData = this.componentOption.data.filter(item => item.label.indexOf(val) !== -1 || item[nodeKey] === 0 || item[nodeKey] === 'checkAll')

                this.cacheData = deepClone(this.filterCacheData.slice(0, this.componentOption.infinite))
            } else {
                this.filterCacheData = []

                this.cacheData = deepClone(this.componentOption.data.slice(0, this.componentOption.infinite))
            }
        },
        loadNode(...arg) {
            this.handleEvent('loadNode', ...arg)
        },
        endDrag(...arg) {
            this.handleEvent('endDrag', ...arg)
        },
        handleClickCheckChange(...arg) {
            this.handleEvent('checkChange', ...arg)
        },
        handleClickCheck(...arg) {
            this.handleEvent('clickCheck', ...arg)
        },
        handleNodeCollapse(...arg) {
            this.handleEvent('nodeCollapse', ...arg)
        },
        allowDrop(draggingNode, dropNode, type) {
            const dropItem = this.componentOption.disabledDrop.find(item => item.key === dropNode.key)
            if (this.componentOption.disabledDrop && this.componentOption.disabledDrop.length > 0 && dropItem) {
                return !dropItem.type.includes(type)
            } else {
                return true
            }
        },
        allowDrag(node) {
            if (this.componentOption.disabledDrag && this.componentOption.disabledDrag.length > 0) {
                return this.componentOption.disabledDrag.indexOf(node.key) === -1
            } else {
                return true
            }
        },
        handleNodeClick(...arg) {
            !arg[0].nodeDisabled && this.handleEvent('node-click', ...arg)
        },
        handleEvent(eName, ...arg) {
            this.$emit('handleEvent', { eName: eName, arg: [...arg] })
        },
        handleClickCommand(params) {
            switch (params.command) {
                case 'open':
                    this.savebehavior = 'add'
                    this.addNodeToOpen(params.data)
                    break
                case 'add':
                    this.savebehavior = 'add'
                    this.appendNode(params.data)
                    break
                case 'edit':
                    this.savebehavior = 'edit'
                    this.editNode(params.data)
                    break
                case 'delete':
                    this.removeNode(params.data)
                    break
                case 'refresh':
                    this.reFreshNode(params.data)
                    break
                default:
            }
        },
        editNode(node) {
            this.componentOption.draggable = false
            this.initialNodeData = node.data.label
            node['environment'] = 'edit'
            this.$nextTick(() => {
                this.$refs['input' + node.id][0].focus()
            })
        },
        saveNode(node, type) {
            this.componentOption.draggable = true
            node.environment = 'default'
            node.data = trimObject(node.data, 'label')
            if (node.data.label === '') {
                node.data.label = '未命名' + Date.now()
            }
            if (this.savebehavior === 'add') {
                this.handleEvent('appendNode', node)
            } else if (this.savebehavior === 'edit') {
                if (node.data.label !== this.initialNodeData) {
                    this.handleEvent('editNode', node)
                }
            }
        },
        addNodeToOpen(node) {
            this.handleEvent('addNodeToOpen', node)
        },
        appendNode(node) {
            const maxLevel = this.componentOption.maxLevel || 5
            if (node.level >= maxLevel) {
                this.$messageInfo({
                    message: '最大层级为 ' + maxLevel + ' 级',
                    type: 'warning'
                })

                return
            }

            const newChild = { label: '未命名' + Date.now(), children: [], count: 0 }

            this.refTree.append(newChild, node)

            node.expand()

            this.$nextTick(() => {
                this.editNode(node.childNodes[node.childNodes.length - 1])
            })
        },
        removeNode(node) {
            this.handleEvent('removeNode', node)
        },
        async detectWidth(node) {
            const that = this

            await this.$nextTick(() => {
                node['tootipDisabled'] = that.$refs['span' + node.id][0].offsetWidth < that.$refs['div' + node.id][0].offsetWidth
            })
        },
        reFreshNode(node) {
            this.componentOption.refresh(node)
        },

        showHideOptions(node, flag) {
            if (flag) {
                this.currentHoverNode = node
            } else {
                this.currentHoverNode = {}
            }
        },
        clickInputAfterSvg() {
            this.$store.dispatch('button/simulateButton', this.componentOption.inputAfterSvg)
        }
    }
}
</script>

<style scoped lang="scss">
.el-input__inner {
    height: 28px;
    line-height: 28px;
}

.el-tree-node__label {
    display: flex;
    overflow: hidden;
    width: 100%;
}

.common-tree-container {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;

    .filter-input {
        display: flex;
        align-items: center;
        padding: 0 24px;
        margin-bottom: 8px;

        .filter-input-after-svg {
            font-size: 20px;
            margin-left: 16px;

            &:hover {
                color: #1872F0;
                cursor: pointer;
            }
        }
    }

    .fold-enter-from,
    .fold-leave-to {
        transform: translateX(20px);
        opacity: 0;
    }

    .tree-block {

        .tree-item-head {
            color: rgba(14, 27, 46, 0.35);
            font-size: 12px;
            line-height: 32px;
            margin-left: 16px;
        }
    }

    .tree-display {
        width: 100%;
        display: flex;
        overflow: hidden;
    }

    .custom-tree-node {
        align-items: center;
        font-size: 14px;
        color: #0E1B2E;

        .tree-item-label {
            display: flex;

            .tree-item-svg {
                position: relative;
                display: flex;
                margin-right: 4px;

                .tree-item-svg-svg {
                    font-size: 16px;
                    color: rgba(14, 27, 46, 0.5);
                }

                .tree-item-svg-badge {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background-color: rgba(255, 58, 51, 1);
                }
            }

            .tree-item-content {
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        &.is-disabled {

            .tree-item-label,
            .tree-item-right {
                color: rgba(14, 27, 46, 0.35);
            }
        }

        .tree-item-rightSpan,
        .tree-item-num {
            font-size: 14px;
            color: rgba(14, 27, 46, .5);
        }

        .tree-item-left {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-right: 8px;

            .tree-item-label {
                width: 100%;
            }

            .red-color {
                color: #FF3A33;
            }

            &:focus {
                outline: none;
            }
        }

        .tree-item-right {
            display: flex;
            align-items: center;

            .tree-item-right-svg {
                color: rgba(14, 27, 46, 0.5);
            }

            .el-button+.el-button {
                margin-left: 8px;
            }

            .el-button.is-link {
                border: none;
                padding: 0;
            }

            .drop-icon {
                position: relative;

                :deep( .el-button ) {
                    i {
                        padding: 2px;
                        border-radius: 4px;
                    }

                    i,
                    svg {

                        &:hover {
                            background-color: rgba(73, 111, 165, 0.1);
                        }
                    }
                }

                .drop-icon-svg {
                    font-size: 12px;
                }
            }

            .tree-item-rightSpan {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        .el-input {
            width: 95%;
        }
    }

    :deep( .el-dropdown ) {
        width: 8px;
        font-size: 14px;
        color: #0E1B2E;
    }

    .point-drop-down-container {
        opacity: 0;
    }

    :deep( .el-tree-node__content ) {
        &:hover {
            .point-drop-down-container {
                opacity: 1;
            }
        }

        .el-tree-node__loading-icon {
            display: flex;
            align-items: center;
            animation: rotating 1s linear infinite;
        }
    }
}

@media screen and (max-width: 1920px) {}

@media screen and (max-width: 1680px) {}

@media screen and (max-width: 1440px) {

    /* CommonTree -- custom-tree-node */
}

@media screen and (max-width: 1366px) {}

@media screen and (max-width: 1280px) {}
</style>
