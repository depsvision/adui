<template>
  <svg class="upload-status-container" width="24px" height="24px" viewBox="0 0 24 24">
    <path class="upload-arrow" d="M6,8 L12,2 L18,8 L14,8 L14,16 L10,16 L10,8 L6,8 Z" />
    <rect fill="#FFFFFF" x="0" y="18" width="24" height="6" />
    <path d="M4,20 C3.44771525,20 3,19.5522847 3,19 L3,19 L3,14 L3.00672773,13.8833789 C3.06449284,13.3860402 3.48716416,13 4,13 C4.55228475,13 5,13.4477153 5,14 L5,14 L5,18 L19,18 L19,14 L19.0067277,13.8833789 C19.0644928,13.3860402 19.4871642,13 20,13 C20.5522847,13 21,13.4477153 21,14 L21,14 L21,19 C21,19.5522847 20.5522847,20 20,20 L20,20 Z" />
  </svg>
</template>

<script>

export default {
  name: 'UploadStatus',
  mixins: [],
  props: {

  },
  data() {
    return {

    }
  },
  watch: {

  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.setAnimation()
    },
    setAnimation(status) {
      this.$nextTick(() => {

      })
    }
  }
}
</script>

<style scoped lang="scss">
.upload-status-container {

  .upload-arrow {
    animation: uploadArrow 1.3s linear infinite;
  }
}

@keyframes uploadArrow {
  0% {
    transform: translateY(66%);
  }
  100% {
    transform: translateY(-66%);
  }
}
</style>
