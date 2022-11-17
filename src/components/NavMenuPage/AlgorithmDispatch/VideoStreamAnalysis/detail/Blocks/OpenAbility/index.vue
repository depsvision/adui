<template>
  <div class="open-ability-block">
    <head-slot :component-option="{label:'开放能力',class: 'is-outer'}">
      <form-list :component-option="formListOption">
        <template v-slot:demoVideoStream>
          <div class="open-ability-inner-table">
            <span class="form-tip is-warning-tip">
              <svg-icon icon-class="warning" />
              编码将消耗较多资源，且路数较多时分析资源可能不足导致演示效果不佳，请注意合理配置；运行中的任务需要重新下发配置以生效
            </span>
            <div class="video-stream-table">
              <form-table
                ref="formTable"
                :component-option="demoVideoStream"
                @handleSwitchChange="handleSwitchChange"
              />
            </div>
          </div>
        </template>
        <template v-slot:alarmVideoClip>
          <div class="alarm-video-clip-form inner-form-layout">
            <form-list :component-option="alarmVideoClip" />
          </div>
        </template>
        <template v-slot:callbackPush>
          <div class="open-ability-inner-form">
            <button-group
              ref="buttonGroup"
              :component-option="callbackPushButtons"
            />
            <form-table
              ref="formTable"
              :component-option="callbackPush"
              @handleSwitchChange="handleSwitchChange"
            />
          </div>
        </template>
      </form-list>
    </head-slot>
  </div>
</template>

<script>
import mixins from './Mixins'
import HeadSlot from '@/components/Slot/HeadSlot'
import FormList from '@/components/InnerComponents/FormList'
import ButtonGroup from '@/components/Button/ButtonGroup'
import FormTable from '@/components/FormTable'
import task from '@/api/task'

