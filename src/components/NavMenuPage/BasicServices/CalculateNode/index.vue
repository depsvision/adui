<template>
  <div class="calculate-node-container layout-bg">
    <div v-loading="pageLoading" class="loading-mask flex-column-class">
      <div class="calculate-node-head">
        <span class="blue-title">Node 节点</span>
        <button-group
          class="calculate-node-buttons"
          :component-option="buttonGroupOption"
        />
        <warning-content
          v-show="false"
          class="license-warning"
          content="license用量已超出, 部分服务可能无法启动,"
          :buttons="[{
            label: '查看详情',
            value: 'toLicenseSetting',
            type: 'text'
          }]"
          :closeable="true"
        />
      </div>
      <div class="calculate-node-layout" :class="{'flex-center-class':physicalNode.length === 0}">
        <div v-if="physicalNode.length === 0 && !pageLoading" class="no-data">暂无数据</div>
        <div v-for="node in physicalNode" :key="node.data.id" v-loading="node.loading" class="physical-node-item">
          <div class="physical-node-item-block">
            <div class="physical-node-item-info">
              <descriptions :component-option="node" />
            </div>
            <div class="physical-node-item-buttons">
              <button-group
                class="small-buttons"
                :component-option="node.leftButtons"
                :scope="node"
              />
            </div>
          </div>
          <div class="service-item-table">
            <form-table
              ref="formTable"
              :component-option="node.tableOption"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonGroup from '@/components/Button/ButtonGroup'
import Descriptions from '@/components/InnerComponents/Descriptions'
import FormTable from '@/components/FormTable'
import WarningContent from '@/components/WarningContent'

import mixins from './Mixins'
import node from './Mixins/node'
import serve from './Mixins/serve'

import healthManage from './Mixins/healthManage'
import healthData from './Mixins/healthData'

