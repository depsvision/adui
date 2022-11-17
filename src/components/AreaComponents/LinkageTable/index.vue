<template>
  <div class="linkage-table-container inner-form-table">
    <form-table
      ref="algorithm"
      :component-option="componentOption.mainTable"
      :style="{
        'margin-bottom':componentOption.marginBottom || '8px'
      }"
      @cell-lick="handleCellClick"
    />
    <form-table
      v-if="componentOption.linkageTable"
      ref="point"
      :component-option="componentOption.linkageTable"
    />
    <div v-if="componentOption.linkageTable" ref="chain" class="linkage-table-chain" />
  </div>
</template>

<script>
import FormTable from '@/components/FormTable'

export default {
  name: 'LinkageTable',
  components: { FormTable },
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
      activeCell: null,
      suport: null,
      hasClickLinkage: false
    }
  },
  computed: {

  },
  watch: {
    'componentOption.index'(val) {
      if (val !== undefined) {
        this.hasClickLinkage = true
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {

    },
    bindWheel() {
      const table = document.querySelector('.el-table--scrollable-y .el-table__body-wrapper')
      table.removeEventListener(this.suport, this.calculateScroll, false)

      this.suport = 'onwheel' in document.createElement('div') ? 'wheel' // 各个厂商的高版本浏览器都支持"wheel"
        : document.onmousewheel !== undefined ? 'mousewheel' // Webkit 和 IE一定支持"mousewheel"
          : 'DOMMouseScroll' // 低版本firefox

      table.addEventListener('scroll', this.calculateScroll, false)
    },
    calculateScroll(e) {
      this.handleChain(this.activeCell)
    },
    handleChain(cell) {
      const cellTop = cell.getBoundingClientRect().bottom + document.body.scrollTop

      const chainTop = this.$refs.chain.getBoundingClientRect().bottom + document.body.scrollTop

      this.$refs.chain.style.height = chainTop - cellTop + cell.getBoundingClientRect().height / 2 + 'px'
    },
    handleCellClick(row, column, cell, event) {
      if (this.componentOption.linkageTable && this.hasClickLinkage) {
        this.bindWheel()

        this.activeCell = cell

        this.handleChain(cell)

        this.hasClickLinkage = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.linkage-table-container {
  position: relative;
  flex: 1;
  display: flex;
  flex-flow: column;

  .linkage-table-chain {
    position: absolute;
    width: 8px;
    height: 170px;
    max-height: 170px;
    min-height: 32px;
    border-left: 2px solid rgba(14, 27, 46, 0.1);
    border-top: 2px solid rgba(14, 27, 46, 0.1);
    border-bottom: 2px solid rgba(14, 27, 46, 0.1);
    left: -16px;
    bottom: 140px;
  }
}
</style>
