<template>
  <div class="head-slot-container">
    <div v-if="Object.keys(componentOption).length > 0 && (componentOption.label || componentOption.tip)" class="head-slot-block" :class="slotClass">
      <span class="head-slot-text">{{ componentOption.label }}</span>
      <span v-if="componentOption.tip" class="head-slot-tip">{{ componentOption.tip }}</span>
      <button-group
        ref="buttonGroup"
        :component-option="componentOption.buttons"
      />
    </div>
    <div v-if="Object.keys(componentOption).length > 0" class="head-slot-body">
      <slot />
    </div>
    <slot v-if="Object.keys(componentOption).length === 0" />
  </div>
</template>

<script>
import ButtonGroup from '@/components/Button/ButtonGroup'

export default {
  name: 'HeadSlot',
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
  computed: {
    slotClass() {
      const classGroup = {}
      this.componentOption.class && this.componentOption.class.split(' ').forEach(item => {
        classGroup[item] = true
      })
      return classGroup
    }
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
.head-slot-container {
  display: flex;
  flex-flow: column;

  .head-slot-block {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    .head-slot-text {
      font-size: 14px;
      line-height: 14px;
      color: #0E1B2E;
      margin-right: 8px;
    }

    .head-slot-tip {
      font-size: 12px;
      color: rgba(14, 27, 46, .5);
    }

    &.is-outer {
      margin-bottom: 20px;

      .head-slot-text {
        font-size: 14px;
        font-weight: 600;

        &+.button-group-container {
          margin-left: 8px;
        }
      }
    }

    &.is-weight {
      font-weight: 600;
    }
  }

  .head-slot-body {
    display: flex;
  }
}

@media screen and (max-width: 1920px) {}

@media screen and (max-width: 1680px) {}

@media screen and (max-width: 1570px) {

  /* FormListBlock --  */

}

@media screen and (max-width: 1440px) {}

@media screen and (max-width: 1366px) {}

@media screen and (max-width: 1280px) {}
</style>
