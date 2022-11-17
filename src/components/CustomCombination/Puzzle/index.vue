<template>
  <span
    v-if="componentOption.value && componentOption.value.formula"
    ref="container"
    class="puzzle-container"
    @keydown.prevent="handleKeyup"
  >
    <span ref="rangePosition-1" class="range-head" contenteditable="true" @focus="e=>{getRange(e,-1)}" />
    <template
      v-for="(con,conIndex) in componentOption.value.formula"
      :key="con.value + conIndex"
    >
      <puzzle-item
        
        :ref="'puzzleItem' + conIndex"
        :component-option="con"
      />
      <span
        :ref="'rangePosition' + conIndex"
        class="range-position"
        contenteditable="true"
        @focus="e=>{getRange(e,conIndex)}"
        @input="stopInput"
      />
      <br v-if="con.br" contenteditable="false">
    </template>
  </span>
</template>

<script>
import PuzzleItem from '@/components/CustomCombination/Puzzle/PuzzleItem'

export default {
  name: 'Puzzle',
  components: { PuzzleItem },
  mixins: [],
  props: {
    componentOption: {
      type: Object,
      default: function() {
        return {
          style: {}
        }
      }
    }
  },
  data() {
    return {
      sel: null,
      index: -1,
      isSelfClick: false,
      positionValue: ''
    }
  },
  computed: {
    canDelete() {
      if (typeof this.componentOption.canDelete === 'undefined') {
        return true
      } else {
        return this.componentOption.canDelete
      }
    }
  },
  watch: {
    'componentOption.value.formula': {
      handler(val) {
        this.updateScript(val)
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {

    },
    getRange(e, index) {
      this.index = index

      if (this.componentOption.afterRangeChange) {
        this.componentOption.afterRangeChange(this.index)
      }
    },
    stopInput(e) {
      e.target.innerText = ''
    },
    addPuzzle(puzzle) {
      let result = true

      if (this.componentOption.beforeAdd) {
        result = this.componentOption.beforeAdd(puzzle)
      }

      if (!result) {
        return
      }

      if (this.index === -1) {
        this.componentOption.value.formula.splice(0, 0, puzzle)
      } else {
        this.componentOption.value.formula.splice(this.index + 1, 0, puzzle)
      }

      this.$nextTick(() => {
        const sel = window.getSelection()

        const range = this.$refs['rangePosition' + (this.index + 1)]

        const itemIndex = this.index === -1 ? 0 : this.index + 1

        const puzzleItem = this.$refs['puzzleItem' + itemIndex]

        if (puzzleItem[0] && puzzleItem[0].componentOption.isEditable) {
          puzzleItem[0].autoFocus()

          this.index++
        } else if (range[0]) {
          sel.collapse(range[0], 0)
        }

        if (this.componentOption.afterAdd) {
          this.componentOption.afterAdd()
        }

        if (this.componentOption.afterRangeChange) {
          this.componentOption.afterRangeChange(this.index)
        }
      })
    },
    handleKeyup(e) {
      switch (e.key) {
        case 'Backspace':
          this.customizeDelete()
          break
        case 'ArrowLeft':
          this.changeRange('left')
          break
        case 'ArrowRight':
          this.changeRange('right')
          break
        default:
          break
      }
    },
    customizeDelete() {
      let result = true

      if (this.componentOption.beforeDelete) {
        result = this.componentOption.beforeDelete()
      }

      if (!result) {
        return
      }

      if (!this.canDelete || this.index === -1) return

      this.componentOption.value.formula.splice(this.index, 1)

      this.$nextTick(() => {
        const sel = window.getSelection()

        const head = this.$refs['rangePosition-1']
        const range = this.$refs['rangePosition' + (this.index - 1)]

        if (range[0]) {
          sel.collapse(range[0], 0)
        } else {
          sel.collapse(head, 0)
        }

        if (this.componentOption.afterDelete) {
          this.componentOption.afterDelete()
        }

        if (this.componentOption.afterRangeChange) {
          this.componentOption.afterRangeChange(this.index)
        }
      })
    },
    changeRange(direction) {
      const sel = window.getSelection()
      const length = this.componentOption.value.formula.length

      let index = this.index

      if (direction === 'left') {
        index = index - 1

        if (index < -1) index = -1
      } else if (direction === 'right') {
        index = index + 1

        if (index > length - 1) index = length - 1
      }

      const range = this.$refs['rangePosition' + index]

      if (range[0]) {
        sel.collapse(range[0], 0)
      }

      if (this.componentOption.afterRangeChange) {
        this.componentOption.afterRangeChange(this.index)
      }
    },
    updateScript(val) {
      this.componentOption.value.script = ''

      this.componentOption.value.formula.forEach(item => {
        if (item.label) {
          this.componentOption.value.script += item.label
        }

        if (item.fix) {
          this.componentOption.value.script += item.fix
        }

        if (item.svg) {
          this.componentOption.value.script += item.value
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.puzzle-container {
  overflow: overlay;

  .range-head {
    display: inline-block;
    width: 1px;
    height: 10px;

    &:focus-visible {
      outline: none;
    }
  }

  .range-position {
    display: inline-block;
    width: 1px;
    padding: 0px 2px;
    height: 10px;
    margin-bottom: 2px;

    &:focus-visible {
      outline: none;
    }
  }
}
</style>
