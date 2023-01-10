<template>
    <div class="count-to-container" :style="componentOption.style">
      <count-to
        :start-val="componentOption.value.start"
        :end-val="componentOption.value.end"
        :autoplay="componentOption.autoplay"
        :separator="componentOption.separator"
        :suffix="componentOption.value.suffix"
      />
    </div>
  </template>
  
  <script>
  import countTo from 'vue3-count-to'
  
  export default {
    name: 'CountToA',
    components: { countTo },
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
        isFocus: false
      }
    },
    methods: {
  
    }
  }
  </script>
  
  <style scoped lang="scss">
  .count-to-container {
  
  }
  </style>
  