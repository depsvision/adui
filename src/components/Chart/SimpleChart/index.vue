<template>
    <div class="simple-chart-container chart-container">
        <div :ref="componentOption.ref" :class="componentOption.class" :style="style" />
    </div>
</template>

<script>
import resizeChart from '@/mixins/resizeChart'

export default {
    name: 'SimpleChart',
    components: {},
    mixins: [resizeChart],
    props: {
        componentOption: {
            type: Object,
            default: function () {
                return {
                    style: {}
                }
            }
        }
    },
    data() {
        return {
            $_chart: null,
            chartStyle: {
                width: '100%',
                height: '100%'
            }
        }
    },
    computed: {
        style() {
            if (this.componentOption.style) {
                return this.componentOption.style
            } else {
                return this.chartStyle
            }
        }
    },
    watch: {
        'componentOption.change'(val) {
            this.init()
        }
    },
    mounted() {
        this.init()
    },
    beforeDestroy() {
        if (!this.$_chart) {
            return
        }
        this.$_chart.dispose()
        this.$_chart = null
    },
    methods: {
        init() {
            const that = this
            let chartIns = null
            if (this.componentOption.ref) {
                if (!this.$_chart) {
                    const chartDiv = this.$refs[this.componentOption.ref]
                    chartIns = this.$echarts.getInstanceByDom(chartDiv)
                    this.$_chart = chartIns ?? this.$echarts.init(chartDiv, null, { renderer: 'svg' })
                }

                chartIns.clear()
                chartIns.setOption(this.componentOption.option, {
                    notMerge: this.componentOption.notMerge,
                    replaceMerge: this.componentOption.replaceMerge
                })

                chartIns.on('legendselectchanged', function (obj) {
                    that.handleChartFun({ name: 'legendselectchanged', params: { ...obj } })
                })
            }
        },
        handleChartFun(arg) {
            this.$emit('handleChartFun', arg)
        }
    }
}
</script>

<style scoped lang="scss">
.simple-chart-container {
    height: 100%;
}
</style>
