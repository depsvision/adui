import user from '@/api/user'
import { mapGetters } from 'vuex'
import { trimObject, formatDate, deepClone } from '@/utils'

export default {
  data() {
    return {
      percentage: 0,
      roleTree: null,
      userDialog: {},
      userDialogTemplate: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            name: '',
            phone: '',
            pictureUrl: '',
            roleGroup: [],
            departmentGroup: [],
            faceGroup: []
          },
          rule: {
            name: [
              { required: true, message: '请输入用户姓名', trigger: ['blur', 'change'] }
            ],
            phone: [
              { required: true, message: '请输入手机号', trigger: ['blur', 'change'] },
              { message: '请使用正确的手机号码', trigger: ['blur', 'change'], pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/ }
            ]
          },
          form: [
            // {
            //   type: 'ImportImgCropper',
            //   label: '用户头像',
            //   prop: 'pictureUrl',
            //   errImg: DefaultAvatar,
            //   avatarUpload: {
            //     limit: 2,
            //     autoUpload: false,
            //     slot: 'trigger',
            //     action: 'file/',
            //     data: {
            //       type: 'portrait'
            //     },
            //     accept: '.jpg,.png,.jpeg',
            //     showFileList: false
            //   },
            //   cropper: {
            //     size: 1,
            //     outputType: 'jpeg',
            //     info: false,
            //     fixed: true,
            //     fixedNumber: [1, 1],
            //     autoCrop: true,
            //     fixedBox: false,
            //     canMove: false,
            //     centerBox: true,
            //     canScale: false
            //   }
            // },
            {
              type: 'ImportImgCropper',
              label: '照片',
              prop: 'pictureUrl',
              width: 75,
              height: 105,
              fit: 'contain',
              hasClose: true,
              closeDisabled: false,
              avatarUpload: {
                limit: 2,
                autoUpload: true,
                slot: 'trigger',
                action: 'file/',
                data: {
                  type: 'portrait'
                },
                accept: '.jpg,.png,.jpeg',
                showFileList: false
              },
              buttons: {
                buttonTip: {
                  show: false,
                  loading: false,
                  head: '提取失败',
                  headColor: 'is-red',
                  content: '请检查照片是否合规，以及算法任务是否开启'
                },
                buttons: [
                  {
                    label: '提取特征',
                    value: 'extractFeatures',
                    type: 'text',
                    class: 'is-black',
                    svgIconLeft: 'face-id-line'
                  }
                ]
              }
            },
            {
              type: 'inputAssembly',
              label: '用户姓名',
              prop: 'name',
              placeholder: '请输入用户姓名'
            },
            {
              type: 'inputAssembly',
              label: '手机号',
              prop: 'phone',
              placeholder: '请输入手机号',
              valueType: 'Number'
            },
            {
              type: 'tagInput',
              label: '所在部门',
              prop: 'departmentGroup',
              suffixIcon: 'el-icon-caret-bottom',
              size: 'medium',
              placeholder: '请选择所在部门'
            },
            {
              type: 'inputAssembly',
              label: '工号',
              prop: 'jobNo',
              placeholder: '请输入工号'
            },
            {
              type: 'tagInput',
              label: '角色',
              prop: 'roleGroup',
              suffixIcon: 'el-icon-caret-bottom',
              size: 'medium',
              placeholder: '请选择角色'
            },
            {
              type: 'tagInput',
              label: '标签',
              prop: 'faceGroup',
              suffixIcon: 'el-icon-caret-bottom',
              size: 'medium',
              placeholder: '请选择标签'
            }
          ],
          labelPosition: 'left',
          labelWidth: '120px'
        }
      },
      changeDepartmentDia: {},
      changeDepartmentDiaTemplate: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            departmentGroup: []
          },
          form: [
            {
              type: 'tagInput',
              label: '所在部门',
              prop: 'departmentGroup',
              suffixIcon: 'el-icon-caret-bottom',
              size: 'medium',
              placeholder: '请选择所在部门'
            }
          ],
          labelPosition: 'left',
          labelWidth: '120px'
        }
      },
      batchImport: {
        name: 'BatchImport',
        option: {
          action: 'file/',
          importTip: '如果检测到电话号码一致，则将覆盖该数据',
          upLoadTip: '可导入模板文件压缩包或用户表格',
          limit: 2,
          data: {
            type: 'temp'
          },
          accept: '.xls,.xlsx,.zip',
          multiple: false,
          autoUpload: false,
          uploadFiles: [],
          dealData: {
            insert: 0,
            update: 0,
            error: []
          },
          importStage: 'operation',
          info: null
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'dialog',
      'button',
      'buttonScope'
    ])
  },
  watch: {
    'button.value'(val) {
      this.clickButton(val)
    },
    'batchImport.option.info': {
      handler(val) {
        this.handleUploadStatus(val)
      },
      deep: true
    }
  },
  methods: {
    handleTableEvent(data) {
      if (data.value === 'selectionChange') {
        this.$set(this.dividerButtonData.buttons[1], 'disabled', !data.arg[0].length)
        this.$set(this.dividerButtonData.buttons[4], 'disabled', !data.arg[0].length)
        this.$set(this.dividerButtonData.buttons[5], 'disabled', !data.arg[0].length)
      }
    },
    clickButton(value) {
      switch (value) {
        case 'new':
          this.action = 'new'
          this.openDrawer()
          break
        case 'edit':
          this.action = 'edit'
          this.openDrawer()
          break
        case 'changeDepartment':
          this.action = 'change'
          this.changeDepartment()
          break
        case 'tagInput-departmentGroup':
          this.openTagInput('department')
          break
        case 'tagInput-roleGroup':
          this.openTagInput('role')
          break
        case 'tagInput-faceGroup':
          this.openTagInput('face')
          break
        case 'saveDepartment':
          this.setTagInput('department')
          break
        case 'saveRole':
          this.setTagInput('role')
          break
        case 'saveFace':
          this.setTagInput('face')
          break
        case 'saveUserData':
          this.saveUserData()
          break
        case 'moveDepartment':
          this.moveDepartment()
          break
        case 'start':
          this.banUser(1)
          break
        case 'ban':
          this.banUser(0)
          break
        case 'delete':
          this.deleteRow('all')
          break
        case 'deleteOne':
          this.deleteRow('one')
          break

        case 'extractFeatures':
          this.extractFeatures()
          break
        case 'extractAllFeatures':
          this.extractAllFeatures()
          break
        case 'faceManage':
          this.faceManage()
          break
        case 'addTag':
          this.addFaceTag()
          break
        case 'inputEnter-tagManage':
          this.addFaceTag()
          break
        case 'closeTag':
          this.closeTag()
          break

        case 'import':
          this.showBatchImport()
          break
        case 'innerImport':
          this.importUser()
          break
        case 'export':
          this.exportTable('')
          break
        case 'downloadTemplate':
          this.exportTable('template')
          break
        default:
      }
    },
    getRoleTree() {
      user.searchRoleTree()
        .then(res => {
          const { treeData } = res.data

          treeData[0].disabled = true
          treeData[0].children.forEach(item => {
            if (item.groupId === 1) {
              item.disabled = true
            }
          })

          this.roleTree = treeData
        })
    },
    getFaceTag() {
      return new Promise((resolve, reject) => {
        user.getFaceTag()
          .then(res => {
            resolve(res.data)
          })
          .catch(() => {
            resolve('')
          })
      })
    },
    changeDepartment() {
      // 清空数据
      this.changeDepartmentDia = deepClone(this.changeDepartmentDiaTemplate)

      const assignObj = {
        title: '设置部门',
        show: true,
        name: 'DialogShell',
        customClass: 'dialog--mini',
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '保存',
              value: 'moveDepartment',
              loading: false,
              type: 'primary'
            }
          ]
        },
        component: this.changeDepartmentDia
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    moveDepartment() {
      const params = {
        user: [],
        parentList: []
      }

      this.$refs.formTable.selectedData.forEach(item => {
        params.user.push(item.id)
      })
      this.changeDepartmentDia.option.data.departmentGroup.forEach(user => {
        params.parentList.push(user.groupId)
      })

      user.userMove(params)
        .then(async res => {
          this.$messageInfo({
            message: '移动成功!',
            type: 'success'
          })

          this.$store.dispatch('dialog/initDialogData')

          await this.searchUserTree()

          this.$nextTick(() => {
            this.clickNode(this.currentNode)
          })
        })
    },
    showBatchImport() {
      this.batchImport.option.importStage = 'operation'

      const assignObj = {
        title: '批量导入',
        show: true,
        name: 'DialogShell',
        customClass: 'dialog--mini',
        buttons: {
          buttons: [
            {
              label: '导入',
              value: 'innerImport',
              type: 'primary',
              hide: false,
              disabled: true
            },
            {
              label: '关闭',
              value: 'cancel',
              type: 'primary',
              hide: true
            }
          ]
        },
        component: this.batchImport
      }
      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    async importUser() {
      this.$store.dispatch('dialog/addDialogLoading', '正在处理 0%')

      await this.changePercentage(67)

      this.$store.dispatch('button/simulateButton', 'manualUpload')
    },
    changePercentage(percentage) {
      return new Promise(resolve => {
        const radomTime = 2 * (Math.floor(Math.random() * (12 - 5)) + 5)
        if (this.percentage <= percentage) {
          this.dialog.loading.text = '正在处理 ' + this.percentage + '%'
          this.percentage++
          setTimeout(async() => {
            resolve(this.changePercentage(percentage))
          }, radomTime)
        } else {
          resolve(true)
        }
      })
    },
    async handleUploadStatus(info) {
      if (info.value === 'success') {
        user.userImport(info.arg[0].response.data)
          .then(async res => {
            await this.changePercentage(100)

            this.dialog.loading.close()

            this.batchImport.option.dealData = res.data

            this.batchImport.option.importStage = 'information'

            this.dialog.buttons.buttons[0].hide = true
            this.dialog.buttons.buttons[1].hide = false
            this.dialog.self.$refs.buttonGroup.$forceUpdate()

            this.init()
          })
      } else if (info.value === 'error') {
        this.batchImport.option.importStage = 'information'
        this.$set(this.batchImport.option, 'serveError', true)
      }
    },
    openDrawer() {
      // 清空数据
      this.userDialog = deepClone(this.userDialogTemplate)

      const assignObj = {
        title: (this.action === 'edit' ? '编辑' : '新增') + '用户',
        show: true,
        name: 'DialogShell',
        customClass: 'dialog--mini',
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '保存',
              value: 'saveUserData',
              loading: false,
              type: 'primary'
            }
          ]
        },
        component: this.userDialog
      }

      if (this.action === 'edit') {
        const data = deepClone(this.buttonScope.row)

        this.userDialog.option.data = data
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    async openTagInput(type) {
      let faceData = []
      if (type === 'face') {
        const faceTag = await this.getFaceTag()
        if (faceData) {
          faceData = faceTag.fixTag.concat(faceTag.tagList)
        }

        faceData.forEach(item => {
          item.label = item.name
        })
      }

      const treeListDia = {
        name: 'TreeList',
        option: {
          bottomHead: type === 'face' ? '选择标签' : '选择分组',
          placeholder: type === 'face' ? '搜索标签' : '搜索分组',
          tagClosable: true,
          treeLoding: false,
          tagData: [],
          tabData: [
            {
              id: 'tree',
              label: type === 'face' ? '标签' : '组织架构',
              filterBlock: type === 'face' ? 'rightTree' : 'leftTree',
              treeData: [this.userTreeOption.data, this.roleTree, [
                {
                  label: '全部',
                  groupId: 0
                }
              ]][['department', 'role', 'face'].indexOf(type)],
              resultData: type === 'face' ? faceData : ''
            }
          ],
          treeOption: {
            data: [],
            slotScope: true,
            expandOnClickNode: false,
            highlightCurrent: true,
            currentNode: 0,
            nodeKey: 'groupId',
            checkStrictly: true,
            expandedKeys: [0],
            filterInput: {
              hide: true
            },
            showCheckbox: type !== 'face',
            tooltip: {
              placement: 'top-start',
              enterable: false
            },
            tagSvg: type === 'department' ? 'department-line' : 'role-line',
            tagColor: 'blue'
          }
        }
      }

      if (type === 'face') {
        treeListDia.option.resultOption = {
          data: [],
          slotScope: true,
          expandOnClickNode: false,
          currentNode: 0,
          nodeKey: 'id',
          filterInput: {
            hide: true
          },
          expandedKeys: [0],
          showCheckbox: true,
          tooltip: {
            placement: 'top-start',
            enterable: false
          },
          tagSvg: 'face-line',
          tagColor: 'blue'
        }
      }

      if (this.action !== 'change') {
        const optionData = this.userDialog.option.data
        treeListDia.option.tagData = [optionData.departmentGroup, optionData.roleGroup, optionData.faceGroup][['department', 'role', 'face'].indexOf(type)]
      } else {
        treeListDia.option.tagData = this.changeDepartmentDia.option.data.departmentGroup
      }

      const assignObj = {
        title: ['选择部门', '选择角色', '选择标签'][['department', 'role', 'face'].indexOf(type)],
        show: true,
        name: 'DialogShell',
        modal: true,
        clickClose: false,
        pressClose: false,
        showClose: true,
        level: 2,
        appendToBody: true,
        customClass: 'dialog--small',
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '保存',
              value: ['saveDepartment', 'saveRole', 'saveFace'][['department', 'role', 'face'].indexOf(type)],
              type: 'primary'
            }
          ]
        },
        component: treeListDia
      }

      this.$store.dispatch('dialog/setDialogData', { key: 'dialog', value: assignObj })
    },
    setTagInput(type) {
      if (this.action !== 'change') {
        if (type === 'face') {
          this.userDialog.option.data[type + 'Group'] = deepClone(this.dialog.listenerClick.refs.resultTagData)
        } else {
          this.userDialog.option.data[type + 'Group'] = deepClone(this.dialog.listenerClick.refs.treeTagData)
        }
      } else {
        this.changeDepartmentDia.option.data[type + 'Group'] = deepClone(this.dialog.listenerClick.refs.treeTagData)
      }

      this.$store.dispatch('dialog/initDialogData', true)
    },
    saveUserData() {
      const data = deepClone(this.userDialog.option.data)
      const departmentList = []
      const roleList = []
      const faceList = []

      data.departmentGroup.forEach(item => {
        departmentList.push(Number(item.groupId))
      })

      data.roleGroup.forEach(item => {
        roleList.push(Number(item.groupId))
      })

      data.faceGroup.forEach(item => {
        faceList.push(Number(item.id))
      })

      this.userDialog.option.ref.validate(valid => {
        if (valid) {
          let params = data
          params.parentList = departmentList
          params.roleList = roleList
          params.faceTag = faceList
          params.photo = data.pictureUrlPath
          params.feature = this.faceFeature

          params = trimObject(params, 'name', 'jobNo')

          this.dialog.buttons.buttons[1].loading = true
          this.dialog.self.$refs.buttonGroup.$forceUpdate()

          user.userEdit(params)
            .then(async res => {
              this.dialog.buttons.buttons[1].loading = false
              this.dialog.self.$refs.buttonGroup.$forceUpdate()

              this.$messageInfo({
                message: (this.action === 'edit' ? '编辑' : '新增') + '用户成功!',
                type: 'success'
              })

              this.$store.dispatch('dialog/initDialogData')

              await this.searchUserTree()

              this.$nextTick(() => {
                this.clickNode(this.currentNode)
              })
            })
            .catch(() => {
              this.dialog.buttons.buttons[1].loading = false
              this.dialog.self.$refs.buttonGroup.$forceUpdate()
            })
        }
      })
    },
    searchUsers(type) {
      if (!this.searchValue.length && type) return

      const defaultParams = {
        keyword: this.searchValue,
        page: this.tablePagerOption.currentPage,
        size: this.tablePagerOption.pageSizes
      }
      this.tableLoading = true
      user.searchUser(defaultParams).then(res => {
        this.tablePagerOption = Object.assign(this.tablePagerOption, res.data.pageVO)
        this.tableOption.tableData = res.data.userList

        this.dealTableData()

        this.tree.setCurrentKey(0)

        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    searchUsersWithNode(arg) {
      const defaultParams = {
        parentId: arg.groupId,
        page: this.tablePagerOption.currentPage,
        size: this.tablePagerOption.pageSizes
      }
      this.tableLoading = true
      user.searchTreeNodeUser(defaultParams).then(res => {
        this.tablePagerOption = Object.assign(this.tablePagerOption, res.data.pageVO)
        this.tableOption.tableData = res.data.userList

        this.dealTableData()

        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    dealTableData() {
      this.tableOption.tableData.forEach(item => {
        item.statusName = ['禁用', '正常'][item.status]
        item.statusNameClass = ['is-grey', 'is-green'][item.status]

        item.pictureUrl = item.photo

        item.faceFeatureStatus = ['未提取', '提取成功', '提取失败'][item.extract]
        item.faceFeatureStatusClass = ['is-grey', 'is-green', 'is-red'][item.extract]

        item.multiple = 1
        item.roleTag = []
        item.roleList.split(',').forEach(role => {
          role !== '' && item.roleTag.push({
            label: role,
            value: role,
            class: 'tag-blue',
            style: {
              'max-width': '110px'
            },
            disableTransitions: true
          })
        })
        item.roleContent = item.roleList

        item.faceTag = []
        item.tagList.split(',').forEach(face => {
          face !== '' && item.faceTag.push({
            label: face,
            value: face,
            class: 'tag-blue',
            style: {
              'max-width': '110px'
            },
            disableTransitions: true
          })
        })
        item.faceContent = item.tagList

        item.hide = ['ban', 'start'][item.status]

        item.departmentGroup = []

        const departmentID = item.departmentID.split(',')
        const departmentLabel = item.departmentList.split(',')

        departmentID.forEach((id, index) => {
          id !== '' && item.departmentGroup.push({
            label: departmentLabel[index],
            groupId: id,
            tagType: 'tree',
            tagSvg: 'department-line',
            tagColor: 'blue',
            nodeKey: 'groupId'
          })
        })

        item.roleGroup = []

        const roleID = item.roleID.split(',')
        const roleLabel = item.roleList.split(',')

        roleID.forEach((id, index) => {
          id !== '' && item.roleGroup.push({
            label: roleLabel[index],
            groupId: id,
            tagType: 'tree',
            tagSvg: 'role-line',
            tagColor: 'blue',
            nodeKey: 'groupId'
          })
        })

        item.faceGroup = []

        const tagID = item.tagID.split(',')
        const tagLabel = item.tagList.split(',')

        tagID.forEach((id, index) => {
          id !== '' && item.faceGroup.push({
            label: tagLabel[index],
            id: id,
            tagType: 'node',
            tagSvg: 'face-line',
            tagColor: 'blue',
            nodeKey: 'id'
          })
        })
      })
    },
    banUser(status) {
      const params = {
        userId: this.buttonScope.row.id,
        status: status
      }
      user.userBan(params).then(res => {
        let message = ''
        if (status === 0) {
          message = '禁用'
        } else {
          message = '启用'
        }
        this.$messageInfo({
          message: message + '成功!',
          type: 'success'
        })

        this.searchUsersWithNode(this.currentNode)
      })
    },
    deleteRow(flag) {
      if (flag === 'all') {
        this.$prompt('请输入“删除”二字以确认删除，用户将无法恢复，请谨慎操作', '批量删除用户', {
          confirmButtonText: '删除',
          confirmButtonClass: 'is-danger',
          cancelButtonText: '取消',
          customClass: 'dialog--mini',
          inputValidator: (string) => {
            if (string !== '删除') {
              return '文本不一致'
            } else {
              return true
            }
          },
          inputPlaceholder: '输入“删除”以执行该操作'
        }).then(async() => {
          this.tableLoading = true
          const deleteId = []
          this.$refs.formTable.selectedData.forEach(item => {
            deleteId.push(item.id)
          })
          const res = await user.userRemove({ userList: deleteId }).catch(() => {
            this.tableLoading = false
          })
          if (!res) return
          const requestInfo = res.requestInfo
          if (requestInfo.flag) {
            this.$messageInfo({
              message: '删除成功!',
              type: 'success'
            })
          }

          this.reverseSelect(deleteId)

          await this.searchUserTree()

          this.$nextTick(() => {
            this.clickNode(this.currentNode)
          })
        })
      } else {
        this.tableLoading = true
        user.userRemove({ userList: [this.buttonScope.row.id] })
          .then(async res => {
            this.$messageInfo({
              message: '删除成功!',
              type: 'success'
            })

            const index = this.tableOption.tableData.findIndex(row => this.buttonScope.row.id === row.id)
            if (index !== -1) {
              this.tableOption.tableData.splice(index, 1)
            }

            this.tableLoading = false

            this.reverseSelect([this.buttonScope.row.id])

            await this.searchUserTree()
          })
      }
    },
    reverseSelect(arr) {
      arr.forEach(item => {
        const index = this.$refs.formTable.selectedData.findIndex(row => item === row.id)
        if (index !== -1) {
          this.$refs.formTable.selectedData.splice(index, 1)
        }
      })
    },
    async exportTable(flag) {
      const exportId = []

      if (flag !== 'template') {
        this.$refs.formTable.selectedData.forEach(item => {
          exportId.push(item.id)
        })
      }

      const { data } = await user.userExport({ user: exportId, name: '点位信息列表' + formatDate(Date.now(), 'full', 'file') + '.xlsx' })
      const a = document.createElement('a')
      a.href = data.url
      a.click()
    }
  }
}
