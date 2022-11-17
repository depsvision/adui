<template>
  <div class="push-log-container layout-bg">
    <div class="flex-column-class auto-flex-1">
      <div class="push-log-head-block">
        <div class="push-log-head-tab">
          <span
            v-for="tab in tabList"
            :key="tab.label"
            class="tab-item"
            :class="[activeTab === tab.value?'is-active':'']"
            @click="changeTab(tab)"
          >
            {{ tab.label }}
          </span>
        </div>
      </div>
      <div v-loading="pageLoading" class="push-log-layout common-tablebox-layout">
        <div class="push-log-buttons common-tablebox--top_button-group">
          <div class="search-info-layout">
            <search-condition
              :component-option="searchConditionOption"
            />
          </div>
          <button-group
            ref="buttonGroup"
            :component-option="buttonGroupOption"
          />
        </div>
        <div class="push-log-table common-tablebox-table">
          <form-table
            ref="formTable"
            :component-option="algorithmLogOption"
          />
        </div>
        <div class="push-log-pager common-tablebox-pager">
          <el-pagination
            :current-page="tablePagerOption.currentPage"
            :page-sizes="tablePagerOption.pageSizesChoose"
            :page-size.sync="tablePagerOption.pageSizes"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tablePagerOption.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            @prev-click="handlePrevClick"
            @next-click="handleNextClick"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchCondition from '@/components/SearchCondition'
import ButtonGroup from '@/components/Button/ButtonGroup'
import FormTable from '@/components/FormTable'
import mixins from './Mixins'
import { deepClone } from '@/utils'
import callback from '@/api/callback'

