<template>
  <div class="select-assembly-container" :style="componentOption.selectStyle">
    <el-select
      ref="select"
      v-model="componentOption.value"
      :loading="componentOption.loading"
      :size="componentOption.size"
      :placeholder="componentOption.placeholder"
      :multiple="componentOption.multiple"
      :collapse-tags="componentOption.collapseTags"
      :clearable="componentOption.clearable"
      :class="[...(componentOption.selectClass ?? [])]"
      @change="handleSelect"
      @visible-change="handleVisibleChange"
      @remove-tag="handleRemoveTag"
    >
      <el-option
        v-for="item in componentOption.option"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
      >
        <span class="select-label">{{ item.label }}</span>
        <span v-if="item.tip" class="select-tip">{{ item.tip }}</span>
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SelectAssembly',
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
      oldValue: []
    }
  },
  computed: {
    ...mapGetters([
      'elementSize'
    ])
  },
  methods: {
    handleSelect(value) {
      this.$emit('changeValue', value)

      this.resetPopper()

      if (this.componentOption.afterSelect) {
        this.componentOption.afterSelect()
      }
    },
    handleVisibleChange(type) {
      if (type) {
        this.oldValue = this.componentOption.value

        window.addEventListener('scroll', this.resetPopper, true)
      } else {
        window.addEventListener('scroll', this.resetPopper, true)
      }

      this.$emit('visibleChange', type, this.oldValue)
    },
    handleRemoveTag(tag) {
      this.$emit('removeTag', [tag, ...this.componentOption.value])

      this.oldValue = this.componentOption.value
    },
    resetPopper(type) {
      this.$nextTick(() => {
        this.$refs.select && this.$refs.select.$refs && this.$refs.select.$refs.popper.updatePopper()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.select-assembly-container {

  .el-select {
    width: 100%;
  }
}
</style>
