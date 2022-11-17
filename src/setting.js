export default {
  title: '人工智能推理平台',

  /**
   * authority and limit 权限说明
   *
   * @limit  0:其他用户权限 1:超级用户权限
   *
   * @authority  1: 查看 2: 操作
   */

  authority: {
    view: 1,
    operate: 2
  },

  algorithmSvg: {
    0: 'helmet',
    1: 'uniform',
    2: 'safety-vest',
    3: 'helmet-uniform',
    4: 'person-invasion',
    5: 'helmet-safety-vest',
    6: 'skin-exposures',
    7: 'fire-smoke',
    8: 'smoking-phone-call',
    9: 'smoking',
    10: 'phone-call',
    11: 'uniform',
    12: 'uniform',
    13: 'outdoor-oil',
    14: 'indoor-oil',
    15: 'indoor-oil',
    16: 'fall-down',
    17: 'fall-down',
    18: 'fall-down',
    19: 'helmet',
    20: 'smog',
    21: 'fire',
    22: 'person-invasion',
    23: 'tram-car',
    24: 'face-line'
  },

  ossService: {
    1: '阿里云 OSS'
  },

  version: 'v2.8.0-release'
}
