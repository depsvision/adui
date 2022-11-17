<template>
  <div class="cube-animation-container" :style="componentOption.style">
    <div class="cube-animation-block" :style="componentOption.blockStyle">
      <div
        v-for="cube in componentOption.cubeList"
        :key="cube.id"
        :style="cube.style"
        :class="splitClass(cube.class)"
        class="cube-cluster-block"
      >
        <div class="cube-surface is-front" :style="dealStyle(cube,'front')" :class="splitClass(cube.topClass)" />
        <div class="cube-surface is-back" :style="dealStyle(cube,'back')" :class="splitClass(cube.bottomClass)" />
        <div class="cube-surface is-top" :style="dealStyle(cube,'top')" :class="splitClass(cube.leftClass)" />
        <div class="cube-surface is-bottom" :style="dealStyle(cube,'bottom')" :class="splitClass(cube.rightClass)" />
        <div class="cube-surface is-left" :style="dealStyle(cube,'left')" :class="splitClass(cube.frontClass)" />
        <div class="cube-surface is-right" :style="dealStyle(cube,'right')" :class="splitClass(cube.backClass)" />
      </div>
    </div>
    <div class="cube-shadow" :style="componentOption.shadowStyle" />
  </div>
</template>

<script>

export default {
  name: 'CubeAnimation',
  components: { },
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
  computed: {
    splitClass() {
      return classString => {
        const classGroup = {}
        classString && classString.split(' ').forEach(item => {
          classGroup[item] = true
        })
        return classGroup
      }
    },
    dealStyle() {
      return (cube, direction) => {
        let style = {}
        switch (direction) {
          case 'front':
            style = {
              top: '-' + cube.height / 2 + 'px',
              left: '-' + cube.width / 2 + 'px',
              width: cube.width + 'px',
              height: cube.height + 'px',
              'background-color': cube.backGroundColor && (cube.backGroundColor[direction] || cube.backGroundColor.all),
              animation: cube.animation && (cube.animation[direction] || cube.animation.all),
              transform: 'translateZ(' + cube.width / 2 + 'px)'
            }
            break
          case 'back':
            style = {
              top: '-' + cube.height / 2 + 'px',
              left: '-' + cube.width / 2 + 'px',
              width: cube.width + 'px',
              height: cube.height + 'px',
              'background-color': cube.backGroundColor && (cube.backGroundColor[direction] || cube.backGroundColor.all),
              animation: cube.animation && (cube.animation[direction] || cube.animation.all),
              transform: 'translateZ(-' + cube.width / 2 + 'px)'
            }
            break
          case 'top':
            style = {
              top: '-' + cube.height / 2 + 'px',
              left: '-' + cube.width / 2 + 'px',
              width: cube.width + 'px',
              height: cube.width + 'px',
              'background-color': cube.backGroundColor && (cube.backGroundColor[direction] || cube.backGroundColor.all),
              animation: cube.animation && (cube.animation[direction] || cube.animation.all),
              transform: 'rotateX(90deg)  translateZ(' + cube.width / 2 + 'px)'
            }
            break
          case 'bottom':
            style = {
              top: '-' + cube.height / 2 + 'px',
              left: '-' + cube.width / 2 + 'px',
              width: cube.width + 'px',
              height: cube.width + 'px',
              'background-color': cube.backGroundColor && (cube.backGroundColor[direction] || cube.backGroundColor.all),
              animation: cube.animation && (cube.animation[direction] || cube.animation.all),
              transform: 'rotateX(-90deg) translateZ(-' + (cube.width / 2 - cube.height) + 'px)'
            }
            break
          case 'left':
            style = {
              top: '-' + cube.height / 2 + 'px',
              left: '-' + cube.width / 2 + 'px',
              width: cube.width + 'px',
              height: cube.height + 'px',
              'background-color': cube.backGroundColor && (cube.backGroundColor[direction] || cube.backGroundColor.all),
              animation: cube.animation && (cube.animation[direction] || cube.animation.all),
              transform: 'rotateY(90deg) translateZ(-' + cube.width / 2 + 'px)'
            }
            break
          case 'right':
            style = {
              top: '-' + cube.height / 2 + 'px',
              left: '-' + cube.width / 2 + 'px',
              width: cube.width + 'px',
              height: cube.height + 'px',
              'background-color': cube.backGroundColor && (cube.backGroundColor[direction] || cube.backGroundColor.all),
              animation: cube.animation && (cube.animation[direction] || cube.animation.all),
              transform: 'rotateY(-90deg) translateZ(-' + cube.width / 2 + 'px)'
            }
            break
          default:
            break
        }
        return style
      }
    }
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
.cube-animation-container {
  position: relative;
  transform-style: preserve-3d;
  perspective-origin: center;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .cube-animation-block {
    position: relative;
    transform-style: preserve-3d;
    perspective-origin: center;

    .cube-cluster-block {
      position: relative;
      transform-style: preserve-3d;
      perspective-origin: center;

      .cube-surface {
        position: absolute;
        border: none;
      }
    }
  }

  .cube-shadow {
    position: relative;
    transform: rotateX(90deg);
  }

}
</style>
