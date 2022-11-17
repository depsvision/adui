<template>
  <div class="cloud-collaboration-container layout-bg">
    <head-slot v-loading="synchronizeLoading" :component-option="{label:'云边协同服务配置',class: 'is-outer'}" class="inner-layout-bg">
      <form-list :component-option="cloudOption" />
    </head-slot>
    <head-slot v-loading="synchronizeLoading" :component-option="{label:'边缘环境管理',class: 'is-outer'}" class="inner-layout-bg cloud-collaboration-synchronize-status">
      <form-list :component-option="synchronizeStatus">
        <template v-slot:calculateNode>
          <div class="cloud-collaboration-table-block">
            <div class="cloud-collaboration-inner-table">
              <button-group
                :component-option="synchronizeTableButtons"
                class="ai-other-button"
              />
              <form-table
                ref="edgeTable"
                :component-option="calculateNode"
              />
            </div>
          </div>
        </template>
      </form-list>
      <button-group
        :component-option="synchronizeStatusButtons"
      />
    </head-slot>
    <head-slot :component-option="{label:'同步数据',class: 'is-outer'}" class="inner-layout-bg synchronize-data">
      <form-list :component-option="synchronizeData" />
      <el-tabs v-model="activeName" @tab-click="handleClickTab">
        <el-tab-pane label="AI 计算服务" name="aiService" />
        <el-tab-pane label="AI 监控点位" name="aiPoint" />
        <el-tab-pane label="其他地址" name="aiOther" />
      </el-tabs>
      <transition-group name="opacity-show">
        <div v-if="activeName === 'aiService'" key="aiService" class="cloud-collaboration-table-block">
          <div class="cloud-collaboration-inner-table">
            <button-group
              :component-option="aiServiceButtons"
              class="ai-other-button"
            />
            <form-table
              ref="formTable"
              :component-option="aiService"
            />
          </div>
        </div>
        <div v-if="activeName === 'aiPoint'" key="aiPoint" class="cloud-collaboration-table-block">
          <button-group
            :component-option="aiPointButtons"
            class="ai-other-button"
          />
          <span class="form-tip is-warning-tip">
            <svg-icon icon-class="warning" />
            监控点位同步将会经过批处理实现云边协同，如需为每个点位做个性化设置，请前往“AI监控点位”进行编辑
          </span>
          <div class="cloud-collaboration-inner-table">
            <form-table
              ref="formTable"
              :component-option="aiPoint"
            />
          </div>
        </div>
        <div v-if="activeName === 'aiOther'" key="aiOther" class="cloud-collaboration-table-block">
          <div class="cloud-collaboration-inner-table">
            <button-group
              :component-option="aiOtherButtons"
              class="ai-other-button"
            />
            <form-table
              ref="formTable"
              :component-option="aiOther"
            />
          </div>
        </div>
      </transition-group>
    </head-slot>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import index from './Mixins'
import dataJs from './Mixins/data'
import HeadSlot from '@/components/Slot/HeadSlot'
import FormList from '@/components/InnerComponents/FormList'
import FormTable from '@/components/FormTable'
import ButtonGroup from '@/components/Button/ButtonGroup'