export default {
  name: 'CalculateNode',
  components: { FormTable, ButtonGroup, Descriptions, WarningContent },
  mixins: [mixins, node, serve, healthManage, healthData],
  props: {},
  data() {
    return {
      pageLoading: false,
      action: 'add',
      buttonGroupOption: {
        buttons: [
          {
            label: '节点管理',
            value: 'nodeManage',
            svgIconLeft: 'list-todo-line',
            class: 'is-black',
            type: 'text'
          },
          {
            label: '刷新',
            value: 'refreshNode',
            svgIconLeft: 'refresh',
            class: 'is-black',
            type: 'text'
          }
        ]
      },
      physicalNode: [],
      commonServiceTableHeader: [
        {
          width: 156,
          align: 'left',
          fixed: 'right',
          label: '操作',
          type: 'buttonGroup',
          buttonGroup: {
            buttons: [
              {
                label: '编辑',
                value: 'editService',
                type: 'text'
              },
              {
                label: '删除',
                value: 'deleteService',
                type: 'text',
                class: 'is-danger'
              }
            ]
          }
        },
        {
          width: 64,
          align: 'left',
          label: 'ID',
          prop: 'serviceId',
          type: 'span',
          sortable: true,
          sortOrders: ['ascending', 'descending']
        },
        {
          width: 100,
          align: 'left',
          label: '服务类型',
          prop: 'serviceTypeResult',
          type: 'span'
        },
        {
          width: 85,
          align: 'left',
          label: '端口',
          prop: 'servicePort',
          type: 'span',
          placeholder: '7877'
        },
        {
          minWidth: 120,
          align: 'left',
          label: '计算资源',
          prop: 'caisaName',
          type: 'span',
          showOverflowTooltip: true
        },
        {
          minWidth: 120,
          align: 'left',
          label: '关联任务ID',
          prop: 'tasksString',
          type: 'span',
          showOverflowTooltip: true
        },
        {
          width: 140,
          align: 'left',
          label: '服务占用状态',
          prop: 'occupyStatus',
          type: 'span',
          class: 'status-mark',
          showOverflowTooltip: true
        },
        {
          width: 140,
          align: 'left',
          label: '服务运行状态',
          prop: 'runStatus',
          type: 'span',
          class: 'status-mark'
        },
        {
          width: 140,
          align: 'left',
          label: '服务健康状态',
          prop: 'healthStatus',
          type: 'span',
          class: 'status-mark',
          buttonGroup: {
            buttons: [
              {
                label: '详情',
                value: 'getServiceHealthDetail',
                type: 'text'
              }
            ]
          }
        },
        {
          minWidth: 160,
          align: 'left',
          label: '启用算法',
          prop: 'activatedAlgorithm',
          type: 'span',
          tooltip: {
            placement: 'top-start'
          },
          buttonGroup: {
            buttons: [
              {
                label: '修改',
                value: 'changeAlgorithm',
                type: 'text'
              }
            ]
          }
        }
      ],
      commonPhysicalNodeButtons: [
        {
          label: '新增服务',
          value: 'addService',
          svgIconLeft: 'plus',
          plain: true
        },
        {
          label: '健康管理',
          value: 'healthManage',
          svgIconLeft: 'healthy-line',
          class: 'is-black',
          plain: true
        },
        {
          label: '重启所有服务',
          value: 'restartAllService',
          svgIconLeft: 'run-restart',
          class: 'is-alter-red',
          plain: true
        },
        {
          label: '重启节点',
          value: 'restartNode',
          svgIconLeft: 'run-restart',
          class: 'is-alter-red',
          plain: true
        }
        // {
        //   label: '刷新服务',
        //   value: 'refreshService',
        //   plain: true
        // }
      ],
      commonPhysicalNodeForm: [
        {
          label: '节点名称',
          prop: 'name',
          type: 'spanAssembly'
        },
        {
          label: 'IP',
          prop: 'ip',
          type: 'spanAssembly'
        },
        {
          label: 'Flight port',
          prop: 'port',
          type: 'spanAssembly'
        },
        {
          label: 'Flight 状态',
          prop: 'NMStatus',
          type: 'spanAssembly',
          class: 'status-mark'
        },
        {
          label: '云边协同',
          prop: 'platPort',
          type: 'spanAssembly',
          class: 'status-mark'
        }
      ]
    }
  },
  mounted() {
    console.log(234233)
    this.init()
  },
  beforeDestroy() {
    if (this.nodeTimer) {
      clearInterval(this.nodeTimer)

      this.nodeTimer = null
    }
  },
  methods: {
    init() {

      this.getNodeData()

      if (!this.nodeTimer) {
        this.nodeTimer = setInterval(() => {
          this.getNodeData(true)
        }, 6000)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.calculate-node-container {
  display: flex;
  flex-flow: column;

  .calculate-node-head {
    display: flex;
    margin-bottom: 16px;

    .blue-title {
      display: flex;
      font-size: 16px;
      color: rgba(14, 27, 46, 1);
      font-weight: 600;
      line-height: 24px;
      margin-right: 50px;
    }

    .license-warning {
      margin-left: 16px
    }
  }

  .calculate-node-layout{
    flex: 1;

    .no-data {
      font-size: 14px;
      color: rgba(14, 27, 46, .5);
    }

    .physical-node-item {
      display: flex;
      flex-flow: column;
      height: 418px;
      background-color: #fff;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;

      &:last-of-type {
        margin-bottom: 40px;
      }

      .physical-node-item-block {
        display: flex;
        justify-content: space-between;
        background-color: #F5F7FA;
        border-radius: 4px;
        padding: 16px;
        margin-bottom: 16px;

        .physical-node-item-info {

          :deep( .el-form-item ) {
            margin-bottom: 0;

            .el-form-item__label {
              line-height: 14px;
              color: rgba(14, 27, 46, .5);
              padding-right: 24px;
            }

            .el-form-item__content {
              line-height: 14px;
              margin-bottom: 16px;
            }

            &:last-of-type {
              .el-form-item__content {
                margin-bottom: 0;
              }
            }

            .svg-run-restart {
              color: rgba(24, 114, 240, 1);
            }
          }
        }

        .physical-node-item-buttons {
          display: flex;
          justify-content: space-between;

          :deep( .point-drop-down-container ) {

            .el-dropdown-link {
              font-size: 20px;
              line-height: 20px;
              padding: 6px;
            }
          }
        }
      }

      .service-item-table {
        flex: 1;
        overflow: hidden;

        :deep( .el-table__fixed-body-wrapper ) {
          z-index: 0;
        }
      }
    }
  }

}

@media screen and (max-width: 1440px) {
  .calculate-node-container {

    .calculate-node-layout {

      .physical-node-item {

        .physical-node-item-block {
          flex-flow: column;

          .physical-node-item-info {
            margin-bottom: 24px;
          }
        }
      }
    }
  }
}
</style>
