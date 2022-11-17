<template>
  <div class="face-linkage-container" :style="componentOption.style">
    <div v-if="componentOption.title" class="face-linkage-title">
      <div class="face-linkage-title--item">
        <span>{{ componentOption.title.label }}</span>
        <span v-if="componentOption.title.value">
          <span v-for="(title,titleIndex) in componentOption.title.value" :key="titleIndex">{{ title }}</span>
        </span>
      </div>
    </div>
    <div v-if="componentOption.cards && componentOption.cards.length >0" class="face-linkage-card" :style="componentOption.cardStyle">
      <div v-for="(card,cardIndex) in componentOption.cards" :key="cardIndex" class="face-linkage-card--item">
        <div class="card-item-clip">
          <el-image
            v-loading="card.clip.loading"
            :src="card.clip.url"
            fit="contain"
            class="clip-image"
            :class="[card.clip.loading?'is-loading':'']"
          >
            <div slot="error" class="image-slot svg-slot">
              <svg-icon :icon-class="card.clip.url === ''?'empty-image':'error-image-line'" />
            </div>
          </el-image>
        </div>
        <div
          v-for="(item,itemIndex) in card.imagesList"
          :key="itemIndex"
          class="card-item-info"
        >
          <div class="card-item-info-head">
            <el-image
              :src="item.url"
              class="head-image"
              fit="contain"
            >
              <div slot="error" class="image-slot svg-slot">
                <svg-icon :icon-class="item.url === ''?'empty-image':'error-image-line'" />
              </div>
            </el-image>
            <span class="head-name">{{ item.name }}</span>
          </div>
          <div class="card-item-info-middle">
            <div class="middle-info-block">
              <span class="info-label">{{ item.idLabel }}</span>
              <span class="info-content">{{ item.id }}</span>
            </div>
            <div class="middle-info-block">
              <span class="info-label">{{ item.scoreLabel }}</span>
              <span class="info-content is-weight">{{ item.score }}</span>
            </div>
          </div>
          <div class="card-item-info-bottom">
            <span class="info-label">{{ item.tagLabel }}</span>
            <div v-if="item.tags" ref="tag" class="bottom-tags">
              <tag-assembly :component-option="item.tags" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TagAssembly from '@/components/InnerComponents/TagAssembly'

export default {
  name: 'FaceLinkage',
  components: { TagAssembly },
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
.face-linkage-container {
  flex: 1;
  display: flex;
  flex-flow: column;

  .face-linkage-title {
    font-size: 14px;
    line-height: 36px;

    .face-linkage-title--item {

      &>span {
        display: inline-block;

        &:first-child {
          color: rgba(14, 27, 46, 0.65);
          padding-right: 24px;
        }

        &:last-of-type {
          color: rgba(7, 14, 23, 0.85);
        }
      }
    }

  }

  .face-linkage-card {
    padding:8px 24px 0 24px;
    margin-left: -24px;
    margin-right: -24px;
    overflow-y: overlay;

    span {
      line-height: 1;
    }

    .face-linkage-card--item {
      display: flex;
      flex-flow: column;
      box-shadow: 0px 0px 8px -1px rgba(7, 14, 23, 0.2);
      border-radius: 4px;
      padding: 8px;
      margin-bottom: 8px;

      .card-item-clip {
        height: 64px;

        .clip-image {
          display: inline-block;
          height: 64px;
          width: auto;
          max-width: 100%;

          &.is-loading {
            display: flex;
          }
        }
      }

      .card-item-info {
        display: flex;
        flex-flow: column;
        background-color: rgba(245, 247, 250, 1);
        border-radius: 4px;
        padding: 8px 16px 4px 8px;
        margin-top: 8px;

        .card-item-info-head {
          display: flex;
          align-items: center;
          margin-bottom: 8px;

          .head-image {
            flex: unset;
            height: 32px;
            width: 32px;
            border-radius: 50%;
          }

          .head-name {
            margin-left: 8px;
            font-size: 14px;
            color: rgba(7, 14, 23, 0.85);
          }
        }

        .card-item-info-middle {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;

          .middle-info-block {
            display: flex;
            flex-flow: column;
          }
        }

        .card-item-info-bottom {

          ::v-deep .tag-assembly-container {
            flex-wrap: wrap;

            .el-tag {
              margin-right: 4px;
              margin-bottom: 4px;
            }
          }
        }

        .info-label {
          font-size: 12px;
          color: rgba(14, 27, 46, 0.35);
          margin-bottom: 4px;
        }

        .info-content {
          font-size: 14px;
          color: rgba(7, 14, 23, 0.85);

          &.is-weight {
            font-weight: 600;
          }
        }
      }
    }
  }
}
</style>