export default {
  name: 'OpenAbility',
  components: { HeadSlot, FormList, ButtonGroup, FormTable },
  mixins: [mixins],
  props: {},
  data() {
    return {
      formListOption: {
        form: [
          {
            type: 'dynamicSlot',
            label: '演示视频推流',
            prop: 'demoVideoStream'
          },
          {
            type: 'dynamicSlot',
            label: '报警视频片段',
            prop: 'alarmVideoClip'
          },
          {
            type: 'dynamicSlot',
            label: 'Callback推送',
            prop: 'callbackPush'
          }
        ],
        labelWidth: '140px',
        labelPosition: 'left'
      },
      demoVideoStream: {
        cacheData: [],
        tableData: [

        ],
        pager: {
          layout: 'total, prev, pager, next, jumper',
          pageSizesChoose: [10, 20, 50, 100],
          currentPage: 1,
          pageSizes: 10,
          total: 0
        },
        option: {
          height: 294
        },
        header: [
          {
            width: 120,
            align: 'left',
            fixed: 'right',
            label: '管理',
            type: 'buttonGroup',
            buttonGroup: {
              buttons: [
                {
                  label: '预览',
                  value: 'view',
                  type: 'text'
                },
                {
                  label: '转发',
                  value: 'transmit',
                  type: 'text'
                }
              ]
            }
          },
          {
            minWidth: 130,
            align: 'left',
            label: '算法类型',
            prop: 'algorithmName',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            minWidth: 190,
            align: 'left',
            label: '监控点位名称',
            prop: 'cameraName',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            minWidth: 190,
            align: 'left',
            label: '原始流地址',
            prop: 'streamUrl',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            minWidth: 190,
            align: 'left',
            label: '演示视频推流',
            prop: 'rtmpUrl',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            width: 80,
            align: 'left',
            label: '开启推流',
            prop: 'openPushStatus',
            type: 'switch'
          },
          {
            width: 70,
            align: 'left',
            label: '转发',
            prop: 'forwardLength',
            type: 'span'
          }
        ]
      },

      lastVideoClipValue: {
        minInterval: ''
      },
      alarmVideoClip: {
        class: 'is-block-inner',
        data: {
          grabService: '自动',
          startStatus: null,
          startStatusTip: '(启用后，我们将自动为每个视频片段抓取事件发生前后的视频片段；注意，该功能不能代替完整监控回放)',
          minInterval: '',
          minIntervalTip: '(当同一摄像头的两次/多次报警事件时间相近时，只会抓取第一个事件的关联视频、并共享给相邻事件)',
          recordDuration: {
            left: -15,
            right: 15
          },
          recordDurationText: ''
        },
        form: [
          {
            type: 'spanAssembly',
            label: '抓取服务',
            prop: 'grabService'
          },
          {
            type: 'switchAssembly',
            label: '启动状态',
            disabled: true,
            prop: 'startStatus',
            componentStyle: {
              'vertical-align': 'top',
              width: 'auto',
              height: '32px'
            },
            back: {
              type: 'spanAssembly',
              prop: 'startStatusTip',
              backStyle: {
                width: 'calc(100% - 64px)'
              },
              spanStyle: {
                color: 'rgba(7, 14, 23, 0.55)',
                'line-height': 1.5
              }
            }
          },
          {
            type: 'inputAssembly',
            label: '最小间隔',
            disabled: true,
            prop: 'minInterval',
            size: 'small',
            placeholder: '10 s',
            valueType: 'Number',
            style: {
              width: '144px'
            },
            componentStyle: {
              'vertical-align': 'top'
            },
            back: {
              type: 'spanAssembly',
              prop: 'minIntervalTip',
              backStyle: {
                width: 'calc(100% - 168px)'
              },
              spanStyle: {
                color: 'rgba(7, 14, 23, 0.55)',
                'line-height': 1.5
              }
            }
          },
          {
            type: 'SliderControl',
            label: '录制时长',
            prop: 'recordDuration',
            svg: 'part-video-fill',
            componentStyle: {
              width: 'auto'
            },
            formatTooltip: (value, type) => {
              let calcValue = value
              let result = ''

              if (type === 'left') {
                calcValue = Math.abs(value)

                result = `事件发生前 ${calcValue} 秒`
              } else {
                result = `事件发生后 ${calcValue} 秒`
              }

              return result
            },
            handleChange: (value, type) => {
              this.saveVideoClipDuration(value, type)
            },
            left: {
              disabled: true,
              min: -15,
              max: -5,
              step: 1,
              style: {
                width: '100px'
              }
            },
            right: {
              disabled: true,
              min: 5,
              max: 15,
              step: 1,
              style: {
                width: '100px'
              }
            },
            back: {
              type: 'spanAssembly',
              prop: 'recordDurationText',
              spanStyle: {
                color: 'rgba(7, 14, 23, 0.85)'
              }
            }
          }
        ],
        labelWidth: '80px',
        labelPosition: 'right'
      },

      callbackPush: {
        tableData: [

        ],
        option: {
          height: 294
        },
        header: [
          {
            width: 200,
            align: 'left',
            fixed: 'right',
            label: '操作',
            type: 'buttonGroup',
            buttonGroup: {
              buttons: [
                {
                  label: '编辑',
                  value: 'editCallbackConfig',
                  type: 'text'
                },
                {
                  label: '删除',
                  value: 'removeCallbackConfig',
                  type: 'text',
                  class: 'is-danger',
                  popoverclass: 'is-danger',
                  tip: '请确认是否删除该条Callback推送！',
                  svgIcon: 'warning'
                }
              ]
            }
          },
          {
            minWidth: 240,
            align: 'left',
            label: '推送地址',
            prop: 'url',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            width: 120,
            align: 'left',
            label: '地址状态',
            prop: 'addressStatusName',
            type: 'span',
            class: 'status-mark'
          },
          {
            width: 200,
            align: 'left',
            label: '最新推送状态',
            prop: 'recentStatusName',
            type: 'span',
            class: 'status-mark',
            showOverflowTooltip: true
          },
          {
            width: 160,
            align: 'left',
            label: '推送间隔',
            prop: 'pushInterval',
            type: 'span'
          },
          {
            width: 260,
            align: 'left',
            label: '推送内容',
            prop: 'pushContent',
            type: 'span'
          },
          {
            width: 140,
            align: 'left',
            label: '报警视频片段',
            prop: 'alarmVideoClipStatus',
            type: 'span'
          }
          // {
          //   width: 80,
          //   align: 'left',
          //   label: '过滤规则',
          //   prop: 'filterRule',
          //   type: 'switch'
          // },
        ]
      },
      callbackPushButtons: {
        buttons: [
          {
            label: '新增',
            value: 'addCallbackConfig',
            class: 'small-buttons',
            plain: true
          },
          {
            label: '刷新',
            value: 'refreshCallbackConfig',
            class: 'small-buttons',
            plain: true
          }
        ]
      }
    }
  },
  watch: {
    'alarmVideoClip.data.recordDuration': {
      handler(val) {
        const data = this.alarmVideoClip.data

        data.recordDurationText = `${val.left} 秒 ~ ${val.right} 秒`
      },
      deep: true,
      immediate: true
    },

    'alarmVideoClip.data.startStatus'(val, old) {
      if (old !== null) {
        this.saveVideoStatus(val)
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {

    },
    saveVideoStatus(val) {
      const params = {
        taskId: this.$route.query.id,
        enable: val ? 1 : 0
      }

      task.editVideoClipStatus(params)
        .then(res => {})
        .catch(() => {
          const data = this.alarmVideoClip.data
          data.startStatus = !val
        })
    },
    saveVideoClipInterval() {
      const data = this.alarmVideoClip.data
      const params = {
        taskId: this.$route.query.id,
        interval: data.minInterval,
        before: Math.abs(data.recordDuration.left),
        duration: data.recordDuration.right
      }

      task.editVideoClipConfig(params)
        .then(res => {
          this.lastVideoClipValue.minInterval = data.minInterval
        })
        .catch(() => {
          data.minInterval = this.lastVideoClipValue.minInterval
        })
    },
    saveVideoClipDuration(value, type) {
      const data = this.alarmVideoClip.data
      const params = {
        taskId: this.$route.query.id,
        interval: data.minInterval,
        before: Math.abs(data.recordDuration.left),
        duration: data.recordDuration.right
      }

      task.editVideoClipConfig(params)
        .then(res => {
          this.lastVideoClipValue.recordDuration[type] = data.recordDuration[type]
        })
        .catch(() => {
          data.recordDuration[type] = this.lastVideoClipValue.recordDuration[type]
        })
    }
  }
}
</script>

<style scoped lang="scss">
.open-ability-block {

  .open-ability-inner-table {
    flex: 1;
    padding-bottom: 16px;
    overflow: hidden;

  }

  .open-ability-inner-form {
    flex: 1;
    width: 100%;
    display: flex;
    flex-flow: column;
    overflow: hidden;

    .button-group-container {
      margin-bottom: 16px;
    }
  }
}
</style>
