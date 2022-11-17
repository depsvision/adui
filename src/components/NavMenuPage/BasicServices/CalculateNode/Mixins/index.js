import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      nodeTimer: null,
      nodeManager: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          form: [
            {
              label: '节点列表',
              type: 'FormTable',
              tableData: [],
              containerClass: ['inner-form-table'],
              option: {
                maxHeight: 236
              },
              header: [
                {
                  width: 110,
                  align: 'left',
                  fixed: 'right',
                  label: '操作',
                  type: 'buttonGroup',
                  buttonGroup: {
                    buttons: [
                      {
                        label: '编辑',
                        value: 'editNode',
                        type: 'text'
                      },
                      {
                        label: '删除',
                        value: 'deleteNode',
                        type: 'text',
                        popoverclass: 'is-danger',
                        tip: '删除物理节点后，所有关联的服务也将会被删除，请谨慎操作！',
                        svgIcon: 'warning',
                        width: 400
                      }
                    ]
                  }
                },
                {
                  minWidth: 200,
                  align: 'left',
                  label: '节点名称',
                  prop: 'name',
                  type: 'span',
                  showOverflowTooltip: true
                },
                {
                  minWidth: 140,
                  align: 'left',
                  label: 'IP',
                  prop: 'ip',
                  type: 'span',
                  showOverflowTooltip: true
                },
                {
                  width: 80,
                  align: 'left',
                  label: '内网端口',
                  prop: 'port',
                  type: 'span'
                },
                {
                  width: 80,
                  align: 'left',
                  label: '平台端口',
                  prop: 'platPort',
                  type: 'span',
                  class: 'status-mark'
                },
                {
                  width: 90,
                  align: 'left',
                  label: 'Flight 状态',
                  prop: 'NMStatus',
                  type: 'span',
                  class: 'status-mark'
                }
              ],
              top: {
                type: 'ButtonGroup',
                buttons: [
                  {
                    label: '新增',
                    value: 'addNode',
                    type: 'text',
                    disabled: false,
                    class: 'is-black',
                    svgIconLeft: 'plus'
                  }
                ]
              }
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
      'button'
    ])
  },
  watch: {
    'button.value'(val) {
      this.clickButton(val)
    }
  },
  methods: {
    clickButton(value) {
      switch (value) {
        // node
        case 'nodeManage':
          this.manageNodes()
          break
        case 'addNode':
          this.action = 'add'
          this.showNodeDia()
          break
        case 'editNode':
          this.action = 'edit'
          this.showNodeDia('edit')
          break
        case 'saveNode':
          this.saveNode()
          break
        case 'refreshNode':
          this.getNodeData(false)
          break
        case 'deleteNode':
          this.deleteNode()
          break
        case 'restartNode':
          this.restartNode()
          break

        // health
        case 'healthManage':
          this.showHealthManage()
          break
        case 'defaultRules':
          this.recoverDefaultRules()
          break
        case 'executeRule':
          this.executeRule()
          break
        case 'saveHealthRules':
          this.saveHealthRules()
          break
        case 'setCaisaValue':
          this.resetCaisa()
          break

        // service
        case 'addService':
          this.action = 'add'
          this.showServiceDia()
          break
        case 'editService':
          this.action = 'edit'
          this.showServiceDia()
          break
        case 'saveService':
          this.saveService()
          break
        case 'deleteService':
          this.deleteService()
          break
        case 'refreshService':
          this.loadingMask(this.buttonScope.id)
          this.getServiceData(this.buttonScope.id)
          break
        case 'restartAllService':
          this.restartAllService()
          break
        case 'getServiceHealthDetail':
          this.getServiceHealthDetail()
          break
        case 'refreshDetail':
          this.refreshDetail()
          break
        case 'changeAlgorithm':
          this.changeAlgorithm()
          break
        case 'tagInput-algorithmGroup':
          this.openTagInput()
          break
        case 'chooseAlgorithm':
          this.chooseAlgorithm()
          break
        case 'startAlgorithm':
          this.startAlgorithm()
          break
        default:
      }
    },
    manageNodes() {
      const assignObj = {
        title: 'Node 节点管理',
        show: true,
        name: 'DialogShell',
        width: '928px',
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

      assignObj.component = this.nodeManager

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    }
  }
}
