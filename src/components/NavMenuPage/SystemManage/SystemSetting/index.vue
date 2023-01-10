<template>
  <div class="system-setting-container setting-layout-bg">
    <div class="system-setting-layout">
      <head-slot class="system-setting-head-slot" :component-option="{label:'系统设置',class:'is-outer'}">
        <head-slot class="system-name-head-slot" :component-option="{label:'系统名称',tip:'页内名称、浏览器标题都将使用该名称'}">
          <el-input v-model="systemNameOption.value" :size="elementSize" :placeholder="systemNameOption.placeholder" clearable />
          <button-group
            :component-option="systemNameOption.buttons"
          />
        </head-slot>
        <head-slot :component-option="{label:'系统 LOGO',tip:'建议使用带透明底的PNG图片'}">
          <common-upload :component-option="logoUpload" @handleUploadStatus="handleUploadStatus">
            <button-group
              :component-option="logoUpload.buttons"
            />
          </common-upload>
        </head-slot>
        <head-slot :component-option="{label:'浏览器标签页图标',tip:'只支持ICO格式的图标'}">
          <common-upload :component-option="icoUpload" @handleUploadStatus="handleUploadStatus">
            <button-group
              :component-option="icoUpload.buttons"
            />
          </common-upload>
        </head-slot>
      </head-slot>
    </div>
    <div class="system-setting-layout">
      <head-slot class="system-nosecret-head-slot" :component-option="{label:'免密登录',class:'is-outer'}">
        <head-slot class="system-nosecret-item-head-slot" :component-option="{label:'开关'}">
          <switch-assembly class="system-nosecret-item" :component-option="noSecret.switch" @changeValue="updateSecret" />
        </head-slot>
        <head-slot v-if="noSecret.switch.value" class="system-nosecret-item-head-slot" :component-option="{label:'登录链接'}">
          <span-assembly class="system-nosecret-item" :component-option="noSecret.url" />
        </head-slot>
        <head-slot v-if="noSecret.switch.value" class="system-nosecret-item-head-slot" :component-option="{label:'关联用户'}">
          <tag-input class="system-nosecret-item" :component-option="noSecret.user" />
        </head-slot>
      </head-slot>
    </div>
    <div class="system-setting-layout">
      <head-slot class="system-version-head-slot" :component-option="{label:'系统版本',class:'is-outer'}">
        <div v-for="version in systemVersion" :key="version.module" class="system-version-item">
          <span class="system-version-module">{{ version.module }}</span>
          <span v-if="version.type !== 'crcs'" class="system-version-version">{{ version.version }}</span>
          <span v-else class="system-version-crcs">
            <span v-for="crcs in version.version" :key="crcs" class="system-version-crcs-item">{{ crcs }}</span>
          </span>
        </div></head-slot>
    </div>
  </div>
</template>

<script>
import user from '@/api/user'
import setting from '@/api/setting'

import mixins from './Mixins'
import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'

import Config from '@/setting'
import Storage from '@/utils/token'
import HeadSlot from '@/components/Slot/HeadSlot'
import ButtonGroup from '@/components/Button/ButtonGroup'
import CommonUpload from '@/components/Upload/CommonUpload'
import switchAssembly from '@/components/InnerComponents/SwitchAssembly'
import spanAssembly from '@/components/InnerComponents/SpanAssembly'
import tagInput from '@/components/InnerComponents/TagInput'

