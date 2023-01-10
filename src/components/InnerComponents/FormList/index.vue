<template>
    <div v-loading="componentOption.loading" class="form-list-container">
        <button-group v-if="componentOption.topButtons" :component-option="componentOption.topButtons" />
        <el-form ref="innerForm" :model="componentOption.data" :rules="componentOption.rule"
            :label-width="componentOption.labelWidth"
            :hide-required-asterisk="componentOption.hideRequiredAsterisk === undefined ? true : componentOption.hideRequiredAsterisk"
            :label-position="componentOption.labelPosition" :show-message="componentOption.showMessage"
            :inline-message="componentOption.inlineMessage === undefined ? true : componentOption.inlineMessage"
            :class="splitClass(componentOption)" @validate="validateForm">
            <head-slot v-for="(headForm, headIndex) in formGroup" :key="headIndex" :component-option="headForm.head"
                :class="[componentOption.formGroup ? '' : 'block-display']">
                <el-form-item v-for="(form, formIndex) in headForm.form" v-show="!form.hide" :key="form.prop"
                    :label="form.label" :prop="form.prop" :error="form.error" :label-width="form.labelWidth"
                    class="form-item" :class="[
    ...splitClass(form),
    form.hide ? 'is-hide' : ''
]" :required="form.required">
                    <template v-slot:label>
                        <span class="form-item-label">
                            <span>{{ form.label }}</span>
                            <el-tooltip :disabled="!form.labelInfo" :content="form.labelInfo" placement="top"
                                :style="form.labelInfoStyle">
                                <svg-icon
                                    v-if="form.labelSvg || (componentOption.rule && componentOption.rule[form.prop])"
                                    :icon-class="form.labelSvg || (componentOption.rule && componentOption.rule[form.prop] ? 'required-fill' : '')"
                                    :class="'svg-' + (form.labelSvg || (componentOption.rule && componentOption.rule[form.prop] ? 'required-fill' : ''))" />
                            </el-tooltip>
                        </span>
                    </template>


                    <div v-if="form.top" class="form-item-top" :style="form.top.topStyle">
                        <component :is="form.top.type" ref="top" :component-option="dealSpanData(form.top)"
                            @changeValue="value => { changeComponentValue(value, form.top) }" />
                    </div>

                    <component :is="form.type" v-if="form.type" ref="component" class="form-item-content"
                        :class="splitClass(form)" :style="form.componentStyle" :component-option="dealSpanData(form)"
                        @changeValue="value => { changeComponentValue(value, form) }">
                        <slot :name="form.prop" />
                    </component>

                    <div v-if="form.back" class="form-item-back" :style="form.back.backStyle">
                        <component :is="form.back.type" ref="back" :style="form.back.componentStyle"
                            :component-option="dealSpanData(form.back)"
                            @changeValue="value => { changeComponentValue(value, form.back) }" />
                    </div>

                    <span v-if="form.tip || (form.tipStyle && form.tipStyle.height)" class="form-item-label--tip"
                        :style="form.tipStyle">{{ form.tip }}</span>

                    <transition name="zoom-in-top">
                        <div v-if="form.isInlineError && form.errorMessage"
                            class="form-item--error form-item--inline_error">
                            {{ form.errorMessage }}
                        </div>
                    </transition>

                    <div v-if="form.bottom" v-show="!form.hide" class="form-item-bottom-block">
                        <div v-for="bottom in bottomGroup(form.bottom)" v-show="bottom.type" :key="bottom.prop"
                            class="form-item-bottom" :style="form.bottom.bottomStyle">
                            <div class="form-item-bottom-content">
                                <div v-if="bottom.label" :style="bottom.labelStyle" class="form-item-bottom-label">
                                    {{ bottom.label }}
                                </div>
                                <component :is="bottom.type" ref="bottom" :component-option="dealSpanData(bottom)"
                                    @changeValue="value => { changeComponentValue(value, bottom) }" />
                            </div>
                            <transition name="zoom-in-top">
                                <div v-if="bottom.isInlineError && bottom.errorMessage"
                                    class="form-item--error form-item--inline_error">
                                    {{ bottom.errorMessage }}
                                </div>
                            </transition>
                        </div>
                    </div>

                    <div v-if="form.imgList" class="form-item-img-list"
                        :class="[form.imgList.disabled ? 'is-disabled' : '']">
                        <el-image v-for="img in componentOption.data[form.prop + 'ImgList']"
                            :key="img[form.imgList.prop]" :src="img.url" :fit="form.imgList.fit"
                            :class="[componentOption.data[form.prop + 'Selected'].includes(img[form.imgList.prop]) ? 'is-active' : '']"
                            :style="{
    width: form.imgList.size || '72px',
    height: form.imgList.size || '72px',
    flex: 'unset'
}" @click="setImgSelect(componentOption, form, img)">
                            <template v-slot:error>
                                <div class="image-slot svg-slot">
                                    <svg-icon :icon-class="img.url === '' ? 'empty-image' : 'error-image-line'" />
                                </div>
                            </template>

                        </el-image>
                    </div>

                    <div v-if="form.tool" class="form-item-tool">
                        <div class="form-item-tool--tag">
                            <span>{{ form.tool.label }}</span>
                            <el-tag v-for="tag in form.tool.tag" :key="tag.label" :style="tag.style"
                                @click="handleClickFormTag(tag, form)">{{ tag.label }}</el-tag>
                        </div>
                    </div>
                    <template v-slot:error>
                        <div v-if="form.isInnerError" slot-scope="{ error }"
                            class="form-item--error form-item--inner_error" :style="errorStyle(formIndex)">
                            {{ error }}
                        </div>
                    </template>

                </el-form-item>
            </head-slot>

            <el-alert v-if="componentOption.alert"
                v-show="componentOption.alert.title || componentOption.alert.description" class="form-alert"
                :description="componentOption.alert.description" :type="componentOption.alert.type"
                :show-icon="componentOption.alert.showIcon" :closable="componentOption.alert.closable">
                <template v-slot:title>
                    <span class="form-alert-info">
                        <span v-html="componentOption.alert.title" />
                        <button-group v-if="componentOption.alert.buttons" class="form-alert-buttons"
                            :component-option="{ buttons: componentOption.alert.buttons }" />
                    </span>
                </template>

            </el-alert>
        </el-form>
    </div>
