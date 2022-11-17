<template>
  <div class="third-container">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'Third',
  components: { },
  props: {},
  data() {
    return {}
  },
  created() {
    this.init()
  },
  methods: {
    init() {}
  }
}
</script>
<style scoped lang="scss">
.third-container {
  flex: 1;
}
</style>
