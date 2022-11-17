<template>
  <div class="dialog-shell-container">
    <el-dialog
      :title="dialogOption.title"
      :visible.sync="dialogOption.show"
      :custom-class="dialogOption.customClass"
      :width="dialogOption.width"
      :class="innerClass"
      :fullscreen="dialogOption.fullscreen"
      :modal="dialogOption.modal"
      :show-close="dialogOption.showClose"
      :close-on-click-modal="dialogOption.clickClose"
      :close-on-press-escape="dialogOption.pressClose"
      :append-to-body="dialogOption.appendToBody"
      :before-close="closeDialog"
    >
      <div v-if="dialogOption.tip" :class="[...dialogOption.tip.class]" :style="dialogOption.tip.style">
        <svg-icon v-if="dialogOption.tip.svg" :icon-class="dialogOption.tip.svg" />
        <span>{{ dialogOption.tip.label }}</span>
      </div>
      <component
        :is="dialogOption.component.name"
        ref="component"
        :component-option="dialogOption.component.option"
      />
      <span slot="footer" class="dialog-footer">
        <span v-if="dialogOption.errorMessage" class="dialog-footer-message">{{ dialogOption.errorMessage }}</span>
        <button-group
          ref="buttonGroup"
          :component-option="dialogOption.buttons"
        />
      </span>
      <dialog-shell v-if="dialogOption.dialog" :component-option="dialogOption.dialog" />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CheckStart from '@/components/AreaComponents/CheckStart'
import TestCallback from '@/components/AreaComponents/TestCallback'
import AlgorithmPoint from '@/components/AreaComponents/AlgorithmPoint'
import CameraFrame from '@/components/AreaComponents/CameraFrame'
import HealthManager from '@/components/AreaComponents/HealthManager'

import BatchImport from '@/components/InnerComponents/BatchImport'
import FormList from '@/components/InnerComponents/FormList'
import radioAssembly from '@/components/InnerComponents/RadioAssembly'
import TreeList from '@/components/InnerComponents/TreeList'

import MpegtsMonitor from '@/components/MpegtsMonitor'
import FilterImg from '@/components/AreaComponents/FilterImg'
import FormTree from '@/components/Tree/FormTree'
import MailTemplate from '@/components/AreaComponents/MailTemplate'
import HeadSlot from '@/components/Slot/HeadSlot'
import Roi from '@/components/Roi/index.vue'
import ButtonGroup from '@/components/Button/ButtonGroup'

import multipleShell from '@/components/Dialog/multipleShell'

import CustomCombination from '@/components/CustomCombination'
import ConditionGroupList from '@/components/AreaComponents/ConditionGroup/ConditionGroupList'

export default {
  name: 'DialogShell',
  components: {
    CheckStart,
    TestCallback,
    ButtonGroup,
    AlgorithmPoint,
    CameraFrame,
    HealthManager,
    BatchImport,
    FormList,
    radioAssembly,
    TreeList,
    Roi,
    MpegtsMonitor,
    FilterImg,
    FormTree,
    MailTemplate,
    HeadSlot,

    multipleShell,

    CustomCombination,
    ConditionGroupList
  },
  mixins: [],
  props: {
    componentOption: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters([
      'button',
      'dialog',
      'screenResolution'
    ]),
    dialogOption() {
      if (Object.keys(this.componentOption).length > 0) {
        return this.componentOption
      } else {
        return this.dialog
      }
    },
    innerClass() {
      const classGroup = {}
      this.dialogOption.class && this.dialogOption.class.split(' ').forEach(item => {
        classGroup[item] = true
      })

      return classGroup
    }
  },
  watch: {
    'button.value'(val) {
      this.clickButton(val)
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.$store.dispatch('dialog/setDialogData', { key: 'self', value: this, level: this.componentOption.level })
      })
    },
    clickButton(value) {
      switch (value) {
        case 'cancel':
          this.closeDialog()
          break
        default:
      }
    },
    closeDialog() {
      this.$store.dispatch('dialog/setDialogName', this.dialog.component.name + '-' + Date.now())

      if (this.dialogOption.dialog) {
        this.$store.dispatch('dialog/initDialogData', this.dialogOption.dialog.appendToBody)
      } else {
        this.$store.dispatch('dialog/initDialogData', this.dialogOption.appendToBody)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.dialog-shell-container {
  position: absolute;
  width: 100%;
  height: 100%;

  ::v-deep .el-dialog {

    .dialog-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .dialog-footer-message {
        font-size: 12px;
        color: rgba(255, 58, 51, 1);
        margin-right: 24px;
      }

      .button-group-container {
        flex: 1;
      }
    }

    .el-loading-mask {
      border-radius: 8px;

      .el-loading-spinner{

        svg {
          height: 48px;
          width: 48px;
        }

        .el-loading-text {
          font-size: 14px;
          font-weight: 600;
          color: rgba(14, 27, 46, .85);
        }
      }
    }
  }
}
</style>