</template>

<script>
import ButtonGroup from '@/components/Button/ButtonGroup'
import spanAssembly from '@/components/InnerComponents/SpanAssembly'
import switchAssembly from '@/components/InnerComponents/SwitchAssembly'
import sliderAssembly from '@/components/InnerComponents/SliderAssembly'
import inputAssembly from '@/components/InnerComponents/InputAssembly'
import inputSet from '@/components/InnerComponents/InputSet'
import datePicker from '@/components/InnerComponents/DatePicker'
import timeSelect from '@/components/InnerComponents/TimeSelect'
import inputGroup from '@/components/InnerComponents/InputGroup'
import selectAssembly from '@/components/InnerComponents/SelectAssembly'
import radioAssembly from '@/components/InnerComponents/RadioAssembly'
import checkboxAssembly from '@/components/InnerComponents/CheckboxAssembly'
import tagAssembly from '@/components/InnerComponents/TagAssembly'
import tabAssembly from '@/components/InnerComponents/tabAssembly'
import inputCountNumber from '@/components/InnerComponents/InputCountNumber'
import AutoCollapse from '@/components/InnerComponents/AutoCollapse'
import pointImg from '@/components/AreaComponents/PointImg'

import dynamicSlot from '@/components/Slot/DynamicSlot'
import ImportImgCropper from '@/components/InnerComponents/ImportImgCropper'
import tagInput from '@/components/InnerComponents/TagInput'
import addTimePicker from '@/components/InnerComponents/AddTimePicker'
import HeadSlot from '@/components/Slot/HeadSlot'
import ImageBlock from '@/components/AreaComponents/ImageBlock'
import LinkageTable from '@/components/AreaComponents/LinkageTable'
import DraggableList from '@/components/AreaComponents/DraggableList'
import FormTree from '@/components/Tree/FormTree'
import SimpleList from '@/components/AreaComponents/SimpleList'
import CustomCombination from '@/components/CustomCombination'
import SliderControl from '@/components/AreaComponents/SliderControl'

import FormTable from '@/components/FormTable'

import { isArray } from '@/utils/is'

