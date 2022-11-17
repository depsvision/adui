<template>
  <div class="tab-assembly-container">
    <el-tabs
      v-model="componentOption.value"
      :stretch="componentOption.stretch"
    >
      <el-tab-pane
        v-for="tab in componentOption.option"
        :key="tab.value"
        class="tab-assembly-pane"
        :name="tab.value"
        :disabled="isDisabled(tab)"
      >
        <div slot="label" class="tab-assembly-slot">
          <span class="tab-assembly-label">{{ tab.label }}</span>
          <span v-show="tab.error" class="tab-error" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

export default {
  name: 'TabAssembly',
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

    }
  },
  computed: {
    isDisabled() {
      return tab => {
        return this.componentOption.disabled ?? tab.disabled ?? false
      }
    }
  },
  watch: {
    'componentOption.value'(val) {
      this.$emit('changeValue', val)
    }
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
.tab-assembly-container {

  ::v-deep .el-tabs {
    flex: 1;

    .el-tabs__header {
      margin-bottom: 0;
    }

    .tab-assembly-slot {
      position: relative;
      display: flex;
      align-items: center;

      .tab-error {
        position: absolute;
        right: -10px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: rgba(255, 58, 51, 1);
      }
    }

    .el-tabs__item {
      height: 36px;
      line-height: 36px;
      padding: 0 24px;
      padding-left: 0;

      &:last-child {
        padding-right: 0;
      }
    }

    .el-tabs__item {

      &.is-active,
      &:hover {
        color: rgba(24, 114, 240, 1);
      }

    }

    .el-tabs__nav-wrap {
      margin-bottom: 0;

      &::after {
        height: 1px;
        background-color: rgba(27, 53, 89, 0.2);
      }
    }

    .el-tabs__active-bar {
      height: 1px;
      background-color: rgba(24, 114, 240, 1);
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
