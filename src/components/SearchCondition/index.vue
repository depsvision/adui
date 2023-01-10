<template>
    <div ref="searchCondition" class="search-condition-container">
        <div class="expand-from-block" :style="expandFromHeight">
            <el-form ref="searchConditionForm" :inline="true" :model="componentOption.data"
                :label-width="componentOption.labelWidth" :label-position="componentOption.labelPosition"
                :class="componentOption.class">
                <div v-for="(div, divIndex) in dealedSearchFormData" :key="divIndex" class="form-row-block">
                    <el-form-item v-for="form in div" :key="form.prop" :label="form.label" :prop="form.prop"
                        class="form-item" :class="form.class">
                        <el-input v-if="form.type === 'input'" v-model.trim="componentOption.data[form.prop]"
                            :style="{ 'width': form.width + 'px' }" :size="elementSize" :disabled="form.disabled"
                            :placeholder="form.placeholder" clearable />
                        <el-select v-if="form.type === 'select'" v-model="componentOption.data[form.prop]"
                            :style="{ 'width': form.width + 'px' }" :disabled="form.disabled" :size="elementSize"
                            :placeholder="form.placeholder" clearable @change="selectChange(form.prop, form.isCascader)">
                            <el-option v-for="sel in form.option" :key="sel.value" :label="sel.label"
                                :value="sel.value" />
                        </el-select>
                        <el-cascader v-if="form.type === 'cascader'" v-model="componentOption.data[form.prop]"
                            :options="form.data" :disabled="form.disabled" :size="elementSize" clearable
                            @change="cascaderChange(form.prop, form.isCascader)" />
                        <el-date-picker v-if="form.type === 'datePicker'" v-model="componentOption.data[form.prop]"
                            :disabled="form.disabled" :type="form.data" :align="form.align"
                            :start-placeholder="form.startPlaceholder" :end-placeholder="form.endPlaceholder"
                            :default-time="form.defaultTime" :picker-options="form.pickerOptions"
                            :value-format="form.valueFormat" :size="elementSize" />
                    </el-form-item>
                </div>
            </el-form>
            <div class="operate-button" :class="[componentOption.fixed ? 'is-fixed' : '']">
                <button-group ref="buttonGroup" :component-option="componentOption.buttons" />
                <el-button v-show="hasExpand" class="expand-operate" link type="primary" size="small"
                    @click="expandShrink">
                    <i class="el-icon-arrow-down" :class="{ 'is-expand': isExpand }" />
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ButtonGroup from '@/components/Button/ButtonGroup'

