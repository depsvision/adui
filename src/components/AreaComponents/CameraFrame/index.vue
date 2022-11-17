<template>
  <div class="camera-frame-container">
    <div class="frame-mode-choose">
      <span class="camera-frame-label">基本模式</span>
      <div class="frame-mode-radio">
        <radio-assembly :component-option="componentOption.modeRadio" />
      </div>
    </div>
    <div class="frame-frequency-choose">
      <span class="camera-frame-label">抽帧频率</span>
      <div v-if="componentOption.modeRadio.value === 1" class="global-frame-radio">
        <radio-assembly :component-option="componentOption.globalRadio" @changeValue="changeAllRadioValue" />
      </div>
      <div v-else class="customize-frame">
        <span>仅展示已选中的点位</span>
        <div class="customize-frame-block">
          <common-tree
            ref="leftTree"
            :component-option="componentOption.treeOption"
            @handleEvent="treeEvent"
          />
          <div class="customize-frame-radio-block">
            <div
              v-for="radio in customizeRadio"
              :key="radio.cameraId"
              class="customize-frame-radio"
            >
              <el-tooltip :content="radio.name" placement="top">
                <div class="camera-frame-label">{{ radio.name }}</div>
              </el-tooltip>
              <radio-assembly :component-option="radio.radioGroup" @changeValue="changeRadioValue" />
              <InputAssembly
                :ref="'input' + radio.cameraId"
                :component-option="radio.inputOption"
                @changeValue="value=>{changeTreeValue(value,radio)}"
                @handleChange="value=>{changeSingleInput(value,radio)}"
              />
              <span class="camera-frame-input-tip">ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="componentOption.modeRadio.value === 1" class="frame-push-analysis-interval">
      <span class="camera-frame-label">推送分析间隔</span>
      <div class="global-frame-input">
        <InputAssembly
          :component-option="componentOption.intervalInput"
          @changeValue="value=>{changeValue(value,componentOption.intervalInput)}"
          @handleChange="changeAllInput"
        />
        <span class="global-frame-input-tip">ms</span>
      </div>
    </div>
  </div>
</template>

<script>
import RadioAssembly from '@/components/InnerComponents/RadioAssembly'
import InputAssembly from '@/components/InnerComponents/InputAssembly'
import CommonTree from '@/components/Tree/CommonTree'

import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'

export default {
  name: 'CameraFrame',
  components: { RadioAssembly, CommonTree, InputAssembly },
  props: {
    componentOption: {
      type: Object,
      default: function() {
        return {

        }
      }
    }
  },
  data() {
    return {
      globalRadioList: [],
      customizeRadio: [],
      commonRadio: {
        radio: [
          {
            label: '关键帧',
            value: true
          },
          {
            label: '全帧',
            value: false
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'dialog'
    ])
  },
  watch: {
    'componentOption.modeRadio.value': {
      handler(val) {
        if (val === 2) {
          this.$nextTick(() => {
            this.clickNode(this.$refs.leftTree.$refs.tree.getCurrentNode())
          })
        } else {
          this.changeAllRadioValue()
          this.changeAllInput()
        }
      },
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    treeEvent(params) {
      switch (params.eName) {
        case 'node-click':
          this.clickNode(params.arg[0])
          break
        default:
      }
    },
    clickNode(data) {
      const customizeRadio = this.componentOption.cameraList.filter(item => item.groupId.includes(data.groupId))
      customizeRadio.forEach(radio => {
        radio.radioGroup = deepClone(this.commonRadio)
        radio.radioGroup.value = radio.tryOnlyDecodeIDR
        radio.radioGroup.cameraId = radio.cameraId
        radio.inputOption = {
          value: radio.extractionIntervalMS,
          valueType: 'Number'
        }
      })
      this.customizeRadio = deepClone(customizeRadio)
    },
    changeAllRadioValue() {
      this.globalRadioLis = this.componentOption.cameraList
      this.globalRadioLis.forEach(item => {
        item.tryOnlyDecodeIDR = this.componentOption.globalRadio.value === 'onlyIDR'
      })
    },
    changeRadioValue(value, radio) {
      const camera = this.componentOption.cameraList.find(item => item.cameraId === radio.cameraId)
      this.$set(camera, 'tryOnlyDecodeIDR', value)
    },
    changeAllInput() {
      this.globalRadioList = this.componentOption.cameraList
      this.globalRadioLis.forEach(item => {
        item.extractionIntervalMS = this.componentOption.intervalInput.value
      })
    },
    changeSingleInput(value, radio) {
      const camera = this.componentOption.cameraList.find(item => item.cameraId === radio.cameraId)
      const customize = this.customizeRadio.find(item => item.cameraId === radio.cameraId)
      this.$set(camera, 'extractionIntervalMS', Number(value))
      this.$set(customize, 'extractionIntervalMS', Number(value))
    },
    changeValue(value, item) {
      this.$set(item, 'value', value)
    },
    changeTreeValue(value, item) {
      this.$set(item.inputOption, 'value', value)

      this.$refs['input' + item.cameraId][0].$forceUpdate()
    }
  }
}
</script>

<style scoped lang="scss">
.camera-frame-container {

  .frame-mode-choose,
  .frame-frequency-choose,
  .frame-push-analysis-interval {
    display: flex;
  }

  .frame-mode-choose,
  .frame-frequency-choose {
    margin-bottom: 24px;
  }

  .frame-frequency-choose {
    .customize-frame{
      flex: 1;
      line-height: 1;

      &>span {
        display: inline-block;
        color: rgba(14, 27, 46, 0.5);
        margin-bottom: 16px;
      }

      .customize-frame-block {
        height: 276px;
        display: flex;
        border: 1px solid rgba(27, 53, 89, .2);
        border-radius: 4px;
        overflow: auto;

        .common-tree-container {
          width: 186px;
          border-right: 1px solid rgba(27, 53, 89, .2);

          ::v-deep .el-tree {
            background-color: unset;

            .el-tree-node__content {

              &::before,
              &::after {
                width: 16px;
              }
            }
          }
        }

        .customize-frame-radio-block {
          flex: 1;
          overflow-y: auto;

          .customize-frame-radio {
            display: flex;
            align-items: center;
            height: 44px;
            line-height: 44px;
            padding-left: 8px;

            .el-tooltip {
              flex: 1;
              display: flex;
              align-items: center;
              height: 44px;
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: normal;
              margin-right: 8px;
            }

            .input-assembly-container {
              padding-left: 16px;
            }
          }

          .camera-frame-input-tip {
            color: rgba(14, 27, 46, 0.85);
            margin: 0 8px 0 4px;
          }
        }
      }
    }
  }

  .frame-push-analysis-interval {

    .camera-frame-label {
      display: flex;
      align-items: center;
    }

    .global-frame-input {
      display: flex;
      align-items: center;

      .global-frame-input-tip {
        color: rgba(14, 27, 46, 0.85);
        margin-left: 4px;
      }
    }
  }

  ::v-deep .el-radio {
    display: flex;
  }

  .camera-frame-label {
    width: 108px;
    font-size: 14px;
    line-height: 1;
    color: rgba(14, 27, 46, .85);
  }
}
</style>
