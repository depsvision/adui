<template>
  <div class="ai-monitoring-point-container layout-bg display-flex-class">
    <div v-loading="treeLoading" class="monitor-point-tree-block display-flex-class">
      <div class="tree-top-block">
        <span class="tree-top-title">所有点位</span>
        <button-group
          :component-option="treeTopButton"
        />
      </div>
      <div class="tree-main-block">
        <common-tree
          ref="commonTree"
          :component-option="treeOption"
          @handleEvent="treeEvent"
        />
      </div>
    </div>
    <div v-loading="tableLoading" class="monitor-point-block common-tablebox-layout">
      <div class="common-tablebox-title blue-title">
        <span>{{ currentNode?currentNode.label:'全部' }}</span>
      </div>
      <div class="monitor-point-buttons common-tablebox--top_button-group">
        <div class="common-tablebox-search">
          <span class="search-input">
            <el-input v-model.trim="searchValue" :size="elementSize" placeholder="名称/流地址/连接状态" clearable @keyup.enter.native="searchCameras(true)">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="searchCameras(true)" />
            </el-input>
          </span>
        </div>
        <button-group
          :component-option="dividerButtonData"
        />
      </div>
      <div class="monitor-point-table common-tablebox-table">
        <form-table
          ref="formTable"
          :component-option="AiMonitoringPointOption"
          @handleTableEvent="handleTableEvent"
        />
      </div>
      <div class="monitor-point-pager common-tablebox-pager">
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
    <common-upload v-show="false" :component-option="uploadOption" @handleUploadStatus="handleUploadStatus">
      <el-button ref="upload">上传图片</el-button>
    </common-upload>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import tree from './Mixins/tree'
import index from './Mixins'
import CommonTree from '@/components/Tree/CommonTree'
import ButtonGroup from '@/components/Button/ButtonGroup'
import FormTable from '@/components/FormTable'
import CommonUpload from '@/components/Upload/CommonUpload'

