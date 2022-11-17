import device from '@/api/device'
import { mapGetters } from 'vuex'
import { trimObject, formatDate, deepClone } from '@/utils'

export default {
  data() {
    return {
      pointTimer: null,
      percentage: 0,
      pointDialog: {},
      pointDialogTemplate: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            name: '',
            stream: '',
            streamUrl: '',
            type: [],
            gps: '',
            parentGroup: [],
            typeTab: '',
            brand: '',
            ip: '',
            port: null,
            user: '',
            password: '',
            digit: 0,
            initPictureData: {
              url: null,
              width: '',
              height: ''
            }
          },
          rule: {
            name: [
              { required: true, message: '请输入点位名称', trigger: ['blur', 'change'] }
            ]
          },
          form: [],
          labelPosition: 'left',
          labelWidth: '120px'
        }
      },
      systemForm: [
        {
          type: 'inputAssembly',
          label: '名称',
          prop: 'name',
          placeholder: '请输入点位名称',
          style: {
            width: '224px'
          }
        },
        {
          type: 'tagInput',
          label: '选择分组',
          prop: 'parentGroup',
          suffixIcon: 'el-icon-caret-bottom',
          size: 'medium',
          placeholder: '请选择分组',
          tagInputStyle: {
            width: '224px'
          }
        },
        {
          type: 'inputAssembly',
          label: 'GPS信息',
          prop: 'gps',
          placeholder: '请输入GPS信息',
          style: {
            width: '224px'
          }
        },
        {
          type: 'selectAssembly',
          label: '设备应用场景',
          prop: 'type',
          size: 'medium',
          multiple: true,
          collapseTags: true,
          selectClass: ['tag-blue'],
          selectStyle: {
            width: '224px'
          },
          placeholder: '请选择应用场景',
          option: [
            {
              label: '视频监控',
              value: 1
            },
            {
              label: 'SDK抓图',
              value: 2
            }
          ]
        },
        {
          type: 'tabAssembly',
          label: null,
          prop: 'typeTab',
          class: 'no-label form-label--top',
          hide: true,
          option: []
        },
        {
          type: 'pointImg',
          label: '图片初始化',
          prop: 'initPictureData',
          loading: false,
          width: '1920',
          height: '1080',
          widthPrepend: '长',
          heightPrepend: '宽',
          class: 'is-inner',
          inputStyle: {
            width: '80px'
          },
          buttons: {
            buttons: [
              {
                label: '上传图片',
                value: 'importImg',
                svgIconLeft: 'image-line',
                type: 'text'
              },
              {
                label: '获取抓图',
                value: 'dragImg',
                svgIconLeft: 'camera-line',
                type: 'text',
                hide: true
              }
            ]
          }
        }
      ],
      videoSceneForm: [
        {
          type: 'inputAssembly',
          label: '原始流地址',
          prop: 'stream',
          inputType: 'textarea',
          resize: 'none',
          style: {
            height: '72px'
          },
          placeholder: 'rtsp://',
          tool: {
            label: '快速填写',
            tag: [
              {
                label: '海康',
                value: 'tag',
                data: 'rtsp://username:password@ip:port/h264/ch1/main/av_stream',
                style: {
                  color: 'rgba(24, 114, 240, 1)',
                  'background-color': 'rgba(24, 114, 240, .05)',
                  'border-color': 'rgba(24, 114, 240, .1)'
                }
              },
              {
                label: '大华',
                value: 'tag',
                data: 'rtsp://username:password@ip:port/cam/realmonitor?channel=1&subtype=',
                style: {
                  color: 'rgba(255, 110, 38, 1)',
                  'background-color': 'rgba(255, 110, 38, .05)',
                  'border-color': 'rgba(255, 110, 38, .1)'
                }
              },
              {
                label: '其他',
                value: 'tag',
                data: 'rtsp://',
                style: {
                  color: 'rgba(14, 27, 46, 1)',
                  'background-color': 'rgba(14, 27, 46, .05)',
                  'border-color': 'rgba(14, 27, 46, .1)'
                }
              }
            ]
          }
        },
        {
          type: 'spanAssembly',
          label: '平台流地址',
          prop: 'streamUrl',
          input: false,
          autoSave: true,
          spanStyle: {
            width: '306px',
            'margin-right': '32px'
          },
          buttons: {
            buttons: [
              {
                label: '编辑',
                value: 'editStreamUrl',
                type: 'text',
                class: 'is-black',
                svgIconLeft: 'edit-2-line'
              }
            ]
          }
        }
      ],
      sdkSceneForm: [
        {
          type: 'selectAssembly',
          label: '品牌',
          prop: 'brand',
          size: 'medium',
          labelSvg: 'required-fill',
          isInlineError: true,
          selectStyle: {
            width: '224px'
          },
          placeholder: '请选择品牌',
          option: [
            {
              label: '海康',
              value: 'hik'
            },
            {
              label: '大华',
              value: 'dh'
            }
          ],
          afterSelect: this.afterSelect
        },
        {
          type: 'inputAssembly',
          label: 'IP',
          prop: 'ip',
          placeholder: '请输入IP',
          labelSvg: 'required-fill',
          isInlineError: true,
          style: {
            width: '224px'
          }
        },
        {
          type: 'inputAssembly',
          label: 'Port',
          prop: 'port',
          placeholder: '请输入端口号',
          min: 0,
          max: 65535,
          valueType: 'Number',
          labelSvg: 'required-fill',
          isInlineError: true,
          style: {
            width: '224px'
          }
        },
        {
          type: 'inputAssembly',
          label: '用户名',
          prop: 'user',
          placeholder: '请输入用户名',
          labelSvg: 'required-fill',
          isInlineError: true,
          style: {
            width: '224px'
          }
        },
        {
          type: 'inputAssembly',
          label: '密码',
          prop: 'password',
          placeholder: '请输入密码',
          labelSvg: 'required-fill',
          isInlineError: true,
          style: {
            width: '224px'
          }
        },
        {
          type: 'selectAssembly',
          label: '抓图通道',
          prop: 'digit',
          size: 'medium',
          selectStyle: {
            width: '224px'
          },
          placeholder: '请选择抓图通道',
          option: []
        }
      ],
      sceneCacheForm: [],
      videoSourceForm: [
        {
          type: 'spanAssembly',
          label: '平台ID',
          prop: 'source'
        },
        {
          type: 'spanAssembly',
          label: '外键',
          prop: 'fk'
        },
        {
          type: 'spanAssembly',
          label: '名称',
          prop: 'name'
        },
        {
          type: 'spanAssembly',
          label: '分析流地址',
          prop: 'stream'
        },
        {
          type: 'spanAssembly',
          label: '平台流地址',
          prop: 'streamUrl',
          input: false,
          autoSave: true,
          spanStyle: {
            width: '306px',
            'margin-right': '32px'
          },
          buttons: {
            buttons: [
              {
                label: '编辑',
                value: 'editStreamUrl',
                type: 'text',
                class: 'is-black',
                svgIconLeft: 'edit-2-line'
              }
            ]
          }
        },
        {
          type: 'inputAssembly',
          label: 'GPS信息',
          prop: 'gps',
          placeholder: '请输入GPS信息'
        },
        {
          type: 'pointImg',
          label: '图片初始化',
          prop: 'initPictureData',
          loading: false,
          width: '1920',
          height: '1080',
          widthPrepend: '长',
          heightPrepend: '宽',
          class: 'is-inner',
          inputStyle: {
            width: '80px'
          },
          buttons: {
            buttons: [
              {
                label: '上传图片',
                value: 'importImg',
                svgIconLeft: 'image-line',
                type: 'text'
              },
              {
                label: '获取抓图',
                value: 'dragImg',
                svgIconLeft: 'camera-line',
                type: 'text'
              }
            ]
          }
        }
      ],
      uploadOption: {
        limit: 1,
        autoUpload: true,
        slot: 'trigger',
        action: 'file/',
        data: {
          type: 'cameraPicture'
        },
        accept: '.png,.jpg,.jpeg'
      },
      batchImport: {
        name: 'BatchImport',
        option: {
          action: 'file/',
          importTip: '如果检测到流地址一致，则将覆盖该数据',
          limit: 2,
          data: {
            type: 'xlsxU'
          },
          accept: '.xls,.xlsx',
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
      },
      MpegtsMonitor: {
        name: 'MpegtsMonitor',
        option: {
          url: '',
          tipList: []
        }
      },
      filterDialog: {
        name: 'FilterImg',
        option: {
          tip: '过滤图片用于算法分析时的报警过滤，请在任务中进行详细配置；当前最多支持 5 张预存图片',
          loading: false,
          upFit: 'cover',
          downFit: 'contain',
          picture: [],
          buttons: {
            buttons: [
              {
                label: '上传本地图片',
                value: 'importImg',
                svgIconLeft: 'empty-image',
                type: 'text'
              },
              {
                label: '摄像头抓图',
                value: 'dragImg',
                svgIconLeft: 'camera-fill',
                type: 'text'
              }
            ]
          }
        }
      },
      errorMessageChache: {},
      optionErrorCache: {}
    }
  },
  computed: {
    ...mapGetters([
      'dialog',
      'button',
      'buttonScope',
      'deliver'
    ])
  },
  watch: {
    'button.value'(val) {
      this.clickButton(val)
    },
    'deliver.tag': {
      handler(val) {
        this.setTagValue()
      },
      deep: true
    },
    'batchImport.option.info': {
      handler(val) {
        this.handleImportStatus(val)
      },
      deep: true
    },
    'pointDialog.option.data.type': {
      handler(val) {
        if (this.isSystemTree) {
          this.setTypeTab()
        }
      },
      deep: true
    },
    'pointDialog.option.data.typeTab': {
      handler(val) {
        if (this.isSystemTree) {
          this.setTabForm()
        }
      },
      deep: true
    }
  },
  methods: {
    setTypeTab() {
      const option = this.pointDialog.option

      const type = option.data.type

      option.form = deepClone(this.systemForm)

      const initPicture = option.form.find(item => item.prop === 'initPictureData')
      initPicture.buttons.buttons[1].hide = !type.length

      const tabOption = [
        {
          label: '视频监控',
          value: '1',
          error: false
        },
        {
          label: 'SDK 抓图',
          value: '2',
          error: false
        }
      ]

      const sortType = [...type].sort((a, b) => a - b)

      tabOption.forEach(item => {
        const scenesForm = {
          '1': deepClone(this.videoSceneForm),
          '2': deepClone(this.sdkSceneForm)
        }

        if (!sortType.includes(Number(item.value))) {
          this.optionErrorCache[item.value] = false

          scenesForm[item.value].forEach(form => {
            if (['port'].includes(form.prop)) {
              option.data[form.prop] = null
            } else if (['digit'].includes(form.prop)) {
              option.data[form.prop] = 0
            } else {
              option.data[form.prop] = ''
            }

            if (form.isInlineError) {
              this.errorMessageChache[form.prop] = ''
            }
          })
        }
      })

      if (type.length) {
        const typeTab = option.form.find(item => item.prop === 'typeTab')

        typeTab.hide = false

        sortType.forEach(item => typeTab.option.push(tabOption[Number(item) - 1]))

        option.data.typeTab = String(sortType[0])
      } else {
        option.data.typeTab = ''
      }

      this.sceneCacheForm = deepClone(option.form)

      this.setTabForm()
    },
    setTabForm() {
      const option = this.pointDialog.option
      const typeTab = option.data.typeTab

      const finalForm = deepClone(this.sceneCacheForm)

      switch (typeTab) {
        case '1':
          finalForm.splice(finalForm.length - 1, 0, ...this.videoSceneForm)
          break
        case '2':
          finalForm.splice(finalForm.length - 1, 0, ...this.sdkSceneForm)
          break
        default:
          break
      }

      this.$set(option, 'form', finalForm)

      option.form.forEach(item => {
        if (item.isInlineError) {
          this.$set(item, 'errorMessage', this.errorMessageChache[item.prop])
        }
      })

      const tabForm = option.form.find(item => item.prop === 'typeTab')
      tabForm.option.forEach(op => {
        op.error = this.optionErrorCache[op.value]
      })
    },

    afterSelect() {
      const data = this.pointDialog.option.data

      const config = {
        port: {
          hik: 8000,
          dh: 37777
        },
        digit: {
          hik: 1,
          dh: 0
        }
      }

      data.port = config.port[data.brand]
      data.digit = config.digit[data.brand]
    },

    handleTableEvent(data) {
      if (data.value === 'selectionChange') {
        this.$set(this.dividerButtonData.buttons[3], 'disabled', !data.arg[0].length)
        this.$set(this.dividerButtonData.buttons[4], 'disabled', !data.arg[0].length)
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
          //  导入提交按钮
        case 'innerImport':
          this.importCamera()
          break
        case 'import':
          this.showBatchImport()
          break
        case 'export':
          this.exportTable('')
          break
        case 'downloadTemplate':
          this.exportTable('template')
          break
        case 'refresh':
          this.refreshRow()
          break
        case 'refreshOne':
          this.refreshRow(true)
          break
        case 'view':
          this.viewCamera()
          break
        case 'delete':
          this.deleteRow('all')
          break
        case 'deleteOne':
          this.deleteRow('one')
          break
        case 'tagInput-parentGroup':
          this.openTagInput()
          break
        case 'savePointGroup':
          this.setTagInput()
          break
        case 'importImg':
          this.importImg()
          break
        case 'dragImg':
          this.dragImg()
          break
        case 'savePointData':
          this.savePointData()
          break
        case 'openFilterImg':
          this.action = 'filter'
          this.openFilterImg()
          break
        case 'saveFilterData':
          this.saveFilterData()
          break
        case 'editStreamUrl':
          this.editStreamUrl()
          break

        case 'inputBlur-stream':
          this.autoSetStream('streamUrl', 'stream')
          break
        case 'inputBlur-streamUrl':
          this.autoSetStream('stream', 'streamUrl')
          break

        // tree
        case 'videoSourceSetting':
          this.videoSourceSetting()
          break
        case 'addSource':
          this.sourceAction = 'add'
          this.addSource()
          break
        case 'editSource':
          this.sourceAction = 'edit'
          this.addSource()
          break
        case 'saveSource':
          this.saveSource()
          break
        case 'deleteSource':
          this.deleteSource()
          break
        default:
      }
    },
    importImg() {
      this.$refs.upload.$el.click()
    },
    dragImg() {
      let option = null
      let streamUrl = null
      let loadingObj = null

      const params = {
        streamUrl: streamUrl
      }

      if (this.action === 'filter') {
        option = this.filterDialog.option
        streamUrl = this.buttonScope.row.streamUrl
        loadingObj = option

        params.streamUrl = streamUrl

        if (!streamUrl.length) {
          this.$messageInfo({
            message: '请先填写流地址后再尝试!',
            type: 'warning'
          })
          return
        }
      } else {
        option = this.pointDialog.option

        params.cameraId = option.data.id ?? null
        params.streamUrl = option.data.streamUrl
        params.brand = option.data.brand
        params.ip = option.data.ip
        params.port = option.data.port
        params.user = option.data.user
        params.password = option.data.password
        params.digit = option.data.digit

        streamUrl = option.data.streamUrl ?? ''
        loadingObj = option.form.find(item => item.prop === 'initPictureData')

        let errorMessage = '请先填写'
        let error = false

        option.data.type.forEach((item, index) => {
          if (index > 0) {
            errorMessage += '或'
          }
          switch (item) {
            case 1:
              if (params.streamUrl === '') {
                error = true
                errorMessage += '流地址'
              }
              break
            case 2:
              if (!params.brand || !params.ip || params.port === null || !params.user || !params.password) {
                error = true
                errorMessage += 'SDK参数'
              }
              break
            default:
              break
          }
        })

        errorMessage += '后再尝试!'

        if (error) {
          this.$messageInfo({
            message: errorMessage,
            type: 'warning'
          })
          return
        }
      }

      loadingObj.loading = true

      this.action === 'edit' && (params.cameraId = this.buttonScope.row.id)

      device.getCameraPicture(params).then(res => {
        if (this.action === 'filter') {
          const filterImg = this.dialog.self.$refs.component
          option.picture.push({
            path: res.data.path,
            url: res.data.url
          })

          filterImg.chooseItem(option.picture[option.picture.length - 1])
        } else {
          option.data.initPictureData.url = res.data.url
          option.data.initPicturePath = res.data.path
          this.getPictureResolution(this.pointDialog.option.data.initPictureData.url)
        }

        loadingObj.loading = false
      }).catch(() => {
        loadingObj.loading = false
      })
    },
    async importCamera() {
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
    handleImportStatus(info) {
      if (info.value === 'success') {
        device.importCamera(info.arg[0].response.data)
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
    handleUploadStatus(info) {
      if (info.value === 'success') {
        this.$messageInfo({
          type: 'success',
          message: '上传成功！'
        })

        if (this.action === 'filter') {
          const filterImg = this.dialog.self.$refs.component
          const option = this.filterDialog.option

          option.picture.push({
            path: info.arg[0].response.data.path,
            url: info.arg[0].response.data.url
          })

          filterImg.chooseItem(option.picture[option.picture.length - 1])
        } else {
          this.pointDialog.option.data.initPictureData.url = URL.createObjectURL(info.arg[0].raw)
          this.getPictureResolution(info.arg[0].response.data.url)
          this.pointDialog.option.data.initPicturePath = info.arg[0].response.data.path
        }
      } else if (info.value === 'error') {
        this.$messageInfo({
          type: 'error',
          message: '上传失败！'
        })
      }
    },
    getPictureResolution(url) {
      const that = this
      const image = new Image()
      image.src = url
      image.onload = function() {
        that.pointDialog.option.data.initPictureData.width = image.naturalWidth
        that.pointDialog.option.data.initPictureData.height = image.naturalHeight
      }
    },
    setTagValue() {
      const data = deepClone(this.deliver)
      this.pointDialog.option.data[data.form.prop] = data.tag.data

      this.autoSetStream('streamUrl', 'stream')
    },
    openTagInput() {
      const treeListDia = {
        name: 'TreeList',
        option: {
          bottomHead: '选择分组',
          placeholder: '搜索分组',
          tagClosable: true,
          treeLoding: false,
          tagData: this.pointDialog.option.data.parentGroup,
          tabData: [
            {
              id: 'tree',
              label: '组织架构',
              filterBlock: 'leftTree',
              treeData: this.systemTree
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
            showCheckbox: true,
            tooltip: {
              placement: 'top-start',
              enterable: false
            },
            tagSvg: 'file-line',
            tagColor: 'blue'
          }
        }
      }

      const assignObj = {
        title: '选择分组',
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
              value: 'savePointGroup',
              type: 'primary'
            }
          ]
        },
        component: treeListDia
      }

      this.$store.dispatch('dialog/setDialogData', { key: 'dialog', value: assignObj })
    },
    setTagInput() {
      this.pointDialog.option.data.parentGroup = deepClone(this.dialog.listenerClick.refs.treeTagData)
      this.$store.dispatch('dialog/initDialogData', true)
    },
    searchCameras(type, isTimer) {
      if (!this.searchValue.length && type) return

      const defaultParams = {
        keyword: this.searchValue,
        page: this.tablePagerOption.currentPage,
        size: this.tablePagerOption.pageSizes
      }
      this.tableLoading = !isTimer
      device.searchCamera(defaultParams).then(res => {
        this.tablePagerOption = Object.assign(this.tablePagerOption, res.data.pageVO)
        this.AiMonitoringPointOption.tableData = res.data.cameraList
        this.dealSearchData(this)
        this.tree.setCurrentKey(0)

        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    dealSearchData(that) {
      if (!that.AiMonitoringPointOption.tableData.some(item => item.status === 2)) {
        clearInterval(this.pointTimer)

        this.pointTimer = null
      } else {
        if (!this.pointTimer) {
          this.pointTimer = setInterval(() => {
            this.searchCamerasWithNode(this.currentNode, true)
          }, 5000)
        }
      }

      that.AiMonitoringPointOption.tableData.forEach(item => {
        const root = this.tree.getNodePath(this.currentNode)[0]

        root && (item.source = root.source)

        item.fk = item.fk ?? '--'

        item.url = item.initPicture

        item.streamUrlString = item.streamUrl
        if (!item.streamUrl) {
          item.streamUrlString = '--'
        }

        const typeArr = [1, 2]
        const typeCache = []
        typeArr.forEach(key => {
          if ((key & item.type) === key) {
            typeCache.push(key)
          }
        })
        item.type = typeCache

        const typeObj = {
          1: '视频监控设备',
          2: 'SDK 抓图设备'
        }
        item.typeString = ''
        item.type.forEach((key, index) => {
          if (index > 0) {
            item.typeString += ', '
          }
          item.typeString += typeObj[key]
        })

        // 处理过滤图片
        item.filterString = !item.filter.length ? '无' : (item.filter.length + ' 张')

        // 处理分组回显
        item.parentGroup = []

        const parentId = item.parentID.split(',')
        const parentLabel = item.parentList.split(',')

        parentId.forEach((id, index) => {
          !!id && item.parentGroup.push({
            label: parentLabel[index],
            groupId: id,
            tagType: 'tree',
            tagSvg: 'file-line',
            tagColor: 'blue',
            type: 'success',
            nodeKey: 'groupId'
          })
        })

        // 处理链接状态、直播流disabled
        if (item.status === 2) {
          item.statusName = ' '
          item.spanLoading = ['statusName']
          item.disabled = ['refreshOne']
        } else if (item.status === 0) {
          item.spanLoading = []
          item.disabled = []
          item.statusName = '离线'
          item.statusNameClass = 'is-grey'
          item.buttonDisabled = {
            button: ['view'],
            disabled: true
          }
        } else if (item.status === 1) {
          item.spanLoading = []
          item.disabled = []
          item.statusName = '在线'
          item.statusNameClass = 'is-green'
          item.buttonDisabled = {
            button: ['view'],
            disabled: false
          }
        }

        if (!item.type.includes(1)) {
          item.statusName = '无'
          item.statusNameClass = 'is-grey'
          item.hide = ['view', 'refreshOne']
        } else {
          item.hide = []
        }
      })

      that.AiMonitoringPointOption.imageViewer = {
        show: true,
        imageList: that.AiMonitoringPointOption.tableData,
        infoHeader: '点位信息',
        infoDisplay: {
          name: '点位名称',
          streamUrl: '平台流地址',
          gps: 'GPS信息',
          statusName: '连接状态'
        },
        infoSpecial: {
          statusName: {
            class: 'status-mark',
            key: 'statusNameClass'
          }
        }
      }
    },
    searchCamerasWithNode(data, type) {
      if (!type) {
        this.tableLoading = true
      }

      const defaultParams = {
        parentId: data.groupId,
        page: this.tablePagerOption.currentPage,
        size: this.tablePagerOption.pageSizes
      }

      device.searchTreeNodeCamera(defaultParams).then(res => {
        const { data } = res

        this.tablePagerOption = Object.assign(this.tablePagerOption, data.pageVO)
        this.AiMonitoringPointOption.tableData = data.cameraList
        this.dealSearchData(this)

        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    async viewCamera() {
      const assignObj = {
        title: '直播流',
        show: true,
        name: 'DialogShell',
        customClass: 'dialog--medium dialog-height--medium',
        component: this.MpegtsMonitor
      }

      this.MpegtsMonitor.option.code = ''
      this.MpegtsMonitor.option.url = ''

      this.MpegtsMonitor.option.tipList = [
        {
          label: this.buttonScope.row.name,
          style: {
            'font-size': '14px',
            color: 'rgba(14, 27, 46, 0.85)'
          }
        }
      ]
      this.MpegtsMonitor.option.error = {
        label: '无法获取当前点位的视频流, 请尝试刷新!'
      }
      this.MpegtsMonitor.option.buttons = ['refresh']

      this.$store.dispatch('dialog/assignDialogData', assignObj)

      const videoCache = await this.$store.dispatch('video/getStreamUrl', {
        id: this.buttonScope.row.id,
        name: this.buttonScope.row.name
      })

      if (videoCache) {
        this.MpegtsMonitor.option.code = videoCache.code
        this.MpegtsMonitor.option.url = videoCache.url
      } else {
        device.getDeviceCameraStream({ cameraId: this.buttonScope.row.id })
          .then(res => {
            const { data } = res

            this.MpegtsMonitor.option.code = data.code_type
            this.MpegtsMonitor.option.url = data.url

            this.$store.dispatch('video/storeStreamUrl', {
              id: this.buttonScope.row.id,
              name: this.buttonScope.row.name,
              code: data.code_type,
              url: data.url
            })
          })
          .catch(err => {
            if (err !== 'cancel') {
              this.MpegtsMonitor.option.code = ''
              this.MpegtsMonitor.option.url = ''
            }
          })
      }
    },
    async refreshRow(flag) {
      const res = await device.cameraRefresh({ cameraId: flag ? [this.buttonScope.row.id] : null }).catch(() => {

      })

      if (!res) return
      const requestInfo = res.requestInfo
      if (requestInfo.flag) {
        this.$messageInfo({
          message: '操作成功!',
          type: 'success'
        })
      }

      this.searchCamerasWithNode(this.currentNode, true)

      if (!this.pointTimer) {
        this.pointTimer = setInterval(() => {
          this.searchCamerasWithNode(this.currentNode, true)
        }, 5000)
      }
    },
    deleteRow(flag) {
      if (flag === 'all') {
        if (this.$refs.formTable.selectedData.length === 0) {
          this.$messageInfo({
            message: '请选择要删除的信息!',
            type: 'warning'
          })
          return
        }
        this.$confirm('确定删除 ' + '<span class="is-red--text"><strong>' + this.$refs.formTable.selectedData.length + '</strong></span>' + ' 项所选项', '提示', {
          confirmButtonText: '删除',
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
          const res = await device.deleteCamera({ camera: deleteId }).catch(() => {
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

          await this.searchCameraTree()

          this.$nextTick(() => {
            this.clickNode(this.currentNode)
          })
        })
      } else {
        this.tableLoading = true
        device.deleteCamera({ camera: [this.buttonScope.row.id] })
          .then(async res => {
            this.$messageInfo({
              message: '删除成功!',
              type: 'success'
            })

            const index = this.AiMonitoringPointOption.tableData.findIndex(row => this.buttonScope.row.id === row.id)
            if (index !== -1) {
              this.AiMonitoringPointOption.tableData.splice(index, 1)
            }

            this.tableLoading = false
            this.reverseSelect([this.buttonScope.row.id])

            await this.searchCameraTree()

            this.$nextTick(() => {
              this.clickNode(this.currentNode)
            })
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
    openDrawer() {
      // 清空数据
      this.pointDialog = deepClone(this.pointDialogTemplate)

      this.setEditorDisplay()

      const assignObj = {
        title: (this.action === 'edit' ? '编辑' : '新增') + '点位',
        show: true,
        name: 'DialogShell',
        width: '552px',
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '保存',
              value: 'savePointData',
              loading: false,
              type: 'primary'
            }
          ]
        },
        component: this.pointDialog
      }

      if (this.action === 'edit') {
        const data = Object.assign(this.pointDialog.option.data, this.buttonScope.row)

        data.initPictureData = {
          url: data.initPicture,
          width: data.width,
          height: data.height
        }
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    savePointData() {
      const data = deepClone(this.pointDialog.option.data)
      const parentList = []

      data.parentGroup.forEach(item => {
        parentList.push(Number(item.groupId))
      })

      this.pointDialog.option.ref.validate(valid => {
        const validScenes = this.validScenes()

        if (valid && validScenes) {
          let params = deepClone(data)

          params.type = 0

          data.type.forEach(item => {
            params.type += item
          })
          params.width = data.initPictureData.width
          params.height = data.initPictureData.height
          params.parentList = parentList
          params.initPicture = data.initPicturePath

          const trimArr = ['name', 'stream', 'streamUrl', 'gps', 'width', 'height']
          params = trimObject(params, ...trimArr)

          this.dialog.buttons.buttons[1].loading = true
          this.dialog.self.$refs.buttonGroup.$forceUpdate()

          device.editCamera(params)
            .then(async res => {
              this.dialog.buttons.buttons[1].loading = false
              this.dialog.self.$refs.buttonGroup.$forceUpdate()

              this.$messageInfo({
                message: (this.action === 'edit' ? '编辑' : '新增') + '点位成功!',
                type: 'success'
              })

              this.$store.dispatch('dialog/initDialogData')

              await this.searchCameraTree()

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
    validScenes() {
      let result = true

      if (this.isSystemTree) {
        const scenesForm = {
          '1': deepClone(this.videoSceneForm),
          '2': deepClone(this.sdkSceneForm)
        }

        const data = this.pointDialog.option.data
        const pointForm = this.pointDialog.option.form

        data.type.forEach(key => {
          const tabForm = pointForm.find(item => item.prop === 'typeTab')
          const option = tabForm.option.find(item => item.value === String(key))
          let sceneError = false

          scenesForm[key].forEach(form => {
            if (form.isInlineError) {
              const validForm = pointForm.find(item => item.prop === form.prop)

              if (form.prop === 'brand') {
                const errorMessage = data[form.prop] ? '' : '请选择品牌'
                validForm && this.$set(validForm, 'errorMessage', errorMessage)
                this.errorMessageChache[form.prop] = errorMessage

                if (data[form.prop] === null) {
                  result = false
                  sceneError = true
                }
              } else if (form.prop === 'port') {
                const errorMessage = data[form.prop] >= 0 && data[form.prop] <= 65535 ? '' : '请输入大于 0 小于 65535 的值'
                validForm && this.$set(validForm, 'errorMessage', errorMessage)
                this.errorMessageChache[form.prop] = errorMessage

                if (data[form.prop] < 0 || data[form.prop] > 65535) {
                  result = false
                  sceneError = true
                }
              } else {
                const errorMessage = data[form.prop] ? '' : form.placeholder
                validForm && this.$set(validForm, 'errorMessage', errorMessage)
                this.errorMessageChache[form.prop] = errorMessage

                if (!data[form.prop]) {
                  result = false
                  sceneError = true
                }
              }
            }
          })

          option.error = sceneError
          this.optionErrorCache[String(key)] = sceneError
        })
      }

      return result
    },

    editStreamUrl() {
      const form = this.pointDialog.option.form

      const streamUrl = form.find(item => item.prop === 'streamUrl')

      streamUrl.input = true
    },
    autoSetStream(autoKey, key) {
      const data = this.pointDialog.option.data

      if (!data[autoKey] && this.isSystemTree) {
        this.$set(data, autoKey, data[key])
      }
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
    async exportTable(flag) {
      const exportId = []

      if (flag !== 'template') {
        this.$refs.formTable.selectedData.forEach(item => {
          exportId.push(item.id)
        })
      }

      const { data } = await device.exportCamera({ camera: exportId, name: '点位信息列表' + formatDate(Date.now(), 'full', 'file') + '.xlsx' })
      const a = document.createElement('a')
      a.href = data.url
      a.click()
    },
    openFilterImg() {
      const assignObj = {
        title: '过滤图片',
        show: true,
        name: 'DialogShell',
        width: '767px',
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '保存',
              value: 'saveFilterData',
              loading: false,
              type: 'primary'
            }
          ]
        },
        component: this.filterDialog
      }

      this.filterDialog.option.id = this.buttonScope.row.id
      this.filterDialog.option.picture = deepClone(this.buttonScope.row.filter)
      this.filterDialog.option.picture.forEach(item => {
        item.id = item.filterId
      })

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    saveFilterData() {
      const params = {
        cameraId: this.filterDialog.option.id,
        pictureList: []
      }

      this.filterDialog.option.picture.forEach(item => {
        params.pictureList.push(item.path)
      })

      device.saveFilterPicture(params)
        .then(async res => {
          this.$messageInfo({
            message: '保存过滤图片成功!',
            type: 'success'
          })

          this.$store.dispatch('dialog/initDialogData')

          await this.searchCameraTree()

          this.$nextTick(() => {
            this.clickNode(this.currentNode)
          })
        })
    },

    setEditorDisplay() {
      const option = this.pointDialog.option

      if (this.isSystemTree) {
        option.form = deepClone(this.systemForm)
      } else {
        option.form = deepClone(this.videoSourceForm)
      }
    }
  }
}
