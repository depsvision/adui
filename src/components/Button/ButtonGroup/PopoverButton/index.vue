<template>
  <span :style="componentOption.style">
    <el-popover
      v-if="componentOption.tip"
      v-model="popoverVisible"
      popper-class="button-popover small-buttons"
      :placement="componentOption.placement || 'left'"
      :width="componentOption.width"
    >
      <div class="button-popover-tip">
        <svg-icon v-if="componentOption.svgIcon" :icon-class="componentOption.svgIcon" :style="componentOption.svgStyle" />
        <p>{{ componentOption.tip }}</p>
      </div>
      <div style="text-align: right; margin: 0">
        <el-button plain @click="popoverVisible = false">取消</el-button>
        <el-button :class="buttonClass(componentOption,'popover')" type="primary" @click="handleButtonClick(componentOption)">{{ componentOption.confirm || '删除' }}</el-button>
      </div>
      <el-button
        slot="reference"
        :loading="dealLoading(componentOption)"
        :disabled="buttonCrossAttribute(componentOption,'disabled')"
        :type="componentOption.type"
        size="default"
        :plain="componentOption.plain"
        :class="buttonClass(componentOption,'popover')"
      >
        <i v-if="componentOption.iconLeft" :class="componentOption.iconLeft" />
        <svg-icon v-if="componentOption.svgIconLeft" :icon-class="componentOption.svgIconLeft" />
        <span>{{ componentOption.label }}</span>
        <svg-icon v-if="componentOption.svgIconRight" :icon-class="componentOption.svgIconRight" />
        <i v-if="componentOption.iconRight" :class="componentOption.iconRight" />
      </el-button>
    </el-popover>
  </span>
</template>

<script>
import Authority from '@/mixins/authority'
import { mapGetters } from 'vuex'

export default {
  name: 'PopoverButton',
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
      popoverVisible: false
    }
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

        button[prop + 'class'] && button[prop + 'class'].split(' ').forEach(item => {
          classGroup[item] = true
        })

        classGroup['is-active'] = button.active

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
      this.popoverVisible = false

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

