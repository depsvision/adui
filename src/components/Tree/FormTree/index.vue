<template>
  <div v-loading="componentOption.loading" class="form-tree-container">
    <div v-if="componentOption.statusOption" class="form-tree-whole status-mark" :class="statusClass">
      <span>{{ componentOption.statusOption.label }}</span>
      <span class="has-text">{{ componentOption.statusOption.statusName }}</span>
    </div>
    <div class="form-tree-form-block" :style="componentOption.blockStyle">
      <el-form
        ref="innerForm"
        :model="componentOption.value || componentOption.data"
        :rules="componentOption.rule"
        :label-width="componentOption.labelWidth"
        :label-position="componentOption.labelPosition"
        :show-message="componentOption.showMessage"
        :inline-message="componentOption.inlineMessage"
        :class="splitClass"
      >
        <level-block :component-option="componentOption" :item-list="itemList" :level="1" @changeValue="changeValue" />
      </el-form>
    </div>
  </div>
</template>

<script>
import LevelBlock from './LevelBlock'

export default {
  name: 'FormTree',
  components: { LevelBlock },
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
    itemList() {
      return this.componentOption.items.filter(item => !item.hide)
    },
    statusClass() {
      const classGroup = {}
      this.componentOption.statusOption.class && this.componentOption.statusOption.class.split(' ').forEach(item => {
        classGroup[item] = true
      })
      classGroup['has-text'] = this.componentOption.statusOption.statusName.length > 0
      return classGroup
    },
    splitClass() {
      const classGroup = {}
      this.componentOption.formClass && this.componentOption.formClass.split(' ').forEach(item => {
        classGroup[item] = true
      })
      return classGroup
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {

    },
    changeValue() {
      this.$emit('changeValue', this.componentOption.value || this.componentOption.data)
    }
  }
}
</script>

<style scoped lang="scss">
.form-tree-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;

  .form-tree-whole {
    height: 48px;
    display: flex;
    align-items: center;
    background-color: rgba(245, 247, 250, 1);
    border-radius: 8px;
    padding: 0 20px;
    margin-bottom: 24px;

    &>span {
      font-size: 14px;
      color: rgba(14, 27, 46, 1);

      &:first-child {
        margin-right: 24px;
      }
    }
  }

  .form-tree-form-block {
    flex: 1;
    overflow-y: overlay;
    padding-right: 8px;

    ::v-deep .el-form {

      .el-form-item {
        margin-bottom: 0;

        &.is-weight {

          .form-item-label {
            color: rgba(14, 27, 46, 0.85);
            font-weight: 600;
          }
        }

        .el-form-item__label {
          color: rgba(14, 27, 46, 0.65);
          line-height: 36px;

          .form-item-label {

            svg {
              font-size: 14px;
              margin-right: 4px;
            }
          }
        }

        .el-form-item__content {
          line-height: 36px;
          display: flex;
          align-items: center;
        }

        .slide-info-svg {
          font-size: 12px;
          color: rgba(218, 227, 240, 1);
          margin-left: 8px;

          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
