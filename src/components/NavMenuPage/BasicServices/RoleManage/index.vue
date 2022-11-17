<template>
  <div class="role-manage-container layout-bg display-flex-class">
    <div v-loading="treeLoading" class="role-manage-tree-block display-flex-class">
      <div class="tree-top-block">
        <span class="tree-top-title">角色</span>
      </div>
      <div class="tree-main-block">
        <common-tree
          ref="commonTree"
          :component-option="roleTreeOption"
          @handleEvent="treeEvent"
        />
      </div>
    </div>
    <div v-loading="tableLoading" class="role-manage-block common-tablebox-layout">
      <div class="common-tablebox-title blue-title">
        <span>{{ currentNode?currentNode.label:'全部' }}</span>
      </div>
      <div class="role-manage-buttons common-tablebox--top_button-group">
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
      <div class="role-manage-table common-tablebox-table">
        <form-table
          ref="formTable"
          :component-option="tableOption"
          @handleTableEvent="handleTableEvent"
        />
      </div>
      <div class="role-manage-pager common-tablebox-pager">
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
import other from './Mixins/other'
import tree from './Mixins/tree'
import index from './Mixins'
import CommonTree from '@/components/Tree/CommonTree'
import ButtonGroup from '@/components/Button/ButtonGroup'
import FormTable from '@/components/FormTable'

export default {
  name: 'RoleManage',
  components: { CommonTree, FormTable, ButtonGroup },
  mixins: [index, tree, other],
  data() {
    return {
      searchValue: '',
      treeLoading: false,
      tableLoading: false,
      roleTreeOption: {
        data: [],
        slotScope: true,
        totalNum: true,
        draggable: true,
        expandOnClickNode: false,
        highlightCurrent: true,
        currentNode: 0,
        inputAfterSvg: 'plus',
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
            key: 1,
            type: ['prev', 'inner'] // ['prev','inner', 'next']
          }
        ],
        disabledDrag: [0, 1],
        nodeKey: 'groupId',
        expandedKeys: [0],
        iconOption: true,
        append: {
          type: 'include',
          arr: []
        },
        edit: {
          type: 'include',
          arr: []
        },
        delete: {
          type: 'except',
          arr: [0, 1]
        }
      },
      dividerButtonData: {
        buttons: [
          {
            label: '编辑角色',
            value: 'edit',
            type: 'text',
            class: 'is-black',
            svgIconLeft: 'edit'
          },
          {
            label: '添加用户',
            value: 'addUser',
            type: 'text',
            class: 'is-black',
            svgIconLeft: 'plus'
          },
          {
            label: '移除',
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
            minWidth: 120,
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
            minWidth: 120,
            align: 'left',
            label: '工号',
            prop: 'jobNo',
            type: 'span'
          },
          {
            width: 200,
            align: 'left',
            label: '角色',
            prop: 'role',
            is: 'TagAssembly',
            tooltip: {
              placement: 'top-start'
            }
          },
          {
            minWidth: 120,
            align: 'left',
            label: '登录密码',
            prop: 'password',
            spanClass: 'span-flex-reverse',
            showOverflowTooltip: true,
            type: 'span',
            buttonGroup: {
              buttons: [
                {
                  label: '',
                  svgIconLeft: 'hide-line',
                  value: 'showPassword',
                  type: 'text'
                },
                {
                  label: '',
                  svgIconLeft: 'show-fill',
                  value: 'hidePassword',
                  type: 'text'
                }
              ]
            }
          },
          {
            width: 160,
            align: 'left',
            label: '操作',
            fixed: 'right',
            type: 'span',
            buttonGroup: {
              buttons: [
                {
                  label: '修改密码',
                  value: 'changePassword',
                  type: 'text'
                },
                {
                  label: '移除',
                  value: 'deleteOne',
                  type: 'text',
                  popoverclass: 'is-danger',
                  confirm: '移除',
                  tip: '仅移除当前用户的相关角色及权限，仍可以在用户管理中查看相关用户信息',
                  svgIcon: 'warning',
                  width: 306
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
      await this.searchRoleTree()

      this.$nextTick(() => {
        this.tree = this.$refs.commonTree.refTree

        this.clickNode()
      })

      this.getGroupData()
      this.getDepartmentData()
    },
    handleSizeChange(size) {
      this.tablePagerOption.pageSizes = size
      !this.searchValue.length > 0 ? this.searchRolesWithNode(this.currentNode) : this.searchUsers()
    },
    handleCurrentChange(page) {
      this.tablePagerOption.currentPage = page
      !this.searchValue.length > 0 ? this.searchRolesWithNode(this.currentNode) : this.searchUsers()
    },
    handlePrevClick(page) {
      this.tablePagerOption.currentPage = page
      !this.searchValue.length > 0 ? this.searchRolesWithNode(this.currentNode) : this.searchUsers()
    },
    handleNextClick(page) {
      this.tablePagerOption.currentPage = page
      !this.searchValue.length > 0 ? this.searchRolesWithNode(this.currentNode) : this.searchUsers()
    }
  }
}
</script>

<style scoped lang="scss">
.role-manage-container {

  .role-manage-tree-block {
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

  .role-manage-block {
    flex: 1;

    .role-manage-table {

      ::v-deep .span-flex-reverse {
        flex-flow: row-reverse;
        justify-content: flex-end;

        .table-span-button_button {
          margin-left: 0;
          margin-right: 12px;

          .el-button {
            color: rgba(14, 27, 46, 1);

            &:hover {
              color: #1872F0;
            }
          }
        }
      }
    }

    .role-manage-buttons {
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
