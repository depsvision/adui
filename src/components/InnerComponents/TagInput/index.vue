<template>
  <div
    ref="tagInputContainer"
    class="tag-input-container"
    :class="[componentOption.disabled?'is-disabled':'']"
    :style="componentOption.tagInputStyle"
  >
    <div class="tag-input-block">
      <div ref="tagDiv" class="input-inner-tag" :style="{'max-height':componentOption.maxHeight + 'px'}" @click="handleClickTagInput">
        <span ref="tagLayout" class="tag-layout">
          <transition-group @after-leave="autoHeight()">
            <el-tag
              v-for="(tag,index) in tagList"
              :key="tag[tag.nodeKey]"
              :type="tag.type"
              :class="[tag.tagColor?'tag-'+ tag.tagColor:'']"
              :closable="hasClose(index)"
              :style="tagStyle"
              @close="removeTag(tag)"
            >
              <svg-icon v-if="tag.tagSvg" class="tag-svg" :icon-class="tag.tagSvg" />
              <span class="tag-label" :class="[componentOption.maxHeight?'':'overflow-hidden']">{{ tag.label }}</span>
              <span v-if="tag.rightSpan" class="tag-rightSpan">{{ tag.rightSpan }}</span>
            </el-tag>
          </transition-group>
        </span>
      </div>
      <el-input
        ref="input"
        :suffix-icon="componentOption.suffixIcon"
        :size="componentOption.size"
        :placeholder="placeholder"
        :disabled="componentOption.disabled"
        @click.native="handleClickTagInput"
      />
    </div>
  </div>
</template>

<script>

export default {
  name: 'TagInput',
  components: { },
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
      placeholder: '',
      defaultInputWidth: '',
      defaultInputHeight: '',
      tagStyle: {}
    }
  },
  computed: {
    tagList() {
      if (this.componentOption.maxHeight && this.componentOption.value.length > 1) {
        const tag = []
        tag[0] = this.componentOption.value[0]

        tag[1] = {
          label: '+' + (this.componentOption.value.length - 1),
          nodeKey: this.componentOption.value[1].nodeKey,
          type: this.componentOption.value[1].type || '',
          tagSvg: '',
          tagColor: this.componentOption.value[1].tagColor,
          tagType: this.componentOption.value[1].tagType
        }
        tag[1][tag[1].nodeKey] = ''

        return tag
      } else {
        return this.componentOption.value
      }
    },
    hasClose() {
      return index => {
        let close = true
        if (typeof this.componentOption.closable !== 'undefined') {
          close = this.componentOption.closable
        } else if (this.componentOption.maxHeight && index > 0) {
          close = false
        }
        return close
      }
    }
  },
  watch: {
    'componentOption.value': {
      handler(val) {
        if (val && val.length > 0) {
          this.placeholder = ''
        } else {
          this.placeholder = this.componentOption.placeholder
        }

        this.$nextTick(() => {
          this.autoHeight()
        })
      },
      immediate: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.$nextTick(() => {
        const inputChildNodes = this.$refs.input.$el.childNodes
        const input = [].filter.call(inputChildNodes, item => item.tagName === 'INPUT')[0]
        this.defaultInputHeight = input.offsetHeight
        this.defaultInputWidth = (typeof this.componentOption.width === 'number' && !isNaN(this.componentOption.width))
          ? this.componentOption.width
          : input.offsetWidth

        if (this.componentOption.maxHeight) {
          this.tagStyle = {
            'max-width': this.defaultInputWidth - 74 - 42 + 'px'
          }
        } else {
          this.tagStyle = {
            'max-width': this.defaultInputWidth - 42 + 'px'
          }
        }
      })
    },
    handleClickTagInput() {
      if (this.componentOption.disabled) return

      this.$store.dispatch('button/assignButtonData', { key: 'value', value: 'tagInput' + '-' + this.componentOption.prop })

      setTimeout(() => {
        this.$store.dispatch('button/listenClickButton', { key: 'value', value: '' })
      }, 500)
    },
    autoHeight() {
      this.$nextTick(() => {
        const inputChildNodes = this.$refs.input.$el.childNodes
        const input = [].filter.call(inputChildNodes, item => item.tagName === 'INPUT')[0]
        if (this.tagList && this.tagList.length > 0) {
          if (this.componentOption.width === 'auto' && this.$refs.tagLayout.offsetWidth > this.defaultInputWidth - 42) {
            if (this.$refs.tagLayout.offsetWidth + 40 <= this.$refs.tagInputContainer.offsetWidth) {
              input.style.width = this.$refs.tagLayout.offsetWidth + 40 + 'px'
            } else {
              this.$refs.tagLayout.style.width = this.$refs.tagInputContainer.offsetWidth
            }
          } else {
            input.style.width = this.$refs.input.$el.style.width = this.$refs.tagDiv.style.width = this.defaultInputWidth + 'px'
          }

          let maxHeight = this.$refs.tagLayout.offsetHeight
          if (this.componentOption.maxHeight) {
            maxHeight = this.componentOption.maxHeight
          }

          input.style.height = (maxHeight > 90 ? 96 : (maxHeight > this.defaultInputHeight ? maxHeight + 6 : this.defaultInputHeight)) + 'px'
        } else {
          this.$refs.input.$el.style.width = this.defaultInputWidth + 'px'
          input.style.width = this.defaultInputWidth + 'px'
          input.style.height = this.defaultInputHeight + 'px'
        }
      })
    },
    removeTag(tag) {
      if (this.componentOption.disabled) return

      this.componentOption.value.splice(this.componentOption.value.findIndex(item => {
        if (item.nodeKey === tag.nodeKey) {
          return item[item.nodeKey] === tag[tag.nodeKey]
        }
      }), 1)

      this.$emit('changeValue', this.componentOption.value)

      if (this.componentOption.removeTag) {
        this.componentOption.removeTag(tag)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.tag-input-container {
  width: 100%;

  &.is-disabled {

    .tag-input-block {

      &:hover {
        cursor: not-allowed;
      }
    }
  }

  .tag-input-block {
    flex: 1;
    line-height: 1;
    position: relative;

    &:hover {
      cursor: pointer;
    }
  }

  .input-inner-tag {
    position: absolute;
    top: 50%;
    max-height: 90px;
    transform: translateY(-50%);
    line-height: 1;
    padding-right: 30px;
    z-index: 1;
    overflow-y: overlay;
    overflow-x: hidden;

    .tag-layout {
      display: inline-block;
      line-height: 1;
    }
  }

  :deep( .el-input ) {
    line-height: 1;

    input {
      caret-color: rgba(0,0,0,0);
      &:hover {
        cursor: pointer;
      }
    }
  }

  :deep( .el-tag ) {
    display: inline-flex;
    align-items: center;
    margin: 3px 0 3px 8px;

    .tag-label {
      text-overflow: ellipsis;
      word-break: normal;

      &.overflow-hidden {
        overflow: hidden;
      }
    }

    .tag-rightSpan {
      margin-left: 20px;
    }

    .tag-svg {
      flex-shrink: 0;
      margin-right: 4px;
    }

    .el-icon-close {
      top: 1px;
    }
  }
}

@media screen and (max-width: 1920px) {}

@media screen and (max-width: 1680px) {}

@media screen and (max-width: 1570px) {

  /* TagInput --  */

}

@media screen and (max-width: 1440px) {}

@media screen and (max-width: 1366px) {}

@media screen and (max-width: 1280px) {}
</style>
