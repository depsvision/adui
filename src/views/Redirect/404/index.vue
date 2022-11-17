<template>
    <CommonResult :component-option="resultOption" />
  </template>
  
  <script>
  import CommonResult from '@/components/Result/CommonResult'
  import notFound from '@/assets/image/result/404.webp'
  
  export default {
    name: 'NotFound',
    components: { CommonResult },
    props: {},
    data() {
      return {
        resultOption: {
          img: notFound,
          text: '没有找到相关页面',
          buttons: {
            buttons: [
              {
                label: '返回',
                value: 'backHistory',
                plain: true,
                innerStyle: {
                  'background-color': 'rgba(54, 106, 179, 0.05)'
                }
              }
            ]
          }
        }
      }
    },
    mounted() {
  
    },
    methods: {
  
    }
  }
  </script>
  
  <style scoped lang="scss">
  
  </style>
  