<template>
    <div class="console-container">
        <div class="console-left-block">
            <div class="console-monitor-point console-common-block flex-column-class auto-flex-1">
                <div class="console-block-title">
                    <span>监控点位</span>
                    <common-cascader ref="commonCascader" class="console-monitor-point-cascader"
                        :component-option="webcamMonitorOption" @handleChange="selectMonitorPoint" />
                </div>
                <mpegts-monitor :component-option="webcamMonitorOption.mpegts" />
                <div class="console-realtime-data flex-column-class auto-flex-1">
                    <div class="console-block-title bottom_8">
                        <span>实时数据</span>
                    </div>
                    <div class="console-realtime-data-timer">
                        <div class="timer-outer">
                            <div ref="realtime" class="timer-inner" :style="realtime.style" />
                        </div>
                    </div>
                    <div ref="scrollBlock" class="console-realtime-data-block" @mouseenter="controlTimerAnimation(true)"
                        @mouseleave="controlTimerAnimation(false)">
                        <transition-group v-infinite-scroll="loadRealtimeLastData"
                            :infinite-scroll-disabled="noMoreRealtimeData" infinite-scroll-immediate="false"
                            name="list-insert" @before-enter="handleBeforeEnter" @enter="handleEnter"
                            @after-enter="blink">
                            <div v-for="data in realtime.data" :key="data.id" :style="data.style"
                                class="console-realtime-data-item" @mousedown="openImageViewer(data)"
                                @mouseenter="e => { overRealtimeItem(e, data, 'enter') }"
                                @mousemove="e => { overRealtimeItem(e, data, 'move') }"
                                @mouseleave="e => { overRealtimeItem(e, data, 'leave') }">
                                <div class="console-realtime-data-item-title">
                                    <div class="console-realtime-data-item--left auto-flex-1">
                                        <svg-icon :icon-class="data.svg" :style="{ color: data.svgColor }" />
                                        <span>{{ data.alertName }}</span>
                                    </div>
                                    <div class="console-realtime-data-item--right">
                                        <span v-html="data.createdAt" />
                                    </div>
                                </div>
                                <div class="console-realtime-data-item-name">
                                    <span>{{ data.name }}</span>
                                    <svg-icon icon-class="empty-image" />
                                </div>
                            </div>
                        </transition-group>
                        <p v-if="noMoreRealtimeData">
                            请前往
                            <span @click="goAlgorithmLog">算法日志</span>
                            功能查看
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="console-right-block flex-column-class">
            <div class="console-right--top">
                <div class="console-right--top--left console-common-block flex-column-class">
                    <div class="console-right-graph auto-flex-1">
                        <div class="console-cluster-block flex-column-class auto-flex-1">
                            <div class="console-block-title bottom_8">
                                <span>集群状态</span>
                            </div>
                            <div class="console-cluster-animation auto-flex-1">
                                <cube-animation :component-option="clusterCube" />
                            </div>
                        </div>
                        <div v-if="activeNode !== -1" class="console-calculate-serve flex-column-class auto-flex-1">
                            <div class="console-block-title bottom_8">
                                <span>计算服务</span>
                            </div>
                            <div v-loading="clusterLoading" class="console-calculate-serve-pie auto-flex-1">
                                <simple-chart :component-option="calculateServicePie" />
                            </div>
                        </div>
                    </div>
                    <div class="console-cluster-item-block">
                        <div v-if="masterMenu.menuGroup.length > 1" class="console-cluster-master">
                            <common-menu ref="masterMenu" :component-option="masterMenu"
                                @handleMenuItemClick="handleMenuItemClick" />
                        </div>
                        <div class="console-cluster-node">
                            <carousel-slot>
                                <template #prev>
                                    <i class="el-icon-arrow-left" />
                                </template>
                                <template #scroll>
                                    <div class="console-cluster-node-block">
                                        <div v-for="node in nodeList" :key="node.id" :class="splitClass(node)"
                                            class="console-cluster-node-item" @click="changeNode(node)">
                                            <svg-icon :icon-class="node.svg" :class="'svg-' + node.svg" />
                                            <span class="console-cluster-node-item--top">{{ node.name }}</span>
                                            <span class="console-cluster-node-item--bottom">{{ node.statusName }}</span>
                                        </div>
                                    </div>
                                </template>
                                <template #next>
                                    <i class="el-icon-arrow-right" />
                                </template>
                            </carousel-slot>
                        </div>
                    </div>
                    <div class="console-cluster-status">
                        <div v-for="status in statusList" :key="status.name" :class="splitClass(status)"
                            class="console-cluster-status-item">
                            <svg-icon v-show="status.svg" :icon-class="status.svg" />
                            <span class="console-cluster-status-item--top">{{ status.name }}</span>
                            <span class="console-cluster-status-item--bottom">
                                <span>{{ status.percentage }}</span>
                                <span>%</span>
                            </span>
                            <div class="console-cluster-status-item-progress">
                                <el-progress type="circle" :percentage="status.percentage" :show-text="false"
                                    :width="statusProgressWidth" :stroke-width="statusProgressStrokeWidth"
                                    stroke-linecap="butt" color="rgba(27, 53, 89, 1)" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="console-right--top--right console-common-block flex-column-class">
                    <div class="console-block-title bottom_0">
                        <span>摄像头点位</span>
                    </div>
                    <div class="console-webcam-point">
                        <div class="console-webcam-point-online auto-flex-1">
                            <div class="console-online-block">

                                <count-to ref="online" :start-val="webcamPoint.online.start"
                                    :end-val="webcamPoint.online.end" :autoplay="false" />

                                <span>
                                    <svg-icon icon-class="webcam-fill" />
                                    <span>在线数量</span>
                                </span>
                            </div>
                        </div>
                        <div class="console-webcam-point-offline auto-flex-1">
                            <div class="console-offline-block">
                                <count-to ref="offline" :start-val="webcamPoint.offline.start"
                                    :end-val="webcamPoint.offline.end" :autoplay="false" />
                                <span>
                                    <svg-icon icon-class="webcam-offline" />
                                    <span>离线数量</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="console-block-title bottom_8">
                        <span>任务启用状态</span>
                    </div>
                    <div class="console-task-start-status auto-flex-1">
                        <simple-chart :component-option="taskActivatingStatusPie" />
                    </div>
                    <div class="console-block-title bottom_8 is-inner">
                        <span>已启用任务健康状态</span>
                    </div>
                    <div class="console-task-started-status">
                        <simple-chart :component-option="taskActivatedStatusBar" />
                    </div>
                </div>
            </div>
            <div class="console-right--bottom auto-flex-1">
                <div class="console-alarm-statistics console-common-block flex-column-class auto-flex-1">
                    <div class="console-block-title flex-start bottom_8">
                        <span>报警统计</span>
                        <span class="console-block-title-tip">{{ alarmStatisticsOption.tip }}</span>
                    </div>
                    <div class="console-alarm-statistics-line auto-flex-1">
                        <simple-chart :component-option="alarmStatisticsStandardTimeLine"
                            @handleChartFun="handleChartFun" />
                    </div>
                    <div class="console-alarm-statistics-tool">
                        <!-- <radio-assembly :component-option="alarmStatisticsOption" class="alarm-statistics-tool-radio" @changeValue="changeLineType" /> -->
                        <div class="alarm-statistics-tool-slider">
                            <span>年</span>
                            <el-slider ref="lineSlider" v-model="alarmStatisticsOption.slider" :min="0" :max="100"
                                :step="20" :disabled="alarmStatisticsOption.disabled" :format-tooltip="showTimeTooltip"
                                @change="sliderTimeLine" />
                            <span>天</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="realtime.picture.hover" class="console-realtime-data-item-picture"
            :style="realtime.picture.pictureStyle">
            <el-image :src="realtime.picture.picture">
                <div slot="error" class="image-slot svg-slot">
                    <svg-icon :icon-class="realtime.picture.picture === '' ? 'empty-image' : 'error-image-line'" />
                </div>
            </el-image>
        </div>
    </div>