export default {
  name: 'SystemSetting',
  components: {
    HeadSlot,
    ButtonGroup,
    CommonUpload,
    switchAssembly,
    spanAssembly,
    tagInput
  },
  mixins: [mixins],
  data() {
    return {
      systemNameOption: {
        value: '',
        placeholder: '',
        buttons: {
          buttons: [
            {
              label: '保存',
              value: 'saveName',
              type: 'text'
            }
          ]
        }
      },
      systemVersion: [
        {
          module: 'CRIP_F',
          version: Config.version
        },
        {
          module: 'CRIP_B',
          version: 'v 2.0.0'
        },
        {
          module: 'CRCS',
          version: '',
          type: 'crcs'
        }
      ],
      commonUploadOption: {
        limit: 2,
        autoUpload: true,
        slot: 'trigger',
        action: '',
        data: {
          type: ''
        },
        accept: '',
        fileList: []
      },
      logoUpload: {},
      icoUpload: {},
      noSecret: {
        switch: {
          prop: 'noSecret',
          value: false
        },
        url: {
          value: '',
          spanStyle: {
            'font-size': '14px'
          },
          copy: {
            label: '复制',
            type: 'text'
          },
          buttons: {
            buttons: [
              {
                label: '更新',
                value: 'updateSecret',
                type: 'text'
              }
            ]
          }
        },
        user: {
          prop: 'user',
          value: [],
          suffixIcon: 'el-icon-caret-bottom',
          size: 'medium'
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'elementSize',
      'dialog',
      'button'
    ])
  },
  watch: {
    'button.value'(val) {
      this.clickButton(val)
    },
    'dialog.listenerClick.time': {
      handler(val) {
        if (!this.dialog.listenerClick) return

        this.getUserData()
      },
      deep: true
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.setSystemPlaceholder()
      this.setLogoUploadOption()
      this.setIcoUploadOption()
      this.getSystemVBersion()
      this.getNosecretData()
    },
    clickButton(value) {
      switch (value) {
        case 'saveName':
          this.saveName()
          break
        case 'tagInput-user':
          this.openTagInput()
          break
        case 'saveUser':
          this.setTagInput()
          break
        case 'updateSecret':
          this.updateSecret('refresh')
          break
        default:
      }
    },
    setSystemPlaceholder() {
      const name = JSON.parse(Storage.getSession('logo')).name
      if (!name.trim().length) {
        this.systemNameOption.placeholder = Config.title
      } else {
        this.systemNameOption.placeholder = name.trim()
      }
    },
    setLogoUploadOption() {
      const logoUpload = {
        action: 'file/logo',
        data: {
          type: 'logo'
        },
        accept: '.png',
        showFileList: false,
        buttons: {
          buttons: [
            {
              label: '上传图片',
              value: 'logo',
              type: 'primary'
            }
          ]
        },
        fileList: []
      }
      this.logoUpload = deepClone(this.commonUploadOption)
      this.logoUpload = Object.assign(this.logoUpload, logoUpload)
    },
    setIcoUploadOption() {
      const icoUpload = {
        action: 'file/logo',
        data: {
          type: 'ico'
        },
        accept: '.ico',
        showFileList: false,
        buttons: {
          buttons: [
            {
              label: '上传ICO文件',
              value: 'ico',
              type: 'primary'
            }
          ]
        },
        fileList: []
      }
      this.icoUpload = deepClone(this.commonUploadOption)
      this.icoUpload = Object.assign(this.icoUpload, icoUpload)
    },
    getNosecretData() {
      setting.getNosecret()
        .then(res => {
          const { data } = res

          this.noSecret.switch.value = !!data.free

          this.noSecret.url.value = location.origin + '/#/login?free=' + data.url

          this.noSecret.user.value = [{
            id: data.user.id,
            label: data.user.name,
            tagSvg: 'people-line',
            tagType: 'node',
            tagColor: 'blue',
            nodeKey: 'id'
          }]
        })
    },
    updateSecret(value) {
      const noSecret = this.noSecret

      const params = {
        free: noSecret.switch.value ? 1 : 0,
        refresh: value === 'refresh' ? 1 : 0,
        user: noSecret.user.value[0].id
      }

      setting.setNosecret(params)
        .then(res => {
          if (value !== false) this.getNosecretData()
        })
        .catch(() => {
          this.getNosecretData()
        })
    },
    async openTagInput() {
      const treeData = await this.getDepartmentData()

      const treeListDia = {
        name: 'TreeList',
        option: {
          type: 'user',
          bottomHead: '选择用户',
          placeholder: '搜索用户',
          tagClosable: true,
          resultLoding: false,
          resultNum: 1,
          tagData: this.noSecret.user.value,
          tabData: [
            {
              id: 'node',
              label: '用户',
              filterBlock: 'rightTree',
              treeData: treeData,
              resultData: []
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
            tagSvg: 'people-line',
            tagColor: 'blue'
          }
        }
      }

      const assignObj = {
        title: '选择用户',
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
              label: '保存',
              value: 'saveUser',
              type: 'primary'
            }
          ]
        },
        component: treeListDia
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    setTagInput() {
      this.noSecret.user.value = deepClone(this.dialog.listenerClick.refs.tagData)

      if (!this.noSecret.user.value.length) {
        this.noSecret.user.value = [{
          id: 1,
          label: 'admin',
          tagSvg: 'people-line',
          tagType: 'node',
          tagColor: 'blue',
          nodeKey: 'id'
        }]
      }

      this.$store.dispatch('dialog/initDialogData')

      this.updateSecret(true)
    },
    getDepartmentData() {
      return new Promise(resolve => {
        user.searchUserTree()
          .then(res => {
            const { treeData } = res.data

            resolve(treeData)
          })
          .catch(() => {
            resolve([])
          })
      })
    },
    getUserData() {
      const tree = this.dialog.listenerClick.refs.currentNode

      const defaultParams = {
        parentId: tree.groupId,
        page: 1,
        size: 99999
      }

      this.dialog.component.option.resultLoding = true
      user.searchTreeNodeUser(defaultParams)
        .then(res => {
          const { userList } = res.data

          userList.forEach(item => {
            item.label = item.name
          })

          this.dialog.component.option.tabData[0].resultData = userList
          this.dialog.component.option.resultOption.data = userList

          this.dialog.component.option.resultLoding = false

          this.$nextTick(() => {
            this.dialog.listenerClick.refs.setTreeChecked()
          })
        })
        .catch(() => {
          this.dialog.component.option.resultLoding = false
        })
    }
  }
}
</script>

<style scoped lang="scss">
.system-setting-container {
  display: flex;
  flex-flow: column;

  &.setting-layout-bg {
    padding: 40px;
  }

  .system-setting-layout {
    display: flex;
    background-color: #fff;
    border-radius: 8px;
    padding: 16px 24px;
    margin-bottom: 20px;

    &:last-of-type {
      margin-bottom: 0;
    }

    .system-setting-head-slot{

      :deep( .head-slot-body ) {
        display: flex;
        flex-flow: column;

        .system-name-head-slot {

          .head-slot-body {
            flex-flow: row;
          }

          .el-input {
            width: 300px;
            margin-right: 24px;
          }
        }
      }
    }

    .system-nosecret-head-slot {

      :deep( .head-slot-body ) {
        display: flex;
        flex-flow: column;

        .system-nosecret-item-head-slot {
          flex-flow: row;

          .head-slot-block {
            padding-right: 24px;
            margin-bottom: 0;

            .head-slot-text {
              color: rgba(14, 27, 46, 0.5);
            }
          }

          .head-slot-body {
            line-height: 36px;
            height: 36px;

            .system-nosecret-item {
              line-height: 36px;
              height: 36px;
            }
          }
        }
      }
    }

    .head-slot-container {
      margin-bottom: 16px;

      &:last-of-type {
        margin-bottom: 0;
      }
    }

    :deep( .span-assembly-content ) {
      display: inline-block;
      margin-right: 24px;
    }

    .system-version-head-slot {

      :deep( .head-slot-body ) {
        display: flex;
        flex-flow: column;

        .system-version-item {
          line-height: 36px;
          display: flex;

          .system-version-module {
            width: 72px;
            display: inline-block;
            flex-shrink: 0;
            font-size: 14px;
            color: rgba(14, 27, 46, .5);
          }

          .system-version-version,
          .system-version-crcs {
            font-size: 14px;
            color: #0E1B2E;
          }

          .system-version-crcs {
            display: flex;
            flex-wrap: wrap;
            margin-top: -4px;

            .system-version-crcs-item {
              flex-shrink: 0;
              display: flex;
              align-items: center;
              min-width: 200px;
              background-color: #f5f7fa;
              border-radius: 4px;
              line-height: 14px;
              padding: 8px 8px;
              margin-right: 4px;
              margin-top: 4px;
            }
          }
        }
      }

    }
  }
}
</style>
