<template>
    <span class="point-drop-down-container" @click.stop>
        <el-dropdown class="point-dropdown-block" :class="[...componentOption.dropdownClass]"
            :trigger="componentOption.trigger" :placement="componentOption.placement" @command="handleCommand"
            @visible-change="dropdownVisible">
            <span v-if="componentOption.icon || componentOption.svgIcon" class="el-dropdown-link"
                :class="[dropdownShow ? 'is-active' : '']">
                <i v-if="componentOption.icon" :class="componentOption.icon" />
                <svg-icon v-if="componentOption.svgIcon" :icon-class="componentOption.svgIcon" />
            </span>
            <slot v-else />
            <template #dropdown>
                <el-dropdown-menu ref="dropdownMenu" :append-to-body="componentOption.appendToBody"
                    :popper-options="popperOptions" :class="componentOption.class" :style="componentOption.style"
                    @created="popperCreated">
                    <el-dropdown-item v-for="drop in dealOption" :key="drop.value" :icon="drop.icon" :command="drop"
                        :disabled="drop.disabled || (!drop.noAuth && accessButtons(drop))" :class="splitClass(drop)">
                        <svg-icon v-if="drop.svgIcon" :icon-class="drop.svgIcon" />
                        <span :class="[drop.label ? 'has-text' : '']">{{ drop.label }}</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>

        </el-dropdown>
    </span>
</template>

<script>
import Authority from '@/mixins/authority'

export default {
    name: 'PointDropDown',
    mixins: [Authority],
    mounted() {
        console.log('AAAAAAAAAAAAA')
        console.log(this.componentOption)
    },
    props: {
        componentOption: {
            type: Object,
            default: function () {
                return {}
            }
        },
        scope: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data() {
        return {
            dropdownShow: false
        }
    },
    computed: {
        dealOption() {
            if (this.componentOption.option && this.componentOption.option.length > 0) {
                return this.componentOption.option
            } else {
                return [
                    {
                        label: this.componentOption.noData || '暂无数据',
                        value: 'noData',
                        disabled: true,
                        class: 'noData'
                    }
                ]
            }
        },
        splitClass() {
            return drop => {
                const classGroup = {}
                drop.class && drop.class.split(' ').forEach(item => {
                    classGroup[item] = true
                })
                return classGroup
            }
        },
        popperOptions() {
            const result = {
                gpuAcceleration: false,
                ...this.componentOption.popperOptions
            }

            return result
        }
    },
    methods: {
        dropdownVisible(show) {
            this.dropdownShow = show

            this.$emit('visible-change', show)
        },
        popperCreated(that) {
            if (this.componentOption.fullScreen) {
                const fullScreenLayout = document.querySelector('.video-layout')
                const menu = document.querySelector('.full-screen-ele .el-dropdown-menu')

                if (menu) {
                    fullScreenLayout.appendChild(menu)
                }
            }
        },
        // command数据归到button数据内
        handleCommand(command) {
            this.$emit('changeChoice', command)

            const timer = command.timer !== undefined ? command.timer : 500

            this.$store.dispatch('button/assignButtonData', command)
            this.$store.dispatch('button/assignScopeData', this.scope)
            // 每次点击完后重置button的value值，防止watch不到变化，同时做到 “节流” 的效果
            setTimeout(() => {
                this.clearCommand()
            }, timer)
        },
        clearCommand() {
            this.$store.dispatch('button/listenClickButton', { key: 'value', value: '' })
        }
    }
}
</script>

<style scoped lang="scss">
.point-drop-down-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .point-dropdown-block {
        display: flex;
        align-items: center;
        justify-content: center;

        .el-dropdown-link {
            border-radius: 4px;

            &:hover,
            &.is-active {
                cursor: pointer;
                color: #1872F0;
                background-color: rgba(24, 114, 240, .1);
            }
        }

        ::v-deep .el-button {

            &>span {
                display: flex;
            }
        }
    }

}
</style>