export default {
    name: 'SearchCondition',
    components: { ButtonGroup },
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
            buttonsWidth: 0,
            hasExpand: false,
            isExpand: false,
            dealedSearchFormData: [],
            expandFromHeight: {
                height: '36px'
            }
        }
    },
    computed: {
        ...mapGetters([
            'aside',
            'button',
            'elementSize',
            'screenResolution',
            'searchConditionExpand'
        ])
    },
    watch: {
        'screenResolution.width': {
            handler(val) {
                this.$nextTick(() => {
                    this.dealedFormData(this.isExpand)
                })
            },
            immediate: true
        },
        'aside.collapse'(val) {
            setTimeout(() => {
                this.dealedFormData(this.isExpand)
            }, 320)
        },
        'componentOption.form': {
            handler(val) {
                this.componentOption.data = {}
                this.dealedFormData(this.isExpand)
            },
            deep: true
        },
        'button.value'(val) {
            this.clickButton(val)
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.componentOption.buttons.buttons.forEach(item => {
                // button字数 * fontsize + padding + border
                this.buttonsWidth += item.label.length * 14
            })
            // += button之间的 margin + “展开图标”的内容长度 + “展开图标”的margin
            this.buttonsWidth += (this.componentOption.buttons.buttons.length - 1) * 24 + 24 + 16
        },
        clickButton(value) {
            switch (value) {
                case 'reset':
                    this.resetForm()
                    break
                default:
            }
        },
        dealedFormData(isExpand) {
            const resultArr = []

            this.componentOption.form.forEach((item, index) => {
                // input宽度  + 字数 * fontsize + padding-right + margin-right
                item.calculateWidth = item.width + item.label.length * 14 + 16 + (index === this.componentOption.form.length - 1 ? 0 : 16)
            })

            const searchCondition = this.$refs.searchCondition.offsetWidth

            this.calculateWidthArr(this.componentOption.form, resultArr, 0, searchCondition, isExpand)

            const lastDivWidth = resultArr[resultArr.length - 1].reduce((total, num) => {
                return total + num.calculateWidth
            }, 0)

            // button个数 * 长度 + "展开"区域长度 + 间距之和
            const isWidthEnough = (lastDivWidth + this.buttonsWidth) < searchCondition

            if (isExpand) {
                if (!isWidthEnough && !this.componentOption.fixed) {
                    resultArr.push([])
                }

                this.expandFromHeight = {
                    height: 36 + (resultArr.length - 1) * 52 + 'px'
                }

                if (resultArr.length === 1) {
                    this.isExpand = false
                    this.$store.dispatch('resolution/getSearchConditionExpand', this.isExpand)
                }
            } else {
                this.expandFromHeight = {
                    height: '36px'
                }
            }

            this.dealedSearchFormData = resultArr

            this.hasExpand = this.dealedSearchFormData.length > 1
        },
        calculateWidthArr(dealArr, resultArr, index, compare, isExpand) {
            let cacheCompare = compare

            if (!isExpand || this.componentOption.fixed) {
                cacheCompare = compare - this.buttonsWidth
            }

            resultArr[index] = []
            dealArr.forEach((item, itemIndex) => {
                const accumulate = resultArr[index].reduce((total, num) => {
                    return total + num.calculateWidth
                }, 0)

                if (accumulate + item.calculateWidth < cacheCompare) {
                    resultArr[index].push(item)
                } else {
                    this.calculateWidthArr(dealArr.slice(itemIndex, dealArr.length), resultArr, ++index, compare)
                }
            })
        },
        resetForm() {
            this.componentOption.data = {}
            this.$store.dispatch('button/listenClickButton', { key: 'value', value: 'search' })
        },
        expandShrink() {
            this.isExpand = !this.isExpand
            this.dealedFormData(this.isExpand)
            this.$store.dispatch('resolution/getSearchConditionExpand', this.isExpand)
        },
        selectChange(prop, isCascader) {
            if (isCascader && Object.keys(isCascader).length > 0) {
                if (this.componentOption.data[prop].length === 0 || this.componentOption.data[prop] === 0) {
                    for (const props in isCascader) {
                        this.componentOption.data[props] = ''
                    }
                }
            }
        },
        cascaderChange(prop, isCascader) {
            if (isCascader && Object.keys(isCascader).length > 0) {
                if (this.componentOption.data[prop].length > 0) {
                    for (const props in isCascader) {
                        this.componentOption.data[props] = isCascader[props]
                    }
                }
            }
        }
    }
}
</script>

<style scoped lang="scss">
.search-condition-container {
    width: 100%;
    height: 100%;

    .expand-from-block {
        position: relative;
        display: flex;
        overflow: hidden;
        transition: height .3s ease-in-out;
    }

    .operate-button {
        position: absolute;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        margin-left: 24px;

        &.is-fixed {
            position: relative;
        }

        .el-icon-arrow-down {
            transition: transform .3s ease-in-out;
        }

        .is-expand {
            transform: rotate(-180deg);
        }

        .expand-operate {
            margin-left: 16px;

            span {
                display: inline-block;
                font-size: 12px;
                line-height: 1;

                &>i {
                    font-size: 16px;
                    padding: 4px;
                }
            }
        }
    }

    :deep( .el-collapse ) {
        .el-collapse-item__header {
            border-bottom: none;
            height: auto;
        }

        .el-collapse-item__wrap {
            border-bottom: none;
        }
    }

    :deep( .form-row-block ) {

        &:not(:first-child) {
            margin-top: 16px;
        }

        .el-form-item {
            margin-right: 16px;
            margin-bottom: 0;

            &:last-of-type {
                margin-right: 0;
            }

            .el-form-item__label {
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: keep-all;
                white-space: nowrap;
                text-align: right;
            }

            .el-row,
            .el-col {
                height: auto;
            }

            .el-form-item__label-wrap {
                margin-left: 0 !important;

                label {
                    font-size: 14px;
                    color: #0E1B2E;
                    padding-right: 16px;
                }
            }
        }
    }
}
</style>