export default {
  name: 'CloudCollaboration',
  components: { HeadSlot, FormList, FormTable, ButtonGroup },
  mixins: [index, dataJs],
  props: {},
  data() {
    return {
      activeName: 'aiService',
      synchronizeLoading: false,
      cloudOption: {
        data: {
          ip: '',
          frps: '',
          privilegeToken: ''
        },
        form: [
          {
            type: 'spanAssembly',
            label: '平台IP',
            prop: 'ip',
            class: 'small-buttons'
            // input: false,
            // buttons: {
            //   buttons: [
            //     {
            //       label: '编辑',
            //       value: 'editIp',
            //       plain: true
            //     }
            //   ]
            // }
          },
          {
            type: 'spanAssembly',
            label: 'FRPS端口',
            prop: 'frps',
            class: 'small-buttons'
            // input: false,
            // buttons: {
            //   buttons: [
            //     {
            //       label: '编辑',
            //       value: 'editFrps',
            //       plain: true
            //     }
            //   ]
            // }
          },
          {
            type: 'spanAssembly',
            label: 'Privilege_token',
            prop: 'privilegeToken',
            class: 'small-buttons'
            // input: false,
            // maxlength: 20,
            // buttons: {
            //   buttons: [
            //     {
            //       label: '编辑',
            //       value: 'editToken',
            //       plain: true
            //     }
            //   ]
            // }
          }
        ],
        labelWidth: '140px',
        labelPosition: 'left'
      },
      synchronizeData: {
        data: {
          edgeEnvironment: ''
        },
        form: [
          {
            type: 'selectAssembly',
            label: '边缘环境',
            prop: 'edgeEnvironment',
            size: 'small',
            selectStyle: {
              width: '350px'
            },
            placeholder: '请选择边缘环境',
            option: []
          }
        ],
        labelWidth: '140px',
        labelPosition: 'left'
      },
      synchronizeStatus: {
        data: {
          syncTimeData: null
        },
        form: [
          {
            type: 'spanAssembly',
            label: '最近同步',
            prop: 'syncTimeData'
          },
          {
            type: 'dynamicSlot',
            label: '边缘环境/FRP Manager',
            prop: 'calculateNode'
          }
        ],
        labelWidth: '170px',
        labelPosition: 'left'
      },
      aiService: {
        loading: false,
        tableData: [],
        option: {
          height: 294
        },
        header: [
          {
            width: 120,
            align: 'left',
            label: 'ID',
            prop: 'id',
            type: 'span'
          },
          {
            minWidth: 160,
            align: 'left',
            label: '名称',
            prop: 'name',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            minWidth: 240,
            align: 'left',
            label: '计算节点地址',
            prop: 'ip',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            width: 160,
            align: 'left',
            label: '内网端口',
            prop: 'port',
            type: 'span'
          },
          {
            width: 160,
            align: 'left',
            label: '平台端口',
            prop: 'platPort',
            type: 'span',
            buttonGroup: {
              buttons: [
                {
                  label: '编辑',
                  value: 'editAiServicePlatPort',
                  type: 'text'
                }
              ]
            }
          }
        ]
      },
      aiPoint: {
        loading: false,
        tableData: [],
        option: {
          height: 294
        },
        header: [
          {
            width: 120,
            align: 'left',
            label: '点位ID',
            prop: 'id',
            type: 'span'
          },
          {
            minWidth: 160,
            align: 'left',
            label: '名称',
            prop: 'name',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            minWidth: 240,
            align: 'left',
            label: '内网IP',
            prop: 'ip',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            minWidth: 160,
            align: 'left',
            label: '内网端口',
            prop: 'port',
            type: 'span'
          },
          {
            minWidth: 160,
            align: 'left',
            label: '平台端口',
            prop: 'platPort',
            type: 'span',
            buttonGroup: {
              buttons: [
                {
                  label: '编辑',
                  value: 'editAiPointPlatPort',
                  type: 'text'
                }
              ]
            }
          }
        ]
      },
      aiOther: {
        loading: false,
        tableData: [],
        option: {
          height: 294
        },
        header: [
          {
            width: 120,
            align: 'left',
            fixed: 'right',
            label: '操作',
            type: 'buttonGroup',
            buttonGroup: {
              buttons: [
                {
                  label: '编辑',
                  value: 'editAiOther',
                  type: 'text'
                },
                {
                  label: '删除',
                  value: 'deleteAiOther',
                  type: 'text',
                  popoverclass: 'is-danger',
                  tip: '请确认是否删除该地址?',
                  svgIcon: 'warning'
                }
              ]
            }
          },
          {
            minWidth: 120,
            align: 'left',
            label: '名称',
            prop: 'name',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            minWidth: 240,
            align: 'left',
            label: '内网IP',
            prop: 'ip',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            minWidth: 110,
            align: 'left',
            label: '内网端口',
            prop: 'port',
            type: 'span'
          },
          {
            minWidth: 140,
            align: 'left',
            label: '平台端口(随机)',
            prop: 'platPort',
            type: 'span'
          }
        ]
      },
      aiServiceButtons: {
        buttons: [
          {
            label: '增加协同节点',
            value: 'addAiService',
            class: 'small-buttons',
            plain: true
          }
        ]
      },
      aiPointButtons: {
        buttons: [
          {
            label: '增加协同监控点位',
            value: 'addAiPoint',
            class: 'small-buttons',
            plain: true
          }
        ]
      },
      aiOtherButtons: {
        buttons: [
          {
            label: '新增',
            value: 'addAiOther',
            class: 'small-buttons',
            plain: true
          }
        ]
      },
      calculateNode: {
        tableData: [],
        option: {
          height: 294
        },
        header: [
          {
            width: 120,
            align: 'left',
            fixed: 'right',
            label: '操作',
            type: 'buttonGroup',
            buttonGroup: {
              buttons: [
                {
                  label: '编辑',
                  value: 'editSynchronize',
                  type: 'text'
                },
                {
                  label: '删除',
                  value: 'deleteSynchronize',
                  type: 'text',
                  popoverclass: 'is-danger',
                  tip: '请确认是否删除该环境?',
                  svgIcon: 'warning'
                }
              ]
            }
          },
          {
            width: 80,
            align: 'left',
            label: 'id',
            prop: 'id',
            type: 'span'
          },
          {
            minWidth: 140,
            align: 'left',
            label: '节点名称',
            prop: 'name',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            minWidth: 140,
            align: 'left',
            label: 'ip',
            prop: 'ip',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            width: 100,
            align: 'left',
            label: '端口',
            prop: 'port',
            type: 'span'
          },
          {
            width: 100,
            align: 'left',
            label: '平台端口',
            prop: 'platPort',
            type: 'span'
          },
          {
            width: 100,
            align: 'left',
            label: '在线状态',
            prop: 'onlineStatus',
            type: 'span',
            class: 'status-mark'
          },
          {
            width: 140,
            align: 'left',
            label: '同步状态',
            prop: 'synchronizeStatus',
            type: 'span'
          }
        ]
      },
      synchronizeTableButtons: {
        buttons: [
          {
            label: '新增',
            value: 'showSynchronize',
            class: 'small-buttons',
            plain: true
          }
        ]
      },
      synchronizeStatusButtons: {
        buttons: [
          {
            label: '刷新',
            value: 'refreshEdge',
            class: 'small-buttons',
            plain: true
          },
          {
            label: '立即同步至边缘端',
            value: 'synchronizeEdge',
            class: 'small-buttons',
            type: 'primary',
            loading: false
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'elementSize'
    ])
  },
  watch: {

  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getCloudConfig()
    }
  }
}
</script>

<style scoped lang="scss">
.cloud-collaboration-container {
  height: auto;
  width: 100%;

  .cloud-collaboration-synchronize-status {

    ::v-deep .head-slot-body {
      flex-flow: column;

      .form-list-container {
        margin-bottom: 16px;
      }
    }
  }

  .synchronize-data {
    ::v-deep .head-slot-body {
      flex-flow: column;

      .form-list-container {
        margin-bottom: 16px;
      }

      .el-tabs {

        .el-tabs__header {
          margin-bottom: 16px;
        }

        .el-tabs__nav-wrap::after {
          height: 1px;
          background-color: #DAE3F0;
        }

        .el-tabs__active-bar {
          background-color: rgba(24, 114, 240, 1);
        }

        .el-tabs__item {
          height: 30px;
          line-height: 1;
          color: rgba(14, 27, 46, 0.65);
          padding: 0 24px 16px 24px;

          &:nth-child(2) {
            padding-left: 0;
          }

          &:last-child {
            padding-right: 0;
          }

          &.is-active {
            color: rgba(14, 27, 46, 0.85);
            font-weight: 600;
          }
        }
      }
    }
  }

  .cloud-collaboration-table-block {
    width: 100%;

    .ai-other-button {
      margin-bottom: 16px;
    }
  }
}
</style>
