<template>
  <div class="point-img-container">
    <div class="point-img-left">
      <button-group
        ref="buttonGroup"
        :component-option="componentOption.buttons"
      />
      <div class="point-img-block">
        <div class="point-img-resolution">
          <el-input
            v-model.trim="componentOption.value.width"
            size="default"
            :placeholder="componentOption.width"
            :class="[isWidthFocus?'is-focus':'']"
            :style="componentOption.inputStyle"
            @focus="isWidthFocus = true"
            @blur="isWidthFocus = false"
          >
            <template v-if="componentOption.widthPrepend" slot="prepend">{{ componentOption.widthPrepend }}</template>
          </el-input>
          <svg-icon icon-class="error-small" />
          <el-input
            v-model.trim="componentOption.value.height"
            size="default"
            :placeholder="componentOption.height"
            :class="[isHeightFocus?'is-focus':'']"
            :style="componentOption.inputStyle"
            @focus="isHeightFocus = true"
            @blur="isHeightFocus = false"
          >
            <template v-if="componentOption.heightPrepend" slot="prepend">{{ componentOption.heightPrepend }}</template>
          </el-input>
        </div>
      </div>
    </div>
    <div class="point-img-right">
      <div v-loading="componentOption.loading" class="image-layout">
        <el-image
          v-if="componentOption.value.url !== null"
          :src="componentOption.value.url"
          fit="contain"
        >
          <div slot="error" class="image-slot svg-slot">
            <svg-icon :icon-class="componentOption.value.url === ''?'empty-image':'error-image-line'" />
          </div>
        </el-image>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonGroup from '@/components/Button/ButtonGroup'

export default {
  name: 'PointImg',
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
      isWidthFocus: false,
      isHeightFocus: false
    }
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
.point-img-container {
  display: flex;
  flex-flow: column;

  .point-img-left {
    flex: 1;
    line-height: 36px;
    display: flex;
    margin-bottom: 8px;

    :deep(.button-group-container) {
      margin-right: 24px;

      .el-button {

        &:hover {
          color: rgba(24, 114, 240, 1) !important;
        }

        &.el-button--text > span {
          line-height: 16px;
          vertical-align: middle;
        }
      }
    }

    .point-img-block {
      margin-left: auto;

      & >span {
        display: inline-block;
        font-size: 12px;
        color: rgba(14, 27, 46, 0.55);
        margin-bottom: 8px;
      }

      :deep(.point-img-resolution) {
        display: flex;
        align-items: center;

        &>svg {
          flex-shrink: 0;
          font-size: 16px;
          margin: 0 4px;
        }

        .el-input__inner {
          font-size: 12px;
        }
      }
    }
  }

  .point-img-right {
    position: relative;
    display: flex;
    flex-shrink: 0;
    height: 182px;
    border: 1px solid rgba(27, 53, 89, 0.2);
    overflow: hidden;

    &::before {
      content: " ";
      position: absolute;
      top: -100%;
      left: -30%;
      width: 150%;
      height: 300%;
      background-image: linear-gradient(45deg, rgba(225, 225, 225, 1) 25%, transparent 25%, transparent),
        linear-gradient(-45deg, rgba(225, 225, 225, 1) 25%, transparent 25%, transparent),
        linear-gradient(45deg, transparent 75%, rgba(225, 225, 225, 1) 75%),
        linear-gradient(-45deg, transparent 75%, rgba(225, 225, 225, 1) 75%);
      background-size: 10px 10px;
      transform: rotate(45deg);
    }

    :deep(.image-layout) {
      flex: 1;
      display: flex;
      justify-content: center;

      svg {
        font-size: 36px;
      }
    }
  }
}
</style>
