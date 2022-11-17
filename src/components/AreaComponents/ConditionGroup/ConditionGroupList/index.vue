<template>
  <div class="condition-group-list-container" :style="componentOption.style">
    <condition-group
      v-for="group in componentOption.data"
      :key="group.action"
      :component-option="dealCondition(group)"
      :style="componentOption.groupStyle"
    />
  </div>
</template>

<script>
import ConditionGroup from '@/components/AreaComponents/ConditionGroup'

export default {
  name: 'ConditionGroupList',
  components: { ConditionGroup },
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
    dealCondition() {
      return (condition) => {
        condition.id = condition.idValue

        condition.condition.algorithm.content.id = condition.idValue
        return condition
      }
    }
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
.condition-group-list-container {

  .condition-group-container {
    &:last-of-type {
      margin-bottom: 0 !important;
    }
  }
}
</style>
