<template>
  <div class="picture-analysis-father">
    <transition name="fade-transform" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>

export default {
  name: 'PictureAnalysis',
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
.picture-analysis-father {
  width: 100%;
  height: 100%;
}
</style>