</template>

<script>
import index from './Mixins'
import lineOption from './Mixins/lineOption'
import chartOption from './Mixins/chartOption'
import lineData from './Mixins/lineData'
import pieData from './Mixins/pieData'
import otherData from './Mixins/otherData'
import webcamData from './Mixins/webcamData'
import { mapGetters } from 'vuex'
import SimpleChart from '@/components/Chart/SimpleChart'
import CommonCascader from '@/components/Cascader/CommonCascader'
import CommonMenu from '@/components/NavMenu/CommonMenu'
import CarouselSlot from '@/components/Slot/CarouselSlot'
import CubeAnimation from '@/components/AreaComponents/CubeAnimation'
import MpegtsMonitor from '@/components/MpegtsMonitor'
// import radioAssembly from '@/components/InnerComponents/RadioAssembly'
import { CountTo } from 'vue3-count-to'

export default {
    name: 'Console',
    components: { SimpleChart, CommonCascader, CommonMenu, CarouselSlot, CubeAnimation, CountTo, MpegtsMonitor },
    mixins: [index, lineOption, lineData, chartOption, pieData, otherData, webcamData],
    data() {
        return {
            masterMenu: {
                mode: 'horizontal',
                active: '1',
                textColor: 'rgba(14, 27, 46, .5)',
                activeTextColor: '#0E1B2E',
                backgroundColor: '#fff',
                class: 'console-cluster-menu',
                menuGroup: [
                    {
                        label: 'Master',
                        value: '1'
                    }
                ],
                bar: {
                    transform: {
                        elWidth: 0,
                        x: 0
                    },
                    style: {
                        width: '43px',
                        height: '2px',
                        'background-color': '#1872F0',
                        'border-radius': '6px',
                        bottom: 0,
                        transition: 'transform .3s cubic-bezier(.645,.045,.355,1)'
                    }
                }
            }
        }
    },
    computed: {
        ...mapGetters([
            'elementSize'
        ]),
        splitClass() {
            return node => {
                const classGroup = {}
                node.class && node.class.split(' ').forEach(item => {
                    classGroup[item] = true
                })
                classGroup['is-active'] = node.id === this.activeNode
                classGroup['is-high'] = node.percentage && node.percentage > 90
                return classGroup
            }
        },
        noMoreRealtimeData() {
            return this.realtime.data.length >= 50
        }
    },
    created() {
        this.init()
    },
    beforeDestroy() {
        if (this.apiTimer) {
            clearInterval(this.apiTimer)

            this.apiTimer = null
        }
    },
    methods: {
        init() {
            this.getMonitorPointData()

            // lineData
            this.alarmStatisticsData()
            this.getLineData()

            this.getCalculateServiceData()
            this.taskActivatingStatusData()
            this.taskActivatedStatusData()

            // webcamData
            this.$nextTick(() => {
                this.realtime.style.animation = 'realtimeProgress 5s linear 0s 1 normal'
                this.addEvent()
            })
            this.getCameraPointStatus()
        },
        addEvent() {
            const that = this
            this.$refs.realtime.addEventListener('animationend', () => {
                that.realtime.style.animation = ''
                that.$refs.scrollBlock && that.$refs.scrollBlock.scrollTop && (that.$refs.scrollBlock.scrollTop = 0)

                // this.getRealTimeData()
            })
        },
        handleMenuItemClick(index, indexPath) {
            const transform = this.masterMenu.bar.transform
            let menuItem = {}
            if (this.$refs.masterMenu) {
                menuItem = this.$refs.masterMenu.$refs[index][0]
                // this.masterMenu.bar.style.width = menuItem.$el.offsetWidth + 'px'
                transform.elWidth = menuItem.$el.offsetWidth
                transform.x = menuItem.$el.offsetLeft
            }
        }
    }
}
</script>

