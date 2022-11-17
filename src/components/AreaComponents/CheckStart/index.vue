<template>
  <div class="check-start-container">
    <head-slot v-if="componentOption.action === 'start'" :component-option="{label:componentOption.check.head}">
      <div class="check-start--check">
        <div
          v-for="check in componentOption.check.list"
          :key="check.label"
          class="check-start--check-item"
        >
          <div v-if="check.head" class="check-item-head">
            <span>
              <svg-icon :icon-class="labelSvg(check.item)" />
              {{ check.head }}
            </span>
            <div v-for="item in check.item" :key="item.label" class="check-item-block">
              <span class="check-item-label" :style="{width:componentOption.check.labelWidth - 16 + 'px'}">
                <svg-icon :icon-class="labelSvg(false)" />
                {{ item.label }}
              </span>
              <span class="check-item-value">
                <loaing-tick v-if="checkCache.loading[item.prop] && !checkCache.svgIcon[item.prop]" :size="20" class="waitting-loadiing" />
                <svg-icon
                  v-if="checkCache.svgIcon[item.prop]"
                  :icon-class="checkCache.svgIcon[item.prop]"
                  :class="'svg-'+componentOption.check.svgIcon[item.prop]"
                  class="check-item-svg"
                />
                <span>{{ checkCache.data[item.prop] }}</span>
              </span>
            </div>
          </div>
          <div v-else class="check-item-block">
            <span class="check-item-label" :style="{width:componentOption.check.labelWidth + 'px'}">
              <svg-icon :icon-class="labelSvg(true)" />
              {{ check.label }}
            </span>
            <span class="check-item-value">
              <loaing-tick v-if="checkCache.loading[check.prop] && !checkCache.svgIcon[check.prop]" :size="20" class="waitting-loadiing" />
              <svg-icon
                v-if="checkCache.svgIcon[check.prop]"
                :icon-class="checkCache.svgIcon[check.prop]"
                :class="'svg-'+componentOption.check.svgIcon[check.prop]"
                class="check-item-svg"
              />
              <span>{{ checkCache.data[check.prop] }}</span>
            </span>
          </div>
        </div>
      </div>
    </head-slot>
    <head-slot
      v-for="start in componentOption.start.item"
      :key="start.head"
      :component-option="{label:start.head}"
      class="check-start--start"
    >
      <div class="check-start--start-item">
        <svg-icon
          v-if="(showStartStatus && componentOption.start.svgIcon[start.prop] && componentOption.start.svgIcon[start.prop] !== 'waitting-loadiing')"
          :icon-class="componentOption.start.svgIcon[start.prop]"
          :class="'svg-'+componentOption.start.svgIcon[start.prop]"
          class="start-item-svg"
        />
        <loaing-tick v-else class="waitting-loadiing" :size="32" :style="controlAnimation(start)" />
        <div class="start-item-block">
          <span v-show="waitShowData(start,'data')">{{ waitShowData(start,'data') }}</span>
          <span class="start-item-content">
            <span v-html="waitShowData(start,'text')" />
            <button-group
              v-if="componentOption.start.buttons &&
                componentOption.start.buttons[start.prop] &&
                componentOption.start.buttons[start.prop].length"
              class="start-item-buttons"
              :component-option="{buttons:componentOption.start.buttons[start.prop]}"
            />
          </span>
        </div>
      </div>
    </head-slot>
  </div>
</template>

<script>
import HeadSlot from '@/components/Slot/HeadSlot'
import LoaingTick from '@/components/SvgAnimation/LoadingTick'
import ButtonGroup from '@/components/Button/ButtonGroup'

import { mapGetters } from 'vuex'