export default {
    name: 'FormList',
    components: {
        ButtonGroup,
        ImportImgCropper,
        tagInput,
        spanAssembly,
        switchAssembly,
        sliderAssembly,
        inputAssembly,
        inputSet,
        AutoCollapse,
        datePicker,
        timeSelect,
        inputGroup,
        selectAssembly,
        tabAssembly,
        dynamicSlot,
        radioAssembly,
        checkboxAssembly,
        tagAssembly,
        inputCountNumber,
        pointImg,
        addTimePicker,
        HeadSlot,
        ImageBlock,
        LinkageTable,
        DraggableList,
        FormTree,
        SimpleList,
        CustomCombination,
        SliderControl,

        FormTable
    },
    props: {
        globalOption: {
            type: Object,
            default: function () {
                return {}
            }
        },
        componentOption: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data() {
        return {
        }
    },
    computed: {
        formGroup() {
            let group = []

            if (this.componentOption.formGroup) {
                group = this.componentOption.formGroup
            } else {
                group = [
                    {
                        head: {},
                        form: this.componentOption.form
                    }
                ]
            }
            return group
        },
        bottomGroup() {
            return bottom => {
                if (isArray(bottom)) {
                    return bottom
                } else {
                    return [bottom]
                }
            }
        },
        dealSpanData() {
            return form => {
                if (this.componentOption.data) {
                    form['value'] = this.componentOption.data[form.prop]

                    if (form.type && form.type === 'tagAssembly' && !form.tagClick) {
                        form[form.prop + 'Tag'] = this.componentOption.data[form.prop]
                    }
                }
                return form
            }
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.$nextTick(() => {
                this.componentOption.ref = this.$refs.innerForm
            })
        },
        handleClickFormTag(tag, form) {
            this.$store.dispatch('button/deliverData', { tag: tag, form: form })
        },
        changeComponentValue(value, form) {
            this.componentOption.data[form.prop] = value

            if (form[form.prop + 'Path'] !== undefined) {
                this.componentOption.data[form.prop + 'Path'] = form[form.prop + 'Path']
            }

            this.$store.dispatch('dialog/setDialogData', { key: 'listenerData', value: this.componentOption.data })
            this.$store.dispatch('dialog/setDialogData', { key: 'listenerDataTime', value: Date.now() })
            this.$store.dispatch('dialog/setDialogData', { key: 'listenerKey', value: form.prop })
        },
        splitClass(form) {
            const classGroup = []

            form.class && form.class.split(' ').forEach(item => {
                classGroup.push(item)
            })

            return classGroup
        },
        validateForm(prop, status, error) {
            if (this.componentOption.form) {
                const formIndex = this.componentOption.form.findIndex(item => item.prop === prop)
                this.componentOption.form[formIndex]['errorMessage'] = !status ? error : ''
            } else {
                this.componentOption.formGroup.forEach(group => {
                    const form = group.form.find(item => {
                        return item.prop === prop
                    })
                    if (form) {
                        form['errorMessage'] = !status ? error : ''
                    }
                })
            }
        },
        setImgSelect(option, form, img) {
            const isSelected = this.componentOption.data[form.prop + 'Selected'].includes(img[form.imgList.prop])

            if (isSelected) {
                const index = this.componentOption.data[form.prop + 'Selected'].indexOf(img[form.imgList.prop])
                this.componentOption.data[form.prop + 'Selected'].splice(index, 1)
            } else {
                this.componentOption.data[form.prop + 'Selected'].push(img[form.imgList.prop])
            }

            this.componentOption.data = { ...this.componentOption.data }
        },
        errorStyle(index) {
            const result = {}

            let component = null
            let father = null
            this.$refs.component && (component = this.$refs.component[index] && this.$refs.component[index].$el)
            component && (father = component.parentElement)
            if (father && component) {
                result.right = father.offsetWidth - component.offsetWidth + 30 + 'px'
                result.height = component.offsetHeight + 'px'
            }

            return result
        }
    }
}
</script>

<style scoped lang="scss">
.form-list-container {
    width: 100%;

    .form-alert {
        margin-top: 16px;

        .form-alert-info {
            display: flex;

            :deep( .form-alert-buttons ) {
                margin-left: 8px;

                .el-button {

                    &>span {
                        font-size: 12px;
                        line-height: 1;
                    }
                }
            }
        }
    }

    :deep( .head-slot-container ) {

        &:last-of-type {
            margin-bottom: 0;
        }

        .head-slot-block {
            height: 36px;
            line-height: 36px;
            margin-bottom: 0;

            .head-slot-text {
                filter: opacity(.85);
            }
        }

        .head-slot-body {
            flex-flow: column;
        }

        &+.head-slot-container {
            margin-top: 16px;
        }
    }

    .form-item {

        &.has-divider {
            border-bottom: 1px solid rgba(27, 53, 89, 0.20);
            padding-bottom: 16px;
        }

        &.is-disabled {
            pointer-events: none;
            filter: opacity(.5);
        }

        &.switch-fixed-height {

            .switch-assembly-container {
                height: 32px;
            }
        }

        &.is-inner {

            :deep( .el-button ) {
                padding: 8px 15px;

                &.el-button--text {
                    color: rgba(14, 27, 46, 1);
                    font-size: 14px;
                    padding: 0;

                    svg {
                        font-size: 16px;
                    }
                }
            }
        }

        .form-item-label {
            display: flex;
            align-items: center;
        }

        .form-item-content {
            display: inline-flex;
            width: 100%;
            vertical-align: middle;
        }

        .form-item-top {
            height: 36px;
            display: flex;
            margin-bottom: 4px;
        }

        .form-item-back {
            display: inline-flex;
            vertical-align: middle;
            margin-left: 24px;
        }

        .form-item-bottom-block {
            display: flex;
            flex-flow: column;

            .form-item-bottom-content {
                display: flex;
            }

            .form-item-bottom {
                display: flex;
                flex-flow: column;
                margin-top: 8px;

                .form-item-bottom-label {
                    color: rgba(14, 27, 46, 1);
                    padding-right: 16px;
                }
            }
        }

        .form-item-back {
            display: inline-flex;
            vertical-align: middle;
            margin-left: 24px;
        }

        .el-form-item__content {

            .form-item-label--tip {
                display: block;
                line-height: 1;
                font-size: 12px;
                color: rgba(14, 27, 46, .5);
                margin-top: 8px;
            }
        }

        .form-item-img-list {
            display: flex;
            margin-top: 8px;

            &.is-disabled {
                pointer-events: none;
                filter: opacity(.5);
            }

            :deep( .el-image ) {
                padding: 2px;
                margin-left: 16px;
                border: 2px solid #fff;

                &:first-child {
                    margin-left: 0;
                }

                &:hover {
                    cursor: pointer;
                    box-shadow: 0px 0px 10px -2px rgba(7, 14, 23, 0.5);
                }

                &.is-active {
                    border: 2px solid rgba(24, 114, 240, 1);
                }
            }
        }

        .form-item-tool {

            .form-item-tool--tag {
                margin-top: 8px;

                &>span {
                    font-size: 12px;

                    &:first-child {
                        line-height: 1;
                        color: rgba(14, 27, 46, .5);
                        margin-right: 16px;
                    }
                }

                .el-tag {
                    margin-right: 8px;

                    &:last-of-type {
                        margin-right: 0;
                    }

                    &:hover {
                        cursor: pointer;
                    }
                }
            }
        }

        .form-item--error {
            font-size: 12px;
            color: rgba(255, 58, 51, 1);
        }

        .form-item--inline_error {
            line-height: 1;
            margin-top: 8px;
        }

        .form-item--inner_error {
            position: absolute;
            top: 1px;
            display: flex;
            align-items: center;
        }

    }

    .import-icon {
        svg {
            font-size: 20px;
            margin-right: 15px;

            &:hover {
                cursor: pointer;
                color: #1890FF;
            }
        }
    }

    :deep( .img-block ) {
        display: inline-flex;
        width: auto;

        .forbid-mouse {
            pointer-events: none;

            .avatar-uploader-icon {
                width: 195px;
                height: 136px;
            }

            .avatar {
                width: 195px;
                height: 136px;
            }
        }

        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            position: relative;
            overflow: hidden;
        }

        .avatar-uploader-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            color: #8c939d;
            width: 96px;
            height: 96px;
            text-align: center;
            z-index: 10;
        }

        .avatar {
            position: absolute;
            width: 96px;
            height: 96px;
            display: block;
            z-index: 15;

            img {
                width: 100%;
                height: 100%;
            }
        }
    }

    .img-resolution {
        span {
            margin-left: 15px;

            &:first-child {
                margin-left: 0;
                margin-right: 15px;
            }

            .el-input {
                width: 77px !important;
            }
        }

        i {
            position: relative;
            top: 4px;
        }
    }

    .el-checkbox-group {
        line-height: 36px;
    }

}
</style>
