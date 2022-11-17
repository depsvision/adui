import user from '@/api/user'
import device from '@/api/device'

import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'

export default {
  data() {
    return {
      faceFeatureDialog: {},
      faceFeatureDialogTem: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            features: -1,
            extractRange: 0,
            tagManage: '',
            tag: []
          },
          form: [
            {
              type: 'selectAssembly',
              label: '特征提取',
              prop: 'features',
              size: 'medium',
              option: [],
              selectStyle: {
                width: '250px'
              },
              tipStyle: {
                height: '12px',
                color: '#006AFF'
              },
              tip: '',
              placeholder: '请选择节点服务',
              top: {
                type: 'selectAssembly',
                prop: 'extractRange',
                size: 'medium',
                topStyle: {
                  display: 'inline-flex',
                  'margin-right': '8px'
                },
                option: [
                  {
                    label: '所有',
                    value: 0
                  },
                  {
                    label: '未提取',
                    value: 1
                  }
                ],
                selectStyle: {
                  width: '144px'
                },
                placeholder: '提取范围'
              },
              back: {
                type: 'ButtonGroup',
                buttons: [
                  {
                    label: '提取人脸特征',
                    value: 'extractAllFeatures',
                    disabled: true,
                    type: 'text',
                    class: 'is-black',
                    svgIconLeft: 'face-id-line'
                  }
                ]
              }
            },
            {
              type: 'inputAssembly',
              label: '标签管理',
              prop: 'tagManage',
              style: {
                width: '402px'
              },
              isInnerError: true,
              error: '',
              placeholder: '请输入唯一标签名称',
              back: {
                type: 'ButtonGroup',
                buttons: [
                  {
                    label: '保存新增',
                    value: 'addTag',
                    type: 'text',
                    class: 'is-black',
                    svgIconLeft: 'plus'
                  }
                ]
              },
              bottom: {
                type: 'tagAssembly',
                prop: 'tag',
                closable: true,
                bottomStyle: {
                  height: '200px',
                  'background-color': '#F5F7FA',
                  'border-radius': '4px',
                  overflow: 'overlay'
                },
                style: {
                  flex: 1,
                  'align-items': 'unset',
                  padding: '5px 18px 5px 0',
                  'flex-wrap': 'wrap'
                },
                tagStyle: {
                  margin: '3px 0 3px 8px'
                }
              }
            }
          ],
          labelPosition: 'left',
          labelWidth: '120px'
        }
      },
      faceFeature: null
    }
  },
  computed: {
    ...mapGetters([
      'dialog',
      'buttonScope'
    ])
  },
  watch: {
    'userDialog.option.data.pictureUrl'(val) {
      if (!this.dialog.show) return

      const form = this.userDialog.option.form[0]
      const buttonTip = form.buttons.buttonTip

      this.faceFeature = null
      form.closeDisabled = false
      buttonTip.loading = false
      buttonTip.show = false
    },
    'faceFeatureDialog.option.data.tagManage'(val) {
      if (!this.dialog.show) return

      const option = this.faceFeatureDialog.option

      const hasRepeat = option.data.tag.some(tag => tag.label === option.data.tagManage)

      if (hasRepeat) {
        this.$set(option.form[1], 'error', '标签已存在')

        return
      } else {
        this.$set(option.form[1], 'error', '')
      }
    },
    'faceFeatureDialog.option.data.features'(val, old) {
      if (this.faceFeatureDialog.option) {
        const form = this.faceFeatureDialog.option.form[0]

        form.back.buttons[0].disabled = !(val !== undefined && val !== null)
      }

      if (old !== undefined && old !== -1) {
        this.changeFaceConfig(val)
      }
    },
    'dialog.show'(val) {
      if (!val) {
        this.faceFeatureDialog = {}
      }
    }
  },
  methods: {
    getServiceList() {
      return new Promise((resolve, reject) => {
        const params = {
          type: 2,
          algorithm: 24
        }

        device.getServiceList(params)
          .then(res => {
            resolve(res.data)
          })
          .catch(() => {
            resolve('')
          })
      })
    },
    async faceManage() {
      // 清空数据
      this.faceFeatureDialog = deepClone(this.faceFeatureDialogTem)

      const assignObj = {
        title: '人脸特征管理',
        show: true,
        name: 'DialogShell',
        width: '698px',
        buttons: {
          buttons: [
            {
              label: '关闭',
              value: 'cancel',
              type: 'primary'
            }
          ]
        },
        component: this.faceFeatureDialog
      }

      const option = this.faceFeatureDialog.option

      const service = await this.getServiceList()

      if (service) {
        const { serviceList } = service

        serviceList.forEach(item => {
          item.value = item.id

          item.label = item.name + '-' + item.id + ' ( ' + ['离线', '在线', '占用'][item.status] + ' )'

          item.disabled = item.status !== 1
        })

        option.form[0].option = serviceList
      }

      let faceData = []
      const faceTag = await this.getFaceTag()
      if (faceData) {
        faceTag.fixTag.forEach(item => {
          item.value = item.id
          item.label = item.name
          item.closable = false
          item.class = 'tag-blue'
        })
        faceTag.tagList.forEach(item => {
          item.value = item.id
          item.label = item.name
          item.closable = true
          item.class = 'tag-purple'
        })
        faceData = faceTag.fixTag.concat(faceTag.tagList)
      }

      option.data.tag = faceData

      const hasService = option.form[0].option.some(item => item.value === faceTag.service)

      option.data.features = hasService ? faceTag.service : ''

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    addFaceTag() {
      const option = this.faceFeatureDialog.option

      if (option.data.tagManage === '' || option.form[1].error) return

      user.addUserTag({ name: option.data.tagManage })
        .then(res => {
          const { id } = res.data

          option.data.tag.push({
            id: id,
            label: option.data.tagManage,
            value: id,
            closable: true,
            class: 'tag-purple'
          })

          option.data.tagManage = ''
        })
    },
    closeTag() {
      const option = this.faceFeatureDialog.option

      user.deleteUserTag({ id: this.buttonScope.id })
        .then(res => {
          option.data.tag.splice(option.data.tag.findIndex(item => item.id === this.buttonScope.id), 1)
        })
    },
    extractFeatures() {
      const form = this.userDialog.option.form[0]
      const buttonTip = form.buttons.buttonTip

      form.closeDisabled = true
      buttonTip.loading = true

      const data = deepClone(this.userDialog.option.data)
      const params = {
        path: data.pictureUrlPath
      }

      user.extractFeatures(params)
        .then(res => {
          const { data } = res

          form.closeDisabled = false
          buttonTip.loading = false
          buttonTip.show = true
          buttonTip.head = '提取' + ['', '成功', '失败'][data.status]
          buttonTip.headColor = ['', 'is-blue', 'is-red'][data.status]
          buttonTip.content = ['', '', '请检查照片是否合规，以及算法任务是否开启'][data.status]

          this.faceFeature = [null, data.feature, []][data.status]
        })
        .catch(err => {
          form.closeDisabled = false
          buttonTip.loading = false
          buttonTip.show = true
          buttonTip.head = '提取失败'
          buttonTip.headColor = 'is-red'
          buttonTip.content = err

          this.faceFeature = []
        })
    },
    changeFaceConfig(val) {
      if (val === '' || val === undefined) return

      user.changeFaceConfig({ serviceId: val })
        .then(res => {
          this.$messageInfo({
            message: '设置节点服务成功!',
            type: 'success'
          })
        })
    },
    extractAllFeatures() {
      const form = this.faceFeatureDialog.option.form[0]
      const data = this.faceFeatureDialog.option.data

      const params = {
        type: data.extractRange
      }

      user.extractAllFeatures(params)
        .then(res => {
          form.tip = '操作成功，请在列表中查看提取结果明细'
          form.tipStyle.color = '#1872F0'
        })
        .catch(err => {
          form.tip = err
          form.tipStyle.color = '#FF3A33'
        })
    }
  }
}
