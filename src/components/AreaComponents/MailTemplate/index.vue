<template>
  <div class="mail-template-container" :style="componentOption.style.container">
    <div class="mail-template-block" :style="componentOption.style.block">
      <div
        class="mail-template-header"
        :style="componentOption.style.header"
      />
      <div class="mail-template-body">
        <transition name="height-clear">
          <div
            v-show="componentOption.title && componentOption.title.head"
            class="mail-template-title__head"
          >
            {{ componentOption.title.head }}
          </div>
        </transition>
        <div class="mail-template-time">
          <div class="mail-template-time__title">
            <svg-icon v-if="componentOption.time.svg" :icon-class="componentOption.time.svg" />
            <span>{{ componentOption.time.title }}</span>
          </div>
          <div class="mail-template-time__timeline">
            <div class="time-timeline-item time-timeline__start">
              <div class="time-timeline__tail" :style="componentOption.style.tail" />
              <div class="time-timeline__node" :style="componentOption.style.startNode" />
              <span class="time-timeline__label">{{ componentOption.time.startText }}</span>
              <span class="time-timeline__date">{{ componentOption.time.start.split(' ')[0] }}</span>
            </div>
            <div class="time-timeline-item__time">{{ componentOption.time.start.split(' ')[1] }}</div>
            <div class="time-timeline-item time-timeline__end">
              <div class="time-timeline__node" :style="componentOption.style.endNode" />
              <span class="time-timeline__label">{{ componentOption.time.endText }}</span>
              <span class="time-timeline__date">{{ componentOption.time.end.split(' ')[0] }}</span>
            </div>
            <div class="time-timeline-item__time">{{ componentOption.time.end.split(' ')[1] }}</div>
            <div class="time-timeline-item time-timeline__total">
              <div class="time-timeline__node" :style="componentOption.style.totalNode" />
              <span class="time-timeline__label">{{ componentOption.time.totalText }}</span>
              <span class="time-timeline__date">{{ componentOption.time.total }}</span>
            </div>
          </div>
        </div>
        <transition-group name="list-switch" class="mail-image-transiton">
          <div
            v-for="list in componentOption.data"
            :key="list.id"
            class="mail-template__image"
            :style="componentOption.style.image"
          >
            <div class="mail-image-title blue-title">
              <span>{{ list.label }}</span>
              <span>{{ list.tip }}</span>
            </div>
            <div class="mail-image-content" :style="list.style">
              <img v-if="list.image" :src="list.image" alt="">
              <simple-chart v-if="list.chart" :component-option="list.chart" />
              <table v-if="list.table" class="image-content-table">
                <tr>
                  <th v-for="(th,thIndex) in list.table.th" :key="thIndex">{{ th }}</th>
                </tr>
                <tr v-for="(td,tdIndex) in list.table.td" :key="tdIndex">
                  <td v-for="(label,labelIndex) in td" :key="labelIndex">{{ label }}</td>
                </tr>
              </table>
            </div>
          </div>
        </transition-group>
        <transition name="height-clear">
          <div v-show="componentOption.screenshot && componentOption.screenshot.screenList.length" class="mail-template-screenshot">
            <div class="mail-template-screenshot__title blue-title">
              <span>{{ componentOption.screenshot.label }}</span>
              <span>{{ componentOption.screenshot.tip }}</span>
            </div>
            <div
              v-for="(screen,screenIndex) in componentOption.screenshot.screenList"
              :key="screenIndex"
              class="mail-screenshot-item"
            >
              <div class="mail-screenshot-image">
                <svg-icon v-if="screen.svg" :icon-class="screen.svg" />
                <el-image
                  v-if="screen.image"
                  :src="screen.image"
                  fit="contain"
                >
                  <div slot="error" class="image-slot svg-slot">
                    <svg-icon :icon-class="screen.image === ''?'empty-image':'error-image-line'" />
                  </div>
                </el-image>
              </div>
              <div class="mail-screenshot-info">
                <div class="mail-screenshot-time">{{ screen.time }}</div>
                <div class="mail-screenshot-content">
                  <span>{{ 'ID:' + screen.algorithm.id }}</span>
                  <span>{{ screen.algorithm.label }}</span>
                </div>
                <div class="mail-screenshot-content">
                  <span>{{ 'ID:' + screen.point.id }}</span>
                  <span>{{ screen.point.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </transition>
        <transition name="height-clear">
          <div
            v-show="componentOption.title && componentOption.title.foot"
            class="mail-template-title__foot"
          >
            {{ componentOption.title.foot }}
          </div>
        </transition>
      </div>
      <div
        class="mail-template-footer"
        :style="componentOption.style.footer"
      />
    </div>
  </div>
</template>

<script>
import SimpleChart from '@/components/Chart/SimpleChart'

export default {
  name: 'MailTemplate',
  components: { SimpleChart },
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
  methods: {

  }
}
</script>

<style scoped lang="scss">
.mail-template-container {
  position: relative;
  flex: 1;
  display: flex;
  justify-content: center;

  .mail-template-header,
  .mail-template-footer {
    background-size: cover;
    background-repeat: no-repeat;
  }

  .mail-template-body {
    background: rgba(245, 249, 255, 1);

    .mail-template-title__head {
      padding: 32px 16px 0 16px;
    }

    .mail-template-title__foot {
      padding: 32px 16px;
    }

    .mail-template-title__head,
    .mail-template-title__foot {
      font-size: 14px;
      font-weight: 600;
      color: rgba(7, 14, 23, 0.85);
      background: #fff;
    }

    .mail-template-time {
      line-height: 1;
      padding: 32px 16px 24px 16px;
      background-image: linear-gradient(to top,rgba(245, 249, 255, 1) 0%,rgba(245, 249, 255, 1) 74px,#fff 75px,#fff 100%);

      .mail-template-time__title {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        svg {
          font-size: 20px;
          margin-right: 8px;

          &+span {
            font-size: 14px;
            color: rgba(14, 27, 46, 0.85);
          }
        }
      }

      .mail-template-time__timeline {
        background: #fff;
        box-shadow: 0px 0px 8px -2px rgba(0, 0, 0, 0.15);
        border-radius: 16px;
        padding: 16px;

        .time-timeline-item {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 8px;

          .time-timeline__tail {
            position: absolute;
            top: 7px;
            left: 2px;
            flex-shrink: 0;
            height: calc(100% + 60px);
            width: 2px;
          }

          .time-timeline__node {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            margin-right: 16px;
          }

          .time-timeline__label {
            color: rgba(14, 27, 46, 0.65);
            margin-right: 80px;
          }

          .time-timeline__date {
            color: rgba(7, 14, 23, 0.85);
          }
        }

        .time-timeline-item__time {
          font-size: 20px;
          font-weight: 600;
          color: rgba(7, 14, 23, 0.85);
          padding-left: 158px;
          margin-bottom: 32px;
        }
      }
    }

    .mail-image-transiton {
      position: relative;
      width: 100%;
      display: inline-block;

      .mail-template__image {
        background: rgba(245, 249, 255, 1);
        padding: 0 16px;
        margin-bottom: 24px;

        .mail-image-title {
          height: 16px;
          display: flex;
          align-items: center;
          margin-bottom: 16px;

          &>span {

            &:first-child {
              color: rgba(14, 27, 46, 0.85);
            }

            &:last-of-type {
              font-size: 12px;
              color: rgba(14, 27, 46, 0.65);
            }
          }
        }

        .mail-image-content {
          background: #fff;
          border-radius: 16px;

          img {
            width: 100%;
          }

          .image-content-table {
            width: 100%;
            border-spacing: 0;

            tr {
              height: 36px;
              box-sizing: border-box;

              th {
                font-size: 12px;
                color: rgba(14, 27, 46, 0.35);
                border-bottom: 1px solid rgba(14, 27, 46, 0.15);
              }

              td {
                font-size: 12px;
                color: rgba(14, 27, 46, 0.85);
                text-align: center;
                border-bottom: 1px solid rgba(14, 27, 46, 0.15);

                &:last-of-type {
                  font-weight: 600;
                }
              }

              &:last-of-type {

                td {
                  border: none;
                }
              }
            }
          }
        }
      }
    }

    .mail-template-screenshot {
      padding: 0 16px;
      margin-bottom: 24px;

      .mail-template-screenshot__title {
        height: 16px;
        display: flex;
        align-items: center;
        margin-bottom: 16px;
      }

      .mail-screenshot-item {
        display: flex;
        flex-flow: column;
        margin-bottom: 16px;

        &:last-of-type {
          margin-bottom: 0;
        }

        .mail-screenshot-image {
          height: 184px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #E6E8EA;

          svg {
            font-size: 24px;
            color: rgba(14, 27, 46, 1);
          }
        }

        .mail-screenshot-info {
          background: #fff;
          padding: 8px;

          .mail-screenshot-time {
            line-height: 1;
            color: rgba(7, 14, 23, 0.65);
            margin-bottom: 8px;
          }

          .mail-screenshot-content {
            display: flex;
            align-items: center;
            margin-bottom: 8px;

            &:last-of-type {
              margin-bottom: 0;
            }

            &>span {

              &:first-child {
                height: 24px;
                display: inline-flex;
                align-items: center;
                font-size: 12px;
                color: rgba(14, 27, 46, 1);
                background: rgba(14, 27, 46, 0.05);
                border: 1px solid rgba(14, 27, 46, 0.2);
                border-radius: 4px;
                padding: 0 12px;
                margin-right: 8px;
              }

              &:last-of-type {
                font-size: 14px;
                color: rgba(7, 14, 23, 0.85);
              }
            }
          }
        }
      }
    }
  }
}
</style>
