<template>
  <div class="simple-list-container" :style="componentOption.style">
    <div
      v-for="(list,listIndedx) in componentOption.value"
      :key="listIndedx"
      class="simple-list-item"
      :class="[componentOption.listType === 'strip'?'list-hover':'']"
      :style="componentOption.itemStyle"
      @mouseenter="activeIndex = listIndedx"
      @mouseleave="activeIndex = null"
    >
      <div v-if="componentOption.listType === 'strip'" class="simple-list-strip">
        <span v-if="list.head" class="simple-list-strip-head">{{ list.head }}</span>
        <span>{{ list.label }}</span>
        <button-group
          v-if="componentOption.buttons"
          v-show="componentOption.show || listIndedx === activeIndex"
          ref="buttonGroup"
          class="simple-list-item--button"
          :scope="list"
          :component-option="componentOption.buttons"
        />
      </div>

      <div v-if="componentOption.listType === 'formInput'" class="simple-list-forminput">
        <span :style="{width:componentOption.labelWidth,'text-align':componentOption.labelPosition}">{{ list.label }}</span>
        <el-input
          v-model.trim="list.value"
          :placeholder="componentOption.placeholder || list.placeholder"
          size="default"
          :style="componentOption.inputStyle"
        />
        <transition name="el-zoom-in-top">
          <div v-show="list.error" class="simple-list-input-error" :style="{'margin-left':componentOption.labelWidth}">{{ list.error }}</div>
        </transition>
      </div>
    </div>
    <span v-if="!componentOption.value.length" :style="componentOption.listTipStyle">{{ componentOption.listTip }}</span>
  </div>
</template>

<script>
import ButtonGroup from '@/components/Button/ButtonGroup'

export default {
  name: 'SimpleList',
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
      activeIndex: null
    }
  },
  computed: {

  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
.simple-list-container {
  position: relative;
  flex: 1;
  display: flex;
  flex-flow: column;
  overflow: auto;

  .simple-list-item {
    position: relative;
    margin-bottom: 8px;

    &:last-of-type {
      margin-bottom: 0;
    }

    &.list-hover {

      &:hover {
        background-color: #E6EAF0 !important;
        cursor: pointer;
      }
    }

    .simple-list-strip {

      .simple-list-strip-head {
        font-weight: 600;
        margin-right: 16px;
      }
    }

    .simple-list-item--button {
      position: absolute;
      height: 100%;
      top: 0;
      right: 8px;

      :deep( .el-button ) {
        i,svg {
          font-size: 16px;
        }
      }
    }

    .simple-list-forminput {

      &>span {
        display: inline-block;
      }

      .simple-list-input-error {
        font-size: 12px;
        color: #ff3a33;
        line-height: 1;
        margin-top: 8px;
      }
    }
  }
}
</style>
