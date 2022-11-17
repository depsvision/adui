import { deepClone, backToPositon } from '@/utils'
import { validEmail } from '@/utils/validate'
import { mapGetters } from 'vuex'

import task from '@/api/task'

import header from '@/assets/image/backGroundImage/mail-header-bg.webp'
import footer from '@/assets/image/backGroundImage/mail-footer-bg.webp'
import flow from '@/assets/image/mail/flow.webp'
import heat from '@/assets/image/mail/heat.webp'
import alarm from '@/assets/image/mail/alarm.webp'
import alarmLine from '@/assets/image/mail/alarm-line.webp'
import alarmPie from '@/assets/image/mail/alarm-pie.webp'
import point from '@/assets/image/mail/point.webp'

export default {
  data() {
    return {
      reportInfoTem: [
        {
          id: 10,
          label: '人流统计',
          tip: ' （累计流入）',
          check: true,
          image: flow,
          style: {
            padding: '16px'
          }
        },
        {
          id: 20,
          label: '热力分布',
          tip: ' （百分比）',
          check: true,
          image: heat,
          style: {
            padding: '16px'
          }
        },
        {
          id: 30,
          label: '报警次数统计表',
          check: true,
          image: alarm,
          style: {
            padding: '16px'
          }
        },
        {
          id: 40,
          label: '报警次数实时统计',
          check: true,
          image: alarmLine,
          style: {
            padding: '16px'
          }
        },
        {
          id: 50,
          label: '报警次数统计分布饼图',
          check: true,
          image: alarmPie,
          style: {
            padding: '32px'
          }
        },
        {
          id: 60,
          label: '报警点位分布Top5柱形图',
          check: true,
          image: point,
          style: {
            padding: '16px'
          }
        }
      ],
      mailDia: {},
      mailDiaTemplate: {
        name: 'multipleShell',
        option: {
          name: 'FormList',
          mainStyle: {
            height: '530px'
          },
          option: {
            class: 'is-inner',
            data: {
              addressValue: '',
              taskName: '',
              addressList: [],
              periodicType: 0,
              periodicTimeValue: '',
              enabled: true,
              taskGroup: [],
              countType: 0,
              countInterval: '',
              reportInfo: [],
              imageRecordCount: '',
              customizeHeader: '',
              customizeTail: ''
            },
            rule: {
              taskName: [
                { required: true, message: '请输入', trigger: ['blur', 'change'] },
                { max: 32, message: '长度最长为 32 个字符', trigger: ['blur', 'change'] }
              ]
            },
            formGroup: [
              {
                head: { label: '推送设置', class: 'is-weight' },
                form: [
                  {
                    type: 'inputAssembly',
                    label: '任务名称',
                    prop: 'taskName',
                    placeholder: '请输入'
                  },
                  {
                    type: 'inputAssembly',
                    label: '邮箱地址',
                    prop: 'addressValue',
                    isInlineError: true,
                    labelSvg: 'required-fill',
                    clearable: true,
                    placeholder: '请输入',
                    style: {
                      display: 'inline-block',
                      width: '264px'
                    },
                    back: {
                      type: 'ButtonGroup',
                      buttons: [
                        {
                          label: '新增',
                          value: 'addMail',
                          type: 'text',
                          class: 'is-black',
                          svgIconLeft: 'plus'
                        }
                      ]
                    },
                    bottom: {
                      type: 'SimpleList',
                      listType: 'strip',
                      prop: 'addressList',
                      bottomStyle: {
                        'margin-top': 0
                      },
                      style: {
                        'max-height': '212px'
                      },
                      itemStyle: {
                        'line-height': '36px',
                        'background-color': '#F5F7FA',
                        'border-radius': '4px',
                        'padding-left': '15px'
                      },
                      buttons: {
                        buttons: [
                          {
                            type: 'text',
                            value: 'deleteMail',
                            iconLeft: 'el-icon-delete',
                            class: 'is-black'
                          }
                        ]
                      }
                    }
                  },
                  {
                    type: 'radioAssembly',
                    label: '推送时间',
                    prop: 'periodicType',
                    radio: [
                      {
                        label: '定时推送',
                        value: 0
                      },
                      {
                        label: '间隔推送',
                        value: 1
                      }
                    ],
                    bottom: {
                      type: '',
                      timeType: 'picker',
                      valueType: 'Number',
                      min: 10,
                      max: 1439,
                      prop: 'periodicTimeValue',
                      isInlineError: true,
                      valueFormat: 'HH:mm:ss',
                      editable: false,
                      suffixSpan: '分钟',
                      style: {
                        width: '235px'
                      },
                      clearable: true,
                      placeholder: ''
                    }
                  },
                  {
                    type: 'switchAssembly',
                    label: '任务启用状态',
                    prop: 'enabled'
                  }
                ]
              },
              {
                head: { label: '推送内容', class: 'is-weight' },
                form: [
                  {
                    type: 'tagInput',
                    label: '关联任务',
                    labelSvg: 'required-fill',
                    svg: 'list-file-line',
                    prop: 'taskGroup',
                    isInlineError: true,
                    suffixIcon: 'el-icon-caret-bottom',
                    size: 'medium',
                    placeholder: '请选择'
                  },
                  {
                    type: 'radioAssembly',
                    label: '汇总时间',
                    prop: 'countType',
                    radio: [
                      {
                        label: '当天0点至今',
                        value: 0
                      },
                      {
                        label: '推送时间往前推',
                        value: 1
                      }
                    ],
                    bottom: {
                      type: '',
                      valueType: 'Number',
                      min: 10,
                      max: 1440,
                      prop: 'countInterval',
                      isInlineError: true,
                      suffixSpan: '分钟',
                      style: {
                        width: '235px'
                      },
                      clearable: true,
                      placeholder: '120'
                    }
                  },
                  {
                    type: 'DraggableList',
                    prop: 'reportInfo',
                    label: '统计信息',
                    svg: 'drag-fill',
                    style: {
                      'flex-flow': 'column'
                    },
                    dragTip: {
                      style: {
                        color: 'rgba(7, 14, 23, 0.85)',
                        'margin-bottom': '8px'
                      },
                      label: '通过拖拽，可调换排序'
                    }
                  },
                  {
                    type: 'inputAssembly',
                    label: '报警截图预览',
                    prop: 'imageRecordCount',
                    isInlineError: true,
                    inputFont: '每种算法',
                    valueType: 'Number',
                    force: [0, 5],
                    placeholder: '3',
                    suffixSpan: '张',
                    style: {
                      width: '70px'
                    }
                  },
                  {
                    type: 'inputAssembly',
                    label: '自定义开头',
                    prop: 'customizeHeader',
                    placeholder: '请输入',
                    maxlength: 256,
                    inputType: 'textarea',
                    autosize: {
                      minRows: 3
                    }
                  },
                  {
                    type: 'inputAssembly',
                    label: '自定义结尾',
                    prop: 'customizeTail',
                    placeholder: '请输入',
                    maxlength: 256,
                    inputType: 'textarea',
                    autosize: {
                      minRows: 3
                    }
                  }
                ]
              }
            ],
            labelPosition: 'left',
            labelWidth: '120px'
          }
        }
      },
      mailViewDia: {},
      mailViewDiaTemplate: {
        name: 'MailTemplate',
        head: {
          label: '邮件正文预览', class: 'is-weight'
        },
        style: {
          width: '548px',
          height: '530px'
        },
        option: {
          style: {
            container: {
              overflow: 'overlay'
            },
            block: {
              width: '360px'
            },
            header: {
              'background-image': 'url(' + header + ')',
              height: '80px'
            },
            footer: {
              'background-image': 'url(' + footer + ')',
              height: '80px'
            },
            startNode: {
              background: 'rgba(24, 114, 240, 1)'
            },
            endNode: {
              background: 'rgba(24, 204, 240, 1)'
            },
            totalNode: {
              background: 'rgba(255, 58, 51, 1)'
            },
            tail: {
              background: 'linear-gradient(180deg, #1872F0 0%, #18CCF0 100%)'
            }
          },
          title: {
            head: '',
            foot: ''
          },
          time: {
            start: '',
            end: '',
            total: '',
            svg: 'time-single-line',
            title: '报警记录汇总时间段',
            startText: '起始时间',
            endText: '结束时间',
            totalText: '累计时长'
          },
          data: [],
          screenshot: {
            label: '报警截图预览',
            tip: '（部分）',
            screenList: []
          }
        }
      },
      mailContainer: null,
      taskData: []
    }
  },
  computed: {
    ...mapGetters([
      'dialog',
      'button',
      'buttonScope',
      'globalData'
    ])
  },
  watch: {
    'button.value'(val) {
      this.clickButton(val)
    },
    'mailDia.option.option.data.reportInfo': {
      handler(val) {
        this.dialog.show && this.setMailBlock(this.globalData.clone.value)
      },
      deep: true
    },
    'mailDia.option.option.data.periodicType'(val, old) {
      if (this.dialog.show) {
        this.dealPeriodicTime(val, old)
        this.dealMailTemplate()
      }
    },
    'mailDia.option.option.data.periodicTimeValue'(val) {
      this.dialog.show && this.dealMailTemplate()
    },
    'mailDia.option.option.data.countType'(val, old) {
      if (this.dialog.show) {
        this.dealcountTime(val, old)
        this.dealMailTemplate()
      }
    },
    'mailDia.option.option.data.countInterval'(val) {
      this.dialog.show && this.dealMailTemplate()
    },
    'mailDia.option.option.data.customizeHeader'(val) {
      this.dialog.show && this.dealText(true, val)
    },
    'mailDia.option.option.data.customizeTail'(val) {
      this.dialog.show && this.dealText(false, val)
    },
    'mailDia.option.option.data.imageRecordCount'(val) {
      this.dialog.show && this.dealScreenshot(val)
    },
    'globalData.clone.value'(val) {
      this.dialog.show && this.setMailBlock(val)
    },
    'globalData.clone.positionIndex'(val) {
      this.goToPosition(val)
    },
    'dialog.show'(val) {
      if (!val) {
        this.mailDia = {}
      }
    },

    'mailDia.option.option.data.addressValue'(val) {
      if (!this.dialog.show) return

      if (val && !validEmail(val)) {
        this.$set(this.dialog.component.option.option.formGroup[0].form[1], 'errorMessage', '邮箱格式错误')
      } else {
        this.$set(this.dialog.component.option.option.formGroup[0].form[1], 'errorMessage', '')
      }
    },
    'mailDia.option.option.data.addressList'(val) {
      if (!this.dialog.show) return

      const form = this.dialog.component.option.option.formGroup[0].form[1]

      if (val && val.length) {
        form.bottom.bottomStyle = {
          'margin-top': '8px'
        }
      } else {
        form.bottom.bottomStyle = {
          'margin-top': 0
        }
      }
    }
  },
  methods: {
    clickButton(value) {
      const result = value.split('--')
      switch (result[result.length - 1]) {
        case 'add':
          this.action = 'add'
          this.showMailDia()
          break
        case 'edit':
          this.action = 'edit'
          this.showMailDia()
          break
        case 'view':
          this.viewMailTemplate()
          break
        case 'delete':
          this.deleteMailSerive()
          break

        case 'saveMailService':
          this.saveMailService()
          break

        case 'mailSetting':
          this.showMailSendDia()
          break
        case 'saveMailSetting':
          this.saveMailSetting()
          break

        case 'addMail':
          this.addMail()
          break
        case 'inputEnter-addressValue':
          this.addMail()
          break
        case 'deleteMail':
          this.deleteMail()
          break
        case 'tagInput-taskGroup':
          this.openTagInput()
          break
        case 'saveTask':
          this.saveTask()
          break
        default:
      }
    },
    getMailData(type) {
      if (!type) {
        this.pageLoading = true
      }

      const params = {
        page: this.tablePagerOption.currentPage,
        size: this.tablePagerOption.pageSizes
      }

      task.getMailService(params)
        .then(res => {
          const { taskList } = res.data

          taskList.forEach(task => {
            task.periodicType = Number(task.periodicType)
            task.time = (task.periodicType ? '间隔' : '定时') + ', ' + (task.periodicType ? ('每' + task.periodicTimeValue + '分钟') : task.periodicTimeValue)

            task.addressList = []

            task.multiple = 2
            task.addressTag = []
            task.content.addressList.forEach(item => {
              task.addressList.push({
                label: item
              })

              task.addressTag.push({
                label: item,
                value: item,
                class: 'tag-blue',
                style: {
                  'max-width': '160px'
                },
                disableTransitions: true
              })
            })
            task.addressContent = task.content.addressList.join(', ')

            task.countType = task.content.countInterval === -1 ? 0 : 1
            task.countInterval = task.countType === 1 ? task.content.countInterval : ''

            task.reportInfo = []

            task.content.reportInfoList.forEach(info => {
              const findInfo = this.reportInfoTem.find(i => i.id === info)
              task.reportInfo.push(findInfo)
            })

            const infoCahce = deepClone(this.reportInfoTem)
            const leftInfo = infoCahce.filter(i => !task.content.reportInfoList.includes(i.id))
            leftInfo.forEach(info => {
              info.check = false
            })

            task.reportInfo = task.reportInfo.concat(leftInfo)

            task.imageRecordCount = task.content.imageRecordCount
            task.customizeHeader = task.content.customizeHeader
            task.customizeTail = task.content.customizeTail
          })

          this.mailOption.tableData = taskList

          this.tablePagerOption = Object.assign(this.tablePagerOption, res.data.pageVO)

          this.pageLoading = false
        })
        .catch(() => {
          this.pageLoading = false
        })
    },
    deleteMailSerive() {
      task.deleteMailService({ taskId: this.buttonScope.row.taskId })
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: '删除邮件服务成功！'
          })

          this.getMailData()
        })
    },

    handleSwitchChange(value, scope) {
      const data = {
        normal_task: {
          taskType: 'mail_report',
          isPeriodic: 1,
          enabled: value ? 1 : 0
        },
        periodic_task: {}
      }

      task.editMailService({ taskId: scope.row.taskId }, data)
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: (value ? '开启' : '关闭') + '邮件服务成功！'
          })
        })
    },

    getTaskData() {
      const params = {
        page: 1,
        size: 99999
      }

      task.getTaskList(params)
        .then(res => {
          const { taskList } = res.data

          taskList.forEach(item => {
            item.label = item.name
          })

          this.taskData = taskList

          const mailDia = this.mailDia.option.option.data
          mailDia.taskGroup = []
          this.buttonScope.row && this.buttonScope.row.content.relatedTasks.forEach(id => {
            const task = taskList.find(task => task.id === Number(id))

            if (task) {
              mailDia.taskGroup.push({
                label: task.name,
                id: id,
                tagType: 'node',
                tagSvg: 'task-line',
                tagColor: 'blue',
                nodeKey: 'id'
              })
            }
          })
        })
    },

    showMailDia() {
      // 清空数据
      this.mailDia = deepClone(this.mailDiaTemplate)
      this.mailViewDia = deepClone(this.mailViewDiaTemplate)

      const assignObj = {
        title: this.action === 'edit' ? '编辑任务' : '新建任务',
        show: true,
        name: 'DialogShell',
        width: '1100px',
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '保存',
              value: 'saveMailService',
              type: 'primary'
            }
          ]
        },
        component: {}
      }

      const mailDia = this.mailDia

      mailDia.option.option.data.customizeHeader = '欢迎使用鲲云人工智能推理平台，以下为系统定时统计的报警信息，更多信息请前往系统查看。'
      mailDia.option.option.data.customizeTail = '以上'

      this.getTaskData()

      if (this.action === 'edit') {
        mailDia.option.option.data = Object.assign(mailDia.option.option.data, this.buttonScope.row)
      } else {
        mailDia.option.option.data.reportInfo = deepClone(this.reportInfoTem)
      }

      const cloneValue = []

      mailDia.option.option.data.reportInfo.forEach(info => {
        cloneValue.push(info.id)
      })

      this.$store.dispatch('data/setData', { obj: 'clone', key: 'value', value: cloneValue })

      mailDia.option.viewComponent = this.mailViewDia

      assignObj.component = mailDia

      this.$store.dispatch('dialog/assignDialogData', assignObj)

      this.$nextTick(() => {
        this.mailContainer = document.querySelector('.mail-template-container')
      })
    },
    viewMailTemplate() {
      // 清空数据
      this.mailViewDia = deepClone(this.mailViewDiaTemplate)

      const assignObj = {
        title: '预览邮件模板',
        show: true,
        name: 'DialogShell',
        width: '500px',
        buttons: {
          buttons: [
            {
              label: '关闭',
              value: 'cancel',
              type: 'primary'
            }
          ]
        },
        component: {}
      }

      const data = this.buttonScope.row
      const mailTem = this.mailViewDia.option

      mailTem.style.container = {}

      mailTem.title.head = data.customizeHeader
      mailTem.title.foot = data.customizeTail

      this.dealMailTemplate(data)

      mailTem.data = data.reportInfo.filter(info => info.check)

      this.dealScreenshot(data.imageRecordCount)

      assignObj.component = this.mailViewDia

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },

    saveMailService() {
      const result = this.verifyRequired()

      if (!result) {
        this.$set(this.dialog, 'errorMessage', '请检查表单项')

        return
      }

      this.mailDia.option.option.ref.validate(valid => {
        if (valid) {
          const mailDia = this.mailDia.option.option.data

          const addressList = []

          mailDia.addressList.forEach(address => {
            addressList.push(address.label)
          })

          const taskIdList = []

          mailDia.taskGroup.forEach(task => {
            taskIdList.push(task.id)
          })

          const reportInfoList = []

          mailDia.reportInfo.forEach(info => {
            if (info.check) {
              reportInfoList.push(info.id)
            }
          })

          const data = {
            normal_task: {
              taskName: mailDia.taskName,
              taskType: 'mail_report',
              isPeriodic: 1,
              enabled: mailDia.enabled ? 1 : 0
            },
            periodic_task: {
              periodicType: mailDia.periodicType,
              periodicTimeValue: mailDia.periodicType ? String(mailDia.periodicTimeValue || 120) : String(mailDia.periodicTimeValue || '08:00:00'),
              content: {
                addressList: addressList,
                relatedTasks: taskIdList,
                countInterval: mailDia.countType ? mailDia.countInterval : -1,
                reportInfoList: reportInfoList,
                imageRecordCount: mailDia.imageRecordCount || '3',
                customizeHeader: mailDia.customizeHeader,
                customizeTail: mailDia.customizeTail
              }
            }
          }

          if (this.action === 'add') {
            task.addMailService(data)
              .then(res => {
                this.$messageInfo({
                  type: 'success',
                  message: '新建邮件服务成功！'
                })

                this.$store.dispatch('dialog/initDialogData')

                this.getMailData()
              })
          } else {
            task.editMailService({ taskId: this.buttonScope.row.taskId }, data)
              .then(res => {
                this.$messageInfo({
                  type: 'success',
                  message: '修改邮件服务成功！'
                })

                this.$store.dispatch('dialog/initDialogData')

                this.getMailData()
              })
          }
        }
      })
    },
    verifyRequired() {
      let result = true

      const mailDia = this.mailDia.option.option.data

      if (!mailDia.addressList.length) {
        this.$set(this.dialog.component.option.option.formGroup[0].form[1], 'errorMessage', '请至少输入一个邮箱地址')

        result = false
      } else {
        this.$set(this.dialog.component.option.option.formGroup[0].form[1], 'errorStatus', false)
      }

      if (mailDia.periodicType === 1 && (mailDia.periodicTimeValue < 10 || mailDia.periodicTimeValue > 1439)) {
        result = false
      }

      if (!mailDia.taskGroup.length) {
        this.$set(this.dialog.component.option.option.formGroup[1].form[0], 'errorMessage', '请至少选择一个关联任务')

        result = false
      } else {
        this.$set(this.dialog.component.option.option.formGroup[1].form[0], 'errorStatus', false)
      }

      if (mailDia.countType === 1 && (mailDia.countInterval < 10 || mailDia.countInterval > 1440)) {
        result = false
      }

      return result
    },

    addMail() {
      const data = this.mailDia.option.option.data

      if (!data.addressValue) return

      if (data.addressList.find(item => item.label === data.addressValue)) {
        this.$set(this.dialog.component.option.option.formGroup[0].form[1], 'errorMessage', '邮箱地址已存在')

        return
      } else if (data.addressList.length >= 20) {
        this.$set(this.dialog.component.option.option.formGroup[0].form[1], 'errorMessage', '最多可设置20个邮箱地址')

        return
      } else {
        this.$set(this.dialog.component.option.option.formGroup[0].form[1], 'errorMessage', '')
      }

      data.addressList.unshift({
        label: data.addressValue
      })

      data.addressValue = ''
    },
    deleteMail() {
      const data = this.mailDia.option.option.data

      data.addressList.splice(data.addressList.findIndex(list => list.label === this.buttonScope.label), 1)
    },
    openTagInput() {
      const treeListDia = {
        name: 'TreeList',
        option: {
          type: '',
          bottomHead: '选择任务',
          placeholder: '搜索任务',
          tagClosable: true,
          resultLoding: false,
          tagData: this.mailDia.option.option.data.taskGroup,
          tabData: [
            {
              id: 'node',
              label: '任务',
              filterBlock: 'rightTree',
              treeData: [
                {
                  label: '全部',
                  groupId: 0
                }
              ],
              resultData: this.taskData
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
          },
          resultOption: {
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
            tagSvg: 'task-line',
            tagColor: 'blue'
          }
        }
      }

      const assignObj = {
        title: '选择任务',
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
              value: 'saveTask',
              type: 'primary'
            }
          ]
        },
        component: treeListDia
      }

      this.$store.dispatch('dialog/setDialogData', { key: 'dialog', value: assignObj })
    },
    saveTask() {
      const data = this.mailDia.option.option.data

      data.taskGroup = deepClone(this.dialog.listenerClick.refs.tagData)

      if (data.taskGroup.length) {
        this.$set(this.dialog.component.option.option.formGroup[1].form[0], 'errorMessage', '')
      }

      this.$store.dispatch('dialog/initDialogData', true)
    },

    dealNull(val) {
      const mailDia = val || this.mailDia.option.option.data

      const result = { ...mailDia }

      if (!mailDia.periodicType) {
        result.periodicTimeValue = mailDia.periodicTimeValue || '08:00:00'
      } else {
        result.periodicTimeValue = mailDia.periodicTimeValue || 120
      }

      result.countInterval = mailDia.countInterval || 120

      return result
    },

    dealMailTemplate(val) {
      const data = this.dealNull(val)

      const mailTem = this.mailViewDia.option

      if (this.mailContainer) {
        backToPositon(this.mailContainer, 0, 500)
      }

      const nowDate = this.$dayjs().format('YYYY年MM月DD日')
      if (!data.periodicType) {
        mailTem.time.end = nowDate + ' ' + data.periodicTimeValue
      } else {
        const nowMinute = this.$dayjs().hour() * 60 + this.$dayjs().minute()
        const isFront = Math.floor(nowMinute / data.periodicTimeValue) > 0

        if (isFront) {
          const interval = nowMinute % data.periodicTimeValue

          mailTem.time.end = this.$dayjs().subtract(interval, 'm').format('YYYY年MM月DD日 HH:mm:00')
        } else {
          mailTem.time.end = nowDate + ' ' + (Math.floor(data.periodicTimeValue / 60) > 9 ? Math.floor(data.periodicTimeValue / 60) : ('0' + Math.floor(data.periodicTimeValue / 60))) + ':' + (data.periodicTimeValue % 60 > 9 ? data.periodicTimeValue % 60 : ('0' + data.periodicTimeValue % 60)) + ':00'
        }
      }

      if (!data.countType) {
        mailTem.time.start = nowDate + ' ' + '00:00:00'
      } else {
        mailTem.time.start = this.$dayjs(mailTem.time.end, 'YYYY年MM月DD日 HH:mm:ss').subtract(data.countInterval, 'm').format('YYYY年MM月DD日 HH:mm:ss')
      }

      const diff = this.$dayjs(mailTem.time.end, 'YYYY年MM月DD日 HH:mm:ss').diff(this.$dayjs(mailTem.time.start, 'YYYY年MM月DD日 HH:mm:ss'), 'm')
      mailTem.time.total = Math.floor(diff / 60) + '小时' + diff % 60 + '分'
    },
    dealPeriodicTime(val, old) {
      const data = this.mailDia.option.option.data
      const form = this.mailDia.option.option.formGroup[0].form[2]

      if (old !== undefined) {
        data.periodicTimeValue = ''
      }

      if (!val) {
        form.bottom.type = 'timeSelect'
        form.bottom.placeholder = '08:00:00'
      } else {
        form.bottom.type = 'inputAssembly'
        form.bottom.placeholder = '120'
      }
    },
    dealcountTime(val, old) {
      const data = this.mailDia.option.option.data
      const form = this.mailDia.option.option.formGroup[1].form[1]

      if (old !== undefined) {
        data.countInterval = ''
      }

      if (val) {
        form.bottom.type = 'inputAssembly'
      } else {
        form.bottom.type = ''
      }
    },
    dealText(type, val) {
      const mailTem = this.mailViewDia.option

      if (type) {
        if (this.mailContainer) {
          backToPositon(this.mailContainer, 0, 500)
        }

        mailTem.title.head = val
      } else {
        if (this.mailContainer) {
          backToPositon(this.mailContainer, 'bottom', 500)
        }

        mailTem.title.foot = val
      }
    },
    dealScreenshot(val) {
      const imageRecordCount = val || '3'

      const mailTem = this.mailViewDia.option
      mailTem.screenshot.screenList = []

      const screenContainer = document.querySelector('.mail-template-screenshot')

      if (this.mailContainer && screenContainer) {
        this.$nextTick(() => {
          backToPositon(this.mailContainer, screenContainer.offsetTop, 500)
        })
      }

      for (let i = 0; i < Number(imageRecordCount); i++) {
        mailTem.screenshot.screenList.push({
          svg: 'empty-image',
          time: this.$dayjs().format('YYYY-MM-DD | HH:mm:ss'),
          algorithm: {
            id: Math.floor(Math.random() * 10),
            label: '算法类型'
          },
          point: {
            id: Math.floor(Math.random() * 100000),
            label: '点位名称'
          }
        })
      }
    },
    setMailBlock(val) {
      const data = this.mailDia.option.option.data
      const mailTem = this.mailViewDia.option

      const finalData = []
      const dataCache = []
      val.forEach(v => {
        const info = data.reportInfo.find(info => info.check && info.id === v)
        info && finalData.push(info)

        const cache = data.reportInfo.find(info => info.id === v)
        cache && dataCache.push(cache)
      })

      if (!mailTem.data.length) {
        mailTem.data = finalData
      } else if (mailTem.data.length === finalData.length) {
        if (this.globalData.clone.index.length) {
          const switchIndex = deepClone(this.globalData.clone.index)

          if (dataCache[switchIndex[0]].check && dataCache[switchIndex[1]].check) {
            mailTem.data.splice(switchIndex[1], 0, mailTem.data.splice(switchIndex[0], 1)[0])
          }
        }
      } else if (mailTem.data.length > finalData.length) {
        const index = mailTem.data.findIndex(d => !finalData.includes(d))

        mailTem.data.splice(index, 1)
      } else if (mailTem.data.length < finalData.length) {
        const index = finalData.findIndex(v => !mailTem.data.includes(v))

        mailTem.data.splice(index, 0, finalData[index])
      }
    },
    goToPosition(val) {
      const transitionContainer = document.querySelector('.mail-image-transiton')
      const dragList = document.querySelectorAll('.mail-template__image')

      this.$nextTick(() => {
        if (this.mailContainer && transitionContainer && dragList[val]) {
          this.$nextTick(() => {
            backToPositon(this.mailContainer, transitionContainer.offsetTop + dragList[val].offsetTop, 100)
          })
        }
      })
    }
  }
}
