<template>
  <div class="descriptions-container" :style="componentOption.style">
    <div class="descriptions-block">
      <div
        v-for="form in componentOption.form"
        :key="form.prop"
        class="descriptions-item"
        :style="componentOption.itemStyle"
      >
        <div class="descriptions-item-label">
          <span>{{ form.label }}</span>
        </div>
        <component
          :is="form.type"
          v-if="form.type"
          ref="component"
          class="descriptions-item-content"
          :component-option="dealData(form)"
          @changeValue="value=>{changeComponentValue(value,form)}"
        />
      </div>
    </div>
  </div>
</template>

<script>
import spanAssembly from '@/components/InnerComponents/SpanAssembly'

export default {
  name: 'Descriptions',
  components: { spanAssembly },
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

    }
  },
  computed: {
    dealData() {
      return form => {
        if (this.componentOption.data) {
          form['value'] = this.componentOption.data[form.prop]

          if (form.type && form.type === 'tagAssembly' && !form[form.prop + 'Tag']) {
            form[form.prop + 'Tag'] = this.componentOption.data[form.prop]
          }
        }
        return form
      }
    }
  },
  methods: {
    changeComponentValue(value, form) {
      this.componentOption.data[form.prop] = value
    }
  }
}
</script>

<style scoped lang="scss">
.descriptions-container {
  width: 100%;

  .descriptions-block {
    display: flex;

    .descriptions-item {

      .descriptions-item-label {
        font-size: 12px;
        line-height: 1;
        color: rgba(14, 27, 46, 0.55);
        margin-bottom: 16px;
      }

      .descriptions-item-content {
        font-size: 14px;
        line-height: 1;
        color: rgba(14, 27, 46, 1);
      }
    }
  }
}
</style>
