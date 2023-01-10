<template>
    <div class="common-cascader-container">
        <el-cascader ref="cascader" v-model="componentOption.value" :options="componentOption.options"
            popper-class="common-cascader" size="default" :style="componentOption.style"
            :props="componentOption.props" @change="handleChange">
            <template #default="{ node }">
                <svg-icon v-if="node.isLeaf" icon-class="camera-fill" class="cascader-label-svg" />
                <span>{{ node.data.label }}</span>
            </template>
        </el-cascader>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'CommonCascader',
    components: {},
    props: {
        componentOption: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },

    data() {
        return {

        }
    },
    computed: {
        ...mapGetters([
            'elementSize'
        ])
    },
    methods: {
        handleChange(value) {
            this.$emit('handleChange', value)
        }
    }
}
</script>

<style scoped lang="scss">
.common-cascader-container {}
</style>
