<template>
    <div v-show="componentOption.show" ref="itemBar" class="item-bar-container" :style="componentOption.style" />
</template>

<script>

export default {
    name: 'ItemBar',
    props: {
        componentOption: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data() {
        return {}
    },
    watch: {
        'componentOption.transform': {
            handler(val) {
                if (val) {
                    this.setBarTranslate()
                }
            },
            deep: true
        }
    },
    methods: {
        setBarTranslate() {
            const transform = this.componentOption.transform
            const barStyle = this.$refs.itemBar
            let offsetWidth = 0
            if (transform.elWidth) {
                offsetWidth = (transform.elWidth - Number(this.componentOption.style.width.replace('px', ''))) / 2
            }
            let offsetHeight = 0
            if (transform.elHeight) {
                offsetHeight = (transform.elHeight - Number(this.componentOption.style.height.replace('px', ''))) / 2
            }
            let translateX = 0
            if (transform.x || transform.x === 0) {
                translateX = transform.x + offsetWidth
                barStyle.style.transform = 'translateX(' + translateX + 'px)'
            }
            let translateY = 0
            if (transform.y || transform.y === 0) {
                translateY = transform.y + offsetHeight
                barStyle.style.transform = 'translateY(' + translateY + 'px)'
            }
        }
    }
}
</script>

<style scoped lang="scss">
.item-bar-container {
    position: absolute;
}
</style>
