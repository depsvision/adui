<template>
  <div class="cache-clear-container">
    <div class="cache-clear-info">
      <span v-for="info in componentOption.info" :key="info.label" :class="info.class" :style="info.style">{{ info.label }}</span>
      <div class="cache-clear-circle-progress" :class="[componentOption.circle.percentage>90?'is-high':'']">
        <el-progress
          type="circle"
          :percentage="componentOption.circle.percentage"
          :width="componentOption.circle.width"
          :show-text="componentOption.circle.showText"
          :stroke-width="componentOption.circle.strokeWidth"
          :stroke-linecap="componentOption.circle.strokeLinecap"
          :color="componentOption.circle.color"
        />
        <span class="cache-clear-percentage">{{ componentOption.circle.percentageText }}</span>
      </div>
    </div>
    <div class="cache-clear-buttons">
      <button-group
        ref="buttonGroup"
        :component-option="componentOption.buttons"
      />
    </div>
  </div>
</template>

<script>
import ButtonGroup from '@/components/Button/ButtonGroup'

export default {
  name: 'CacheClear',
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

    }
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
.cache-clear-container {
  display: flex;
  align-items: center;

  .cache-clear-info {
    display: flex;
    align-items: center;
    margin-right: 48px;

    span {
      font-size: 14px;
      color: #0E1B2E;
    }

    .cache-clear-circle-progress {
      display: flex;
      align-items: center;

      &.is-high {

        .cache-clear-percentage {
          color: rgba(255, 58, 51, 1);
        }
      }

      .cache-clear-percentage {
        font-size: 12px;
        color: #1872F0;
        margin-left: 8px;
      }

      ::v-deep .el-progress {
        path {
          &:first-child {
            stroke: rgba(14, 27, 46, .1);
          }
        }
      }
    }
  }
}
</style>
