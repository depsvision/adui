<template>
  <div ref="father" class="algorithm-linkage-detail layout-bg">
    <head-slot v-loading="pageLoading" :component-option="detailHeaderOption" class="algorithm-linkage-detail-title">
      <div class="algorithm-linkage-detail-blocks">
        <basic-information ref="basicInformation" class="inner-layout-bg" />
        <algorithm-linkage ref="algorithmLinkage" class="inner-layout-bg" />
        <linkage-output ref="linkageOutput" class="inner-layout-bg" />
      </div>
    </head-slot>
  </div>
</template>

<script>
import mixins from './Mixins'
import HeadSlot from '@/components/Slot/HeadSlot'
// import 页面区块
import BasicInformation from './Blocks/BasicInformation'
import AlgorithmLinkage from './Blocks/AlgorithmLinkage'
import LinkageOutput from './Blocks/LinkageOutput'

export default {
  name: 'AlgorithmLinkageDetail',
  components: { HeadSlot, BasicInformation, AlgorithmLinkage, LinkageOutput },
  mixins: [mixins],
  props: {},
  data() {
    return {
      pageLoading: false,
      detailHeaderOption: {
        label: '任务详情',
        class: 'is-outer is-weight',
        buttons: {
          buttons: [
            {
              label: '',
              type: 'text',
              iconLeft: 'el-icon-delete',
              class: 'is-danger is-outer',
              value: 'deleteLinkage'
            }
          ]
        }
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.pageLoading = true
      this.getLinkageDetail()
    }
  }
}
</script>

<style scoped lang="scss">
.algorithm-linkage-detail {
  height: 100%;
  width: 100%;

  .algorithm-linkage-detail-title {
    ::v-deep .el-button {
      i,
      svg {
        font-size: 16px;

        &:hover {
          background-color: rgba(255, 58, 51, .1);
        }
      }
    }
  }

  .algorithm-linkage-detail-blocks {
    flex: 1;
    padding-bottom: 40px;
    overflow: hidden;
  }
}
</style>
