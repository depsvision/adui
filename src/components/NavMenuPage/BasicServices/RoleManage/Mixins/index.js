import user from '@/api/user'
import device from '@/api/device'
import { mapGetters } from 'vuex'
import { trimObject, deepClone } from '@/utils'

export default {
  data() {
    return {
      roleTree: null,
      roleDialog: {},
      roleDialogTemplate: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            name: '',
            authority: {
              global: [],
              console: [],
              node: [],
              camera: [],
              record: [],
              task: [],
              imageTask: [],
              linkage: [],
              material: [],
              log: [],
              alert: [],
              callback: [],
              callbackLog: [],
              oss: [],
              app: [],
              user: [],
              role: [],
              license: [],
              setting: [],
              nodeGroup: [],
              pointGroup: [],
              userGroup: [],
              roleGroup: [],
              taskGroup: 0,
              imageGroup: 0,
              linkageGroup: 0,
              materialGroup: 0,
              logGroup: 0
            }
          },
          rule: {
            name: [
              { required: true, message: '请输入角色名称', trigger: 'blur' }
            ]
          },
          form: [
            {
              type: 'inputAssembly',
              label: '角色名称',
              prop: 'name',
              style: {
                width: '300px'
              },
              placeholder: '请输入角色名称'
            },
            {
              type: 'FormTree',
              label: null,
              prop: 'authority',
              class: 'no-label form-label--top',
              blockStyle: {
                'max-height': '442px'
              },
              items: [
                {
                  form: [
                    {
                      type: 'CheckboxAssembly',
                      label: '平台权限',
                      prop: 'global',
                      checkbox: [
                        {
                          label: '全选',
                          value: 1,
                          indeterminate: false
                        }
                      ],
                      labelWidth: '174px'
                    }
                  ],
                  items: [
                    {
                      form: [
                        {
                          type: 'CheckboxAssembly',
                          label: '控制台',
                          prop: 'console',
                          checkbox: [
                            {
                              label: '查看',
                              value: 1
                            }
                          ],
                          labelWidth: '158px'
                        }
                      ]
                    },
                    {
                      form: [
                        {
                          label: '基础服务'
                        }
                      ],
                      items: [
                        {
                          form: [
                            {
                              label: '智能计算节点'
                            }
                          ],
                          items: [
                            {
                              form: [
                                {
                                  type: 'CheckboxAssembly',
                                  label: '权限',
                                  svg: 'key-line',
                                  prop: 'node',
                                  checkbox: [
                                    {
                                      label: '操作',
                                      value: 2,
                                      relate: [1]
                                    },
                                    {
                                      label: '查看',
                                      value: 1
                                    }
                                  ],
                                  labelWidth: '126px'
                                },
                                {
                                  type: 'tagInput',
                                  label: '数据',
                                  svg: 'list-file-line',
                                  prop: 'nodeGroup',
                                  maxHeight: 32,
                                  suffixIcon: 'el-icon-caret-bottom',
                                  size: 'small',
                                  tagInputStyle: {
                                    width: '360px'
                                  },
                                  placeholder: '请选择节点',
                                  labelWidth: '126px'
                                }
                              ]
                            }
                          ]
                        },
                        {
                          form: [
                            {
                              label: '监控输入设备'
                            }
                          ],
                          items: [
                            {
                              form: [
                                {
                                  type: 'CheckboxAssembly',
                                  label: '权限',
                                  svg: 'key-line',
                                  prop: 'camera',
                                  checkbox: [
                                    {
                                      label: '操作',
                                      value: 2,
                                      relate: [1]
                                    },
                                    {
                                      label: '查看',
                                      value: 1
                                    }
                                  ],
                                  labelWidth: '126px'
                                },
                                {
                                  type: 'tagInput',
                                  label: '数据',
                                  svg: 'list-file-line',
                                  prop: 'pointGroup',
                                  maxHeight: 32,
                                  suffixIcon: 'el-icon-caret-bottom',
                                  size: 'small',
                                  tagInputStyle: {
                                    width: '360px'
                                  },
                                  placeholder: '请选择节点',
                                  labelWidth: '126px'
                                }
                              ]
                            }
                          ]
                        },
                        {
                          form: [
                            {
                              label: '视频录制'
                            }
                          ],
                          items: [
                            {
                              form: [
                                {
                                  type: 'CheckboxAssembly',
                                  label: '权限',
                                  svg: 'key-line',
                                  prop: 'record',
                                  checkbox: [
                                    {
                                      label: '操作',
                                      value: 2,
                                      relate: [1]
                                    },
                                    {
                                      label: '查看',
                                      value: 1
                                    }
                                  ],
                                  labelWidth: '126px'
                                }
                              ]
                            }
                          ]
                        },
                        {
                          form: [
                            {
                              label: '用户管理'
                            }
                          ],
                          items: [
                            {
                              form: [
                                {
                                  type: 'CheckboxAssembly',
                                  label: '权限',
                                  svg: 'key-line',
                                  prop: 'user',
                                  checkbox: [
                                    {
                                      label: '操作',
                                      value: 2,
                                      relate: [1]
                                    },
                                    {
                                      label: '查看',
                                      value: 1
                                    }
                                  ],
                                  labelWidth: '126px'
                                },
                                {
                                  type: 'tagInput',
                                  label: '数据',
                                  svg: 'list-file-line',
                                  prop: 'userGroup',
                                  maxHeight: 32,
                                  suffixIcon: 'el-icon-caret-bottom',
                                  size: 'small',
                                  tagInputStyle: {
                                    width: '360px'
                                  },
                                  placeholder: '请选择节点',
                                  labelWidth: '126px'
                                }
                              ]
                            }
                          ]
                        },
                        {
                          form: [
                            {
                              label: '角色管理'
                            }
                          ],
                          items: [
                            {
                              form: [
                                {
                                  type: 'CheckboxAssembly',
                                  label: '权限',
                                  svg: 'key-line',
                                  prop: 'role',
                                  checkbox: [
                                    {
                                      label: '操作',
                                      value: 2,
                                      relate: [1]
                                    },
                                    {
                                      label: '查看',
                                      value: 1
                                    }
                                  ],
                                  labelWidth: '126px'
                                },
                                {
                                  type: 'tagInput',
                                  label: '数据',
                                  svg: 'list-file-line',
                                  prop: 'roleGroup',
                                  maxHeight: 32,
                                  suffixIcon: 'el-icon-caret-bottom',
                                  size: 'small',
                                  tagInputStyle: {
                                    width: '360px'
                                  },
                                  placeholder: '请选择节点',
                                  labelWidth: '126px'
                                }
                              ]
                            }
                          ]
                        }
                        // {
                        //   form: [
                        //     {
                        //       label: 'license管理'
                        //     }
                        //   ],
                        //   items: [
                        //     {
                        //       form: [
                        //         {
                        //           type: 'CheckboxAssembly',
                        //           label: '权限',
                        //           svg: 'key-line',
                        //           prop: 'license',
                        //           checkbox: [
                        //             {
                        //               label: '操作',
                        //               value: 2,
                        //               relate: [1]
                        //             },
                        //             {
                        //               label: '查看',
                        //               value: 1
                        //             }
                        //           ],
                        //           labelWidth: '126px'
                        //         }
                        //       ]
                        //     }
                        //   ]
                        // }
                      ]
                    },
                    {
                      form: [
                        {
                          label: '算法调度'
                        }
                      ],
                      items: [
                        {
                          form: [
                            {
                              label: '视频流分析'
                            }
                          ],
                          items: [
                            {
                              form: [
                                {
                                  type: 'CheckboxAssembly',
                                  label: '权限',
                                  svg: 'key-line',
                                  prop: 'task',
                                  checkbox: [
                                    {
                                      label: '操作',
                                      value: 2,
                                      relate: [1]
                                    },
                                    {
                                      label: '查看',
                                      value: 1
                                    }
                                  ],
                                  labelWidth: '126px'
                                },
                                {
                                  type: 'RadioAssembly',
                                  label: '数据',
                                  prop: 'taskGroup',
                                  svg: 'list-file-line',
                                  labelWidth: '126px',
                                  radio: [
                                    {
                                      label: '全部',
                                      value: 0
                                    },
                                    {
                                      label: '仅自己创建',
                                      value: 1
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        },
                        {
                          form: [
                            {
                              label: '图片分析'
                            }
                          ],
                          items: [
                            {
                              form: [
                                {
                                  type: 'CheckboxAssembly',
                                  label: '权限',
                                  svg: 'key-line',
                                  prop: 'imageTask',
                                  checkbox: [
                                    {
                                      label: '操作',
                                      value: 2,
                                      relate: [1]
                                    },
                                    {
                                      label: '查看',
                                      value: 1
                                    }
                                  ],
                                  labelWidth: '126px'
                                },
                                {
                                  type: 'RadioAssembly',
                                  label: '数据',
                                  prop: 'imageGroup',
                                  svg: 'list-file-line',
                                  labelWidth: '126px',
                                  radio: [
                                    {
                                      label: '全部',
                                      value: 0
                                    },
                                    {
                                      label: '仅自己创建',
                                      value: 1
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        },
                        {
                          form: [
                            {
                              label: '算法联动'
                            }
                          ],
                          items: [
                            {
                              form: [
                                {
                                  type: 'CheckboxAssembly',
                                  label: '权限',
                                  svg: 'key-line',
                                  prop: 'linkage',
                                  checkbox: [
                                    {
                                      label: '操作',
                                      value: 2,
                                      relate: [1]
                                    },
                                    {
                                      label: '查看',
                                      value: 1
                                    }
                                  ],
                                  labelWidth: '126px'
                                },
                                {
                                  type: 'RadioAssembly',
                                  label: '数据',
                                  prop: 'linkageGroup',
                                  svg: 'list-file-line',
                                  labelWidth: '126px',
                                  radio: [
                                    {
                                      label: '全部',
                                      value: 0
                                    },
                                    {
                                      label: '仅自己创建',
                                      value: 1
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        },
                        {
                          form: [
                            {
                              label: '算法增强'
                            }
                          ],
                          items: [
                            {
                              form: [
                                {
                                  type: 'CheckboxAssembly',
                                  label: '权限',
                                  svg: 'key-line',
                                  prop: 'material',
                                  checkbox: [
                                    {
                                      label: '操作',
                                      value: 2,
                                      relate: [1]
                                    },
                                    {
                                      label: '查看',
                                      value: 1
                                    }
                                  ],
                                  labelWidth: '126px'
                                },
                                {
                                  type: 'RadioAssembly',
                                  label: '数据',
                                  prop: 'materialGroup',
                                  svg: 'list-file-line',
                                  labelWidth: '126px',
                                  radio: [
                                    {
                                      label: '全部',
                                      value: 0
                                    },
                                    {
                                      label: '仅自己创建',
                                      value: 1
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        },
                        {
                          form: [
                            {
                              label: '算法日志'
                            }
                          ],
                          items: [
                            {
                              form: [
                                {
                                  type: 'CheckboxAssembly',
                                  label: '权限',
                                  svg: 'key-line',
                                  prop: 'log',
                                  checkbox: [
                                    {
                                      label: '操作',
                                      value: 2,
                                      relate: [1]
                                    },
                                    {
                                      label: '查看',
                                      value: 1
                                    }
                                  ],
                                  labelWidth: '126px'
                                },
                                {
                                  type: 'RadioAssembly',
                                  label: '数据',
                                  prop: 'logGroup',
                                  svg: 'list-file-line',
                                  labelWidth: '126px',
                                  radio: [
                                    {
                                      label: '全部',
                                      value: 0
                                    },
                                    {
                                      label: '仅自己创建任务相关',
                                      value: 1
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        },
                        {
                          form: [
                            {
                              label: '报警语音'
                            }
                          ],
                          items: [
                            {
                              form: [
                                {
                                  type: 'CheckboxAssembly',
                                  label: '权限',
                                  svg: 'key-line',
                                  prop: 'alert',
                                  checkbox: [
                                    {
                                      label: '操作',
                                      value: 2,
                                      relate: [1]
                                    },
                                    {
                                      label: '查看',
                                      value: 1
                                    }
                                  ],
                                  labelWidth: '126px'
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      form: [
                        {
                          label: '开放能力'
                        }
                      ],
                      items: [
                        {
                          form: [
                            {
                              label: 'callback输出'
                            }
                          ],
                          items: [
                            {
                              form: [
                                {
                                  type: 'CheckboxAssembly',
                                  label: '权限',
                                  svg: 'key-line',
                                  prop: 'callback',
                                  checkbox: [
                                    {
                                      label: '操作',
                                      value: 2,
                                      relate: [1]
                                    },
                                    {
                                      label: '查看',
                                      value: 1
                                    }
                                  ],
                                  labelWidth: '126px'
                                }
                              ]
                            }
                          ]
                        },
                        {
                          form: [
                            {
                              label: '推送日志'
                            }
                          ],
                          items: [
                            {
                              form: [
                                {
                                  type: 'CheckboxAssembly',
                                  label: '权限',
                                  svg: 'key-line',
                                  prop: 'callbackLog',
                                  checkbox: [
                                    {
                                      label: '操作',
                                      value: 2,
                                      relate: [1]
                                    },
                                    {
                                      label: '查看',
                                      value: 1
                                    }
                                  ],
                                  labelWidth: '126px'
                                }
                              ]
                            }
                          ]
                        },
                        {
                          form: [
                            {
                              label: '对象存储'
                            }
                          ],
                          items: [
                            {
                              form: [
                                {
                                  type: 'CheckboxAssembly',
                                  label: '权限',
                                  svg: 'key-line',
                                  prop: 'oss',
                                  checkbox: [
                                    {
                                      label: '操作',
                                      value: 2,
                                      relate: [1]
                                    },
                                    {
                                      label: '查看',
                                      value: 1
                                    }
                                  ],
                                  labelWidth: '126px'
                                }
                              ]
                            }
                          ]
                        },
                        {
                          form: [
                            {
                              label: 'AppId'
                            }
                          ],
                          items: [
                            {
                              form: [
                                {
                                  type: 'CheckboxAssembly',
                                  label: '权限',
                                  svg: 'key-line',
                                  prop: 'app',
                                  checkbox: [
                                    {
                                      label: '操作',
                                      value: 2,
                                      relate: [1]
                                    },
                                    {
                                      label: '查看',
                                      value: 1
                                    }
                                  ],
                                  labelWidth: '126px'
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    },
                    {
                      form: [
                        {
                          label: '系统管理'
                        }
                      ],
                      items: [
                        {
                          form: [
                            {
                              label: '系统设置'
                            }
                          ],
                          items: [
                            {
                              form: [
                                {
                                  type: 'CheckboxAssembly',
                                  label: '权限',
                                  svg: 'key-line',
                                  prop: 'setting',
                                  checkbox: [
                                    {
                                      label: '操作',
                                      value: 2,
                                      relate: [1]
                                    },
                                    {
                                      label: '查看',
                                      value: 1
                                    }
                                  ],
                                  labelWidth: '126px'
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ],
              labelPosition: 'left'
            }
          ],
          labelPosition: 'left',
          labelWidth: '120px'
        }
      },
      groupData: [],
      departmentData: [],
      roleData: []
    }
  },
  computed: {
    ...mapGetters([
      'dialog',
      'button',
      'globalData',
      'buttonScope'
    ]),
    checkboxGroup() {
      if (this.roleDialog.option) {
        const data = this.roleDialog.option.data.authority

        const keys = Object.keys(data).filter(key => key !== 'global' && !key.includes('Group'))

        let length = 0

        keys.forEach(key => {
          length += data[key].length
        })

        return length
      } else {
        return 0
      }
    }
  },
  watch: {
    'button.value'(val) {
      this.clickButton(val)
    },
    checkboxGroup(val) {
      this.changeGlobal(val)
    },
    'globalData.checkbox': {
      handler(val) {
        if (val && val.global) {
          this.setCheckGroup(val)
        }
      },
      deep: true
    },
    'dialog.listenerClick.time': {
      handler(val) {
        if (!this.dialog.listenerClick) return

        switch (this.dialog.listenerClick.refs.componentOption.type) {
          case 'node':
            this.getNodeData()
            break
          case 'point':
            this.getPointData()
            break
          case 'user':
            this.getUserData()
            break
          default:
        }
      },
      deep: true
    }
  },
  methods: {
    changeGlobal(value) {
      const data = this.roleDialog.option.data.authority
      const checkbox = this.roleDialog.option.form[1].items[0].form[0].checkbox[0]

      if (value === 0) {
        checkbox.indeterminate = false
        data.global = []
      } else if (value === 25) {
        checkbox.indeterminate = false
        data.global = [1]
      } else {
        checkbox.indeterminate = true
        data.global = []
      }
    },
    setCheckGroup(value) {
      const data = this.roleDialog.option.data.authority
      const checkbox = Object.keys(data).filter(key => key !== 'global' && !key.includes('Group'))
      checkbox.forEach(item => {
        if (!value.global.length) {
          data[item] = []
        } else {
          if (item === 'console') {
            data[item] = [1]
          } else {
            data[item] = [2, 1]
          }
        }
      })
    },
    handleTableEvent(data) {
      if (data.value === 'selectionChange') {
        this.$set(this.dividerButtonData.buttons[2], 'disabled', !data.arg[0].length)
      }
    },
    clickButton(value) {
      switch (value) {
        case 'plus':
          this.action = 'new'
          this.openDrawer()
          break
        case 'edit':
          this.action = 'edit'
          this.openDrawer()
          break
        case 'addUser':
          this.action = 'addUser'
          this.openAddUser()
          break
        case 'tagInput-addUserGroup':
          this.openTagInput('addUser')
          break
        case 'tagInput-nodeGroup':
          this.openTagInput('node')
          break
        case 'tagInput-pointGroup':
          this.openTagInput('point')
          break
        case 'tagInput-userGroup':
          this.openTagInput('user')
          break
        case 'tagInput-roleGroup':
          this.openTagInput('role')
          break

        case 'saveNode':
          this.setTagInput('node')
          break
        case 'savePoint':
          this.setTagInput('point')
          break
        case 'saveUser':
          this.setTagInput('user')
          break
        case 'saveRole':
          this.setTagInput('role')
          break
        case 'saveAddUser':
          this.setTagInput('addUser')
          break
        case 'saveRoleData':
          this.saveRoleData()
          break
        case 'addUserToRole':
          this.addUserToRole()
          break
        case 'changePassword':
          this.changePassword()
          break
        case 'savePassword':
          this.savePassword()
          break
        case 'delete':
          this.deleteRow('all')
          break
        case 'deleteOne':
          this.deleteRow('one')
          break

        case 'showPassword':
          this.setPasswordStatus(true)
          break
        case 'hidePassword':
          this.setPasswordStatus(false)
          break
        default:
      }
    },
    openDrawer() {
      // 清空数据
      this.roleDialog = deepClone(this.roleDialogTemplate)

      const assignObj = {
        title: (this.action === 'edit' ? '编辑' : '新增') + '角色',
        show: true,
        name: 'DialogShell',
        customClass: 'dialog--small',
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '确认',
              value: 'saveRoleData',
              loading: false,
              type: 'primary'
            }
          ]
        },
        component: this.roleDialog
      }

      if (this.action === 'edit') {
        this.roleDialog.option.data = deepClone(this.currentRoleInfo)
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    getGroupData() {
      device.getCameraTree()
        .then(res => {
          const { treeData } = res.data

          treeData.forEach(tree => {
            if (tree.groupId === 0) {
              tree.children.forEach(item => {
                if (item.groupId === -1) {
                  item.disabled = true
                }
              })
            }
          })

          this.groupData = treeData
        })
    },
    getDepartmentData() {
      user.searchUserTree()
        .then(res => {
          const { treeData } = res.data

          treeData[0].children.forEach(item => {
            if (item.groupId === -1) {
              item.disabled = true
            }
          })

          this.departmentData = treeData
        })
    },
    getNodeData() {
      this.dialog.dialog.component.option.resultLoding = true
      device.getNodeData()
        .then(res => {
          const { nodeList } = res.data

          nodeList.forEach(item => {
            item.label = item.name
          })

          this.dialog.dialog.component.option.tabData[0].resultData = nodeList
          this.dialog.dialog.component.option.resultOption.data = nodeList

          this.dialog.dialog.component.option.resultLoding = false

          this.$nextTick(() => {
            this.dialog.listenerClick.refs.setTreeChecked()
          })
        })
        .catch(() => {
          this.dialog.dialog && (this.dialog.dialog.component.option.resultLoding = false)
        })
    },
    getPointData() {
      const tree = this.dialog.listenerClick.refs.currentNode

      const defaultParams = {
        parentId: tree.groupId,
        page: 1,
        size: 99999
      }

      this.dialog.dialog.component.option.resultLoding = true
      device.searchTreeNodeCamera(defaultParams)
        .then(res => {
          const { cameraList } = res.data

          cameraList.forEach(item => {
            item.label = item.name
          })

          this.dialog.dialog.component.option.tabData[1].resultData = cameraList
          this.dialog.dialog.component.option.resultOption.data = cameraList
          this.dialog.dialog.component.option.resultLoding = false

          this.$nextTick(() => {
            this.dialog.listenerClick.refs.setTreeChecked()
          })
        })
        .catch(() => {
          this.dialog.dialog.component.option.resultLoding = false
        })
    },
    getUserData() {
      const tree = this.dialog.listenerClick.refs.currentNode

      const defaultParams = {
        parentId: tree.groupId,
        page: 1,
        size: 99999
      }

      this.dialog.dialog.component.option.resultLoding = true
      user.searchTreeNodeUser(defaultParams)
        .then(res => {
          const { userList } = res.data

          userList.forEach(item => {
            item.label = item.name
          })

          if (this.action === 'addUser') {
            this.dialog.dialog.component.option.tabData[0].resultData = userList
          } else {
            this.dialog.dialog.component.option.tabData[1].resultData = userList
          }
          this.dialog.dialog.component.option.resultOption.data = userList

          this.dialog.dialog.component.option.resultLoding = false

          this.$nextTick(() => {
            this.dialog.listenerClick.refs.setTreeChecked()
          })
        })
        .catch(() => {
          this.dialog.dialog.component.option.resultLoding = false
        })
    },
    openTagInput(type) {
      const treeListDia = {
        name: 'TreeList',
        option: {
          type: '',
          bottomHead: '选择分组',
          placeholder: '搜索分组',
          tagClosable: true,
          resultLoding: false,
          tagData: [],
          tabData: [
            {
              id: '',
              label: '',
              filterBlock: '',
              treeData: {}
            }
          ],
          treeOption: {
            data: [],
            slotScope: true,
            expandOnClickNode: false,
            highlightCurrent: true,
            filterBlock: 'last',
            currentNode: 0,
            nodeKey: 'groupId',
            checkStrictly: true,
            expandedKeys: [0],
            filterInput: {
              hide: true
            },
            tooltip: {
              placement: 'top-start',
              enterable: false
            }
          }
        }
      }

      const assignObj = {
        title: '',
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
              value: '',
              type: 'primary'
            }
          ]
        },
        component: treeListDia
      }

      this.setDiaOption(type, treeListDia, assignObj)
    },
    setDiaOption(type, treeListDia, assignObj) {
      const commonResultOption = {
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
        tagSvg: '',
        tagColor: 'blue'
      }

      treeListDia.option.type = type
      treeListDia.option.resultOption = deepClone(commonResultOption)

      if (!Object.keys(this.roleDialog).length) {
        this.roleDialog = deepClone(this.roleDialogTemplate)
      }

      treeListDia.option.tagData = this.roleDialog.option.data.authority[type + 'Group']
      if (type === 'node') {
        treeListDia.option.tabData[0] = {
          id: 'node',
          label: '节点',
          filterBlock: 'rightTree',
          treeData: [
            {
              label: '全部',
              groupId: 0
            }
          ],
          treeOption: {
            showCheckbox: true,
            tagSvg: 'all-line',
            tagColor: 'blue'
          },
          resultData: []
        }
        treeListDia.option.resultOption.tagSvg = 'node'
        treeListDia.option.resultOption.tagColor = 'green'

        assignObj.title = '选择节点'
        assignObj.buttons.buttons[1].value = 'saveNode'
      } else if (type === 'point' || type === 'user') {
        treeListDia.option.tabData[0] = {
          id: 'tree',
          label: '组织架构',
          filterBlock: 'leftTree',
          treeData: type === 'point' ? this.groupData : this.departmentData,
          treeOption: {
            showCheckbox: true,
            tagSvg: type === 'point' ? 'file-line' : 'department-line',
            tagColor: 'blue'
          }
        }
        treeListDia.option.tabData[1] = {
          id: 'node',
          label: type === 'point' ? '点位' : '用户',
          filterBlock: 'rightTree',
          treeData: type === 'point' ? this.groupData : this.departmentData,
          resultData: []
        }
        treeListDia.option.resultOption.tagSvg = type === 'point' ? 'webcam-line' : 'people-line'

        assignObj.title = type === 'point' ? '选择节点' : '选择部门'
        assignObj.buttons.buttons[1].value = type === 'point' ? 'savePoint' : 'saveUser'
      } else if (type === 'role') {
        treeListDia.option.tabData[0] = {
          id: 'node',
          label: '组织架构',
          filterBlock: 'leftTree',
          treeData: this.roleData,
          treeOption: {
            showCheckbox: true,
            tagSvg: 'role-line',
            tagColor: 'blue'
          }
        }

        assignObj.title = '选择角色'
        assignObj.buttons.buttons[1].value = 'saveRole'
      } else if (type === 'addUser') {
        treeListDia.option.type = 'user'
        treeListDia.option.tabData[0] = {
          id: 'node',
          label: '用户',
          filterBlock: 'rightTree',
          treeData: this.departmentData,
          resultData: []
        }
        treeListDia.option.resultOption.tagSvg = 'people-line'

        assignObj.title = '选择用户'
        assignObj.buttons.buttons[1].value = 'saveAddUser'
      }

      this.$store.dispatch('dialog/setDialogData', { key: 'dialog', value: assignObj })
    },
    setTagInput(type) {
      if (this.action !== 'addUser') {
        this.roleDialog.option.data.authority[type + 'Group'] = deepClone(this.dialog.listenerClick.refs.tagData)
      } else {
        this.addUserDialog.option.data[type + 'Group'] = deepClone(this.dialog.listenerClick.refs.tagData)
      }

      this.$store.dispatch('dialog/initDialogData', true)
    },
    saveRoleData() {
      const data = deepClone(this.roleDialog.option.data)
      let params = {
        name: data.name,
        manage: {},
        data: {
          node: {},
          point: {},
          user: {},
          role: {}
        }
      }

      if (this.action === 'edit') {
        params.roleId = this.currentNode.groupId
      }

      Object.keys(params.data).forEach(item => {
        params.data[item].dir = []
        params.data[item].point = []

        data.authority[item + 'Group'].forEach(data => {
          if (data.groupId !== undefined) {
            params.data[item].dir.push({
              groupId: Number(data.groupId),
              label: data.label
            })
          } else if (data.id !== undefined) {
            params.data[item].point.push({
              id: Number(data.id),
              label: data.name
            })
          }
        })
      })

      params.data.camera = params.data.point

      params.data.task = {}
      params.data.task.dir = []
      if (data.authority.taskGroup === 0) {
        params.data.task.dir = [
          {
            groupId: data.authority.taskGroup
          }
        ]
      }

      params.data.image_task = {}
      params.data.image_task.dir = []
      if (data.authority.imageGroup === 0) {
        params.data.image_task.dir = [
          {
            groupId: data.authority.imageGroup
          }
        ]
      }

      params.data.task_group = {}
      params.data.task_group.dir = []
      if (data.authority.linkageGroup === 0) {
        params.data.task_group.dir = [
          {
            groupId: data.authority.linkageGroup
          }
        ]
      }

      params.data.material = {}
      params.data.material.dir = []
      if (data.authority.materialGroup === 0) {
        params.data.material.dir = [
          {
            groupId: data.authority.materialGroup
          }
        ]
      }

      params.data.log = {}
      params.data.log.dir = []
      if (data.authority.logGroup === 0) {
        params.data.log.dir = [{
          groupId: data.authority.logGroup
        }]
      }

      Object.keys(data.authority).forEach(item => {
        if (!item.includes('Group')) {
          params.manage[item] = data.authority[item].reduce((t, v) => t + v, 0)
        }
      })

      params = trimObject(params, 'name')

      this.roleDialog.option.ref.validate(valid => {
        if (valid) {
          this.dialog.buttons.buttons[1].loading = true
          this.dialog.self.$refs.buttonGroup.$forceUpdate()

          user.addRoleInTree(params)
            .then(async res => {
              this.dialog.buttons.buttons[1].loading = false
              this.dialog.self.$refs.buttonGroup.$forceUpdate()

              this.$messageInfo({
                message: (this.action === 'edit' ? '编辑' : '新增') + '角色成功!',
                type: 'success'
              })

              this.$store.dispatch('dialog/initDialogData')

              await this.searchRoleTree()

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
      if (!this.searchValue.length && true) return

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
    searchRolesWithNode(arg) {
      const defaultParams = {
        parentId: arg.groupId,
        page: this.tablePagerOption.currentPage,
        size: this.tablePagerOption.pageSizes
      }
      this.tableLoading = true
      user.searchTreeNodeRole(defaultParams).then(res => {
        this.tablePagerOption = Object.assign(this.tablePagerOption, res.data.pageVO)
        this.tableOption.tableData = res.data.userList

        this.dealTableData(res.data.userList)

        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    dealTableData() {
      this.tableOption.tableData.forEach(item => {
        this.$set(item, 'hide', [])

        if (item.roleList.includes('root')) {
          item.rowDisabled = true
          item.hide.push('deleteOne')
        }

        item.hide.push('hidePassword')
        item.isPassword = ['password']

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
      })
    },
    deleteRow(flag) {
      if (flag === 'all') {
        this.$confirm('仅移除当前用户的相关角色及权限， 仍可以在用户管理中<br/>查看相关用户信息', '批量移除用户', {
          confirmButtonText: '确定',
          confirmButtonClass: 'is-danger',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning',
          customClass: 'dialog--mini'
        }).then(async() => {
          this.tableLoading = true
          const deleteId = []
          this.$refs.formTable.selectedData.forEach(item => {
            deleteId.push(item.id)
          })
          const res = await user.userRoleRemove({ roleId: this.currentNode.groupId, userList: deleteId }).catch(() => {
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

          await this.searchRoleTree()

          this.$nextTick(() => {
            this.clickNode(this.currentNode)
          })
        })
      } else {
        this.tableLoading = true
        user.userRoleRemove({ roleId: this.currentNode.groupId, userList: [this.buttonScope.row.id] })
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

            await this.searchRoleTree()

            this.$nextTick(() => {
              this.clickNode(this.currentNode)
            })
          })
          .catch(() => {
            this.tableLoading = false
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
    }
  }
}
