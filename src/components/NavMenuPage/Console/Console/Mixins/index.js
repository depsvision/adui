import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'
import { cleanRequestList } from '@/utils/interceptors'

export default {
  data() {
    return {
      apiTimer: null,
      webcamPoint: {
        online: {
          start: 0,
          end: 0
        },
        offline: {
          start: 0,
          end: 0
        }
      },
      masterNode: {
        id: -1,
        name: '',
        statusName: 'Master',
        svg: 'master',
        class: 'master-node'
      },
      activeNode: -1,
      nodeList: [],
      statusProgressWidth: 32,
      statusProgressStrokeWidth: 8,
      statusList: [],
      masterStatusList: [
        {
          svg: 'cpu',
          name: 'CPU状态',
          percentage: 0
        },
        {
          svg: 'ram',
          name: '内存占用',
          percentage: 0
        },
        {
          svg: 'disk',
          name: '硬盘容量',
          percentage: 0
        }
      ],
      clusterCube: {},
      masterCube: {
        style: {
          transform: 'rotateX(-36deg) rotateY(45deg)'
        },
        cubeList: [
          {
            id: 0,
            width: 56,
            height: 20,
            cache: {
              width: 56,
              height: 20,
              top: 36
            },
            style: {
              top: '-36px'// 20 + 14 + 1 + 1
            },
            backGroundColor: {
              front: 'rgba(211, 222, 240, 1)',
              back: 'rgba(211, 222, 240, 1)',
              top: 'rgba(234, 241, 255, 1)',
              bottom: 'rgba(234, 241, 255, 1)',
              left: 'rgba(246, 249, 255, 1)',
              right: 'rgba(246, 249, 255, 1)'
            }
          },
          {
            id: 1,
            width: 44,
            height: 14,
            cache: {
              width: 44,
              height: 14,
              top: 18
            },
            style: {
              top: '-18px'// 10 + 7 +1
            },
            backGroundColor: {
              all: 'rgba(42, 109, 244, 1)',
              front: 'rgba(12, 82, 223, 1)'
            },
            animation: {
              all: 'lightBlueChange 2s ease-in-out 0s infinite alternate',
              front: 'deepBlueChange 2s ease-in-out 0s infinite alternate'
            }
          },
          {
            id: 2,
            width: 56,
            height: 20,
            cache: {
              width: 56,
              height: 20,
              top: 0
            },
            style: {
            },
            backGroundColor: {
              front: 'rgba(211, 222, 240, 1)',
              back: 'rgba(211, 222, 240, 1)',
              top: 'rgba(234, 241, 255, 1)',
              bottom: 'rgba(234, 241, 255, 1)',
              left: 'rgba(246, 249, 255, 1)',
              right: 'rgba(246, 249, 255, 1)'
            }
          },
          {
            id: 3,
            width: 44,
            height: 14,
            cache: {
              width: 44,
              height: 14,
              top: 18
            },
            style: {
              top: '18px'
            },
            backGroundColor: {
              all: 'rgba(42, 109, 244, 1)',
              front: 'rgba(12, 82, 223, 1)'
            },
            animation: {
              all: 'lightBlueChange 2s ease-in-out 0s infinite alternate',
              front: 'deepBlueChange 2s ease-in-out 0s infinite alternate'
            }
          },
          {
            id: 4,
            width: 56,
            height: 20,
            cache: {
              width: 56,
              height: 20,
              top: 36
            },
            style: {
              top: '36px'
            },
            backGroundColor: {
              front: 'rgba(211, 222, 240, 1)',
              back: 'rgba(211, 222, 240, 1)',
              top: 'rgba(234, 241, 255, 1)',
              bottom: 'rgba(234, 241, 255, 1)',
              left: 'rgba(246, 249, 255, 1)',
              right: 'rgba(246, 249, 255, 1)'
            }
          }
        ],
        blockStyle: {
          animation: 'cubeFloat 2s ease-in-out 0s infinite alternate'
        },
        shadowStyle: {
          width: '1px',
          height: '1px',
          top: '48px',
          'box-shadow': 'rgba(27, 53, 89, .5) 0px 0px 6px 28px',
          animation: 'cubeShadow 2s ease-in-out 0s infinite alternate',
          cache: {
            top: 48
          }
        }
      },
      nodeCube: {
        style: {
          transform: 'rotateX(-36deg) rotateY(45deg)'
        },
        cubeList: [
          {
            id: 0,
            width: 56,
            height: 30,
            cache: {
              width: 56,
              height: 30,
              top: 15
            },
            style: {
              top: '-15px'
            },
            backGroundColor: {
              front: 'rgba(211, 222, 240, 1)',
              back: 'rgba(211, 222, 240, 1)',
              top: 'rgba(234, 241, 255, 1)',
              bottom: 'rgba(234, 241, 255, 1)',
              left: 'rgba(246, 249, 255, 1)',
              right: 'rgba(246, 249, 255, 1)'
            }
          },
          {
            id: 1,
            width: 56,
            height: 30,
            cache: {
              width: 56,
              height: 30,
              top: 15
            },
            style: {
              top: '15px'
            },
            backGroundColor: {
              all: 'rgba(42, 244, 187, 1)',
              front: 'rgba(75, 210, 172, 1)'
            },
            animation: {
              all: 'lightGreenChange 2s ease-in-out 0s infinite alternate',
              front: 'deepGreenChange 2s ease-in-out 0s infinite alternate'
            }
          }
        ],
        blockStyle: {
          animation: 'cubeFloat 2s ease-in-out 0s infinite alternate'
        },
        shadowStyle: {
          width: '1px',
          height: '1px',
          top: '32px',
          'box-shadow': 'rgba(16, 92, 70, .5) 0px 0px 6px 28px',
          animation: 'cubeShadow 2s ease-in-out 0s infinite alternate',
          cache: {
            top: 32
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'screenResolution'
    ])
  },
  watch: {
    'screenResolution.height': {
      handler(val) {
        const svgArr = ['cpu', 'ram', 'disk']
        if (!val) {
          return
        }

        if (val <= 765) {
          this.statusProgressWidth = 46

          this.$nextTick(() => {
            this.statusList.forEach((item, index) => {
              item.svg = ''
            })
          })
        } else {
          this.$nextTick(() => {
            this.statusList.forEach((item, index) => {
              item.svg = svgArr[index]
            })
          })

          if (val <= 874) {
            this.statusProgressWidth = 52
          } else {
            this.statusProgressWidth = 72
          }
        }

        this.dealClusterSize(val)
      },
      immediate: true
    }
  },
  methods: {
    changeNode(node, type, addAnimation) {
      const pieBlueColor = ['#9CBFF0', '#1872F0', '#1B3559', '#DAE3F0']
      const pieGreenColor = ['#9CF0D4', '#00CC88', '#06402D', '#CFE6DE']

      this.activeNode = node.id
      if (this.activeNode === -1) {
        this.clusterCube = deepClone(this.masterCube)
        this.calculateServicePie.option.series[0].data.forEach((item, index) => {
          item.itemStyle.color = pieBlueColor[index]
        })
        this.statusList = this.masterStatusList
        cleanRequestList(['device/node/service/status'])
        this.getMasterStatus()
      } else {
        this.clusterCube = deepClone(this.nodeCube)

        if (node.status === 0) {
          this.clusterCube.cubeList[1].backGroundColor = {
            all: 'rgba(224, 235, 232, 1)',
            front: 'rgba(194, 214, 208, 1)'
          }

          this.clusterCube.cubeList[1].animation = {}

          this.clusterCube.blockStyle = {}

          this.clusterCube.shadowStyle.animation = ''
        } else {
          this.clusterCube.cubeList[1].backGroundColor = {
            all: 'rgba(42, 244, 187, 1)',
            front: 'rgba(75, 210, 172, 1)'
          }

          this.clusterCube.cubeList[1].animation = {
            all: 'lightGreenChange 2s ease-in-out 0s infinite alternate',
            front: 'deepGreenChange 2s ease-in-out 0s infinite alternate'
          }

          this.clusterCube.blockStyle = {
            animation: 'cubeFloat 2s ease-in-out 0s infinite alternate'
          }

          this.clusterCube.shadowStyle.animation = 'cubeShadow 2s ease-in-out 0s infinite alternate'
        }

        cleanRequestList(['device/server/status'])

        this.calculateServicePie.option.series[0].data.forEach((item, index) => {
          item.itemStyle.color = pieGreenColor[index]
        })

        this.getNodeServicePie(node, type)
      }

      this.dealClusterSize(this.screenResolution.height, addAnimation)

      if (!type) {
        this.$nextTick(() => {
          clearInterval(this.apiTimer)
          this.apiTimer = null

          this.apiTimer = setInterval(() => {
            this.getCameraPointStatus()

            this.getClusterNode(node)
          }, 30000)
        })
      }
    },
    dealClusterSize(resolution, addAnimation) {
      const scale = resolution / 810

      if (Object.keys(this.clusterCube).length === 0) this.clusterCube = deepClone(this.masterCube)

      this.clusterCube.cubeList.forEach((item, index) => {
        item.width = item.cache.width * scale
        item.height = item.cache.height * scale

        switch (index) {
          case 0:
            if (this.activeNode === -1) {
              item.style.top = '-' + ((item.cache.top - 2) * scale + 2) + 'px'
            } else {
              item.style.top = '-' + (item.cache.top * scale) + 'px'
            }
            break
          case 1:
            if (this.activeNode === -1) {
              item.style.top = '-' + ((item.cache.top - 1) * scale + 1) + 'px'
            } else {
              item.style.top = (item.cache.top * scale) + 'px'
            }
            break
          case 3:
            item.style.top = (item.cache.top - 2) * scale + 2 + 'px'
            break
          case 4:
            item.style.top = (item.cache.top - 1) * scale + 1 + 'px'
            break
          default:
        }
      })

      if (this.activeNode === -1) {
        this.clusterCube.shadowStyle.top = (this.clusterCube.shadowStyle.cache.top - 4) * scale + 4 + 'px'
        this.clusterCube.shadowStyle['box-shadow'] = 'rgba(27, 53, 89, .5) 0px 0px ' + (6 * scale) + 'px ' + (28 * scale) + 'px'
        this.changeAnimation(scale, '27, 53, 89', addAnimation)
      } else {
        this.clusterCube.shadowStyle.top = this.clusterCube.shadowStyle.cache.top * scale + 'px'
        this.clusterCube.shadowStyle['box-shadow'] = 'rgba(16, 92, 70, .5) 0px 0px ' + (6 * scale) + 'px ' + (28 * scale) + 'px'
        this.changeAnimation(scale, '16, 92, 70', addAnimation)
      }
    },
    changeAnimation(scale, color, addAnimation) {
      if (!addAnimation) return

      const style = document.createElement('style')

      style.setAttribute('type', 'text/css')

      document.head.appendChild(style)

      const sheet = style.sheet

      sheet.insertRule(
        `@keyframes cubeFloat{
              from {
                transform: translate(0, 0);
                transition-timing-function: ease-in-out;
              }
  
              to {
                transform: translate(0, -` + (32 * scale) + `px);
                transition-timing-function: ease;
              }
            }`
      )

      sheet.insertRule(
        `@keyframes cubeShadow {
            from {
              box-shadow: rgba(` + color + `, .5) 0px 0px ` + (6 * scale) + `px ` + (28 * scale) + `px;
              transition-timing-function: ease-in-out;
            }
          
            to {
              box-shadow: rgba(` + color + `, .25) 0px 0px ` + (48 * scale) + `px ` + (32 * scale) + `px;
              transition-timing-function: ease;
            }
          }`
      )
    }
  }
}
