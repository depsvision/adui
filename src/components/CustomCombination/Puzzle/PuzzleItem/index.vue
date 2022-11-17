<template>
  <span contenteditable="false" class="puzzle-item-block">
    <span
      class="puzzle-item"
      :class="[
        ...componentOption.class,
        isView?'is-view':'',
        componentOption.isEdit? 'is-edit':''
      ]"
      contenteditable="false"
      @click="clickPuzzle"
    >
      <svg-icon v-if="componentOption.svg" :icon-class="componentOption.svg" class="item-svg" />
      <span
        v-else
        ref="edit"
        class="puzzle-item-edit"
        :contenteditable="checkIsEdit"
        @keydown.stop
        @focus="handleClicSpan(componentOption)"
        @blur="setData"
        v-html="componentOption.label"
      />
      <span v-if="componentOption.fix">{{ componentOption.fix }}</span>
      <svg-icon
        v-if="componentOption.editSvg"
        :icon-class="componentOption.editSvg"
        class="edit-svg"
      />
    </span>
    <br v-if="isView && componentOption.br">
  </span>
</template>

<script>

export default {
  name: 'Puzzle',
  components: { },
  mixins: [],
  props: {
    componentOption: {
      type: Object,
      default: function() {
        return {
          style: {}
        }
      }
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  computed: {
    checkIsEdit() {
      return this.componentOption.isEditable && (!this.isView || this.componentOption.isEdit)
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {

    },
    setData(e) {
      this.componentOption.label = e.target.innerText
    },
    clickPuzzle(e) {
      if (this.isView && !this.componentOption.isEdit) return

      if (this.componentOption.isEdit && this.componentOption.buttonValue) {
        this.$store.dispatch('button/simulateButton', this.componentOption.buttonValue || 'clickPuzzleItem')
      }

      this.componentOption.isEditable && this.autoFocus()
    },
    autoFocus() {
      this.$refs.edit.focus()
    },
    handleClicSpan(option) {
      if (option.removeClass) {
        option.removeClass.forEach(item => {
          const index = option.class.indexOf(item)

          option.class.splice(index, index !== -1 ? 1 : 0)
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.puzzle-item-block {
  margin-right: 2px;

  &:last-of-type {
    margin-right: 0;
  }
}

.puzzle-item {
  position: relative;
  min-height: 20px;
  line-height: 20px;
  margin-top: 4px;
  margin-bottom: 4px;

  &:hover {
    cursor: pointer;
  }

  &.is-text {
    display: inline-flex;
    align-items: center;
    font-size: 12px;
    border-radius: 4px;
    padding: 0 4px;
  }

  &.is-svg {
    display: inline-flex;
    align-items: center;

    &:hover {
      background-color: rgba(50, 61, 77, 0.05);
      border-radius: 4px;
    }

    &.is-view {

      &:hover {
        cursor: unset;
        background-color: unset;
      }
    }

    .item-svg {
      height: 10px;
    }
  }

  &.is-view {

    &:hover {
      cursor: unset;
    }
  }

  &.is-edit {

    &:hover {
      cursor: pointer;
    }
  }

  .edit-svg {
    font-size: 12px;
    margin-left: 4px;
  }

  &.is-blue {
    color: rgba(24, 114, 240, 1);
    background-color: rgba(24, 114, 240, 0.05);
  }

  &.is-orange {
    color: rgba(255, 110, 38, 1);
    background-color: rgba(255, 110, 38, 0.05);
  }

  &.is-green {
    color: rgba(59, 166, 50, 1);
    background-color: rgba(59, 166, 50, 0.05);
  }

  &.is-purple {
    color: rgba(119, 51, 255, 1);
    background-color: rgba(119, 51, 255, 0.05);
  }

  &.is-grey {
    color: rgba(14, 27, 46, 1);
    background-color: rgba(200, 202, 204, 0.2);
  }

  &.is-error {
    background-color: rgba(255, 58, 51, 0.2);
  }

  .puzzle-item-edit {
    min-width: 2px;

    &:focus-visible {
      outline: none;
    }
  }
}
</style>
