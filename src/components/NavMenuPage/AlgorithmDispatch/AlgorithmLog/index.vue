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
          label: '???????????????',
          value: 'video'
        },
        {
          label: '????????????',
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
              label: '??????',
              value: 'search',
              class: 'is-black',
              type: 'text'
            },
            {
              label: '??????',
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
          label: '??????',
          prop: 'keyword',
          width: 250,
          placeholder: '??????ID/??????ID/?????????'
        },
        {
          type: 'input',
          label: '??????ID',
          prop: 'cameraId',
          width: 140,
          placeholder: '??????ID'
        },
        {
          type: 'select',
          label: '????????????',
          prop: 'alertType',
          width: 140,
          placeholder: '?????????',
          option: []
        },
        {
          type: 'datePicker',
          label: '????????????',
          prop: 'date',
          data: 'datetimerange',
          width: 400,
          startPlaceholder: '????????????',
          endPlaceholder: '????????????',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now()
            },
            shortcuts: [{
              text: '????????????',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              }
            }, {
              text: '???????????????',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              }
            }, {
              text: '???????????????',
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
          label: '??????',
          prop: 'keyword',
          width: 250,
          placeholder: '??????ID/??????ID/?????????'
        },
        {
          type: 'input',
          label: '??????ID',
          prop: 'cameraId',
          width: 140,
          placeholder: '??????ID'
        },
        {
          type: 'select',
          label: '????????????',
          prop: 'alertType',
          width: 140,
          placeholder: '?????????',
          option: []
        },
        {
          type: 'datePicker',
          label: '????????????',
          prop: 'date',
          data: 'datetimerange',
          width: 400,
          startPlaceholder: '????????????',
          endPlaceholder: '????????????',
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now()
            },
            shortcuts: [{
              text: '????????????',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', [start, end])
              }
            }, {
              text: '???????????????',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit('pick', [start, end])
              }
            }, {
              text: '???????????????',
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
            label: '???????????????',
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
              label: '?????????????????????',
              value: 'autoClean',
              svgIconLeft: 'clearing-up-auto',
              class: 'is-black',
              type: 'text'
            },
            {
              label: '????????????',
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
            label: '??????',
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
          label: '??????',
          align: 'left',
          showOverflowTooltip: true
        },
        header: []
      },
      videoTableHead: [
        {
          width: 120,
          align: 'left',
          label: '????????????ID',
          prop: 'taskId',
          type: 'span'
        },
        {
          width: 120,
          align: 'left',
          label: '??????ID',
          prop: 'cameraId',
          type: 'span',
          placeholder: '7877'
        },
        {
          minWidth: 160,
          align: 'left',
          label: '????????????',
          prop: 'cameraName',
          type: 'span',
          showOverflowTooltip: true
        },
        {
          minWidth: 180,
          align: 'left',
          label: '????????????',
          prop: 'associateName',
          type: 'span',
          showOverflowTooltip: true
        },
        {
          minWidth: 180,
          align: 'left',
          label: '????????????',
          prop: 'other',
          type: 'span',
          showOverflowTooltip: true
        },
        {
          minWidth: 80,
          align: 'left',
          label: '??????ID',
          prop: 'alertId',
          type: 'span'
        },
        {
          minWidth: 120,
          align: 'left',
          label: '????????????',
          prop: 'alertType',
          type: 'span',
          showOverflowTooltip: true
        },
        {
          width: 160,
          align: 'left',
          label: '??????',
          prop: 'createdAt',
          type: 'span'
        },
        {
          width: 84,
          align: 'left',
          label: '????????????',
          prop: 'origin',
          type: 'photo'
        },
        {
          width: 80,
          align: 'center',
          label: '????????????',
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
          label: '????????????ID',
          prop: 'taskId',
          type: 'span'
        },
        // {
        //   width: 90,
        //   align: 'left',
        //   label: '??????ID',
        //   prop: 'cameraId',
        //   type: 'span',
        //   placeholder: '7877'
        // },
        {
          minWidth: 120,
          align: 'left',
          label: '??????ID',
          prop: 'alertId',
          type: 'span'
        },
        {
          minWidth: 180,
          align: 'left',
          label: '????????????',
          prop: 'alertType',
          type: 'span',
          showOverflowTooltip: true
        },
        {
          width: 120,
          align: 'left',
          label: '???????????????',
          prop: 'isWarning',
          type: 'span'
        },
        {
          minWidth: 180,
          align: 'left',
          label: '????????????',
          prop: 'associateName',
          type: 'span',
          showOverflowTooltip: true
        },
        {
          minWidth: 180,
          align: 'left',
          label: '????????????',
          prop: 'other',
          type: 'span',
          showOverflowTooltip: true
        },
        {
          minWidth: 120,
          align: 'left',
          label: '????????????',
          prop: 'createdAt',
          type: 'span',
          showOverflowTooltip: true
        },
        {
          width: 84,
          align: 'left',
          label: '????????????',
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
