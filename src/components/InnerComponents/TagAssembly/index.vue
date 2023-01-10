<template>
  <div class="tag-assembly-container" :class="splitClass" :style="componentOption.style">
    <el-tag
      v-for="tag in tagGroup"
      :key="tag.value"
      :class="tagClass(tag)"
      :disable-transitions="disableTransitions(tag)"
      :closable="closable(tag)"
      :style="tagStyle(tag)"
      @click="handleTag(tag)"
      @close="handleClose(tag)"
    >
      {{ tag.label }}
    </el-tag>
    <el-popover
      v-if="componentOption.popover"
      v-model="componentOption.popover.visible"
      popper-class="button-popover small-buttons"
      :placement="componentOption.popover.placement || 'bottom-start'"
      :visible-arrow="componentOption.popover.visibleArrow"
      :width="componentOption.popover.width"
      @show="handleShowPopover"
      @hide="handleHidePopover"
    >
      <div class="popover-title">{{ componentOption.popover.title }}</div>
      <el-select
        v-if="componentOption.popover.type === 'select'"
        ref="select"
        v-model="componentOption.popover.content"
        class="popover-content"
        size="default"
        :placeholder="componentOption.popover.placeholder"
        popper-class="popover-inner-select"
      >
        <el-option
          v-for="item in componentOption.popover.option"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        />
      </el-select>
      <el-input
        v-else
        v-model="componentOption.popover.content"
        class="popover-content"
        size="default"
        :placeholder="componentOption.popover.placeholder"
        @input="handleInput"
        @keyup.enter.native="handleAddTag"
      />
      <div style="text-align: right; margin: 0">
        <el-button plain @click="componentOption.popover.visible = false">取消</el-button>
        <el-button type="primary" @click="handleAddTag">确定</el-button>
      </div>
      <button-group slot="reference" class="tag-popover-button" :component-option="popoverButton" />
    </el-popover>
  </div>
</template>

<script>
import ButtonGroup from '@/components/Button/ButtonGroup'

export default {
  name: 'TagAssembly',
  components: { ButtonGroup },
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
      visible: false,
      popoverButton: {
        buttons: [
          {
            value: 'showNewTag',
            iconLeft: 'el-icon-circle-plus-outline',
            type: 'text',
            class: 'is-grey',
            innerStyle: {
              'padding': 0
            }
          }
        ]
      },
      lastInputValue: ''
    }
  },
  computed: {
    tagGroup() {
      if (this.componentOption.multiple && this.componentOption[ this.componentOption.prop + 'Tag'].length > this.componentOption.multiple) {
        const tag = []

        for (let i = 0; i < this.componentOption.multiple; i++) {
          tag[i] = this.componentOption[ this.componentOption.prop + 'Tag'][i]
        }

        tag[this.componentOption.multiple] = {
          label: '+' + (this.componentOption[ this.componentOption.prop + 'Tag'].length - this.componentOption.multiple),
          value: 'multiple',
          style: this.componentOption[ this.componentOption.prop + 'Tag'][1].style,
          class: this.componentOption[ this.componentOption.prop + 'Tag'][1].class,
          disableTransitions: this.componentOption[ this.componentOption.prop + 'Tag'][1].disableTransitions
        }

        return tag
      } else {
        return this.componentOption[ this.componentOption.prop + 'Tag']
      }
    },
    splitClass() {
      const classGroup = {}
      this.componentOption.tagClass && this.componentOption.tagClass.split(' ').forEach(item => {
        classGroup[item] = true
      })
      return classGroup
    },
    tagClass() {
      return tag => {
        const classGroup = {}

        tag.class && tag.class.split(' ').forEach(item => {
          classGroup[item] = true
        })

        if (this.componentOption.tagClick) {
          classGroup['is-active'] = this.componentOption.value.includes(tag.value)
        }

        return classGroup
      }
    },
    disableTransitions() {
      return tag => {
        return tag.disableTransitions ?? (this.componentOption.disableTransitions ?? false)
      }
    },
    closable() {
      return tag => {
        return tag.closable ?? (this.componentOption.closable ?? false)
      }
    },
    tagStyle() {
      return tag => {
        return tag.style ?? (this.componentOption.tagStyle ?? false)
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (this.componentOption.popover) {
        this.lastInputValue = this.componentOption.popover.content
      }
    },
    handleTag(tag) {
      if (this.componentOption.tagClick) {
        const value = this.componentOption.value
        const hasTag = this.componentOption.value.indexOf(tag.value)
        hasTag !== -1 ? value.splice(hasTag, 1) : value.push(tag.value)
        this.$emit('changeValue', value)
      }

      this.$store.dispatch('button/simulateButton', { value: 'clickTagAssembly', time: 0 })
      this.$store.dispatch('button/assignScopeData', tag)
    },
    handleClose(tag) {
      this.$store.dispatch('button/simulateButton', 'closeTag')
      this.$store.dispatch('button/assignScopeData', tag)
    },
    handleAddTag() {
      const tag = {
        id: this.componentOption.id ?? '',
        label: this.componentOption.popover.content
      }

      this.$store.dispatch('button/simulateButton', 'addTagAssembly')
      this.$store.dispatch('button/assignScopeData', tag)
    },
    handleInput(value) {
      const pattern = this.componentOption.popover.reg ?? ''

      if (!pattern.test(value)) {
        this.componentOption.popover.content = this.lastInputValue
      } else {
        this.lastInputValue = value
      }
    },
    handleShowPopover() {
      window.addEventListener('scroll', this.hidePopover, true)
    },
    handleHidePopover() {
      window.removeEventListener('scroll', this.hidePopover, true)
    },
    hidePopover(e) {
      const classList = Array.prototype.slice.call(e.target.classList)

      if (classList.includes('el-select-dropdown__wrap')) {
        return
      }

      this.componentOption.popover.visible = false
      this.$refs.select.blur()
    }
  }
}
</script>

<style scoped lang="scss">
.tag-assembly-container {
  display: flex;
  align-items: center;

  &.hover-point {

    .el-tag {
      position: relative;

      &:hover {
        cursor: pointer;

        &::after {
          content:' ';
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          background-color: #fff;
          opacity: .25;
          z-index: 1;
        }
      }
    }
  }

  .el-tag {
    text-overflow: ellipsis;
    word-break: normal;
    margin-right: 8px;
    overflow: hidden;
  }

  :deep( .tag-popover-button ) {

    i,svg {
      font-size: 24px;
    }
  }

  &.is-button {

    .el-tag {
      height: auto;
      line-height: 1;
      font-size: 12px;
      color: rgba(14, 27, 46, 1);
      background-color: #fff;
      border-color: #D1D7DE;
      padding: 7px 13px;

      &.is-active {
        color: #F5F9FF;
        background-color: #1872F0;
        border-color: #1872F0;
      }

      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
