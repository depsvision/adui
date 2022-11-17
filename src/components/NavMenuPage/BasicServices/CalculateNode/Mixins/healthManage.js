import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'

import device from '@/api/device'

export default {
  data() {
    return {
      healthManageDia: {},
      healthManageDiaTem: {
        name: 'HealthManager',
        option: {
          isView: true,
          warning: {
            content: '规则详情列表中，点击「内容块」可以进行参数值的修改，注意灰色「内容块」暂时不提供修改',
            style: {
              display: 'inline-flex'
            }
          },
          rule: {
            value: [],
            headSvg: 'file-manage-fill',
            buttons: {
              buttons: [
                {
                  label: '立即执行',
                  value: 'executeRule',
                  type: 'text'
                }
              ]
            },
            detail: {
              label: '规则详情',
              frequency: '检查频率',
              judge: '健康状态',
              execute: '执行动作'
            }
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'dialog',
      'buttonScope'
    ])
  },
  watch: {

  },
  methods: {
    showHealthManage() {
      // 清空数据
      this.healthManageDia = deepClone(this.healthManageDiaTem)

      const assignObj = {
        title: '健康管理规则',
        show: true,
        name: 'DialogShell',
        width: '928px',
        customClass: 'not-scroll',
        buttons: {
          buttons: [
            {
              label: '恢复默认',
              value: 'defaultRules',
              plain: true
            },
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '保存',
              value: 'saveHealthRules',
              type: 'primary'
            }
          ]
        },
        component: this.healthManageDia
      }

      this.healthManageDia.option.nodeId = this.buttonScope.id

      const rules = this.handleRules(this.buttonScope.health)
      this.healthManageDia.option.rule.value = rules

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    handleRules(rules) {
      const defaultRules = deepClone(this.healthRulesCache)

      defaultRules.forEach(rule => {
        const matchRule = rules.find(match => match.ruleId === rule.ruleId)

        if (matchRule) {
          rule.switch.value = !!matchRule.enable

          rule.frequencyData.forEach(item => {
            if (['second', 'hour'].includes(item.value)) {
              item.label = matchRule.frequency.interval
            }

            if (item.value === 'num') {
              item.label = matchRule.frequency.times
            }
          })

          rule.executeData.forEach(item => {
            if (matchRule.execute && item.value === 'resetCaisa') {
              item.label = matchRule.execute.action.length ? '重置板卡' : '不重置板卡'
            }
          })
        }
      })

      return defaultRules
    },
    saveHealthRules() {
      const rules = this.analysisRules(this.healthManageDia.option.rule.value)

      const params = {
        nodeId: this.buttonScope.id,
        config: rules
      }

      device.setHealthFrequencyRules(params)
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: '保存健康管理规则成功！'
          })

          this.$store.dispatch('dialog/initDialogData')

          const node = this.physicalNode.find(item => item.id === this.buttonScope.id)
          node.health = deepClone(params.config)

          this.getNodeData()
        })
    },
    analysisRules(rules) {
      const result = []

      rules.forEach(rule => {
        let interval = ['', 300, 24][rule.ruleId]
        let times = ['', 2, 1][rule.ruleId === 1]

        let action = []

        rule.frequencyData.forEach(item => {
          if (['second', 'hour'].includes(item.value)) {
            interval = item.label
          }

          if (item.value === 'num') {
            times = item.label
          }
        })

        rule.executeData.forEach(item => {
          if (item.value === 'resetCaisa') {
            action = item.label.includes('不') ? [] : ['caisa']
          }
        })

        const config = {
          ruleId: rule.ruleId,
          enable: rule.switch.value ? 1 : 0,
          frequency: {
            interval: Number(interval) || ['', 300, 24][rule.ruleId],
            times: Number(times) || ['', 2, 1][rule.ruleId === 1]
          }
        }

        if (rule.ruleId === 1) {
          config.execute = {
            action: action
          }
        }

        result.push(config)
      })

      return result
    },

    resetCaisa() {
      const rule = this.healthManageDia.option.rule.value
      let formula = null

      rule.forEach(item => {
        if (!formula) {
          formula = item.executeData.find(data => data.buttonValue === 'setCaisaValue')
        }
      })

      if (formula) {
        formula.label = formula.label.includes('不') ? `重置板卡` : `不重置板卡`
      }
    },
    recoverDefaultRules() {
      const option = this.dialog.component.option

      option.rule.value = deepClone(this.healthRulesCache)
    },
    executeRule() {
      const rules = this.analysisRules([this.buttonScope])

      const params = {
        nodeId: this.healthManageDia.option.nodeId,
        rule: {
          ruleId: rules[0].ruleId
        }
      }

      if (rules[0].ruleId === 1) {
        params.rule.execute = rules[0].execute
      }

      device.executeHealthRule(params)
        .then(res => {
          this.$messageInfo({
            type: 'success',
            message: '立即执行成功！'
          })

          this.getNodeData()
        })
    }
  }
}
