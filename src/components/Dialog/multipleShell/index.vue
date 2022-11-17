<template>
  <div class="multiple-shell-container">
    <div class="dialog-shell-main" :style="componentOption.mainStyle">
      <component
        :is="componentOption.name"
        ref="component"
        :component-option="componentOption.option"
      />
    </div>
    <div v-if="componentOption.viewComponent" class="dialog-shell-view" :style="componentOption.viewComponent.style">
      <head-slot
        :component-option="componentOption.viewComponent.head"
      />
      <component
        :is="componentOption.viewComponent.name"
        ref="component"
        :component-option="componentOption.viewComponent.option"
      />
    </div>
  </div>
</template>

<script>
import FormList from '@/components/InnerComponents/FormList'
import MailTemplate from '@/components/AreaComponents/MailTemplate'
import HeadSlot from '@/components/Slot/HeadSlot'

export default {
  name: 'MultipleShell',
  components: {
    FormList,
    MailTemplate,
    HeadSlot
  },
  mixins: [],
  props: {
    componentOption: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {

  },
  watch: {

  },
  mounted() {

  },
  methods: {
    init() {

    }
  }
}
</script>

<style scoped lang="scss">
.multiple-shell-container {
  display: flex;
}
</style>
