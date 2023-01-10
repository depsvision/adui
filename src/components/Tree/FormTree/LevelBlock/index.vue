<template>
  <div class="level-block-container" :class="{'has-left-border':level > 1}">
    <div
      v-for="(item,index) in itemList"
      :key="index"
      class="level-block"
    >
      <el-form-item
        v-for="form in item.form"
        :key="form.prop"
        :label="form.label"
        :prop="form.prop"
        :label-width="form.labelWidth"
        :class="splitClass(form)"
        :required="form.required"
      >
        <span slot="label" class="form-item-label">
          <svg-icon :icon-class="labelSvg(form,item)" />
          <span>{{ form.label }}</span>
        </span>
        <component
          :is="form.type"
          v-if="form.type"
          ref="component"
          class="form-item-content"
          :component-option="dealSpanData(form)"
          @changeValue="value=>{changeComponentValue(value,form)}"
        >
          <slot :name="form.prop" />
        </component>
        <span v-if="(componentOption.value && componentOption.value[form.prop + 'Expand']) || (componentOption.data && componentOption.data[form.prop + 'Expand'])" :ref="form.prop" :class="[form.expand?'':'not-expand']" class="level-block-form-item-expand">
          <span :ref="form.prop + 'Expand'" :class="[form.expand?'':'not-expand']">
            {{ (componentOption.value && componentOption.value[form.prop + 'Expand']) || (componentOption.data && componentOption.data[form.prop + 'Expand']) }}
            <i v-if="hasExpand(form) && form.hasExpand" class="el-icon-arrow-down" :class="[form.expand?'is-expand':'not-expand']" @click="handleExpand(form)" />
          </span>
        </span>
        <el-tooltip v-if="form.info" :content="form.info.label" placement="top">
          <svg-icon icon-class="info-fill" class="slide-info-svg" />
        </el-tooltip>
      </el-form-item>
      <level-block v-if="item.items" :component-option="componentOption" :item-list="item.items" :level="level + 1" @changeValue="changeValue" />
    </div>
  </div>
</template>

<script>
import spanAssembly from '@/components/InnerComponents/SpanAssembly'
import tagAssembly from '@/components/InnerComponents/TagAssembly'
import inputCountNumber from '@/components/InnerComponents/InputCountNumber'
import InputGroup from '@/components/InnerComponents/InputGroup'
import CheckboxAssembly from '@/components/InnerComponents/CheckboxAssembly'
import RadioAssembly from '@/components/InnerComponents/RadioAssembly'
import tagInput from '@/components/InnerComponents/TagInput'

export default {
  name: 'LevelBlock',
  components: {
    spanAssembly,
    tagAssembly,
    inputCountNumber,
    InputGroup,
    CheckboxAssembly,
    RadioAssembly,
    tagInput
  },
  props: {
    componentOption: {
      type: Object,
      default: function() {
        return {}
      }
    },
    itemList: {
      type: Array,
      default: function() {
        return []
      }
    },
    level: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {

    }
  },
  computed: {
    labelSvg() {
      return (form, item) => {
        let svg = null
        if (form.svg) {
          svg = form.svg
        } else {
          svg = item.items ? 'unordered-fill' : 'unordered-line'
        }
        return svg
      }
    },
    splitClass() {
      return form => {
        const classGroup = {}

        form.itemClass && form.itemClass.split(' ').forEach(item => {
          classGroup[item] = true
        })

        const data = this.componentOption.value || this.componentOption.data

        if (data) {
          classGroup['form-flex-start'] = !!data[form.prop + 'Expand']
        }

        return classGroup
      }
    },
    dealSpanData() {
      return form => {
        if (this.componentOption.value || this.componentOption.data) {
          const data = this.componentOption.value || this.componentOption.data

          if (form.type && form.type === 'tagAssembly') {
            this.$set(form, form.prop + 'Tag', data[form.prop] || data[form.prop])
          } else {
            this.$set(form, 'value', data[form.prop] || data[form.prop])
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

    },
    changeComponentValue(value, form) {
      const data = this.componentOption.value || this.componentOption.data

      data[form.prop] = value

      this.$emit('changeValue')
    },
    changeValue() {
      this.$emit('changeValue')
    },
    async hasExpand(form) {
      let result = false

      await this.$nextTick(() => {
        const father = this.$refs[form.prop][0]
        const span = this.$refs[form.prop + 'Expand'][0]

        if (span.offsetWidth >= father.offsetWidth - 16 - 16) {
          result = true
        }
      })

      this.$set(form, 'hasExpand', result)

      if (form.expand === undefined) {
        this.$set(form, 'expand', false)
      }
    },
    handleExpand(form) {
      const father = this.$refs[form.prop][0]
      const span = this.$refs[form.prop + 'Expand'][0]

      if (!form.expand) {
        father.style.height = span.scrollHeight + 'px'
        span.style.height = span.scrollHeight + 'px'
      } else {
        father.style.height = '36px'
        span.style.height = '36px'
      }

      this.$set(form, 'expand', !form.expand)
    }
  }
}
</script>

<style scoped lang="scss">
.level-block-container {

  &.has-left-border {
    border-left: 2px solid rgba(14, 27, 46, 0.1);
    padding-left: 8px;
    margin-left: 6px;
  }

  :deep( .el-form-item ) {

    .el-form-item__content {
      display: flex;

      .form-item-content {
        display: flex;
        align-items: center;
        height: 36px;
      }

      .level-block-form-item-span {
        line-height: 36px;
        flex-shrink: 0;
        margin-right: 8px;
      }

      .level-block-form-item-expand {
        flex: 1;
        position: relative;
        overflow: hidden;
        margin-bottom: 4px;
        transition: all .3s ease-in-out;
        z-index: 1;

        &.not-expand {
          height: 36px;
        }

        &>span {
          position: relative;
          display: inline-block;
          line-height: 36px;
          overflow: hidden;
          background-color: rgba(245, 247, 250, 1);
          border-radius: 4px;
          padding-left: 16px;
          padding-right: 16px;
          margin-left: 16px;
          margin-right: 16px;
          transition: all .3s ease-in-out;

          &.not-expand {
            height: 36px;
          }
        }

        i {
          font-size: 16px;

          &.is-expand {
            transform: rotateZ(180deg);
          }

          &.not-expand {
            position: absolute;
            top: 10px;
            right: 4px;
          }

          &:hover {
            cursor: pointer;
            color: rgba(24, 114, 240, 1);
          }
        }
      }
    }

    &.form-flex-start {

      .el-form-item__content {
        align-items: flex-start !important;
      }
    }
  }
}
</style>
