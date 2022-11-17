export default {
  data() {
    return {
      healthRulesCache: [
        {
          ruleId: 1,
          label: '服务健康管理',
          tip: '自动化服务健康状态修复',
          switch: {
            value: true
          },
          forbid: true,
          frequencyData: [
            {
              value: '(',
              svg: 'leftParentheses',
              class: ['is-svg']
            },
            {
              label: '检查间隔',
              value: 'interval',
              class: ['is-text', 'is-grey']
            },
            {
              value: '==',
              svg: 'equal',
              class: ['is-svg']
            },
            {
              label: '300',
              fix: 's',
              value: 'second',
              isEditable: true,
              isEdit: true,
              class: ['is-text', 'is-blue']
            },
            {
              value: ')',
              svg: 'rightParentheses',
              class: ['is-svg']
            },
            {
              value: '&&',
              svg: 'union',
              class: ['is-svg']
            },

            {
              value: '(',
              svg: 'leftParentheses',
              class: ['is-svg']
            },
            {
              label: '检查次数',
              value: 'checkTimes',
              class: ['is-text', 'is-grey']
            },
            {
              value: '==',
              svg: 'equal',
              class: ['is-svg']
            },
            {
              label: '2',
              value: 'num',
              isEditable: true,
              isEdit: true,
              class: ['is-text', 'is-blue']
            },
            {
              value: ')',
              svg: 'rightParentheses',
              class: ['is-svg']
            }
          ],
          judgeData: [
            {
              value: '(',
              svg: 'leftParentheses',
              class: ['is-svg']
            },
            {
              value: '(',
              svg: 'leftParentheses',
              class: ['is-svg']
            },
            {
              label: '任务状态',
              value: 'task',
              class: ['is-text', 'is-grey']
            },
            {
              value: '==',
              svg: 'equal',
              class: ['is-svg']
            },
            {
              label: '已启用',
              value: 'start',
              class: ['is-text', 'is-grey']
            },
            {
              value: ')',
              svg: 'rightParentheses',
              class: ['is-svg']
            },
            {
              value: '&&',
              svg: 'union',
              class: ['is-svg']
            },
            {
              value: '(',
              svg: 'leftParentheses',
              class: ['is-svg']
            },
            {
              label: '服务状态',
              value: 'service',
              class: ['is-text', 'is-grey']
            },
            {
              value: '==',
              svg: 'equal',
              class: ['is-svg']
            },
            {
              label: 'run',
              value: 'run',
              class: ['is-text', 'is-grey']
            },
            {
              value: ')',
              svg: 'rightParentheses',
              class: ['is-svg']
            },
            {
              value: ')',
              svg: 'rightParentheses',
              class: ['is-svg']
            },
            {
              value: '||',
              svg: 'or',
              br: true,
              class: ['is-svg']
            },
            {
              value: '(',
              svg: 'leftParentheses',
              class: ['is-svg']
            },
            {
              value: '(',
              svg: 'leftParentheses',
              class: ['is-svg']
            },
            {
              label: '任务状态',
              value: 'task',
              class: ['is-text', 'is-grey']
            },
            {
              value: '==',
              svg: 'equal',
              class: ['is-svg']
            },
            {
              label: '已停用',
              value: 'stop',
              class: ['is-text', 'is-grey']
            },
            {
              value: ')',
              svg: 'rightParentheses',
              class: ['is-svg']
            },
            {
              value: '&&',
              svg: 'union',
              class: ['is-svg']
            },
            {
              value: '(',
              svg: 'leftParentheses',
              class: ['is-svg']
            },
            {
              label: '服务状态',
              value: 'service',
              class: ['is-text', 'is-grey']
            },
            {
              value: '!=',
              svg: 'unequal',
              class: ['is-svg']
            },
            {
              label: 'stop',
              value: 'stop',
              class: ['is-text', 'is-grey']
            },
            {
              value: ')',
              svg: 'rightParentheses',
              class: ['is-svg']
            },
            {
              value: ')',
              svg: 'rightParentheses',
              class: ['is-svg']
            }
          ],
          executeData: [
            {
              label: '恢复健康状态',
              value: 'recoverHealth',
              class: ['is-text', 'is-grey']
            },
            {
              value: '&&',
              svg: 'union',
              class: ['is-svg']
            },
            {
              label: '重置板卡',
              value: 'resetCaisa',
              buttonValue: 'setCaisaValue',
              editSvg: 'data-switch-fill',
              isEdit: true,
              class: ['is-text', 'is-blue']
            }
          ]
        },
        {
          ruleId: 2,
          label: '定时重启',
          tip: '自动定时重启整个物理节点',
          switch: {
            value: false
          },
          forbid: true,
          frequencyData: [
            {
              value: '(',
              svg: 'leftParentheses',
              class: ['is-svg']
            },
            {
              label: '检查间隔',
              value: 'interval',
              class: ['is-text', 'is-grey']
            },
            {
              value: '==',
              svg: 'equal',
              class: ['is-svg']
            },
            {
              label: '24',
              fix: 'h',
              value: 'hour',
              isEditable: true,
              isEdit: true,
              class: ['is-text', 'is-blue']
            },
            {
              value: ')',
              svg: 'rightParentheses',
              class: ['is-svg']
            },
            {
              value: '&&',
              svg: 'union',
              class: ['is-svg']
            },

            {
              value: '(',
              svg: 'leftParentheses',
              class: ['is-svg']
            },
            {
              label: '检查次数',
              value: 'checkTimes',
              class: ['is-text', 'is-grey']
            },
            {
              value: '==',
              svg: 'equal',
              class: ['is-svg']
            },
            {
              label: '1',
              value: 'num',
              isEditable: true,
              isEdit: true,
              class: ['is-text', 'is-blue']
            },
            {
              value: ')',
              svg: 'rightParentheses',
              class: ['is-svg']
            }
          ],
          judgeData: [
            {
              value: '(',
              svg: 'leftParentheses',
              class: ['is-svg']
            },
            {
              value: '(',
              svg: 'leftParentheses',
              class: ['is-svg']
            },
            {
              label: '任务状态',
              value: 'task',
              class: ['is-text', 'is-grey']
            },
            {
              value: '==',
              svg: 'equal',
              class: ['is-svg']
            },
            {
              label: '已启用',
              value: 'start',
              class: ['is-text', 'is-grey']
            },
            {
              value: ')',
              svg: 'rightParentheses',
              class: ['is-svg']
            },
            {
              value: '&&',
              svg: 'union',
              class: ['is-svg']
            },
            {
              value: '(',
              svg: 'leftParentheses',
              class: ['is-svg']
            },
            {
              label: '服务状态',
              value: 'service',
              class: ['is-text', 'is-grey']
            },
            {
              value: '==',
              svg: 'equal',
              class: ['is-svg']
            },
            {
              label: 'run',
              value: 'run',
              class: ['is-text', 'is-grey']
            },
            {
              value: ')',
              svg: 'rightParentheses',
              class: ['is-svg']
            },
            {
              value: ')',
              svg: 'rightParentheses',
              class: ['is-svg']
            },
            {
              value: '||',
              svg: 'or',
              br: true,
              class: ['is-svg']
            },
            {
              value: '(',
              svg: 'leftParentheses',
              class: ['is-svg']
            },
            {
              value: '(',
              svg: 'leftParentheses',
              class: ['is-svg']
            },
            {
              label: '任务状态',
              value: 'task',
              class: ['is-text', 'is-grey']
            },
            {
              value: '==',
              svg: 'equal',
              class: ['is-svg']
            },
            {
              label: '已停用',
              value: 'stop',
              class: ['is-text', 'is-grey']
            },
            {
              value: ')',
              svg: 'rightParentheses',
              class: ['is-svg']
            },
            {
              value: '&&',
              svg: 'union',
              class: ['is-svg']
            },
            {
              value: '(',
              svg: 'leftParentheses',
              class: ['is-svg']
            },
            {
              label: '服务状态',
              value: 'service',
              class: ['is-text', 'is-grey']
            },
            {
              value: '!=',
              svg: 'unequal',
              class: ['is-svg']
            },
            {
              label: 'stop',
              value: 'stop',
              class: ['is-text', 'is-grey']
            },
            {
              value: ')',
              svg: 'rightParentheses',
              class: ['is-svg']
            },
            {
              value: ')',
              svg: 'rightParentheses',
              class: ['is-svg']
            },
            {
              value: '||',
              svg: 'or',
              br: true,
              class: ['is-svg']
            },
            {
              label: 'false',
              value: 'false',
              class: ['is-text', 'is-grey']
            }
          ],
          executeData: [
            {
              label: '恢复健康状态',
              value: 'recoverHealth',
              class: ['is-text', 'is-grey']
            },
            {
              value: '&&',
              svg: 'union',
              class: ['is-svg']
            },
            {
              label: '重置板卡',
              value: 'resetCaisa',
              class: ['is-text', 'is-grey']
            },
            {
              value: '&&',
              svg: 'union',
              class: ['is-svg']
            },
            {
              label: '重启节点',
              value: 'restartNode',
              class: ['is-text', 'is-grey']
            }
          ]
        }
      ]
    }
  }
}
