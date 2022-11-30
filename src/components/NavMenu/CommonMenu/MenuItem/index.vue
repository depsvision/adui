<template>
  <div class="menu-item-container">
    <!-- el-menu-item  showAll表示所有层级都显示 -->
    <el-menu-item
      v-if="!componentOption.showAll && (!componentOption[prop] || componentOption[prop].length === 0)"
      :index="componentOption.value || resolvePath()"
      :disabled="checkIsMeta('disabled')"
      class="menu-item-padding"
    >
      <el-badge
        :hidden="(!!componentOption.meta && !!componentOption.meta.badge && componentOption.badge.position === 'div') || (preconditions('value') == null)"
        :max="preconditions('max')"
        :type="preconditions('type')"
        :value="preconditions('value')"
        :is-dot="preconditions('isDot')"
        :class="preconditions('class')"
        class="menu-outer-badge"
      >
        <div class="menu-item">
          <i v-if="checkIsMeta('icon')" :class="checkIsMeta('icon')" />
          <svg-icon v-if="checkIsMeta('svgIcon')" :class="[...checkIsMeta('svgClass')]" :icon-class="checkIsMeta('svgIcon')" />
          <el-badge
            :hidden="(!!componentOption.meta && !!componentOption.meta.badge && componentOption.badge.position === 'span') || (preconditions('value') == null)"
            :max="preconditions('max')"
            :type="preconditions('type')"
            :value="preconditions('value')"
            :is-dot="preconditions('isDot')"
            :class="preconditions('class')"
            class="menu-inner-badge"
          >
            {{ componentOption.label || componentOption.meta.title }}
          </el-badge>
        </div>
      </el-badge>
    </el-menu-item>

    <!-- el-submenu -->
    <el-submenu
      v-else
      :index="componentOption.value || resolvePath()"
      popper-append-to-body
      class="menu-item-padding"
      :popper-class="componentOption.popperClass || '' + ' ' + submenuClass"
      :class="[
        aside.collapse ? 'is-collapse' : '',
      ]"
    >
    <span>awefawefawefawefawe</span>
      <template slot="title">
        <div class="submenu-menu-block">
          <el-badge
            :hidden="componentOption.meta && componentOption.meta.badge && componentOption.badge.position === 'div'"
            :max="preconditions('max')"
            :type="preconditions('type')"
            :value="preconditions('value')"
            :is-dot="preconditions('isDot')"
            :class="preconditions('class')"
            class="menu-outer-badge"
          >
            <div class="menu-item">
              <i v-if="checkIsMeta('icon')" :class="checkIsMeta('icon')" />
              <svg-icon
                v-if="checkIsMeta('svgIcon')"
                :class="[
                  'submenu-menu-title-svg',
                  ...checkIsMeta('svgClass')
                ]"
                :icon-class="checkIsMeta('svgIcon')"
              />
              <transition name="opacity-show">
                <el-badge
                  v-show="!aside.collapse"
                  :hidden="componentOption.meta && componentOption.meta.badge && componentOption.badge.position === 'span'"
                  :max="preconditions('max')"
                  :type="preconditions('type')"
                  :value="preconditions('value')"
                  :is-dot="preconditions('isDot')"
                  :class="preconditions('class')"
                  class="menu-inner-badge"
                >
                  {{ componentOption.label || componentOption.meta.title }}
                </el-badge>
              </transition>
            </div>
          </el-badge>
          <svg-icon class="submenu-menu-arrow" icon-class="arrow-right-line" />
        </div>
      </template>

      <div v-show="aside.collapse" class="submenu-menu-popup-title">
        <div>asd</div>
        <span>{{ componentOption.label || componentOption.meta.title }}</span>
      </div>

      <div v-for="menuItem in isGroupMenu" :key="menuItem.path" class="submenu-menu-item">
        <el-menu-item-group v-if="menuItem.groupKey" :title="menuItem.groupKey">
          <menu-item
            v-for="menuGroupItem in menuItem.groupData"
            :key="menuGroupItem.path"
            :component-option="menuItem"
            :prop="prop"
          />
        </el-menu-item-group>

        <menu-item
          v-else
          :component-option="menuItem"
          :prop="prop"
        />
      </div>
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'

import { mapGetters } from 'vuex'

export default {
  name: 'MenuItem',
  props: {
    componentOption: {
      type: Object,
      default: function() {
        return {}
      }
    },
    prop: {
      type: String,
      default: 'children'
    },
    submenuClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      indexPath: ''
    }
  },
  computed: {
    ...mapGetters([
      'aside'
    ]),
    preconditions() {
      return prop => {
        if (this.componentOption.meta && this.componentOption.meta.badge) {
          return this.componentOption.badge[prop]
        } else {
          return null
        }
      }
    },
    checkIsMeta() {
      return prop => {
        return this.componentOption[prop] || (this.componentOption.meta && this.componentOption.meta[prop])
      }
    },
    isGroupMenu() {
      let resultArr = []
      const groupKeys = []
      this.componentOption[this.prop].forEach(item => {
        if (item.meta && item.meta.groupKey) {
          groupKeys.push(item.meta.groupKey)
        }
      })

      const groupKeysSet = [...new Set(groupKeys)]

      if (groupKeysSet.length > 0) {
        const keyCache = {}
        groupKeysSet.forEach(set => {
          keyCache[set] = []
        })

        this.componentOption[this.prop].forEach(item => {
          if (item.meta && item.meta.groupKey) {
            keyCache[item.meta.groupKey].push(item)
          }
        })

        Object.keys(keyCache).forEach(key => {
          resultArr.push({
            groupKey: key,
            groupData: keyCache[key]
          })
        })

        const notGroupData = this.componentOption[this.prop].filter(data => data.meta && !data.meta.groupKey)
        resultArr = resultArr.concat(notGroupData)
        return resultArr
      } else {
        return this.componentOption[this.prop]
      }
    }
  },
  methods: {
    resolvePath() {
      let basePath = ''
      if (this.componentOption.basePath) {
        basePath = this.componentOption.basePath
      }
      this.indexPath = path.resolve(basePath, this.componentOption.path)
      if (this.componentOption[this.prop]) {
        this.componentOption[this.prop].forEach(item => {
          item.basePath = this.indexPath
        })
      }
      return this.indexPath
    }
  }
}
</script>

<style scoped lang="scss">
.menu-item-container {
  display: flex;
}

.menu-item-padding {
  flex: 1;
  min-width: unset;

  &.is-opened {

    .submenu-menu-arrow {
      transform: rotateZ(90deg);
    }

    ::v-deep .el-menu--inline {
      margin-bottom: 8px;
    }
  }

  &.is-collapse {

    .submenu-menu-title-svg {
      margin-right: 0;
    }
  }
}

.submenu-menu-block {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;

  .submenu-menu-arrow {
    position: absolute;
    right: 8px;
    font-size: 16px;
    transition: all ease-in-out .3s;
  }
}

::v-deep .el-submenu__title {
  border-radius: 8px;
  margin-bottom: 8px;

  .el-submenu__icon-arrow {
    display: none;
  }
}

.el-menu--inline {

  .submenu-menu-item {
    margin-bottom: 8px;

    &:last-of-type {
      margin-bottom: 0;
    }

    .menu-item-padding {
      border-radius: 4px;
    }
  }
}

.menu-item {
  display: flex;
  align-items: center;

  .submenu-menu-title-svg {
    font-size: 20px;
    margin-right: 8px;
  }
}
</style>
