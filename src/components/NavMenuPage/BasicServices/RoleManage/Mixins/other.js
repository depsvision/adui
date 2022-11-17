import user from '@/api/user'
import { mapGetters } from 'vuex'
import { trimObject, deepClone } from '@/utils'

export default {
  data() {
    return {
      addUserDialog: {},
      addUserDialogTemplate: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            addUserGroup: []
          },
          form: [
            {
              type: 'tagInput',
              label: '用户',
              prop: 'addUserGroup',
              suffixIcon: 'el-icon-caret-bottom',
              size: 'medium',
              placeholder: '请选择部门下的用户'
            }
          ],
          labelPosition: 'left',
          labelWidth: '120px'
        }
      },
      passwordDialog: {},
      passwordDialogTemplate: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            password: ''
          },
          rule: {
            password: [
              { required: true, message: '请输入密码', trigger: ['blur', 'change'] }
            ]
          },
          form: [
            {
              type: 'inputAssembly',
              label: '登录密码',
              prop: 'password',
              tip: '为管理员设置登录密码后才能登录使用,保存后将自动更新',
              placeholder: '请输入密码'
            }
          ],
          labelPosition: 'left',
          labelWidth: '120px'
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'dialog',
      'buttonScope'
    ])
  },
  methods: {
    openAddUser() {
      // 清空数据
      this.addUserDialog = deepClone(this.addUserDialogTemplate)

      const assignObj = {
        title: '添加用户',
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
              label: '确定',
              value: 'addUserToRole',
              loading: false,
              type: 'primary'
            }
          ]
        },
        component: this.addUserDialog
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    addUserToRole() {
      const params = {
        roleId: this.currentNode.groupId,
        userList: []
      }

      const data = this.addUserDialog.option.data
      data.addUserGroup.forEach(item => {
        params.userList.push(item.id)
      })

      user.userRoleAddUser(params)
        .then(async res => {
          this.$messageInfo({
            message: '添加用户成功!',
            type: 'success'
          })

          this.$store.dispatch('dialog/initDialogData')

          await this.searchRoleTree()

          this.$nextTick(() => {
            this.clickNode(this.currentNode)
          })
        })
    },
    changePassword() {
      // 清空数据
      this.passwordDialog = deepClone(this.passwordDialogTemplate)

      const assignObj = {
        title: '设置登录密码',
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
              label: '确定',
              value: 'savePassword',
              loading: false,
              type: 'primary'
            }
          ]
        },
        component: this.passwordDialog
      }

      this.passwordDialog.option.data = deepClone(this.buttonScope.row)

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    savePassword() {
      let params = {
        userId: this.buttonScope.row.id,
        password: this.passwordDialog.option.data.password
      }

      params = trimObject(params, 'password')

      this.passwordDialog.option.ref.validate(valid => {
        if (valid) {
          user.userResetPassword(params)
            .then(async res => {
              this.$messageInfo({
                message: '修改成功!',
                type: 'success'
              })

              this.$store.dispatch('dialog/initDialogData')

              await this.searchRoleTree()

              this.$nextTick(() => {
                this.clickNode(this.currentNode)
              })
            })
        }
      })
    },
    setPasswordStatus(type) {
      const row = this.tableOption.tableData.find(item => item.id === this.buttonScope.row.id)

      this.$set(row, 'isPassword', type ? [] : ['password'])
      this.$set(row, 'hide', type ? ['showPassword'] : ['hidePassword'])
      this.tableOption.tableData = [...this.tableOption.tableData]
    }
  }
}
