<template>
  <div class="span-assembly-container" :class="splitClass()">
    <div
      v-show="componentOption.loadingS"
      v-loading-s
      class="span-assembly-loading"
    />
    <loaing-tick
      v-show="componentOption.loaingTick"
      :size="componentOption.loaingTick"
      class="span-assembly-loaing-tick"
    />
    <div v-if="componentOption.svg" class="svg-block">
      <svg-icon :icon-class="componentOption.svg" :class="'svg-' + componentOption.svg" />
    </div>
    <el-input
      v-if="componentOption.input"
      ref="spanInput"
      v-model="componentOption.valueCache"
      :size="componentOption.size || elementSize"
      :maxlength="componentOption.maxlength"
      :style="componentOption.inputStyle"
      @blur="autoSave"
    />
    <span
      v-else
      class="span-assembly-content"
      :class="[
        componentOption.value?'has-text':'',...componentOption.spanClass,
        componentOption.isLink? 'is-link': ''
      ]"
      :style="componentOption.spanStyle"
      @click="clickLnk"
      v-html="componentOption.value"
    />
    <span v-if="componentOption.spanTip" class="span-assembly-tip" :style="componentOption.tipStyle">{{ componentOption.spanTip }}</span>
    <button-group
      v-if="componentOption.fontButtons"
      :component-option="componentOption.fontButtons"
    />
    <el-button
      v-if="componentOption.copy && componentOption.value"
      v-clipboard:copy="componentOption.value"
      v-clipboard:success="onCopyCopy"
      v-clipboard:error="onCopyError"
      :type="componentOption.copy.type"
      :plain="componentOption.copy.plain"
      class="copy-span-button"
    >
      {{ componentOption.copy.label }}
    </el-button>
    <button-group
      v-if="componentOption.buttons"
      :component-option="componentOption.buttons"
    />
  </div>
</template>

<script>
import loadingS from '@/directive/loading-s'
import ButtonGroup from '@/components/Button/ButtonGroup'
import LoaingTick from '@/components/SvgAnimation/LoadingTick'

import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'

export default {
  name: 'SpanAssembly',
  directives: { loadingS },
  components: { ButtonGroup, LoaingTick },
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
      buttonCache: []
    }
  },
  computed: {
    ...mapGetters([
      'elementSize'
    ])
  },
  watch: {
    'componentOption.input'(val) {
      if (val) {
        this.$set(this.componentOption, 'valueCache', this.componentOption.value)

        this.buttonCache = []

        this.buttonCache = deepClone(this.componentOption.buttons.buttons)

        this.componentOption.buttons = {
          buttons: []
        }

        this.$nextTick(() => {
          this.$refs.spanInput.focus()
        })
      } else {
        this.componentOption.buttons = {
          buttons: this.buttonCache
        }
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.$set(this.componentOption, 'valueCache', this.componentOption.value)
    },
    onCopyCopy() {
      this.$messageInfo({
        message: '已复制到剪切板',
        type: 'success'
      })
    },
    onCopyError() {
      this.$messageInfo({
        message: '该浏览器不支持自动复制,请手动复制',
        type: 'warning'
      })
    },
    splitClass() {
      const classGroup = {}
      this.componentOption.class && this.componentOption.class.split(' ').forEach(item => {
        classGroup[item] = true
      })
      classGroup['is-copy'] = this.componentOption.copy
      return classGroup
    },
    autoSave() {
      if (!this.componentOption.autoSave) {
        return
      }

      this.componentOption.value = this.componentOption.valueCache
      this.componentOption.input = false

      this.$emit('changeValue', this.componentOption.value)

      this.$store.dispatch('button/simulateButton', 'inputBlur' + '-' + this.componentOption.prop)
    },
    clickLnk() {
      if (this.componentOption.isLink) {
        window.open(this.componentOption.value)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.span-assembly-container {
  display: flex;

  .span-assembly-loading {
    margin-right: 4px;
  }

  .span-assembly-loaing-tick {
    margin-right: 4px;
  }

  svg {
    margin-right: 4px;
  }

  .el-input {
    width: 100%;
  }

  .span-assembly-content {

    &.is-link {
      text-decoration: underline;
      text-underline-offset: 2px;

      &:hover {
        cursor: pointer;
        color: #1872F0;
      }
    }

    &.is-copy {
      display: inline-block;
      font-size: 14px;
      color: rgba(14, 27, 46, .5);
      background: #F5F7FA;
      border-radius: 4px;
      padding: 11px 16px;
      margin-right: 24px;
    }
  }

  .copy-span-button {
    margin-right: 24px;
  }

  .span-assembly-tip {
    font-size: 12px;
    color: rgba(14, 27, 46, 0.5);
    white-space: pre;
  }

  &.small-buttons {

    .span-assembly-content {

      &.has-text {
        margin-right: 32px;
      }
    }
  }
}

@media screen and (max-width: 1920px) {}

@media screen and (max-width: 1680px) {}

@media screen and (max-width: 1570px) {

}

@media screen and (max-width: 1440px) {}

@media screen and (max-width: 1366px) {}

@media screen and (max-width: 1280px) {}
</style>
