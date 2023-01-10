<template>
  <div ref="father" class="video-stream-analysis-detail layout-bg">
    <head-slot v-loading="pageLoading" :component-option="detailHeaderOption" class="video-stream-detail-title">
      <div class="video-stream-detail-blocks">
        <basic-information ref="basicInformation" class="inner-layout-bg" />
        <operation-management ref="operationManagement" class="inner-layout-bg" />
        <algorithm-point ref="algorithmPoint" class="inner-layout-bg" />
        <algorithm-log ref="algorithmLog" class="inner-layout-bg" />
        <analysis-configuration ref="analysisConfiguration" class="inner-layout-bg" />
        <intelligent-computingNode ref="intelligentComputingNode" class="inner-layout-bg" />
        <open-ability ref="openAbility" class="inner-layout-bg" />
      </div>
    </head-slot>
  </div>
</template>

<script>
import mixins from './Mixins'
import HeadSlot from '@/components/Slot/HeadSlot'
// import 页面区块
import BasicInformation from './Blocks/BasicInformation'
import OperationManagement from './Blocks/OperationManagement'
import AlgorithmPoint from './Blocks/AlgorithmPoint'
import AnalysisConfiguration from './Blocks/AnalysisConfiguration'
import IntelligentComputingNode from './Blocks/IntelligentComputingNode'
import AlgorithmLog from './Blocks/AlgorithmLog'
import OpenAbility from './Blocks/OpenAbility'

export default {
  name: 'VideoStreamAnalysisDetail',
  components: { HeadSlot, BasicInformation, OperationManagement, AlgorithmPoint, AnalysisConfiguration, IntelligentComputingNode, AlgorithmLog, OpenAbility },
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
              value: 'deleteTask'
            }
          ]
        }
      }
    }
  },
  created() {
    this.init()
  },
  beforeDestroy() {
    if (this.taskTimer) {
      clearInterval(this.taskTimer)

      this.taskTimer = null
    }
  },
  methods: {
    init() {
      this.pageLoading = true
      this.getTaskDetail()
    }
  }
}
</script>

<style scoped lang="scss">
.video-stream-analysis-detail {
  height: 100%;
  width: 100%;

  .video-stream-detail-title {

    :deep( .head-slot-block ) {
      .el-button {
        i,
        svg {
          font-size: 16px;

          &:hover {
            background-color: rgba(255, 58, 51, .1);
          }
        }
      }
    }
  }

  .video-stream-detail-blocks {
    flex: 1;
    padding-bottom: 40px;
    overflow: hidden;
  }
}
</style>
