<template>
  <span
    v-show="showControl"
    class="warning-content-backgroud"
    :class="[backgroud?'has-backgroud':'']"
  >
    <svg-icon icon-class="warning" class="svg-warning" />
    <span class="warning-content" v-html="content" />
    <button-group
      v-if="buttons.length"
      class="warning-content-buttons"
      :component-option="{buttons}"
    />
    <svg-icon
      v-if="closeable"
      icon-class="error-small"
      class="error-small"
      @click="hideWarningContent()"
    />
  </span>
</template>

<script>
import ButtonGroup from '@/components/Button/ButtonGroup'

export default {
  name: 'WarningContent',
  components: { ButtonGroup },
  mixins: [],
  props: {
    backgroud: {
      type: Boolean,
      default: true
    },
    content: {
      type: String,
      default: ''
    },
    showWarning: {
      type: Boolean,
      default: true
    },
    buttons: {
      type: Array,
      default: () => []
    },
    closeable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showControl: true
    }
  },
  watch: {
    showWarning: {
      handler(val) {
        this.showControl = val
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
    hideWarningContent() {
      this.showControl = false
    }
  }
}
</script>

<style scoped lang="scss">
.warning-content-backgroud {
  line-height: 12px;
  display: flex;
  align-items: center;

  &.has-backgroud {
    background: rgba(255, 110, 38, 0.05);
    border-radius: 4px;
    padding: 12px 16px;
  }

  .svg-warning {
    font-size: 12px;
    margin-right: 8px;
  }

  .warning-content {
    font-size: 12px;
    line-height: 1;
    color: rgba(255, 110, 38, 1);
  }

  .warning-content-buttons {
    margin-left: 4px;

    :deep( .el-button ) {

      &>span {
        font-size: 12px;
        line-height: 1;
      }
    }
  }

  .error-small {
    margin-left: 12px;
    color: rgba(134, 141, 150, 1);

    &:hover {
      cursor: pointer;
      color: rgba(134, 141, 150, .65);
    }
  }
}
</style>
