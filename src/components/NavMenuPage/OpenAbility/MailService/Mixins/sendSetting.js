import { deepClone } from '@/utils'
import { validEmail } from '@/utils/validate'
import task from '@/api/task'

export default {
  data() {
    return {
      mailSetting: {},
      mailSendDia: {},
      mailSendDiaTemplate: {
        name: 'FormList',
        option: {
          class: 'is-inner',
          data: {
            mailSender: '',
            mailUsername: '',
            mailPassword: '',
            mailServer: '',
            mailPort: '',
            mailEncryptType: ''
          },
          rule: {
            mailSender: [
              { required: true, message: '请输入', trigger: 'blur' }
            ],
            mailUsername: [
              { required: true, message: '请输入', trigger: 'blur' },
              {
                validator(rule, value, callback, source, options) {
                  const isMail = validEmail(value)

                  if (isMail) {
                    callback([])
                  } else {
                    callback('邮箱格式错误')
                  }
                },
                trigger: 'blur'
              }
            ],
            mailPassword: [
              { required: true, message: '请输入', trigger: 'blur' }
            ],
            mailServer: [
              { required: true, message: '请输入', trigger: 'blur' }
            ],
            mailPort: [
              { required: true, message: '请输入', trigger: 'blur' },
              {
                validator(rule, value, callback, source, options) {
                  const reg = /^[0-9]+.?[0-9]*/
                  const valueNumber = Number(value)

                  if (reg.test(valueNumber)) {
                    if (Math.round(Number(value)) >= 0 && Math.round(Number(value)) < 65536) {
                      callback([])
                    } else {
                      callback('请输入0 - 65535 之间的值')
                    }
                  } else {
                    callback('请输入数字')
                  }
                },
                trigger: 'blur'
              }
            ],
            mailEncryptType: [
              { required: true, message: '请选择', trigger: 'change' }
            ]
          },
          form: [
            {
              type: 'inputAssembly',
              label: '发件人名称',
              prop: 'mailSender',
              placeholder: '请输入'
            },
            {
              type: 'inputAssembly',
              label: '邮箱地址',
              prop: 'mailUsername',
              placeholder: 'you@example.com'
            },
            {
              type: 'inputAssembly',
              label: '密码',
              autocomplete: 'new-password',
              showPassword: true,
              prop: 'mailPassword',
              placeholder: '请输入'
            },
            {
              type: 'inputAssembly',
              label: '服务器',
              prop: 'mailServer',
              placeholder: '邮件服务器'
            },
            {
              type: 'inputAssembly',
              label: '端口',
              prop: 'mailPort',
              placeholder: '587'
            },
            {
              type: 'selectAssembly',
              label: '加密方式',
              prop: 'mailEncryptType',
              placeholder: '请选择',
              option: [
                {
                  label: 'TLS',
                  value: 'tls'
                },
                {
                  label: 'SSL',
                  value: 'ssl'
                }
              ]
            }
          ],
          labelPosition: 'left',
          labelWidth: '120px'
        }
      }
    }
  },
  methods: {
    getMailSetting() {
      task.getMailSetting()
        .then(res => {
          const { data } = res

          const button = this.buttonGroupOption.buttons[1]

          const isSet = Object.values(data).every(setting => !!setting || setting === 0)

          if (!isSet) {
            button.class = 'is-danger'
            this.mailWarning = true
          } else {
            button.class = ''
            this.mailWarning = false
          }

          this.mailSetting = deepClone(data)
        })
    },
    showMailSendDia() {
      // 清空数据
      this.mailSendDia = deepClone(this.mailSendDiaTemplate)

      const assignObj = {
        title: '发送服务器设置（SMTP）',
        show: true,
        name: 'DialogShell',
        width: '500px',
        buttons: {
          buttons: [
            {
              label: '取消',
              value: 'cancel',
              plain: true
            },
            {
              label: '保存',
              value: 'saveMailSetting',
              type: 'primary'
            }
          ]
        },
        component: {}
      }

      this.mailSendDia.option.data = deepClone(this.mailSetting)

      assignObj.component = this.mailSendDia

      this.$store.dispatch('dialog/assignDialogData', assignObj)
    },
    saveMailSetting() {
      this.mailSendDia.option.ref.validate(valid => {
        const data = deepClone(this.mailSendDia.option.data)

        data.mailPort = Number(data.mailPort)

        task.setMailSetting(data)
          .then(res => {
            this.$messageInfo({
              type: 'success',
              message: '修改邮件设置成功！'
            })

            this.$store.dispatch('dialog/initDialogData')

            this.getMailSetting()
          })
      })
    }
  }
}
