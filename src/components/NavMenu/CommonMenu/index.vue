<template>
  <div class="common-menu-container">
    <el-menu
      :mode="componentOption.mode"
      :default-active="componentOption.active"
      :text-color="componentOption.textColor"
      :active-text-color="componentOption.activeTextColor"
      :background-color="componentOption.backgroundColor"
      :collapse="componentOption.collapse"
      :collapse-transition="componentOption.collapseTransition"
      :unique-opened="true"
      :menu-trigger="componentOption.menuTrigger"
      :router="componentOption.router"
      :class="menuClass"
      :style="componentOption.style"
      :ellipsis="false"
      @select="handleMenuItemClick"
    >
      <menu-item
        v-for="menuItem in componentOption[componentOption.prop || 'menuGroup']"
        :ref="menuItem.value || menuItem.path"
        :key="menuItem.value || menuItem.path"
        :component-option="menuItem"
        :prop="componentOption.prop"
        :submenu-class="componentOption.submenuClass"
      />
      <item-bar v-if="componentOption.bar" :component-option="componentOption.bar" />
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MenuItem from './MenuItem'
import Storage from '@/utils/token'
import ItemBar from '@/components/Bar/ItemBar'

export default {
  name: 'CommonMenu',
  components: { MenuItem, ItemBar },
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
      logoUrl: import('@/assets/image/logoImage/homeLogoWhite.png')
    }
  },
  computed: {
    ...mapGetters([
      'accessedRoutes'
    ]),
    menuClass() {
      const classObj = {
        'horizontal-menu': this.componentOption.mode === 'horizontal'
      }
      classObj[this.componentOption.class] = true
      return classObj
    }
  },
  methods: {
    getLogo() {
      const logo = JSON.parse(Storage.getSession('logo'))
      this.logoUrl = logo.logo
    },
    handleMenuItemClick(index, indexPath) {
      this.$emit('handleMenuItemClick', index, indexPath)
    }
  }
}
</script>

<style scoped lang="scss">
.common-menu-container{
  .horizontal-menu {
    display: flex;
  }
}

.el-menu--collapse {

  ::v-deep .menu-item-container {
    .submenu-menu-arrow {
      display: none;
    }
  }
}
</style>
