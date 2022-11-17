import { mapGetters } from 'vuex'
import authorityConfig from '@/setting'

export default {
  data() {
    return {
      authorityObj: {},
      whiteList: {
        common: ['search', 'reset', 'prev', 'next', 'zoomOut', 'zoomIn', 'handleAlarm', 'detail', 'backHistory'],
        CalculateNode: ['getServiceHealthDetail'],
        MonitorPoint: ['view'],
        VideoStreamAnalysis: ['detail', 'demoVideo'],
        VideoStreamAnalysisDetail: ['viewTaskHealthStatus', 'serviceDetail', 'view'],
        AlgorithmLinkage: ['detail'],
        AlgorithmLinkageDetail: [],
        AlgorithmLog: [],
        AlarmVoice: ['listenDefault', 'listenItem'],
        CallbackOutput: [],
        PushLog: [],
        AppId: [],
        UserManage: [],
        RoleManage: [],
        LicenseManage: ['downloadSignature', 'refreshEfficient', 'reGet'],
        SystemSetting: []
      },
      hasRole: false
    }
  },
  computed: {
    ...mapGetters([
      'authority'
    ])
  },
  created() {
    this.authorityInit()
  },
  methods: {
    authorityInit() {
      this.authorityObj.route = this.$route

      this.hasRole = this.authority.limit === 1 || this.authorityObj.route.meta.role.some(role => {
        return (this.authority.role[role] & authorityConfig.authority.operate) === authorityConfig.authority.operate || this.authorityObj.route.name === 'console'
      })
    },
    accessButtons(data) {
      const whiteList = this.whiteList[this.authorityObj.route.name]

      let finallyList = this.whiteList.common

      if (whiteList) {
        finallyList = finallyList.concat(whiteList)
      }

      let value = data.value

      const splitValue = (value && value.split('-')) || ''

      if (splitValue.length > 1) {
        value = splitValue[0]
      }

      return !this.hasRole && !finallyList.includes(value)
    }
  }
}
