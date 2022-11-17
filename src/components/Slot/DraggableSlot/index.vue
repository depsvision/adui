<template>
  <div class="draggable-slot-container" :class="componentOption.slotClass">
    <draggable
      ref="drag"
      v-model="componentOption.value"
      class="draggable-layout"
      :force-fallback="componentOption.forceFallback === undefined?true:componentOption.forceFallback"
      :animation="componentOption.animation || 500"
      :disabled="componentOption.disabled"
      :handle="componentOption.handle"
      :draggable="componentOption.draggable || '.is-draggable'"
      @start="sortStart"
      @update="sortUpdate"
      @sort="sorted"
      @end="sortEnd"
    >
      <transition-group>
        <slot />
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'DraggableSlot',
  components: { draggable },
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
  mounted() {
    this.init()
  },
  methods: {
    init() {

    },
    sortStart() {
      this.$emit('sortStart', this.componentOption)
    },
    sortUpdate() {
      this.$emit('sortUpdate', this.componentOption)
    },
    sorted() {
      this.$emit('sorted', this.componentOption)
    },
    sortEnd() {
      this.$emit('sortEnd', this.componentOption)
    }
  }
}
</script>

<style scoped lang="scss">
.draggable-slot-container {
  flex: 1;
}
</style>
