<template>
  <div class="filter-img-container">
    <div class="filter-img-tip">
      <span>{{ componentOption.tip }}</span>
    </div>
    <div class="filter-img-picture-block">
      <div
        v-for="picture in dealPictureList"
        :key="picture.url"
        class="filter-img-picture-item"
      >
        <span :class="[(displayImg && displayImg === picture.url)?'is-active':'']" @click="chooseItem(picture)">
          <el-image
            v-if="picture.url !== ''"
            :src="picture.url"
            :fit="componentOption.upFit"
          >
            <div slot="error" class="image-slot svg-slot">
              <svg-icon :icon-class="picture.url === ''?'empty-image':'error-image-line'" />
            </div>
          </el-image>
          <div v-else class="filter-img-no-picture">
            <svg-icon :icon-class="componentOption.pictureSvg || 'plus'" />
          </div>
          <span v-if="picture.url !== ''" class="filter-img-remove-img" @click.stop="removePicture(picture)">
            <svg-icon icon-class="error-small-m" />
          </span>
        </span>
      </div>
    </div>
    <div v-loading="componentOption.loading" class="filter-img-display">
      <el-image
        v-if="displayImg !== ''"
        :src="displayImg"
        :fit="componentOption.downFit"
      >
        <div slot="error" class="image-slot svg-slot">
          <svg-icon :icon-class="displayImg === ''?'empty-image':'error-image-line'" />
        </div>
      </el-image>
      <button-group
        v-else
        ref="buttonGroup"
        :component-option="componentOption.buttons"
      />
    </div>
  </div>
</template>

<script>
import ButtonGroup from '@/components/Button/ButtonGroup'

export default {
  name: 'FilterImg',
  components: { ButtonGroup },
  props: {
    componentOption: {
      type: Object,
      default: function() {
        return {

        }
      }
    }
  },
  data() {
    return {
      displayImg: ''
    }
  },
  computed: {
    dealPictureList() {
      const max = this.componentOption.max || 5
      if (this.componentOption.picture.length < max) {
        return [
          ...this.componentOption.picture,
          {
            path: '',
            url: ''
          }
        ]
      } else {
        return this.componentOption.picture
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.displayImg = this.dealPictureList[0].url
      })
    },
    chooseItem(picture) {
      this.displayImg = picture.url
    },
    removePicture(picture) {
      const index = this.componentOption.picture.findIndex(item => item.url === picture.url)
      this.componentOption.picture.splice(index, 1)

      if (this.displayImg === picture.url) {
        this.displayImg = ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
.filter-img-container {
  display: flex;
  flex-flow: column;

  .filter-img-tip {
    line-height: 36px;
    font-size: 14px;
    color: rgba(14, 27, 46, .85);
  }

  .filter-img-picture-block {
    display: flex;
    height: 72px;
    margin: 8px 0 16px;

    .filter-img-picture-item {
      display: flex;
      align-items: center;
      margin-left: 20px;

      &:first-child {
        margin-left: 0;
      }

      &>span {
        position: relative;
      }

      .el-image {
        width: 72px;
        height: 72px;
        padding: 2px;
        border: 2px solid #fff;

        &:hover {
          color: #1872F0;;
          border-color: #1872F0;
          cursor: pointer;
        }

        &+.filter-img-no-picture {
          margin-left: 20px;
        }
      }

      .filter-img-no-picture {
        width: 64px;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(27, 53, 89, 0.2);
        border: 1px solid rgba(27, 53, 89, 0.2);
        border-radius: 4px;

        &:hover {
          color: #1872F0;;
          border-color: #1872F0;
          cursor: pointer;

          svg {
            color: #1872F0;
          }
        }

        svg {
          font-size: 24px;
          color: #868D96;
        }
      }

      .is-active {

        .el-image,
        .filter-img-no-picture {
          border-color: #1872F0;

          svg {
            color: #1872F0;;
          }
        }
      }

      .filter-img-remove-img {
        position: absolute;
        top: -4px;
        right: -4px;
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 58, 51, 1);
        border-radius: 50%;

        &:hover {
          cursor: pointer;

          &::after {
            content: " ";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255,255,255,.15);
            border-radius: 50%;
          }
        }

        svg {
          font-size: 12px;
          color: #fff;
        }
      }
    }
  }

  .filter-img-display {
    height: 405px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(14, 27, 46, 0.1);

    ::v-deep .button-span-layout.span-button_text{

      &+.button-span-layout.span-button_text {
        margin-left: 48px;
      }

      .el-button--text {
        color: rgba(14, 27, 46, 1);

        &:hover {
          color: #1872F0;
        }

        &>span {
          display: flex;
          align-items: center;
          font-size: 12px;
        }

        svg {
          font-size: 16px;
          margin-right: 4px;
        }
      }
    }

    .el-image {
      height: 100%;
    }
  }

}
</style>
