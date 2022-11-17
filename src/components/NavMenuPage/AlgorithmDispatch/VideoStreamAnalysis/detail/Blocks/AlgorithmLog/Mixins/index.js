import task from '@/api/task'

import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      ruleConfigDia: {
        name: 'CustomCombination',
        option: {
          afterRangeChange: this.afterRangeChange,
          eleStyle: {
            height: '240px'
          },
          elementOption: {
            nodeKey: 'value'
          },
          value: {
            formula: [],
            script: ''
          },
          element: [
            {
              head: '参数',
              class: ['is-text', 'is-blue'],
              data: [
                {
                  label: '算法参数',
                  value: 'params',
                  nodeDisabled: false,
                  isEditable: true,
                  removeClass: ['is-error']
                }
              ],
              style: {
                width: '150px'
              }
            },
            {
              head: '条件',
              class: ['is-svg'],
              dataGroup: [
                {
                  head: '逻辑条件',
                  data: [
                    {
                      label: '且',
                      value: '&&',
                      svg: 'union',
                      br: true,
                      nodeDisabled: false
                    },
                    {
                      label: '或',
                      value: '||',
                      svg: 'or',
                      br: true,
                      nodeDisabled: false
                    }
                  ]
                },
                {
                  head: '判断条件',
                  data: [
                    {
                      label: '不等于',
                      value: '!=',
                      svg: 'unequal',
                      nodeDisabled: false
                    },
                    {
                      label: '大于',
                      value: '>',
                      svg: 'more',
                      nodeDisabled: false
                    },
                    {
                      label: '大于等于',
                      value: '>=',
                      svg: 'moreEqual',
                      nodeDisabled: false
                    },
                    {
                      label: '等于',
                      value: '==',
                      svg: 'equal',
                      nodeDisabled: false
                    },
                    {
                      label: '小于等于',
                      value: '<=',
                      svg: 'lessEqual',
                      nodeDisabled: false
                    },
                    {
                      label: '小于',
                      value: '<',
                      svg: 'less',
                      nodeDisabled: false
                    }
                  ]
                }
              ],
              style: {
                width: '200px'
              }
            },
            {
              head: '值',
              class: ['is-text', 'is-orange'],
              data: [
                {
                  label: '参数值',
                  value: 'value',
                  nodeDisabled: false,
                  isEditable: true,
                  removeClass: ['is-error']
                }
              ],
              style: {
                width: '150px'
              }
            }
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'dialog',
      'button',
      'buttonScope'
    ])
  },
  watch: {
    'button.value'(val) {
      this.clickButton(val)
    }
  },
  methods: {
    clickButton(value) {
      switch (value) {
        case 'ruleConfig':
          this.openRuleConfig()
          break

        case 'addCondition':
          this.addCondition()
          break
        case 'deleteFilterCondition':
          this.deleteFilterCondition()
          break

        case 'addTagAssembly':
          this.addTag()
          break
        case 'closeTag':
          this.closeTag()
          break

        case 'saveWarnRules':
          this.saveWarnRules()
          break

        case 'applyCondition':
          this.applyCondition()
          break
        default:
      }
    },

    openRuleConfig() {
      this.ruleConfigDia.option.value = this.filterCondition[this.buttonScope.id].condition.rule.value

      const assignObj = {
        title: '警告规则',
        show: true,
        name: 'DialogShell',
        width: '564px',
        tip: {
          label: '根据以下规则， 过滤为一次警告',
          svg: 'warning',
          class: ['dialog-shell-tip', 'is-warning-tip']
        },
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '确认',
              value: 'saveWarnRules',
              type: 'primary'
            }
          ]
        },
        component: this.ruleConfigDia
      }

      this.$store.dispatch('dialog/assignDialogData', assignObj)

      this.$nextTick(() => {
        let index = this.ruleConfigDia.option.value.formula.length - 1

        index = index === -1 ? null : index

        this.afterRangeChange(index)
      })
    },

    addCondition() {
      if (!this.algorithm.length) {
        this.$messageInfo({
          type: 'warning',
          message: '当前任务未配置算法，无法添加过滤！'
        })

        return
      }

      if (!this.unusedAlgorithm.length) {
        this.$messageInfo({
          type: 'warning',
          message: '当前可用算法数量为0，无法添加过滤！'
        })

        return
      }

      const template = deepClone(this.filterConditionTemplate)

      template.condition.algorithm.content.popover.option = this.unusedAlgorithm

      this.filterCondition.push(template)

      this.$nextTick(() => {
        const conditionGroup = this.$refs.conditionGroup

        conditionGroup[conditionGroup.length - 1].focusInput()
      })
    },
    deleteFilterCondition() {
      this.$confirm('正在进行条件组及其规则配置的删除操作，点击应用后将无法恢复<br />确认要删除吗？', '删除确认', {
        confirmButtonText: '删除',
        confirmButtonClass: 'is-danger',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'dialog--mini',
        type: 'warning'
      })
        .then(() => {
          const index = this.filterCondition.findIndex(item => item.id === this.buttonScope.id)

          const content = this.filterCondition[index].condition.algorithm.content

          content.algorithmTag.forEach(item => {
            this.unusedAlgorithm.push({
              label: item.label,
              value: item.id
            })
          })

          this.filterCondition.splice(index, 1)
        })
    },

    addTag() {
      const condition = this.filterCondition.find((item) => item.id === this.buttonScope.id)

      const algorithmIndex = this.unusedAlgorithm.findIndex(item => item.value === this.buttonScope.label)

      const algorithmContent = condition.condition.algorithm.content

      algorithmContent.algorithmTag.push({
        parentId: this.buttonScope.id,
        id: this.buttonScope.label,
        label: this.unusedAlgorithm[algorithmIndex].label,
        value: this.buttonScope.label + this.unusedAlgorithm[algorithmIndex].label,
        class: 'tag-grey'
      })

      this.unusedAlgorithm.splice(algorithmIndex, 1)

      algorithmContent.popover.content = ''
      algorithmContent.popover.visible = false
    },
    closeTag() {
      const condition = this.filterCondition.find((item) => item.id === this.buttonScope.parentId)

      const algorithmContent = condition.condition.algorithm.content

      this.unusedAlgorithm.push({
        label: this.buttonScope.label,
        value: this.buttonScope.id
      })

      algorithmContent.algorithmTag.splice(algorithmContent.algorithmTag.findIndex(item => item.id === this.buttonScope.id), 1)
    },

    afterRangeChange(index) {
      const formula = this.ruleConfigDia.option.value.formula

      const end = formula[index]

      this.setDisable(false)

      if (end) {
        const endIsParams = end.value === 'params'
        const endIsJudgment = ['!=', '>', '>=', '==', '<=', '<'].includes(end.value)
        const endIsValue = end.value === 'value'
        const endIsLogic = ['&&', '||', '('].includes(end.value)

        if (endIsParams) {
          this.setDisable(true, 0)
          this.setDisable(true, 1, 0)
          this.setDisable(true, 2)
        } else if (endIsJudgment) {
          this.setDisable(true, 0)
          this.setDisable(true, 1, 0)
          this.setDisable(true, 1, 1)
        } else if (endIsValue) {
          this.setDisable(true, 0)
          this.setDisable(true, 1, 1)
          this.setDisable(true, 2)
        } else if (endIsLogic) {
          this.setDisable(true, 1, 0)
          this.setDisable(true, 1, 1)
          this.setDisable(true, 2)
        }
      } else {
        this.setDisable(true, 1, 0)
        this.setDisable(true, 1, 1)
        this.setDisable(true, 2)
      }
    },
    setDisable(disabled, elementIndex, groupIndex) {
      const element = this.ruleConfigDia.option.element

      if (typeof elementIndex !== 'undefined') {
        if (elementIndex === 1) {
          if (typeof groupIndex !== 'undefined') {
            element[elementIndex].dataGroup[groupIndex].data.forEach(item => {
              item.nodeDisabled = disabled
            })
          } else {
            element[elementIndex].dataGroup.forEach(group => {
              group.data.forEach(item => {
                item.nodeDisabled = disabled
              })
            })
          }
        } else {
          element[elementIndex].data.forEach(item => {
            item.nodeDisabled = disabled
          })
        }
      } else {
        element.forEach((ele, eleIndex) => {
          if (eleIndex === 1) {
            ele.dataGroup.forEach(group => {
              group.data.forEach(item => {
                item.nodeDisabled = disabled
              })
            })
          } else {
            ele.data.forEach(item => {
              item.nodeDisabled = disabled
            })
          }
        })
      }
    },
    findLastIndex(arr, params, value) {
      const indexList = []
      const arrList = deepClone(arr)

      arrList.forEach(item => {
        indexList.push(item[params])
      })

      return indexList.lastIndexOf(value)
    },
    saveWarnRules() {
      const verify = this.checkFormula()

      if (!verify) {
        this.$messageInfo({
          type: 'warning',
          message: '公式内存在错误，请检查公式！'
        })
      } else {
        this.transformFormulaToArray()

        this.$store.dispatch('dialog/initDialogData')
      }
    },
    checkFormula() {
      let verify = true

      const formula = this.ruleConfigDia.option.value.formula

      const start = formula[0]
      const end = formula[formula.length - 1]

      if (start && ['&&', '||'].includes(start.value)) {
        start.class.push('is-error')
      }

      if (end && ['&&', '||'].includes(end.value)) {
        end.class.push('is-error')
      }

      const ruleList = start ? [''] : []

      formula.forEach(item => {
        if (item.isEditable && item.label === '' && !item.class.includes('is-error')) {
          item.class.push('is-error')
          verify = false
        }

        if (!['&&', '||'].includes(item.value)) {
          if (['!=', '>', '>=', '==', '<=', '<'].includes(item.value)) {
            ruleList[ruleList.length - 1] += 'judge'
          } else {
            ruleList[ruleList.length - 1] += item.value
          }
        } else {
          ruleList[ruleList.length] = ''
        }
      })

      const isEveryRuleIsTrue = ruleList.every(rule => rule === 'paramsjudgevalue')

      if (!isEveryRuleIsTrue) {
        verify = false
      }

      return verify
    },
    transformFormulaToArray() {
      const formula = this.ruleConfigDia.option.value.formula

      const condition = []
      formula.forEach(item => {
        if (item.value !== '||') {
          !condition.length && (condition[0] = [])

          if (item.value !== '&&') {
            !condition[condition.length - 1].length && (condition[condition.length - 1][0] = {})

            const inner = condition[condition.length - 1][condition[condition.length - 1].length - 1]

            if (item.value === 'params') {
              inner.parameter = item.label
            } else if (['!=', '>', '>=', '==', '<=', '<'].includes(item.value)) {
              inner.judge = ['!=', '==', '>', '>=', '<', '<='].indexOf(item.value)
            } else if (item.value === 'value') {
              inner.reference = item.label
            }
          } else {
            condition[length - 1][condition[length - 1].length] = {}
          }
        } else {
          condition[condition.length] = []
        }
      })

      let ruleNum = 0
      condition.forEach(con => {
        con.forEach(item => {
          ruleNum++
        })
      })

      const config = this.filterCondition.find(item => item.id === this.buttonScope.id)

      config.condition.rule.pushData = condition
      config.condition.rule.tip = `当前已有${ruleNum}条规则`
    },

    verifyData() {
      let result = true

      let algorithNum = 0
      this.filterCondition.forEach(item => {
        algorithNum += item.condition.algorithm.content.algorithmTag.length
      })

      if (this.filterCondition.length && !algorithNum) {
        this.$messageInfo({
          type: 'warning',
          message: '未选择算法！'
        })

        result = false
      }

      return result
    },
    applyCondition() {
      const result = this.verifyData()

      if (!result) {
        return
      }

      this.finalData = this.filterCondition.filter(item => item.condition.algorithm.content.algorithmTag.length)

      const log = []

      this.finalData.forEach(item => {
        const algorithm = []

        item.condition.algorithm.content.algorithmTag.forEach(item => {
          algorithm.push(item.id)
        })

        log.push({
          id: item.id,
          name: item.head.name,
          algorithm: algorithm,
          conditions: item.condition.rule.pushData,
          interval: item.condition.judgment.input[0].value,
          count: item.condition.judgment.input[1].value
        })
      })

      const params = {
        taskId: this.$route.query.id,
        log: log
      }

      task.setAlgorithmLogFilter(params)
        .then(() => {
          this.$messageInfo({
            type: 'success',
            message: '保存算法日志过滤条件成功！'
          })

          this.$parent.$parent.getTaskDetail()
        })
    }
  }
}
