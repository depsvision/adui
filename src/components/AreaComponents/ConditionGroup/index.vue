<template>
  <div class="condition-group-container" :style="componentOption.style">
    <div class="group-item-head">
      <div class="item-head-name">
        <span
          v-show="!showInput"
          @click="focusInput"
          v-html="componentOption.head.name"
        />
        <el-input
          v-show="showInput"
          ref="nameInput"
          v-model="componentOption.head.name"
          plain
          size="small"
          :style="{
            width: `${componentOption.head.width || 224}px`
          }"
          @blur="showInput = false"
        />
      </div>
      <button-group
        v-if="componentOption.head.buttons"
        :component-option="componentOption.head.buttons"
        :scope="{id: componentOption.id}"
      />
    </div>
    <div class="group-item-condition small-buttons">
      <div v-if="componentOption.condition.algorithm" class="condition-item">
        <div class="condition-item-label" :style="componentOption.condition.labelStyle">{{ componentOption.condition.algorithm.label }}</div>
        <div class="condition-item-params">
          <tag-assembly :component-option="componentOption.condition.algorithm.content" />
        </div>
      </div>
      <div v-if="componentOption.condition.rule" class="condition-item">
        <div class="condition-item-label" :style="componentOption.condition.labelStyle">{{ componentOption.condition.rule.label }}</div>
        <div class="condition-item-params">
          <button-group
            :component-option="componentOption.condition.rule.buttons"
            :scope="{id: componentOption.id}"
          />
          <span class="rule-text">{{ componentOption.condition.rule.tip }}</span>
        </div>
      </div>
      <div v-if="componentOption.condition.judgment" class="condition-item">
        <div class="condition-item-label" :style="componentOption.condition.labelStyle">{{ componentOption.condition.judgment.label }}</div>
        <div class="condition-item-params">
          <div v-for="(input,inputIndex) in componentOption.condition.judgment.input" :key="inputIndex">
            <el-input
              v-model="input.value"
              size="default"
              :style="{
                width: `${input.width}px`
              }"
              :placeholder="input.placeholder"
              @input="handleInput(input)"
            >
              <span v-if="input.unit" slot="suffix" class="judgment-unit">{{ input.unit }}</span>
            </el-input>
            <span v-if="input.text" class="judgment-text">{{ input.text }}</span>
            <el-select
              v-if="input.select"
              v-model="input.select.value"
              class="judgment-select"
              size="default"
              :style="{
                width: `${input.select.width}px`
              }"
              :placeholder="input.select.placeholder"
            >
              <el-option
                v-for="select in input.select.option"
                :key="select.value"
                :label="select.label"
                :value="select.value"
              />
            </el-select>
          </div>
        </div>
      </div>
      <div v-if="componentOption.condition.output" class="condition-item">
        <div class="condition-item-label" :style="componentOption.condition.labelStyle">{{ componentOption.condition.output.label }}</div>
        <div class="condition-item-params">
          <el-input
            v-model="componentOption.condition.output.value"
            size="default"
            :style="{
              width: `${componentOption.condition.output.width}px`
            }"
            :placeholder="componentOption.condition.output.placeholder"
            @input="handleInput(componentOption.condition.output)"
          />
          <span class="output-text">{{ componentOption.condition.output.tip }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import ButtonGroup from '@/components/Button/ButtonGroup'
import tagAssembly from '@/components/InnerComponents/TagAssembly'

export default {
  name: 'ConditionGroup',
  components: { ButtonGroup, tagAssembly },
  props: {
    componentOption: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      showInput: true
    }
  },
  watch: {
    'componentOption.initShowInput': {
      handler(val) {
        if (typeof val !== 'undefined') {
          this.showInput = val
        }
      },
      immediate: true
    }
  },
  methods: {
    focusInput() {
      if (typeof this.componentOption.canChangeName !== 'undefined' && !this.componentOption.canChangeName) {
        return
      }

      this.showInput = true

      this.$nextTick(() => {
        this.$refs.nameInput.focus()
      })
    },
    handleInput(input) {
      if (input.type === 'number') {
        const pattern = /^-?[0-9][0-9]*$/

        if (input.value !== '' && input.value !== '-' && !pattern.test(input.value)) {
          input.value = input.lastValue
        } else {
          input.lastValue = input.value
        }

        if (input !== '-') {
          input.value = Number(input.value ?? 0)
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.condition-group-container {
  background: #F5F7FA;
  border-radius: 4px;
  padding: 16px;

  .group-item-head {
    display: flex;
    align-items: center;
    line-height: 28px;
    border-bottom: 1px solid #E1E3E6;
    padding-bottom: 4px;

    :deep(.button-group-container) {
      margin-left: 8px;

      .el-button {
        padding: 4px;
      }
    }
  }

  .group-item-condition {
    line-height: 36px;
    .condition-item {
      display: flex;
      margin-bottom: 8px;

      &:last-of-type {
        margin-bottom: 0;
      }

      .condition-item-params {
        display: flex;

        .rule-text,
        .output-text {
          margin-left: 8px;
          color: rgba(7, 14, 23, 0.55);
        }

        :deep(.el-input) {

          .judgment-unit {
            font-size: 12px;
            color: rgba(14, 27, 46, .35);
          }
        }

        .judgment-text {
          margin: 0 8px;
        }

        .judgment-select {
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