export default {
  name: 'PushLog',
  components: { SearchCondition, FormTable, ButtonGroup },
  mixins: [mixins],
  props: {},
  data() {
    return {
      pageLoading: false,
      activeTab: 'callback',
      tabList: [
        {
          label: 'callback日志',
          value: 'callback'
        },
        {
          label: '邮件日志',
          value: 'mail'
        }
      ],
      searchConditionOption: {
        fixed: true,
        data: {},
        form: [],
        buttons: {
          buttons: [
            {
              label: '搜索',
              value: 'search',
              class: 'is-black',
              type: 'text'
            },
            {
              label: '重置',
              value: 'reset',
              class: 'is-black',
              type: 'text'
            }
          ]
        },
        labelWidth: 'auto'
      },
      commonSearchForm: [
        {
          type: 'input',
          label: '筛选',
          prop: 'keyword',
          width: 250,
          placeholder: '任务ID/点位ID/流地址'
        },
        {
          type: 'select',
          label: '异常类型',
          prop: 'type',
          width: 140,
          placeholder: '请选择',
          option: []
        },
        {
          type: 'datePicker',
          label: '时间范围',
          prop: 'date',
          data: 'datetimerange',
          width: 400,
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now()
            },
            shortcuts: [{
              text: '最近一周',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              }
            }, {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                picker.$emit('pick', [start, end])
              }
            }]
          }
        }
      ],
      callbackSearchForm: [],
      mailSearchForm: [
        // {
        //   type: 'input',
        //   label: '筛选',
        //   prop: 'keyword',
        //   width: 250,
        //   placeholder: '关联任务ID'
        // },
        {
          type: 'datePicker',
          label: '时间范围',
          prop: 'date',
          data: 'datetimerange',
          width: 400,
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now()
            },
            shortcuts: [{
              text: '最近一周',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              }
            }, {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                picker.$emit('pick', [start, end])
              }
            }]
          }
        }
      ],
      cloudSearchForm: [],
      buttonGroupOption: {
        buttons: [
          {
            label: '导出',
            value: 'export',
            plain: true,
            disabled: false,
            hide: false
          }
        ]
      },
      algorithmLogOption: {
        tableData: [],
        indexColumn: {
          fixed: 'left',
          width: 90,
          label: '序号',
          align: 'left',
          showOverflowTooltip: true
        },
        header: []
      },
      callbackTableHead: [
        {
          minWidth: 90,
          align: 'left',
          label: '关联任务ID',
          prop: 'taskId',
          showOverflowTooltip: true,
          type: 'span'
        },
        {
          minWidth: 160,
          align: 'left',
          label: 'Callback地址',
          prop: 'callbackUrl',
          type: 'span',
          showOverflowTooltip: true
        },
        {
          minWidth: 80,
          align: 'left',
          label: '点位ID',
          prop: 'cameraId',
          type: 'span'
        },
        {
          minWidth: 90,
          align: 'left',
          label: '异常类型',
          prop: 'alertType',
          type: 'span'
        },
        {
          minWidth: 160,
          align: 'left',
          label: '扩展信息',
          prop: 'other',
          type: 'span',
          showOverflowTooltip: true
        },
        {
          width: 160,
          align: 'left',
          label: '时间',
          prop: 'pushTime',
          type: 'span'
        },
        {
          minWidth: 80,
          align: 'left',
          label: '推送结果',
          prop: 'resultData',
          type: 'span',
          class: 'font-color'
        },
        {
          width: 90,
          align: 'left',
          label: '报警截图',
          prop: 'picture',
          type: 'photo'
        },
        {
          width: 80,
          align: 'center',
          label: '录制片段',
          prop: 'videoString',
          type: 'span',
          blockStyle: {
            'justify-content': 'center'
          },
          buttonStyle: {
            'margin-left': 0
          },
          buttonGroup: {
            buttons: [
              {
                value: 'videoClip',
                svgIconLeft: 'part-video-line',
                type: 'text',
                class: 'is-grey',
                fontSize: 20
              }
            ]
          }
        }
      ],
      mailTableHead: [
        {
          width: 140,
          align: 'left',
          fixed: 'right',
          label: '操作',
          type: 'buttonGroup',
          buttonGroup: {
            buttons: [
              {
                label: '预览',
                value: 'viewMail',
                type: 'text'
              }
              // {
              //   label: '重新推送',
              //   value: 'rePush',
              //   type: 'text'
              // }
            ]
          }
        },
        {
          minWidth: 180,
          align: 'left',
          label: '关联任务ID',
          prop: 'taskId',
          type: 'span'
        },
        {
          minWidth: 420,
          align: 'left',
          label: '邮箱地址',
          prop: 'address',
          is: 'TagAssembly',
          tooltip: {
            placement: 'top-start'
          }
        },
        {
          minWidth: 210,
          align: 'left',
          label: '推送时间',
          prop: 'pushTime',
          type: 'span',
          showOverflowTooltip: true
        },
        {
          width: 140,
          align: 'left',
          label: '推送结果',
          prop: 'resultData',
          type: 'span',
          class: 'font-color'
        }
      ],
      cloudTableHead: [
        {
          minWidth: 90,
          align: 'left',
          label: '关联任务ID',
          prop: 'taskId',
          showOverflowTooltip: true,
          type: 'span'
        },
        {
          minWidth: 80,
          align: 'left',
          label: '点位ID',
          prop: 'cameraId',
          type: 'span'
        },
        {
          minWidth: 90,
          align: 'left',
          label: '平台算法ID',
          prop: 'algorithmId',
          type: 'span'
        },
        {
          minWidth: 90,
          align: 'left',
          label: '输出报警ID',
          prop: 'alarmId',
          type: 'span'
        },
        {
          minWidth: 180,
          align: 'left',
          label: '输出告警 MAC',
          prop: 'deviceMac',
          type: 'span',
          showOverflowTooltip: true
        },
        {
          minWidth: 180,
          align: 'left',
          label: '输出告警设备 CUEI',
          prop: 'deviceCuei',
          type: 'span',
          showOverflowTooltip: true
        },
        {
          minWidth: 160,
          align: 'left',
          label: '输出告警时间',
          prop: 'alarmTime',
          type: 'span'
        },
        {
          minWidth: 160,
          align: 'left',
          label: '输出告警结束时间',
          prop: 'endAlarmTime',
          type: 'span'
        },
        {
          minWidth: 120,
          align: 'left',
          label: '输出营业状态',
          prop: 'businessStatusString',
          type: 'span',
          class: 'font-color'
        },
        {
          minWidth: 90,
          align: 'left',
          label: '推送结果',
          prop: 'pushStatusString',
          type: 'span',
          class: 'font-color'
        },
        {
          width: 90,
          align: 'left',
          label: '报警截图',
          prop: 'picture',
          type: 'photo'
        }
      ],
      oilTableHead: [
        {
          minWidth: 90,
          align: 'left',
          label: '关联任务ID',
          prop: 'taskId',
          showOverflowTooltip: true,
          type: 'span'
        },
        {
          minWidth: 80,
          align: 'left',
          label: '点位ID',
          prop: 'cameraId',
          type: 'span'
        },
        {
          minWidth: 90,
          align: 'left',
          label: '平台算法ID',
          prop: 'algorithmId',
          type: 'span'
        },
        {
          minWidth: 90,
          align: 'left',
          label: '输出报警ID',
          prop: 'alarmId',
          type: 'span'
        },
        {
          minWidth: 180,
          align: 'left',
          label: '输出报警类型',
          prop: 'alarmTypeName',
          type: 'span',
          showOverflowTooltip: true
        },
        {
          width: 120,
          align: 'left',
          label: '输出报警动作',
          prop: 'alarmActionString',
          type: 'span'
        },
        {
          minWidth: 180,
          align: 'left',
          label: '输出视频智能分析编码',
          prop: 'videoInteAnalysisCode',
          type: 'span',
          showOverflowTooltip: true
        },
        {
          minWidth: 180,
          align: 'left',
          label: '输出设备国标通道',
          prop: 'channelCode',
          type: 'span',
          showOverflowTooltip: true
        },
        {
          width: 160,
          align: 'left',
          label: '输出告警时间',
          prop: 'alarmTime',
          type: 'span'
        },
        {
          width: 160,
          align: 'left',
          label: '输出销警时间',
          prop: 'eliminateAlarmTime',
          type: 'span'
        },
        {
          width: 90,
          align: 'left',
          label: '推送结果',
          prop: 'pushStatusString',
          type: 'span',
          class: 'font-color'
        },
        {
          width: 90,
          align: 'left',
          label: '报警图片',
          prop: 'alarmPictureUrl',
          type: 'photo',
          imgKey: 'alarmPictureUrl'
        },
        {
          width: 90,
          align: 'left',
          label: '销警图片',
          prop: 'eliminateAlarmPictureUrl',
          type: 'photo',
          imgKey: 'eliminateAlarmPictureUrl'
        },
        {
          width: 90,
          align: 'left',
          label: '手动销警',
          prop: 'revokeAlarm',
          type: 'span',
          class: 'font-color',
          buttonGroup: {
            buttons: [
              {
                label: '手动销警',
                value: 'revokeAlarm',
                type: 'text',
                left: 0
              }
            ]
          },
          buttonStyle: {
            'margin-left': 0
          }
        }
      ],
      tablePagerOption: {
        pageSizesChoose: [10, 20, 50, 100],
        currentPage: 1,
        pageSizes: 10,
        total: 0
      }
    }
  },
  watch: {
    activeTab: {
      handler(val) {
        this.tablePagerOption.currentPage = 1
        this.pageLoading = true

        if (val === 'callback') {
          this.callbackSearchForm = deepClone(this.commonSearchForm)
          this.searchConditionOption.form = this.callbackSearchForm
          this.algorithmLogOption.header = this.callbackTableHead
          this.$set(this.algorithmLogOption, 'selectionColumn', {
            fixed: 'left',
            width: 30,
            align: 'left'
          })
          this.buttonGroupOption.buttons[0].hide = false
        } else if (val === 'mail') {
          this.searchConditionOption.form = this.mailSearchForm
          this.algorithmLogOption.header = this.mailTableHead
          this.algorithmLogOption.selectionColumn = null
          this.buttonGroupOption.buttons[0].hide = true
        } else if (val === 'cloud') {
          this.cloudSearchForm = deepClone(this.commonSearchForm)
          this.searchConditionOption.form = this.cloudSearchForm
          this.algorithmLogOption.header = this.cloudTableHead
          this.algorithmLogOption.selectionColumn = null
          this.buttonGroupOption.buttons[0].hide = true
        } else if (val === 'oil') {
          this.cloudSearchForm = deepClone(this.commonSearchForm)
          this.searchConditionOption.form = this.cloudSearchForm
          this.algorithmLogOption.header = this.oilTableHead
          this.algorithmLogOption.selectionColumn = null
          this.buttonGroupOption.buttons[0].hide = true
        }

        this.$refs.formTable && (this.$refs.formTable.reRenderTable = String(Date.now()))

        this.initTaskData()
      },
      immediate: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      await this.getCloudAlarmOpen()

      await this.getOilAlarmOpen()
    },
    getCloudAlarmOpen() {
      return new Promise(resolve => {
        callback.getCloudAlarmOpen(true)
          .then(res => {
            const { is_open_shuadh_alarm } = res.data

            if (is_open_shuadh_alarm) {
              this.tabList.push(
                {
                  label: '智慧云厅',
                  value: 'cloud'
                }
              )
            }

            resolve(true)
          })
          .catch(() => {
            resolve(false)
          })
      })
    },
    getOilAlarmOpen() {
      return new Promise(resolve => {
        callback.getOilAlarmOpen(true)
          .then(res => {
            const { is_open_oil_alarm } = res.data

            if (is_open_oil_alarm) {
              this.tabList.push(
                {
                  label: '加油站',
                  value: 'oil'
                }
              )
            }

            resolve(true)
          })
          .catch(() => {
            resolve(false)
          })
      })
    },

    async initTaskData() {
      await this.getTaskSubData()

      if (this.activeTab === 'callback') {
        this.getPushLogData()
      } else if (this.activeTab === 'mail') {
        this.getMailLogData()
        this.setChartOption()
      } else if (this.activeTab === 'cloud') {
        this.getCloudLogData()
      } else if (this.activeTab === 'oil') {
        this.getOilLogData()
      }
    },
    changeTab(tab) {
      this.activeTab = tab.value
    },
    handleSizeChange(size) {
      this.tablePagerOption.pageSizes = size
      this.dealSearchCondition()
    },
    handleCurrentChange(page) {
      this.tablePagerOption.currentPage = page
      this.dealSearchCondition()
    },
    handlePrevClick(page) {
      this.tablePagerOption.currentPage = page
      this.dealSearchCondition()
    },
    handleNextClick(page) {
      this.tablePagerOption.currentPage = page
      this.dealSearchCondition()
    }
  }
}
</script>

<style scoped lang="scss">
.push-log-container {
  display: flex;
  flex-flow: column;

  .push-log-head-block {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;

    .push-log-head-tab {
      display: flex;
      background-color: #fff;
      border-radius: 8px;
      padding: 6px;

      .tab-item {
        font-size: 14px;
        color: rgba(7, 14, 23, 0.85);
        border-radius: 5px;
        padding: 11px 12px;
        margin-right: 6px;

        &:last-of-type {
          margin-right: 0;
        }

        &:hover {
          background-color: rgba(0, 106, 255, .05);
          cursor: pointer;
        }

        &.is-active {
          color: #fff;
          background-color: rgba(0, 106, 255, 1);
        }
      }
    }
  }

  .search-info-layout {
    flex: 1;
    margin-right: 36px;
  }

  .push-log-layout{
    flex: 1;

    .push-log-buttons {
      display: flex;
      justify-content: flex-end;
    }
  }

}
</style>