export default {
  name: 'CheckStart',
  components: { HeadSlot, LoaingTick, ButtonGroup },
  props: {
    componentOption: {
      type: Object,
      default: function() {
        return {

        }
      }
    }
  },
  data() {
    return {
      checkCache: {
        data: {},
        svgIcon: {},
        loading: {}
      },
      dataKeysRecord: 0,
      showStartStatus: false,
      timeout: null
    }
  },
  computed: {
    ...mapGetters([
      'dialog'
    ]),
    waitShowData() {
      return (start, attribute) => {
        let result = null
        if (this.showStartStatus) {
          result = this.componentOption.start[attribute][start.prop]
        } else {
          result = this.componentOption.start[attribute][start.prop + 'Cache'] ||
                    this.componentOption.start[attribute][start.prop]
        }
        return result
      }
    },
    controlAnimation() {
      return start => {
        const style = {}
        if (!this.componentOption.start.svgIcon[start.prop] && this.showStartStatus) {
          style['animation-play-state'] = 'paused'
        } else {
          style['animation-play-state'] = 'running'
        }
        return style
      }
    },
    labelSvg() {
      return flag => {
        return flag ? 'unordered-fill' : 'unordered-line'
      }
    }
  },
  watch: {
    'componentOption.check': {
      handler(val) {
        if (val) {
          if (this.componentOption.action === 'start') {
            this.cacheData(val)
          } else {
            this.$nextTick(() => {
              this.showStart()
            })
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  beforeDestroy() {
    if (!this.componentOption.noDispatch) {
      this.$store.dispatch('dialog/setDialogComponentData', { obj: 'checkStart', key: 'waitting', value: false })
    }

    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  },
  methods: {
    cacheData(value) {
      const dataFirstKeys = Object.keys(value.data)[0]
      this.$set(this.checkCache.loading, dataFirstKeys, true)

      this.setTimeOutWait(value)
    },
    setTimeOutWait(value) {
      const random = this.componentOption.random || [5, 12]
      const radomTime = 100 * (Math.floor(Math.random() * (random[1] - random[0])) + random[0])
      const dataKeys = Object.keys(value.data)

      this.timeout = setTimeout(() => {
        this.$set(this.checkCache.svgIcon, dataKeys[this.dataKeysRecord], value.svgIcon[dataKeys[this.dataKeysRecord]])
        this.$set(this.checkCache.data, dataKeys[this.dataKeysRecord], value.data[dataKeys[this.dataKeysRecord]])
        this.$set(this.checkCache.loading, dataKeys[this.dataKeysRecord + 1], value.data[dataKeys[this.dataKeysRecord]])
        this.dataKeysRecord++

        if (this.dataKeysRecord < dataKeys.length) {
          this.setTimeOutWait(value)
        } else {
          this.dataKeysRecord = 0
          this.showStart()
        }
      }, radomTime)
    },
    showStart() {
      this.showStartStatus = true

      if (!this.componentOption.noDispatch) {
        this.$store.dispatch('dialog/setDialogComponentData', { obj: 'checkStart', key: 'waitting', value: true })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.check-start-container {

  ::v-deep .head-slot-container {

    .head-slot-block {
      height: 36px;
      line-height: 36px;
      color: rgba(14, 27, 46, .85) !important;
      font-weight: 600;
      margin-bottom: 0;
    }

    .head-slot-body {

      .check-start--check {
        flex: 1;
        margin-bottom: 16px;

        .check-start--check-item {
          line-height: 36px;

          .check-item-head {

            &>span {
              display: inline-block;
            }

            &>.check-item-block {
              border-left: 2px solid rgba(14, 27, 46, 0.1);
              padding-left: 8px;
              margin-left: 6px;
            }
          }

          .check-item-block {
            height: 36px;
            line-height: 36px;

            span {
              height: 36px;
              line-height: 36px;
            }
          }

          .check-item-label {
            display: inline-block;
          }

          .check-item-value {

            .waitting-loadiing {
              vertical-align: middle;
            }

            .check-item-svg {
              position: relative;
              top: 2px;
              font-size: 20px;
              margin-right: 8px;
            }
          }
        }
      }
    }

    &+.head-slot-container {
      margin-top: 16px;
    }
  }

  .check-start--start {

    &:last-of-type {
      margin-bottom: 0;
    }

    .check-start--start-item {
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
      min-height: 56px;
      background-color: rgba(245, 247, 250, 1);
      border-radius: 4px;
      padding: 12px 21px 12px 72px;

      .waitting-loadiing {
        position: absolute;
        top: 12px;
        left: 20px;
        flex-shrink: 0;
      }

      .start-item-svg {
        position: absolute;
        top: 12px;
        left: 20px;
        height: 32px;
        width: 32px;
        flex-shrink: 0;
      }

      .start-item-block {
        display: flex;
        flex-flow: column;

        &>span {
          font-size: 14px;
          color: rgba(14, 27, 46, .85);
          line-height: 20px;

          &:first-child {
            line-height: 14px;
            font-weight: 600;
            margin-bottom: 8px;
          }
        }

        .start-item-content {
          display: flex;

          .start-item-buttons {
            margin-left: 4px;

            ::v-deep .el-button {

              &>span {
                line-height: 1;
              }
            }
          }
        }
      }
    }
  }

  .check-item-block {
    display: flex;

    span {
      height: 20px;
      line-height: 20px;
    }
  }

}
</style>