export default {
  name: 'AiMonitoringPoint',
  components: { CommonTree, FormTable, ButtonGroup, CommonUpload },
  mixins: [index, tree],
  props: {},
  data() {
    return {
      treeLoading: false,
      tableLoading: false,
      searchValue: '',
      pageLoading: false,
      treeOption: {
        data: [],
        headSvg: {
          default: 'file-1-line',
          isActive: 'file-1-line'
        },
        slotScope: true,
        totalNum: false,
        draggable: true,
        expandOnClickNode: false,
        highlightCurrent: true,
        currentNode: 0,
        maxLevel: 7,
        tooltip: {
          placement: 'top-start',
          enterable: false
        },
        disabledDrop: [
          {
            key: 0,
            type: ['prev', 'next'] // ['prev','inner', 'next']
          },
          {
            key: -1,
            type: ['prev', 'inner'] // ['prev','inner', 'next']
          }
        ],
        disabledDrag: [0, -1],
        nodeKey: 'groupId',
        expandedKeys: [0],
        iconOption: true,
        append: {
          type: 'except',
          arr: [-1]
        },
        edit: {
          type: 'except',
          arr: [0, -1]
        },
        delete: {
          type: 'except',
          arr: [0, -1]
        },
        refresh: (node) => { this.refreshNode(node) }
      },
      treeTopButton: {
        buttons: [
          {
            label: '视频源管理',
            value: 'videoSourceSetting',
            type: 'text',
            class: 'is-black',
            svgIconLeft: 'setup-line'
          }
        ]
      },
      dividerButtonData: {
        buttons: []
      },
      dividerButtonsCache: [
        {
          label: '新增点位',
          value: 'new',
          type: 'text',
          class: 'is-black',
          svgIconLeft: 'plus'
        },
        {
          label: '刷新',
          value: 'refresh',
          svgIconLeft: 'refresh',
          type: 'text',
          class: 'is-black'
        },
        {
          label: '导入',
          value: 'import',
          type: 'text',
          class: 'is-black'
        },
        {
          label: '导出',
          value: 'export',
          type: 'text',
          class: 'is-black',
          disabled: true
        },
        {
          label: '删除',
          value: 'delete',
          type: 'text',
          class: 'is-danger',
          disabled: true
        }
      ],
      AiMonitoringPointOption: {
        tableData: [],
        selectionColumn: {},
        header: [
          {
            width: 230,
            align: 'left',
            label: '操作',
            fixed: 'right',
            type: 'span',
            buttonGroup: {
              buttons: []
            }
          },
          {
            width: 80,
            align: 'left',
            label: 'ID',
            prop: 'id',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            minWidth: 120,
            align: 'left',
            label: '外键',
            prop: 'fk',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            minWidth: 120,
            align: 'left',
            label: '设备类型',
            prop: 'typeString',
            type: 'span',
            hide: false,
            showOverflowTooltip: true
          },
          {
            minWidth: 100,
            align: 'left',
            label: '名称',
            prop: 'name',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            minWidth: 140,
            align: 'left',
            label: '流地址',
            prop: 'streamUrlString',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            width: 80,
            align: 'left',
            label: '连接状态',
            prop: 'statusName',
            class: 'status-mark',
            type: 'span'
          },
          {
            width: 110,
            align: 'left',
            label: '过滤图片',
            prop: 'filterString',
            spanStyle: {
              width: '25px'
            },
            type: 'span',
            buttonGroup: {
              buttons: [
                {
                  label: '设置',
                  value: 'openFilterImg',
                  type: 'primary'
                }
              ]
            }
          },
          {
            width: 90,
            align: 'left',
            label: '初始化图片',
            prop: 'initPicture',
            class: 'table-inner-picture',
            type: 'photo',
            showOverflowTooltip: true
          }
        ]
      },
      tablePagerOption: {
        pageSizesChoose: [10, 20, 50, 100],
        currentPage: 1,
        pageSizes: 10,
        total: 0
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
  beforeDestroy() {
    if (this.pointTimer) {
      clearInterval(this.pointTimer)

      this.pointTimer = null
    }
  },
  methods: {
    async init() {
      this.setAisleOption()

      await this.searchCameraTree()

      this.$nextTick(() => {
        this.tree = this.$refs.commonTree.refTree

        this.clickNode()
      })
    },
    setAisleOption() {
      const digitForm = this.sdkSceneForm.find(item => item.prop === 'digit')

      for (let i = 0; i <= 31; i++) {
        digitForm.option.push({ label: i, value: i })
      }
    },
    handleSizeChange(size) {
      this.tablePagerOption.pageSizes = size
      !this.searchValue.length ? this.searchCamerasWithNode(this.currentNode) : this.searchCameras()
    },
    handleCurrentChange(page) {
      this.tablePagerOption.currentPage = page
      !this.searchValue.length ? this.searchCamerasWithNode(this.currentNode) : this.searchCameras()
    },
    handlePrevClick(page) {
      this.tablePagerOption.currentPage = page
      !this.searchValue.length ? this.searchCamerasWithNode(this.currentNode) : this.searchCameras()
    },
    handleNextClick(page) {
      this.tablePagerOption.currentPage = page
      !this.searchValue.length ? this.searchCamerasWithNode(this.currentNode) : this.searchCameras()
    }
  }
}
</script>

<style scoped lang="scss">
.ai-monitoring-point-container {

  .monitor-point-tree-block {
    flex-flow: column;
    width: 240px;
    border-radius: 8px;
    background-color: #fff;
    margin-right: 20px;

    .tree-main-block {
      flex: 1;
      overflow: hidden;
      padding-bottom: 16px;
    }
  }

  .monitor-point-block {
    flex: 1;

    .monitor-point-buttons {
      display: flex;
    }
  }

}

@media screen and (max-width: 1920px) {}

@media screen and (max-width: 1680px) {}

@media screen and (max-width: 1570px) {

  /* AiMonitoringPoint -- ai-tree-node */

}

@media screen and (max-width: 1440px) {}

@media screen and (max-width: 1366px) {}

@media screen and (max-width: 1280px) {}
</style>
