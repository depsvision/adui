<template>
  <div class="test-callback-container">
    <head-slot :component-option="{label:'发送内容'}">
      <div class="test-callback-area-block">
        <div contenteditable="true" class="test-callback-area" @blur="editTestCallback" v-html="componentOption.data" />
      </div>
      <div class="test-callback-result-block">
        <button-group
          ref="buttonGroup"
          :component-option="componentOption.buttons"
        />
        <div class="test-callback-result">
          <form-list :component-option="componentOption.formListOption" />
        </div>
      </div>
    </head-slot>
  </div>
</template>

<script>
import HeadSlot from '@/components/Slot/HeadSlot'
import ButtonGroup from '@/components/Button/ButtonGroup'
import FormList from '@/components/InnerComponents/FormList'

export default {
  name: 'TestCallback',
  components: { HeadSlot, ButtonGroup, FormList },
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
  methods: {
    editTestCallback(e) {
      this.$store.dispatch('dialog/setDialogData', { key: 'listenerData', value: e.target.innerText })
    }
  }
}
</script>

<style scoped lang="scss">
.test-callback-container {

  ::v-deep .head-slot-container {
    .head-slot-block {

      .head-slot-text {
        color: rgba(14, 27, 46, .85);
        font-weight: 600;
      }
    }

    .head-slot-body {
      flex-flow: column;
    }
  }

  .test-callback-area-block {
    height: 300px;
    overflow-y: overlay;
    white-space: pre-wrap;
    background-color: rgba(245, 247, 250, 1);
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;

    .test-callback-area {
      min-height: 268px;

      &:focus-visible {
        outline: none;
      }

      &:empty:before{
        content: '请填写callback';
        color: rgba(14, 27, 46, .35);
      }

    }
  }

  .test-callback-result-block {

    .test-callback-result {
      margin-top: 7px;

      ::v-deep .el-form {

        .el-form-item {
          margin-bottom: 0;
        }
      }
    }
  }

}
</style>
