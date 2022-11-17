<template>
  <div class="switch-assembly-container">
    <el-switch
      v-model="componentOption.value"
      :active-text="componentOption.activeText"
      :inactive-text="componentOption.inactiveText"
      :inactive-color="componentOption.inactiveColor || 'rgba(218, 227, 240, 1)'"
      :disabled="componentOption.disabled || accessButtons({value:componentOption.prop})"
      @change="handleSwitch"
    />
    <span v-show="componentOption.switchTip" class="switch-assembly-tip" :style="componentOption.switchTipStyle">{{ componentOption.switchTip }}</span>
  </div>
</template>

<script>
import Authority from '@/mixins/authority'

export default {
  name: 'SwitchAssembly',
  components: { },
  mixins: [Authority],
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
    handleSwitch(swich) {
      this.$emit('changeValue', swich)
    }
  }
}
</script>

<style scoped lang="scss">
.switch-assembly-container {
  display: flex;
  align-items: center;

  .switch-assembly-tip {
    font-size: 14px;
    color: rgba(14, 27, 46, 1);
    margin-left: 32px;
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
