<template>
  <div class="dynamic-slot-container">
    <slot />
  </div>
</template>

<script>

export default {
  name: 'DynamicSlot',
  components: { },
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

</style>
