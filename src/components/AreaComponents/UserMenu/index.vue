<template>
  <div class="user-menu-container">
    <el-dropdown ref="dropDown" trigger="click" @command="handleCommand">
      <span class="user-avatar-layout">
        <el-image
          class="user-avatar"
          :src="userData.img"
          fill="cover"
        >
          <div slot="error" class="image-slot">
            <el-image
              class="user-avatar"
              :src="userData.errImg"
              fill="cover"
            />
          </div>
        </el-image>
      </span>
      <el-dropdown-menu slot="dropdown" class="user-drop-down-menu">
        <div class="user-info">
          <div class="user-name">{{ userData.userName }}</div>
          <div class="user-email">{{ userData.email }}</div>
        </div>
        <el-divider class="header-divider" />
        <el-dropdown-item
          v-for="(item,index) in dropDownData"
          :key="index"
          :command="item.command"
          :divided="item.divided"
          :class="item.class"
        >
          <svg-icon v-if="item.svg" :icon-class="item.svg" />
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>

export default {
  name: 'UserMenu',
  components: { },
  props: {
    userData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    dropDownData: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
    }
  },
  mounted() {},
  methods: {
    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.$store.dispatch('user/logout')
          break
        default:
      }
    }
  }
}
</script>

<style scoped lang="scss">
.user-menu-container {
  height: 100%;
  display: flex;

  .user-avatar-layout {
    position: relative;
    border-radius: 50%;
    &:hover {
      cursor: pointer;
      &::before {
        content: " ";
        width: 42px;
        height: 42px;
        position: absolute;
        top: -3px;
        left: -3px;
        border-radius: 50%;
        background-color:#E2E9F4;
      }
    }
    .user-avatar {
      display: block;
      height: 36px;
      width: 36px;
      border-radius: 50%;
    }
    &:focus {
      outline: unset;
    }
  }

  .el-dropdown {
    display: flex;
    align-items: center;
  }

  :deep( .el-drawer__container ) {
    display: flex;
    justify-content: center;
    align-items: center;
    .system-setting-drawer {
      height: auto !important;
      width: 620px;
      top: auto;
      left: auto;
      right: auto;
      border-radius: 8px;
      .el-drawer__header {
        margin-bottom: 0;
        span {
          text-align: left;
          font-weight: 600;
        }
      }
      .drawer__content {
        padding: 5px 25px;
      }
      .drawer__footer {
        float: right;
        padding: 5px 10px;
        .el-button {
          padding: 12px 30px;
        }
      }

      .el-form-item__label-wrap {
        label {
          font-weight: 500;
          color: #000;
        }
      }
    }

  }

  :deep( .span-detail ) {
    display: flex;

    .copy-span-button {
      margin-left: 12px;
      padding: 0;
    }
  }

  :deep( .import-img-format-tip ) {
    font-size: 13px;
    color: #989696;
    margin-left: 10px;
  }
}
</style>
