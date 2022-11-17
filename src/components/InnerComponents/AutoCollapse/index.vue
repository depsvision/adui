<template>
  <div class="auto-collapse-container">
    <span
      v-for="(data,dataIndex) in componentOption.value"
      :key="dataIndex"
      ref="container"
      class="auto-collapse-item"
      :class="[data.expand?'':'not-expand']"
    >
      <span ref="content" class="auto-collapse-item-content" :class="[data.expand?'':'not-expand']">
        {{ data.label }}
      </span>
      <i
        v-if="hasExpand(data,dataIndex) && data.hasExpand"
        class="el-icon-arrow-down"
        :class="[data.expand?'is-expand':'not-expand']"
        @click="handleExpand(data,dataIndex)"
      />
    </span>
  </div>
</template>

<script>

export default {
  name: 'AutoCollapse',
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
    async hasExpand(data, index) {
      let result = false

      await this.$nextTick(() => {
        const container = this.$refs.container[index]
        const content = this.$refs.content[index]

        if (content.offsetWidth >= container.offsetWidth - 16) {
          result = true
        }
      })

      this.$set(data, 'hasExpand', result)

      if (data.expand === undefined) {
        this.$set(data, 'expand', false)
      }
    },
    handleExpand(data, index) {
      const container = this.$refs.container[index]
      const content = this.$refs.content[index]

      if (!data.expand) {
        container.style.height = content.scrollHeight + 'px'
        content.style.height = content.scrollHeight + 'px'
      } else {
        container.style.height = '32px'
        content.style.height = '32px'
      }

      this.$set(data, 'expand', !data.expand)
    }
  }
}
</script>

<style scoped lang="scss">
.auto-collapse-container {
  flex-flow: column;

  .auto-collapse-item {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
    transition: all .3s ease-in-out;

    &>span {
      display: inline-block;
      overflow: hidden;
      width: auto;
      word-break: break-all;
      border-left: 2px solid #1872F0;
      box-sizing: border-box;
      transition: all .3s ease-in-out;
      padding-right: 16px;
      padding-left: 10px;

      &.not-expand {
        height: 32px;
        border-left: none;
        padding-left: 0;
      }
    }

    i {
      font-size: 16px;
      transition: all .3s ease-in-out;

      &.is-expand {
        transform: rotateZ(180deg);
      }

      &:hover {
        cursor: pointer;
        color: rgba(24, 114, 240, 1);
      }
    }
  }
}
</style>
