<template>
  <div class="draggable-list-container" :style="componentOption.style">
    <div v-if="componentOption.dragTip" :style="componentOption.dragTip.style">{{ componentOption.dragTip.label }}</div>
    <div
      ref="sortBlock"
      class="draggable-list-block"
      :class="[isDraging?'is-draging':'']"
    >
      <div
        v-for="item in componentOption.value"
        :key="item.id"
        :data-id="item.id"
        class="draggable-list-item"
      >
        <svg-icon :icon-class="componentOption.svg || item.svg" />
        <el-checkbox
          v-model="item.check"
          :label="item.id"
        >
          <span>{{ item.label }}</span>
          <span>{{ item.tip }}</span>
        </el-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Sortable from 'sortablejs'
import { deepClone } from '@/utils'

export default {
  name: 'DraggableList',
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
      sortable: null,
      isDraging: false
    }
  },
  computed: {
    ...mapGetters([
      'globalData'
    ])
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.setSort()
    },
    setSort() {
      const that = this

      const el = this.$refs.sortBlock
      this.sortable = new Sortable(el, {
        animation: 500,
        forceFallback: true,
        onStart: evt => {
          that.isDraging = true
          this.$store.dispatch('data/setData', { obj: 'clone', key: 'positionIndex', value: evt.oldIndex })
        },
        onMove: evt => {
          const cloneValue = deepClone(that.globalData.clone.value)

          const oldIndex = cloneValue.findIndex(val => val === Number(evt.dragged.dataset.id))
          const newIndex = cloneValue.findIndex(val => val === Number(evt.related.dataset.id))

          cloneValue.splice(newIndex, 0, cloneValue.splice(oldIndex, 1)[0])

          this.$store.dispatch('data/setData', { obj: 'clone', key: 'value', value: cloneValue })
          this.$store.dispatch('data/setData', { obj: 'clone', key: 'index', value: [oldIndex, newIndex] })

          return true
        },
        onEnd: evt => {
          that.isDraging = false
          this.$store.dispatch('data/setData', { obj: 'clone', key: 'positionIndex', value: evt.newIndex })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.draggable-list-container {

  .draggable-list-block {
    display: flex;
    flex-flow: column;

    .draggable-list-item {
      height: 36px;
      line-height: 36px;
      display: flex;
      align-items: center;
      background-color: rgba(245, 247, 250, 1);
      border-radius: 4px;
      padding: 0 8px;
      margin-top: 8px;

      &:first-child {
        margin-top: 0;
      }

      svg {
        font-size: 16px;
        color: rgba(27,53,89,0.05);
        margin-right: 8px;
      }

      &:hover {
        cursor: pointer;

        svg {
          color: rgba(27,53,89,0.35);
        }
      }
    }

    &.is-draging {

      .draggable-list-item {

        &:hover {

          svg {
            color: rgba(27,53,89,0.05);
          }
        }

        &.sortable-chosen {
          svg {
            color: rgba(27,53,89,0.35);
          }
        }
      }
    }

  }

}
</style>
