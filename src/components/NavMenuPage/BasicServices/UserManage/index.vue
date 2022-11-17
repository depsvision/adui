<template>
  <div class="user-manage-container layout-bg display-flex-class">
    <div v-loading="treeLoading" class="user-manage-tree-block display-flex-class">
      <div class="tree-top-block">
        <span class="tree-top-title">用户</span>
      </div>
      <div class="tree-main-block">
        <common-tree
          ref="commonTree"
          :component-option="userTreeOption"
          @handleEvent="treeEvent"
        />
      </div>
    </div>
    <div v-loading="tableLoading" class="user-manage-block common-tablebox-layout">
      <div class="common-tablebox-title blue-title">
        <span>{{ currentNode?currentNode.label:'全部' }}</span>
      </div>
      <div class="user-manage-buttons common-tablebox--top_button-group">
        <div class="common-tablebox-search">
          <span class="search-input">
            <el-input v-model.trim="searchValue" :size="elementSize" placeholder="姓名/手机/工号" clearable @keyup.enter.native="searchUsers(true)">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="searchUsers(true)" />
            </el-input>
          </span>
        </div>
        <button-group
          ref="buttonGroup"
          :component-option="dividerButtonData"
        />
      </div>
      <div class="user-manage-table common-tablebox-table">
        <form-table
          ref="formTable"
          :component-option="tableOption"
          @handleTableEvent="handleTableEvent"
        />
      </div>
      <div class="user-manage-pager common-tablebox-pager">
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
import { mapGetters } from 'vuex'
import index from './Mixins'
import tree from './Mixins/tree'
import other from './Mixins/other'
import CommonTree from '@/components/Tree/CommonTree'
import ButtonGroup from '@/components/Button/ButtonGroup'
import FormTable from '@/components/FormTable'

export default {
  name: 'UserManage',
  components: { CommonTree, FormTable, ButtonGroup },
  mixins: [index, tree, other],
  data() {
    return {
      searchValue: '',
      treeLoading: false,
      tableLoading: false,
      userTreeOption: {
        data: [],
        slotScope: true,
        totalNum: true,
        draggable: true,
        expandOnClickNode: false,
        highlightCurrent: true,
        currentNode: 0,
        filterInput: {
          size: 'small',
          placeholder: '用户名称',
          suffixIcon: 'el-icon-search'
        },
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
        }
      },
      dividerButtonData: {
        buttons: [
          {
            label: '新增用户',
            value: 'new',
            type: 'text',
            class: 'is-black',
            svgIconLeft: 'plus'
          },
          {
            label: '设置部门',
            value: 'changeDepartment',
            type: 'text',
            svgIconLeft: 'department-line',
            class: 'is-black',
            disabled: true
          },
          {
            label: '人脸特征管理',
            value: 'faceManage',
            type: 'text',
            class: 'is-black'
          },
          {
            label: '批量导入',
            value: 'import',
            class: 'is-black',
            type: 'text'
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
        ]
      },
      tableOption: {
        tableData: [],
        selectionColumn: {
          fixed: 'left',
          width: 30,
          show: true,
          align: 'left'
        },
        header: [
          {
            width: 40,
            align: 'left',
            label: 'ID',
            prop: 'id',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            minWidth: 110,
            align: 'left',
            label: '姓名',
            prop: 'name',
            type: 'span',
            showOverflowTooltip: true
          },
          {
            width: 120,
            align: 'left',
            label: '手机号码',
            prop: 'phone',
            type: 'span'
          },
          {
            minWidth: 90,
            align: 'left',
            label: '工号',
            prop: 'jobNo',
            type: 'span'
          },
          {
            width: 180,
            align: 'left',
            label: '角色',
            prop: 'role',
            is: 'TagAssembly',
            tooltip: {
              placement: 'top-start'
            }
          },
          {
            width: 120,
            align: 'left',
            label: '人脸特征',
            prop: 'faceFeatureStatus',
            type: 'span',
            class: 'status-mark'
          },
          {
            width: 180,
            align: 'left',
            label: '人脸标签',
            prop: 'face',
            is: 'TagAssembly',
            tooltip: {
              placement: 'top-start'
            }
          },
          // {
          //   width: 80,
          //   align: 'left',
          //   label: '人员状态',
          //   prop: 'statusName',
          //   type: 'span',
          //   class: 'status-mark'
          // },
          {
            width: 120,
            align: 'left',
            label: '操作',
            fixed: 'right',
            type: 'span',
            buttonGroup: {
              buttons: [
                {
                  label: '编辑',
                  value: 'edit',
                  type: 'text'
                },
                // {
                //   label: '启用',
                //   value: 'start',
                //   type: 'text',
                //   tip: '是否启用该用户?',
                //   confirm: '确定',
                //   svgIcon: 'warning',
                //   width: 240
                // },
                // {
                //   label: '禁用',
                //   value: 'ban',
                //   type: 'text',
                //   popoverclass: 'is-danger',
                //   tip: '设为禁用后该用户将被设为黑名单，请谨慎操作！',
                //   confirm: '确定',
                //   svgIcon: 'warning',
                //   width: 306
                // },
                {
                  label: '删除',
                  value: 'deleteOne',
                  type: 'text',
                  popoverclass: 'is-danger',
                  tip: '删除用户后无法恢复，请谨慎操作！',
                  svgIcon: 'warning'
                }
              ]
            }
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
  methods: {
    async init() {
      await this.searchUserTree()
      this.getRoleTree()

      this.$nextTick(() => {
        this.tree = this.$refs.commonTree.refTree

        this.clickNode()
      })
    },
    handleSizeChange(size) {
      this.tablePagerOption.pageSizes = size
      !this.searchValue.length > 0 ? this.searchUsersWithNode(this.currentNode) : this.searchUsers()
    },
    handleCurrentChange(page) {
      this.tablePagerOption.currentPage = page
      !this.searchValue.length > 0 ? this.searchUsersWithNode(this.currentNode) : this.searchUsers()
    },
    handlePrevClick(page) {
      this.tablePagerOption.currentPage = page
      !this.searchValue.length > 0 ? this.searchUsersWithNode(this.currentNode) : this.searchUsers()
    },
    handleNextClick(page) {
      this.tablePagerOption.currentPage = page
      !this.searchValue.length > 0 ? this.searchUsersWithNode(this.currentNode) : this.searchUsers()
    }
  }
}
</script>

<style scoped lang="scss">
.user-manage-container {

  .user-manage-tree-block {
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

  .user-manage-block {
    flex: 1;

    .user-manage-buttons {
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
