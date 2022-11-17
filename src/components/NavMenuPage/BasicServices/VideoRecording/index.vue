<template>
  <div class="video-recording-container layout-bg display-flex-class">
    <div v-loading="treeLoading" class="video-recording-tree-block display-flex-class">
      <div class="tree-top-block">
        <span class="tree-top-title">所有点位</span>
        <button-group
          :component-option="treeTopButton"
        />
      </div>
      <div class="tree-main-block">
        <common-tree
          ref="commonTree"
          :component-option="treeOption"
          @handleEvent="treeEvent"
        />
      </div>
    </div>
    <div v-loading="tableLoading" class="video-recording-block common-tablebox-layout">
      <div class="common-tablebox-title blue-title">
        <span>{{ currentNode.label || '全部' }}</span>
      </div>
      <div v-if="isPoint" class="video-recording-point">
        <div class="video-recording-top">
          <div class="video-recording-top-cards">
            <div
              v-for="(card,cardIndex) in cardList"
              :key="cardIndex"
              class="card-item"
            >
              <span class="card-item-title">{{ card.status[currentNode[card.key]] }}</span>
              <span class="card-item-text">{{ card.label }}</span>
              <span class="card-item-status status-mark" :class="['is-red','is-green'][currentNode[card.key]]">
                <span class="has-text" />
              </span>
            </div>
          </div>
          <div class="video-recording-top-tabs">
            <span
              v-for="tab in tabList"
              :key="tab.label"
              class="tab-item"
              :class="[activeTab === tab.value?'is-active':'']"
              @click="changeTab(tab)"
            >
              {{ tab.label }}
            </span>
          </div>
        </div>
        <div class="video-recording-video">
          <div class="video-recording-play">
            <mpegts-monitor ref="mpegtsPlayer" :component-option="mpegtsOption" />
          </div>
          <div v-show="activeTab === 'recording'" class="video-recording-list">
            <div class="video-recording-list-head">
              <svg-icon :icon-class="recordListOption.head.svg" />
              <span>{{ recordListOption.head.label }}</span>
            </div>
            <div v-show="recordListOption.play.id !== null" class="video-recording-list-playing">
              <svg-icon class="recording-list-playing-svg" :icon-class="recordListOption.play.svg" />
              <span>{{ recordListOption.play.label }}</span>
            </div>
            <div class="video-recording-list-block">
              <div
                v-for="videoItem in recordListOption.list"
                :key="videoItem.label"
                class="video-recording-item"
                :class="[videoItem.id === recordListOption.play.id?'is-active':'']"
                @click="playVideo(videoItem)"
              >
                <image-assembly :component-option="videoItem" />
                <span>{{ videoItem.label }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="video-recording-time-line">
          <div v-show="activeTab === 'recording'" class="time-line-block">
            <div class="time-line-distribute">
              <div class="time-line-title">
                <svg-icon :icon-class="timeLineOption.distribute.svg" />
                <span>{{ timeLineOption.distribute.title }}</span>
              </div>
              <div
                ref="dayDistribute"
                class="time-line-distribute-block"
              />
            </div>
            <div class="time-line-axis">
              <div class="time-line-title">
                <svg-icon :icon-class="timeLineOption.axis.svg" />
                <span>{{ timeLineOption.axis.title }}</span>
              </div>
              <div
                ref="timeLine"
                class="axis-webgl-block"
              />
            </div>
            <div class="time-line-button">
              <div class="time-line-button-block" :class="[timeLineOption.button.left.disabled?'is-disabled':'']" @click="jumpDay(timeLineOption.button.left)">
                <svg-icon :icon-class="timeLineOption.button.left.svg" />
                <span>{{ timeLineOption.button.left.label }}</span>
              </div>
              <div class="time-line-button-block" :class="[timeLineOption.button.right.disabled?'is-disabled':'']" @click="jumpDay(timeLineOption.button.right)">
                <span>{{ timeLineOption.button.right.label }}</span>
                <svg-icon :icon-class="timeLineOption.button.right.svg" />
              </div>
              <div class="time-line-button-middle">
                <div class="button-middle-block">
                  <svg-icon :icon-class="timeLineOption.button.middle.svg" />
                  <span class="button-middle-text">{{ timeLineOption.button.middle.date }}</span>
                  <span class="button-middle-text">{{ timeLineOption.button.middle.time }}</span>
                </div>
                <div class="back-to-now" @click="backToNow">
                  <svg-icon :icon-class="timeLineOption.button.middle.back" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="video-recording-empty">
        <img :src="emptyOption.image" alt="">
        <span>{{ emptyOption.text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import tree from './Mixins/tree'
import index from './Mixins'
import CommonTree from '@/components/Tree/CommonTree'
import ButtonGroup from '@/components/Button/ButtonGroup'
import ImageAssembly from '@/components/InnerComponents/ImageAssembly'

import MpegtsMonitor from '@/components/MpegtsMonitor'

import empty from '@/assets/image/othersImage/empty.webp'

export default {
  name: 'VideoRecording',
  components: { CommonTree, ButtonGroup, ImageAssembly, MpegtsMonitor },
  mixins: [index, tree],
  props: {},
  data() {
    return {
      treeLoading: false,
      tableLoading: false,
      searchValue: '',
      pageLoading: false,
      treeOption: {
        data: [],
        props: {
          isLeaf: 'leaf'
        },
        headSvg: {
          default: 'file-1-line',
          isActive: 'file-1-line',
          placement: 'top-start',
          enterable: false,
          popperClass: 'tooltip-status-list',
          tooltip: true
        },
        slotScope: true,
        totalNum: false,
        expandOnClickNode: true,
        highlightCurrent: true,
        currentNode: 0,
        tooltip: {
          placement: 'top-start',
          enterable: false
        },
        nodeKey: 'groupId',
        lazy: true
      },
      treeTopButton: {
        buttons: [
          {
            label: '录像设置',
            value: 'recordSetting',
            type: 'text',
            class: 'is-black',
            svgIconLeft: 'setup-line'
          }
        ]
      },
      tabList: [
        {
          label: '直播流',
          value: 'mpegts'
        },
        {
          label: '视频录像',
          value: 'recording'
        }
      ],
      activeTab: 'mpegts',
      cardList: [
        {
          label: '点位状态',
          key: 'status',
          status: ['离线', '在线']
        },
        {
          label: '录像是否开启',
          key: 'isStart',
          status: ['未开启', '已开启']
        },
        {
          label: '录像是否缓存',
          key: 'isCache',
          status: ['未缓存', '已缓存']
        }
      ],
      emptyOption: {
        image: empty,
        text: '请选择具体点位以查看录像信息'
      },
      timeLineOption: {
        distribute: {
          title: '单日录制分布',
          svg: 'chart-pie-line'
        },
        axis: {
          title: '时间轴',
          svg: 'time-axis-line'
        },
        button: {
          left: {
            svg: 'arrow-left-move',
            label: '前一天',
            disabled: false,
            target: null
          },
          right: {
            svg: 'arrow-right-move',
            label: '后一天',
            disabled: true,
            target: null
          },
          middle: {
            svg: 'time-1-line',
            date: '2022/03/02',
            time: '00:00:00',
            back: 'replace-line'
          }
        }
      },
      axis: null,
      mpegtsOption: {
        code: '',
        url: '',
        isInnerScreen: true
      },
      recordListOption: {
        head: {
          svg: 'list-video-fill',
          label: '视频列表'
        },
        play: {
          svg: 'play-fill',
          label: '',
          url: '',
          id: null
        },
        list: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'elementSize'
    ]),
    isPoint() {
      return typeof this.currentNode.id !== 'undefined'
    }
  },
  watch: {

  },
  beforeDestroy() {
    this.dispose()
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      await this.searchCameraTree()

      this.$nextTick(() => {
        this.tree = this.$refs.commonTree.refTree

        this.clickNode()
      })
    },
    changeTab(tab) {
      this.activeTab = tab.value

      this.setVideo()
    }
  }
}
</script>

<style scoped lang="scss">
.video-recording-container {

  .video-recording-tree-block {
    flex-flow: column;
    width: 240px;
    border-radius: 8px;
    background-color: #fff;
    margin-right: 20px;

    .tree-main-block {
      flex: 1;
      overflow: hidden;
      padding-bottom: 16px;
    }
  }

  .video-recording-block {
    position: relative;
    flex: 1;

    .video-recording-empty {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: center;

      &>img {
        margin-bottom: 12px;
        width: 4.445vw;
        height: 4.445vw;
        min-width: 64px;
        min-height: 64px;
      }

      &>span {
        font-size: 0.83vw;
        line-height: 1;
        color: rgba(14, 27, 46, 0.35);
      }
    }

    .video-recording-point {
      flex: 1;
      display: flex;
      flex-flow: column;
      overflow: hidden;
    }

    .video-recording-top {
      display: flex;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(14, 27, 46, 0.1);

      .video-recording-top-cards {
        display: flex;
        flex: 1;

        .card-item {
          position: relative;
          display: flex;
          flex-flow: column;
          min-width: 144px;
          line-height: 1;
          background-color: #F5F9FF;
          border-radius: 4px;
          padding: 8px 32px;
          margin-right: 8px;

          &:last-of-type {
            margin-right: 0;
          }

          .card-item-title {
            font-size: 14px;
            font-weight: 600;
            color: rgba(14, 27, 46, 1);
            margin-bottom: 8px;
          }

          .card-item-text {
            font-size: 12px;
            color: rgba(14, 27, 46, 0.65);
          }

          .card-item-status {
            position: absolute;
            top: 11px;
            left: 12px;
          }
        }
      }

      .video-recording-top-tabs {
        display: flex;
        background-color: rgba(7,14,23,0.05);
        border-radius: 4px;
        padding: 4px;
        margin-top: auto;

        .tab-item {
          font-size: 12px;
          line-height: 1;
          color: rgba(14, 27, 46, 1);
          border-radius: 4px;
          padding: 6px 10px;
          margin-right: 4px;

          &:last-of-type {
            margin-right: 0;
          }

          &:hover {
            cursor: pointer;
            background-color: rgba(0, 106, 255, .05);
          }

          &.is-active {
            color: rgba(245, 249, 255, 1);
            background-color: rgba(24, 114, 240, 1);
          }
        }
      }
    }

    .video-recording-video {
      flex: 1;
      display: flex;
      overflow: hidden;

      .video-recording-play {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }

      .video-recording-list {
        width: 224px;
        display: flex;
        flex-flow: column;
        border-radius: 4px;
        background-color: rgba(245, 247, 250, 1);
        padding: 8px;
        margin: 24px 0 24px 16px;

        .video-recording-list-head {
          display: flex;
          align-items: center;
          line-height: 1;
          color: rgba(14, 27, 46, 1);

          &>svg {
            font-size: 16px;
          }

          &>span {
            margin-left: 8px;
          }
        }

        .video-recording-list-playing {
          display: flex;
          align-items: center;
          font-size: 12px;
          background-color: rgba(255, 255, 255, 1);
          border-radius: 4px;
          padding: 8px;
          margin-top: 8px;

          .recording-list-playing-svg {
            font-size: 8px;
            background-color: rgba(218, 227, 240, 1);
            border-radius: 50%;
            padding: 4px;
          }

          &>span {
            font-size: 12px;
            color: rgba(24, 114, 240, 1);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-left: 8px;
          }
        }

        .video-recording-list-block {
          display: flex;
          flex-flow: column;
          overflow: overlay;
          margin-top: 8px;

          .video-recording-item {
            display: flex;
            margin-bottom: 8px;

            &:last-of-type {
              margin-bottom: 0;
            }

            &:hover {
              cursor: pointer;
              background-color: rgba(235, 237, 240, 1);
            }

            .image-assembly-layout {
              width: 96px;
              height: 54px;
              flex: unset;
              flex-shrink: 0;

              ::v-deep .image-svg-bg {
                background-color: rgba(14, 27, 46, 1);

                svg {
                  color: rgba(203, 212, 225,1);
                }
              }
            }

            &>span {
              font-size: 14px;
              line-height: 20px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              color: rgba(7, 14, 23, 0.85);
              margin-left: 8px
            }

            &.is-active {

              &>span {
                color: rgba(24, 114, 240, 1);
              }
            }
          }
        }
      }

      .webcam-monitor-container {
        width: 55vw;
        max-height: 100%;
        aspect-ratio: 16/9;
        border: 2px solid rgba(14, 27, 46, 1);
        box-sizing: content-box;
      }
    }

    .video-recording-time-line {
      height: 180px;
      display: flex;

      .time-line-block {
        flex: 1;
        display: flex;
        flex-flow: column;
      }

      .time-line-distribute {
        display: flex;
        flex-flow: column;
        margin-bottom: 16px;

        .time-line-distribute-block {
          height: 32px;
          display: flex;

          ::v-deep canvas {
            &:hover {
              cursor: pointer;
            }
          }
        }
      }

      .time-line-axis {
        display: flex;
        flex-flow: column;
        margin-bottom: 12px;

        .axis-webgl-block {
          height: 48px;

          &:hover {
            cursor: pointer;
          }
        }
      }

      .time-line-title {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        &>svg {
          font-size: 16px;
          color: rgba(14, 27, 46, 0.5);
          margin-right: 4px;
        }

        &>span {
          font-size: 12px;
          line-height: 1;
          color: rgba(14, 27, 46, 0.85);
        }
      }

      .time-line-button {
        position: relative;
        display: flex;
        justify-content: space-between;

        .time-line-button-block {
          display: flex;
          align-items: center;
          z-index: 2;

          &>svg {
            font-size: 16px;
            color: rgba(14, 27, 46, 0.5);
            background-color: rgba(54,106,179,0.05);
            border-radius: 4px;
            padding: 4px;
          }

          &>span {
            font-size: 12px;
            line-height: 12px;
            color: rgba(14, 27, 46, 0.85);
            margin: 0 8px;
          }

          &:hover {
            cursor: pointer;

            &>svg {
              color: #1872f0;
              background-color: rgba(24, 114, 240, 0.1);
            }

            &>span {
              color: #1872f0;
            }
          }

          &.is-disabled {
            filter: opacity(.5);
            cursor: not-allowed;

            &>svg {
              color: rgba(14, 27, 46, 0.5);
              background-color: rgba(54,106,179,0.05);
            }

            &>span {
              color: rgba(14, 27, 46, 0.85);
            }
          }
        }

        .time-line-button-middle {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          z-index: 1;

          .button-middle-block {
            display: flex;
            align-items: center;
            background-color: #F5F7FA;
            border-radius: 12px;
            padding: 6px;

            &>svg {
              font-size: 12px;
              color: rgba(14,27,46,0.35);
              margin-right: 6px;
            }
          }

          .button-middle-text {
            font-size: 12px;
            line-height: 1;
            color: rgba(14, 27, 46, 0.85);
            margin-right: 12px;

            &:last-of-type {
              margin-right: 0;
            }
          }

          .back-to-now {
            display: flex;
            font-size: 16px;
            color: rgba(14, 27, 46, 0.5);
            background-color: #F5F7FA;
            border-radius: 50%;
            padding: 4px;
            margin-left: 8px;

            &:hover {
              cursor: pointer;
              color: rgba(14, 27, 46, 0.35);
            }
          }
        }
      }
    }
  }

}

@media screen and (max-width: 1920px) {}

@media screen and (max-width: 1680px) {}

@media screen and (max-width: 1570px) {

  /* AiMonitoringPoint -- ai-tree-node */

}

@media screen and (max-width: 1440px) {}

@media screen and (max-width: 1366px) {}

@media screen and (max-width: 1280px) {}
</style>
