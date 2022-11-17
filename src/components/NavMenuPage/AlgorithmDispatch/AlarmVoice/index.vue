<template>
  <div class="alarm-voice-container layout-bg">
    <div v-loading="pageLoading" class="alarm-voice-layout common-tablebox-layout">
      <div class="alarm-voice-buttons common-tablebox--top_button-group">
        <div class="alarm-voice-control">
          <div class="alarm-voice-system-popup">
            <span>系统报警弹窗</span>
            <el-switch
              v-model="systemNotify"
              inactive-color="rgba(218, 227, 240, 1)"
              :disabled="accessButtons({value:'notify'})"
              @change="value=>setVoiceNotify(value,'notify')"
            />
          </div>
          <div class="alarm-voice-system-voice">
            <span>系统报警语音</span>
            <el-switch
              v-model="alarmVoice"
              inactive-color="rgba(218, 227, 240, 1)"
              :disabled="accessButtons({value:'voice'})"
              @change="value=>setVoiceNotify(value,'voice')"
            />
          </div>
        </div>
        <div class="default-voice-buttons">
          <span class="default-voice-title">默认报警语音</span>
          <span class="default-voice-name">{{ defaultVoice.name }}</span>
          <button-group
            ref="buttonGroup"
            :component-option="buttonGroupOption"
          />
        </div>
      </div>
      <div class="alarm-voice-table common-tablebox-table">
        <form-table
          ref="formTable"
          :component-option="algorithmLogOption"
        />
      </div>
    </div>
    <common-upload v-show="false" :component-option="audioUpload" @handleUploadStatus="handleUploadStatus">
      <el-button ref="uploadButton" plain>替换</el-button>
    </common-upload>
  </div>
</template>

<script>
import Authority from '@/mixins/authority'
import ButtonGroup from '@/components/Button/ButtonGroup'
import FormTable from '@/components/FormTable'
import CommonUpload from '@/components/Upload/CommonUpload'
import mixins from './Mixins'
import { mapGetters } from 'vuex'

export default {
  name: 'AlarmVoice',
  components: { FormTable, ButtonGroup, CommonUpload },
  mixins: [Authority, mixins],
  props: {},
  data() {
    return {
      pageLoading: false,
      systemNotify: false,
      alarmVoice: false,
      defaultVoice: {
        name: 'default.mp3',
        url: ''
      },
      buttonGroupOption: {
        buttons: [
          {
            label: '试听',
            value: 'listenDefault',
            plain: true
          },
          {
            label: '替换',
            value: 'replaceDefault',
            plain: true
          },
          {
            label: '恢复默认',
            value: 'deleteDefault',
            plain: true
          }
        ]
      },
      algorithmLogOption: {
        tableData: [],
        header: [
          {
            width: 160,
            align: 'left',
            fixed: 'right',
            label: '操作',
            type: 'buttonGroup',
            buttonGroup: {
              buttons: [
                {
                  label: '试听',
                  value: 'listenItem',
                  type: 'text'
                },
                {
                  label: '替换',
                  value: 'replaceItem',
                  type: 'text'
                },
                {
                  label: '删除',
                  value: 'deleteItem',
                  type: 'text',
                  popoverclass: 'is-danger',
                  tip: '删除后会使用默认语音，是否删除？',
                  svgIcon: 'warning'
                }
              ]
            }
          },
          {
            minWidth: 60,
            align: 'left',
            label: '算法ID',
            prop: 'algorithmId',
            type: 'span'
          },
          {
            minWidth: 230,
            align: 'left',
            label: '算法名称',
            prop: 'algorithmName',
            type: 'span'
          },
          {
            minWidth: 400,
            align: 'left',
            label: '报警语音',
            prop: 'alertVoiceName',
            type: 'span',
            showOverflowTooltip: true
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'voiceOption'
    ])
  },
  watch: {
    voiceOption: {
      handler(val) {
        this.alarmVoice = val.voice
        this.systemNotify = val.notify
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getAlarmVoiceData()
    }
  }
}
</script>

<style scoped lang="scss">
.alarm-voice-container {
  display: flex;
  flex-flow: column;

  .search-info-layout {
    margin-bottom: 20px;
  }

  .alarm-voice-layout{
    flex: 1;

    .alarm-voice-buttons {
      display: flex;
      justify-content: space-between;

      .alarm-voice-control {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: rgba(14, 27, 46, .5);

        .alarm-voice-system-popup {
          margin-right: 48px;
        }

        .alarm-voice-system-popup,
        .alarm-voice-system-voice {
          &>span {
            margin-right: 16px;
          }
        }
      }

      .default-voice-buttons {
        display: flex;
        align-items: center;
        font-size: 14px;

        .default-voice-title {
          color: rgba(14, 27, 46, .5);
          margin-right: 16px;
        }

        .default-voice-name {
          color: #0E1B2E;
          margin-right: 64px;
        }
      }
    }

    .alarm-voice-table {

      ::v-deep .el-table {

        .is-default {

          &>span {
            filter: opacity(0.5);
          }
        }
      }
    }
  }

}

@media screen and (max-width: 1439px) {

  .alarm-voice-container {

    .alarm-voice-buttons {

      .default-voice-buttons {

        .default-voice-name {
          max-width: 160px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
