<template>
  <div class="algorithm-linkage-father">
    <transition name="fade-transform" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>

export default {
  name: 'AlgorithmLinkage',
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
.algorithm-linkage-father {
  width: 100%;
  height: 100%;
}
</style>