<style scoped lang="scss">
.console-container {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    padding: 20px;

    .console-left-block {
        flex-basis: 27.24%;
        display: flex;
        min-width: 372px;
        margin-right: 20px;

        .console-monitor-point {
            overflow: hidden;

            .console-monitor-point-cascader {
                width: 180px;
            }

            :deep(.webcam-monitor-container) {
                margin-bottom: 32px;
            }

            .console-realtime-data {
                overflow: hidden;
                margin: 0 -16px;
                padding: 0 16px;

                .console-realtime-data-timer {
                    width: 56px;
                    margin-bottom: 16px;

                    .timer-outer {
                        width: 100%;
                        height: 4px;
                        border-radius: 2px;
                        background-color: rgba(24, 114, 240, .1);

                        .timer-inner {
                            height: 100%;
                            border-radius: 2px;
                            background-color: rgba(24, 114, 240, 1);
                        }
                    }
                }

                .console-realtime-data-block {
                    height: 89%;
                    overflow: auto;
                    margin: 0 -16px;

                    &>span {
                        display: block;
                    }

                    &>p {
                        height: 48px;
                        line-height: 48px;
                        font-size: 14px;
                        color: rgba(14, 27, 46, .5);
                        text-align: center;
                        margin: 0;

                        span {
                            color: rgba(24, 114, 240, 1);
                            text-decoration: underline;
                            text-underline-offset: 2px;

                            &:hover {
                                cursor: pointer;
                            }
                        }
                    }

                    .console-realtime-data-item {
                        position: relative;
                        display: flex;
                        height: 64px;
                        flex-flow: column;
                        transition: transform 1s;
                        padding: 8px 24px 10px 24px;

                        &:hover {
                            cursor: pointer;
                            background-color: rgba(24, 114, 240, 0.1);
                        }

                        .console-realtime-data-item-title {
                            display: flex;

                            .console-realtime-data-item--left,
                            .console-realtime-data-item--right {
                                display: flex;
                                align-items: center;

                            }

                            .console-realtime-data-item--left {

                                &>span {
                                    font-size: 14px;
                                    line-height: 1;
                                    font-weight: 600;
                                }

                                &>svg {
                                    font-size: 12px;
                                    box-shadow: 0px 0px 8px -2px rgba(7, 14, 23, 0.2);
                                    border-radius: 6px;
                                    padding: 4px;
                                    margin-right: 8px;
                                }
                            }

                            .console-realtime-data-item--right {

                                &>span {
                                    font-size: 12px;
                                    line-height: 1;
                                    color: rgba(14, 27, 46, 0.5);
                                }
                            }
                        }

                        .console-realtime-data-item-name {
                            display: flex;
                            align-items: center;
                            flex-shrink: 0;
                            margin-top: 10px;

                            &>span {
                                flex: 1;
                                font-size: 12px;
                                line-height: 1;
                                color: rgba(14, 27, 46, 0.85);
                            }

                            &>svg {
                                font-size: 16px;
                                color: rgba(14, 27, 46, 0.5);
                                margin-left: 8px;
                            }
                        }
                    }
                }
            }
        }
    }

    .console-right-block {
        flex: 1;
        min-width: 65%;

        .console-right--top {
            flex-basis: 61.8%;
            display: flex;
            min-height: calc((100% - 20px) * 0.618);
            margin-bottom: 20px;

            .console-right--top--left {
                flex-basis: 61.8%;
                min-width: calc((100% - 20px) * 0.6);
                position: relative;
                margin-right: 20px;

                .console-right-graph {
                    display: flex;
                    margin-bottom: 8px;

                    .console-calculate-serve-pie {

                        :deep(.el-loading-mask) {
                            background-color: #fff;
                        }
                    }
                }

                .console-cluster-item-block {

                    .console-cluster-master {
                        margin-bottom: 16px;

                        :deep(.console-cluster-menu) {

                            .menu-item-container {
                                margin-left: 24px;

                                &:first-child {
                                    margin-left: 0;
                                }

                                .el-menu-item {
                                    height: auto;
                                    line-height: 1;
                                    background-color: #fff !important;
                                    padding: 0;
                                    padding-bottom: 6px;

                                }
                            }
                        }
                    }

                    .console-cluster-node {
                        height: 48px;
                        display: flex;
                        margin-bottom: 16px;

                        .carousel-slot-container {
                            align-items: center;

                            i {
                                color: rgba(14, 27, 46, .5);
                                font-weight: 600;

                                &:hover {
                                    cursor: pointer;
                                    color: rgba(14, 27, 46, 1);
                                }

                                &:first-child {
                                    margin-right: 8px;
                                }

                                &:last-of-type {
                                    margin-left: 8px;
                                }
                            }

                            :deep(.carousel-scroll-block) {
                                display: flex;
                                height: 100%;
                                overflow: auto;
                                scroll-behavior: smooth;

                                .console-cluster-node-block {
                                    display: flex;
                                    height: 100%;

                                    .console-cluster-node-item {
                                        position: relative;
                                        height: 100%;
                                        display: flex;
                                        flex-flow: column;
                                        background-color: #F5F7FA;
                                        border-radius: 6px;
                                        padding: 8px;
                                        padding-right: 12px;
                                        margin-right: 8px;

                                        &:last-of-type {
                                            margin-right: 0;
                                        }

                                        &:hover {
                                            cursor: pointer;
                                        }

                                        &.is-active {
                                            background-color: rgba(20, 204, 143, 1);

                                            svg,
                                            .console-cluster-node-item--top,
                                            .console-cluster-node-item--bottom {
                                                color: rgba(245, 249, 255, 1);
                                            }
                                        }

                                        svg {
                                            font-size: 16px;
                                            position: absolute;
                                            top: 8px;
                                            left: 8px;
                                            color: rgba(20, 204, 143, 1);
                                        }

                                        .svg-webcam-offline {
                                            color: rgba(14, 27, 46, .5);
                                        }

                                        .console-cluster-node-item--top {
                                            display: flex;
                                            align-items: center;
                                            line-height: 1;
                                            font-size: 12px;
                                            height: 12px;
                                            color: rgba(14, 27, 46, 1);
                                            margin-bottom: 8px;
                                            margin-left: 24px;
                                        }

                                        .console-cluster-node-item--bottom {
                                            font-size: 12px;
                                            color: rgba(14, 27, 46, 5);
                                            line-height: 1;
                                            margin-left: 24px;
                                        }

                                        &.master-node {

                                            &.is-active {
                                                background-color: rgba(24, 114, 240, 1);

                                                svg,
                                                .console-cluster-node-item--top,
                                                .console-cluster-node-item--bottom {
                                                    color: rgba(245, 249, 255, 1);
                                                }
                                            }

                                            svg {
                                                font-size: 16px;
                                                position: absolute;
                                                top: 8px;
                                                left: 12px;
                                                color: rgba(24, 114, 240, 1);
                                            }

                                            .console-cluster-node-item--bottom {
                                                margin-left: 4px;
                                            }
                                        }
                                    }
                                }

                                &::-webkit-scrollbar {
                                    width: 0;
                                    height: 0;
                                }
                            }
                        }
                    }
                }

                .console-cluster-status {
                    display: flex;

                    .console-cluster-status-item {
                        position: relative;
                        flex: 1;
                        display: flex;
                        flex-flow: column;
                        background-color: rgba(245, 247, 250, 1);
                        border-radius: 12px;
                        padding: 12px;
                        margin-right: 16px;

                        &:last-of-type {
                            margin-right: 0;
                        }

                        svg {
                            font-size: 18px;
                            background: rgba(24, 114, 240, 1);
                            border-radius: 8px;
                            color: #fff;
                            padding: 5px;
                            margin-bottom: 8px;
                        }

                        .console-cluster-status-item--top {
                            font-size: 14px;
                            line-height: 1;
                            color: rgba(14, 27, 46, 1);
                            margin-bottom: 24px;
                        }

                        .console-cluster-status-item--bottom {
                            line-height: 1;

                            span {
                                color: rgba(14, 27, 46, 1);

                                &:first-child {
                                    font-size: 24px;
                                }

                                &:last-of-type {
                                    font-size: 16px;
                                    font-weight: 600;
                                }
                            }

                        }

                        .console-cluster-status-item-progress {
                            position: absolute;
                            right: 12px;
                            bottom: 12px;
                            line-height: 1;

                            :deep(.el-progress) {
                                path {
                                    &:first-child {
                                        stroke: rgba(14, 27, 46, .1);
                                    }
                                }
                            }
                        }

                        &.is-high {

                            svg {
                                background: rgba(255, 58, 51, 1);
                            }

                            .console-cluster-status-item--bottom {
                                span {
                                    font-weight: 600;
                                    color: rgba(255, 58, 51, 1);
                                }
                            }
                        }
                    }
                }
            }

            .console-right--top--right {
                flex-basis: 39.2%;
                min-width: calc((100% - 20px) * 0.38);
                position: relative;

                .console-webcam-point {
                    flex-basis: 26%;
                    display: flex;

                    .console-webcam-point-online,
                    .console-webcam-point-offline {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .console-online-block,
                    .console-offline-block {
                        display: flex;
                        flex-flow: column;
                        align-items: center;
                        width: 100%;
                        padding: 12px 0;

                        &>span {
                            color: rgba(14, 27, 46, 1);

                            &:first-child {
                                font-size: 24px;
                                line-height: 1;
                                font-weight: 600;
                                margin-bottom: 12px;
                            }

                            &:last-of-type {
                                display: flex;
                                align-items: center;
                                font-size: 14px;
                                line-height: 1;

                                svg {
                                    font-size: 16px;
                                    line-height: 1;
                                    margin-right: 12px;
                                }
                            }
                        }
                    }

                    .console-online-block {
                        border-right: 1px solid rgba(27, 53, 89, .2);
                    }

                }

                .console-task-start-status {
                    min-height: 25%;
                }

                .console-task-started-status {
                    max-height: 84px;
                    flex-basis: 20%;
                    background-color: #F5F7FA;
                    border-radius: 8px;
                    padding: 16px;
                }
            }
        }

        .console-right--bottom {
            flex-basis: 39.2%;
            display: flex;
            min-width: calc((100% - 20px) * 0.392);

            .console-alarm-statistics {
                position: relative;

                .console-alarm-statistics-tool {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    display: flex;
                    align-items: center;

                    .alarm-statistics-tool-radio {
                        margin-right: 8px;

                        :deep(.el-radio) {
                            margin-right: 24px;

                            &:last-of-type {
                                margin-right: 0;
                            }
                        }
                    }

                    .alarm-statistics-tool-slider {
                        height: 28px;
                        width: 172px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background-color: #F5F7FA;
                        border-radius: 4px;
                        padding: 0 16px;

                        &>span {
                            font-size: 12px;
                            color: rgba(14, 27, 46, .85);
                        }

                        :deep(.el-slider) {
                            width: 100px;
                            margin: 0 8px;

                            .el-slider__runway {
                                height: 2px;
                                background-color: rgba(14, 27, 46, .2);
                                margin: 0;

                                .el-slider__bar {
                                    height: 0;
                                }

                                .el-slider__button-wrapper {
                                    height: 12px;
                                    width: 8px;
                                    top: -5px;

                                    .el-slider__button {
                                        width: 8px;
                                        height: 12px;
                                        border: 1px solid rgba(27, 53, 89, 1);
                                        background-color: rgba(27, 53, 89, 1);
                                        border-radius: 2px;
                                        transform: scale(1);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    .console-realtime-data-item-picture {
        position: absolute;
        width: 240px;
        height: 135px;
        display: flex;
        border-radius: 8px;
        box-shadow: 0px 4px 20px -4px rgba(0, 0, 0, .25);
        border: 4px solid #FFFFFF;
        z-index: 1;
    }
}

.console-common-block {
    background-color: #fff;
    border-radius: 16px;
    padding: 16px;
}

.console-block-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    &>span {
        font-size: 14px;
        font-weight: 600;
        color: #0E1B2E;
    }

    &.is-inner {

        &>span {
            font-size: 12px;
            font-weight: 400;
            color: rgba(14, 27, 46, .85);
        }
    }

    .console-block-title-tip {
        font-size: 12px;
        color: rgba(14, 27, 46, 0.5);
        margin-left: 8px;
    }

    &.flex-start {
        justify-content: flex-start;
    }

    &.bottom_8 {
        margin-bottom: 8px;
    }

    &.bottom_0 {
        margin-bottom: 0;
    }

}

// 1680
@media screen and (max-height: 874px) {

    .console-container .console-right-block .console-right--top {

        .console-right--top--left .console-cluster-status .console-cluster-status-item {
            svg {
                font-size: 15px;
                padding: 5px;
            }

            .console-cluster-status-item--top {
                font-size: 13px;
            }

            .console-cluster-status-item--bottom {

                span {

                    &:first-child {
                        font-size: 22px;
                    }

                    &:last-of-type {
                        font-size: 15px;
                    }
                }
            }
        }

        .console-right--top--right .console-webcam-point {

            .console-online-block,
            .console-offline-block {
                padding: 8px 0;

                &>span {

                    &:first-child {
                        font-size: 22px;
                        margin-bottom: 10px;
                    }

                    &:last-of-type {
                        font-size: 13px;

                        svg {
                            margin-right: 10px;
                        }
                    }
                }
            }
        }
    }

}

// 1440
@media screen and (max-height: 810px) {

    .console-container .console-right-block .console-right--top {

        .console-right--top--left .console-cluster-status .console-cluster-status-item {
            svg {
                font-size: 12px;
                padding: 4px;
            }

            .console-cluster-status-item--top {
                font-size: 12px;
            }

            .console-cluster-status-item--bottom {

                span {

                    &:first-child {
                        font-size: 20px;
                    }

                    &:last-of-type {
                        font-size: 14px;
                    }
                }
            }
        }

        .console-right--top--right .console-webcam-point {

            .console-online-block,
            .console-offline-block {
                padding: 8px 0;

                &>span {

                    &:first-child {
                        font-size: 20px;
                        margin-bottom: 8px;
                    }

                    &:last-of-type {
                        font-size: 12px;

                        svg {
                            margin-right: 8px;
                        }
                    }
                }
            }
        }
    }

}
</style>
