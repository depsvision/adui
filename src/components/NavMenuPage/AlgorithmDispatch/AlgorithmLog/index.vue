<template>
  <div v-loading="pageLoading" class="algorithm-log-container layout-bg">
    <div class="algorithm-log-head-block">
      <div class="algorithm-log-head-tab">
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
      <cache-clear :component-option="cacheClearOption" />
    </div>
    <div class="algorithm-log-layout common-tablebox-layout">
      <div class="algorithm-log-buttons common-tablebox--top_button-group">
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
      <div class="algorithm-log-table common-tablebox-table">
        <form-table
          ref="formTable"
          :component-option="algorithmLogOption"
        />
      </div>
      <div class="algorithm-log-pager common-tablebox-pager">
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
</template>

<script>
import SearchCondition from '@/components/SearchCondition'
import CacheClear from '@/components/AreaComponents/CacheClear'
import ButtonGroup from '@/components/Button/ButtonGroup'
import FormTable from '@/components/FormTable'
import mixins from './Mixins'

export default {
  name: 'AlgorithmLog',
  components: { SearchCondition, FormTable, ButtonGroup, CacheClear },
  mixins: [mixins],
  props: {},
  data() {
    return {
      pageLoading: false,
      activeTab: 'video',
      tabList: [
        {
          label: '视频流分析',
          value: 'video'
        },
        {
          label: '图片分析',
          value: 'picture'
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
      videoSearchForm: [
        {
          type: 'input',
          label: '筛选',
          prop: 'keyword',
          width: 250,
          placeholder: '任务ID/点位ID/流地址'
        },
        {
          type: 'input',
          label: '点位ID',
          prop: 'cameraId',
          width: 140,
          placeholder: '点位ID'
        },
        {
          type: 'select',
          label: '异常类型',
          prop: 'alertType',
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
      pictureSearchForm: [
        {
          type: 'input',
          label: '筛选',
          prop: 'keyword',
          width: 250,
          placeholder: '任务ID/点位ID/流地址'
        },
        {
          type: 'input',
          label: '点位ID',
          prop: 'cameraId',
          width: 140,
          placeholder: '点位ID'
        },
        {
          type: 'select',
          label: '识别算法',
          prop: 'alertType',
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
      cacheClearOption: {
        info: [
          {
            label: '空间占用：',
            style: {
              'margin-right': '8px'
            }
          },
          {
            label: '250GB',
            style: {
              'margin-right': '4px',
              'font-weight': 600
            }
          },
          {
            label: '/ 1992GB',
            style: {
              color: 'rgba(14, 27, 46, .5)',
              'margin-right': '24px'
            }
          }
        ],
        circle: {
          width: 24,
          showText: false,
          strokeWidth: 4,
          strokeLinecap: 'butt',
          color: '#1872F0',
          percentage: 0,
          percentageText: '0%'
        },
        buttons: {
          buttons: [
            {
              label: '自动清理未启用',
              value: 'autoClean',
              svgIconLeft: 'clearing-up-auto',
              class: 'is-black',
              type: 'text'
            },
            {
              label: '清理缓存',
              value: 'clear',
              svgIconLeft: 'clearing-up-line',
              class: 'is-black',
              type: 'text'
            }
          ]
        }
      },
      buttonGroupOption: {
        buttons: [
          {
            label: '导出',
            value: 'export',
            plain: true
          }
        ]
      },
      algorithmLogOption: {
        tableData: [],
        imageViewer: {},
        selectionColumn: {
          fixed: 'left',
          width: 30,
          align: 'left'
        },
        indexColumn: {
          fixed: 'left',
          width: 80,
          label: '序号',
          align: 'left',
          showOverflowTooltip: true
        },
        header: []
      },
      videoTableHead: [
        {
          width: 120,
          align: 'left',
          label: '关联任务ID',
          prop: 'taskId',
          type: 'span'
        },
        {
          width: 120,
          align: 'left',
          label: '点位ID',
          prop: 'cameraId',
          type: 'span',
          placeholder: '7877'
        },
        {
          minWidth: 160,
          align: 'left',
          label: '点位名称',
          prop: 'cameraName',
          type: 'span',
          showOverflowTooltip: true
        },
        {
          minWidth: 180,
          align: 'left',
          label: '算法联动',
          prop: 'associateName',
          type: 'span',
          showOverflowTooltip: true
        },
        {
          minWidth: 180,
          align: 'left',
          label: '扩展信息',
          prop: 'other',
          type: 'span',
          showOverflowTooltip: true
        },
        {
          minWidth: 80,
          align: 'left',
          label: '算法ID',
          prop: 'alertId',
          type: 'span'
        },
        {
          minWidth: 120,
          align: 'left',
          label: '异常类型',
          prop: 'alertType',
          type: 'span',
          showOverflowTooltip: true
        },
        {
          width: 160,
          align: 'left',
          label: '时间',
          prop: 'createdAt',
          type: 'span'
        },
        {
          width: 84,
          align: 'left',
          label: '报警截图',
          prop: 'origin',
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
      pictureTableHead: [
        {
          width: 100,
          align: 'left',
          label: '关联任务ID',
          prop: 'taskId',
          type: 'span'
        },
        // {
        //   width: 90,
        //   align: 'left',
        //   label: '点位ID',
        //   prop: 'cameraId',
        //   type: 'span',
        //   placeholder: '7877'
        // },
        {
          minWidth: 120,
          align: 'left',
          label: '算法ID',
          prop: 'alertId',
          type: 'span'
        },
        {
          minWidth: 180,
          align: 'left',
          label: '识别算法',
          prop: 'alertType',
          type: 'span',
          showOverflowTooltip: true
        },
        {
          width: 120,
          align: 'left',
          label: '是否有报警',
          prop: 'isWarning',
          type: 'span'
        },
        {
          minWidth: 180,
          align: 'left',
          label: '算法联动',
          prop: 'associateName',
          type: 'span',
          showOverflowTooltip: true
        },
        {
          minWidth: 180,
          align: 'left',
          label: '扩展信息',
          prop: 'other',
          type: 'span',
          showOverflowTooltip: true
        },
        {
          minWidth: 120,
          align: 'left',
          label: '输入时间',
          prop: 'createdAt',
          type: 'span',
          showOverflowTooltip: true
        },
        {
          width: 84,
          align: 'left',
          label: '报警截图',
          prop: 'origin',
          type: 'photo'
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
        if (val === 'video') {
          this.searchConditionOption.form = this.videoSearchForm
          this.algorithmLogOption.header = this.videoTableHead
          this.tablePagerOption.currentPage = 1
        } else {
          this.searchConditionOption.form = this.pictureSearchForm
          this.algorithmLogOption.header = this.pictureTableHead
          this.tablePagerOption.currentPage = 1
        }

        this.$refs.formTable && (this.$refs.formTable.reRenderTable = String(Date.now()))

        this.initTaskData()
      },
      immediate: true
    }
  },
  methods: {
    async initTaskData() {
      await this.getTaskSubData()

      if (this.activeTab === 'video') {
        this.searchAlgorithmLog()
      } else if (this.activeTab === 'picture') {
        this.getLogData()
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
.algorithm-log-container {
  display: flex;
  flex-flow: column;

  .algorithm-log-head-block {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;

    .algorithm-log-head-tab {
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

    .cache-clear-container{
      background-color: #fff;
      border-radius: 8px;
      padding: 12px 24px;
    }
  }

  .search-info-layout {
    flex: 1;
    margin-right: 36px;
  }

  .algorithm-log-layout{
    flex: 1;

    .algorithm-log-buttons {
      display: flex;
      justify-content: space-between;
    }
  }

}
</style>
