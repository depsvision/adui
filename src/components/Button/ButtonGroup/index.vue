<template>
  <div class="button-group-container" :style="componentOption.style" :class="[...(componentOption.class ? componentOption.class : [])]">
    <span
      v-for="(button,buttonIndex) in componentOption.buttons || componentOption.value"
      v-show="buttonCrossAttribute(button,'hide',true)"
      :key="button.value"
      class="button-span-layout"
      :style="{
        'margin-top': (button.top + 'px') || 0,
        'margin-right': (button.right + 'px') || 0,
        'margin-bottom': (button.bottom + 'px') || 0,
        'margin-left': (button.left + 'px') || 0,
        '--divider': (button.divider || 16) + 'px',
        ...button.style
      }"
      :class="buttonTypeClass(button,buttonIndex)"
    >
      <el-tooltip
        :disabled="!button.tooltip"
        :content="button.tooltip || button.value"
        :show-after="componentOption.openDelay || 0"
        :placement="button.placement || 'top'"
        :effect="button.effect"
      >
        <popover-button v-if="button.tip" :component-option="button" :scope="scope" />
        <el-button
          v-else
          v-show="!button.hide"
          :loading="dealLoading(button)"
          :disabled="buttonCrossAttribute(button,'disabled')"
          :link="button.link"
          :type="button.type"
          size="default"
          :plain="button.plain"
          :class="buttonClass(button)"
          :style="button.innerStyle"
          @click="handleButtonClick(button)"
        >
          <i v-if="button.iconLeft" :class="[button.iconLeft,button.label?'':'no-label']" class="button-left-icon" />
          <svg-icon
            v-if="button.svgIconLeft"
            :icon-class="button.svgIconLeft"
            class="button-left-icon"
            :class="[button.label?'':'no-label']"
            :style="{
              'font-size':button.fontSize + 'px'
            }"
          />
          <span>{{ button.label }}</span>
          <svg-icon v-if="button.svgIconRight" :icon-class="button.svgIconRight" />
          <i v-if="button.iconRight" :class="button.iconRight" />
        </el-button>
      </el-tooltip>
    </span>
  </div>
</template>

<script>
import Authority from '@/mixins/authority'
import { mapGetters } from 'vuex'
import PopoverButton from './PopoverButton'

export default {
  name: 'ButtonGroup',
  components: { PopoverButton },
  mixins: [Authority],
  props: {
    componentOption: {
      type: Object,
      default: function() {
        return {}
      }
    },
    scope: {
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
  created() {
    console.log('class', this.componentOption.class)
  },
  computed: {
    ...mapGetters([
      'authority',
      'elementSize'
    ]),
    buttonClass() {
      return (button, prop) => {
        const classGroup = {}

        if (!prop) {
          prop = ''
        }

        button[ prop + 'class'] && button[prop + 'class'].split(' ').forEach(item => {
          classGroup[item] = true
        })

        classGroup['is-active'] = button.active

        return classGroup
      }
    },
    buttonTypeClass() {
      return (button, buttonIndex) => {
        const classGroup = []

        button['buttonSpanClass'] && button['buttonSpanClass'].split(' ').forEach(item => {
          classGroup.push(item)
        })

        if (button.type === 'text') {
          classGroup.push('span-button_text')
        }

        if (button.divider) {
          classGroup.push('has-divider')
        }

        if (!this.buttonCrossAttribute(button, 'hide', true) && buttonIndex === 0) {
          classGroup.push('button-margin-left-none')
        }

        return classGroup
      }
    },
    dealLoading() {
      return button => {
        if (this.scope && this.scope.row) {
          return this.scope.row.loading
        } else {
          return button.loading
        }
      }
    },
    buttonCrossAttribute() {
      return (button, attribute, scene) => {
        const result = this.componentOption[attribute] ||
                button[attribute] ||
               (
                 this.scope.row &&
                 this.scope.row[attribute] &&
                 this.scope.row[attribute].includes(button.value)
               )
        return scene ? !result : (result || this.accessButtons(button))
      }
    }
  },
  methods: {
    handleButtonClick(button) {
        console.log(1232)
      const timer = button.timer !== undefined ? button.timer : 500

      this.$emit('handleClickButton')
      this.$store.dispatch('button/assignButtonData', button)
      this.$store.dispatch('button/assignScopeData', this.scope)
      // 每次点击完后重置button的value值，防止watch不到变化，同时做到 “节流” 的效果
      setTimeout(() => {
        this.clearButton()
      }, timer)
    },
    clearButton() {
      this.$store.dispatch('button/listenClickButton', { key: 'value', value: '' })
    }
  }
}
</script>

<style scoped lang="scss">
.button-group-container {
  display: flex;
  align-items: center;

  .button-span-layout {
    display: flex;
    align-items: center;

    &.has-divider {
      display: inline-flex;
      align-items: center;

      &::after {
        content: " ";
        width: 1px;
        height: 24px;
        background-color: rgba(14, 27, 46, 0.15);
        margin-left: var(--divider);
      }
    }

    .button-left-icon {
      margin-right: 4px;

      &.no-label {
        margin-right: 0;
      }
    }
  }

  .button-margin-left-none {

    &+.button-span-layout {
      margin-left: 0 !important;
    }
  }
}
</style>
