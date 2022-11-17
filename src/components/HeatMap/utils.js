export const randomNormalDistribution = (mean, std_dev) => {
  return mean + (uniformNormalDistribution() * std_dev)
}

function uniformNormalDistribution() {
  let u = 0.0; let v = 0.0; let w = 0.0; let c = 0.0
  do {
    // 获得两个（-1,1）的独立随机变量
    u = Math.random() * 2 - 1.0
    v = Math.random() * 2 - 1.0
    w = u * u + v * v
  } while (w === 0.0 || w >= 1.0)
  // 这里就是 Box-Muller转换
  c = Math.sqrt((-2 * Math.log(w)) / w)
  // 返回2个标准正态分布的随机数，封装进一个数组返回
  // 当然，因为这个函数运行较快，也可以扔掉一个
  // return [u*c,v*c];
  return u * c
}

function cauchyRandom(a, b) {
  const u = Math.random()
  const cauchy = a - b / Math.tan(Math.PI * u)
  return cauchy
}

/**
   * This is just a simple version of deep copy
   * Has a lot of edge cases bug
   * If you want to use a perfect deep copy, use lodash's _.cloneDeep
   * @param {Object} source
   * @returns {Object}
   */
export const deepClone = source => {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : (source.constructor === RegExp ? new RegExp(source) : {})
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })

  return targetObj
}

export const simulatedWalking = (id, arr, pointRadius, mainRadius, max) => {
  const dataArr = deepClone(arr)
  const resultArr = []

  const wapper = document.querySelector('#' + id)
  const w = wapper.offsetWidth
  const h = wapper.offsetHeight
  const defaultRadius = mainRadius / 1920 * w

  const PI = Math.PI

  dataArr.forEach(point => {
    const radomRadius = Math.floor(Math.random() * (defaultRadius - Math.max(defaultRadius * 0.8, pointRadius))) + Math.max(defaultRadius * 0.8, pointRadius)
    point.x *= w
    point.y *= h

    const radiusScope = radomRadius - pointRadius
    const pointCache = deepClone(point)

    for (let i = 0; i < point.value; i++) {
      resultArr.push({
        x: Math.floor(pointCache.x),
        y: Math.floor(pointCache.y),
        value: 1
      })

      const randomAngle = Math.random() * 360

      const randomSin = Math.sin(2 * PI * randomAngle / 360)
      const randomCos = Math.cos(2 * PI * randomAngle / 360)

      const randomX = randomSin * pointRadius
      const randomY = randomCos * pointRadius

      if (Math.pow(pointCache.x + randomX - point.x, 2) + Math.pow(pointCache.y + randomY - point.y, 2) <= Math.pow(radiusScope, 2)) {
        pointCache.x += randomX
        pointCache.y += randomY
      } else {
        pointCache.x += Math.sin(2 * PI * (randomAngle + 180) / 360) * pointRadius
        pointCache.y += Math.cos(2 * PI * (randomAngle + 180) / 360) * pointRadius
      }
    }
  })
  const resultMax = (1 / 75 * PI + Math.sqrt(3) / 150) / PI * max

  return [resultArr, resultMax]
}

export const cauchyHeatMap = (id, arr, pointRadius, mainRadius, max) => {
  const dataArr = deepClone(arr)
  const resultArr = []

  const wapper = document.querySelector('#' + id)
  const w = wapper.offsetWidth
  const h = wapper.offsetHeight
  const defaultRadius = mainRadius / 1920 * w

  const PI = Math.PI

  dataArr.forEach(point => {
    const radomRadius = Math.floor(Math.random() * (defaultRadius - Math.max(defaultRadius * 0.8, pointRadius))) + Math.max(defaultRadius * 0.8, pointRadius)
    point.x *= w
    point.y *= h

    const radiusScope = radomRadius - pointRadius

    for (let i = 0; i < point.value; i++) {
      const randomRadius = Math.min(Math.abs(cauchyRandom(0, radiusScope)), radiusScope)

      const randomAngle = Math.random() * 360

      const randomSin = Math.sin(2 * PI * randomAngle / 360)
      const randomCos = Math.cos(2 * PI * randomAngle / 360)

      const randomX = randomSin * randomRadius
      const randomY = randomCos * randomRadius

      resultArr.push({
        x: Math.floor(point.x + randomX),
        y: Math.floor(point.y + randomY),
        value: 1
      })
    }
  })

  const resultMax = Math.pow(pointRadius, 2) / Math.pow(mainRadius, 2) * max * 0.6826

  return [resultArr, resultMax]
}

export const normalHeatMap = (id, arr, pointRadius, mainRadius, max) => {
  const dataArr = deepClone(arr)
  const resultArr = []

  const wapper = document.querySelector('#' + id)
  const w = wapper.offsetWidth
  const h = wapper.offsetHeight
  const defaultRadius = mainRadius / 1920 * w

  const PI = Math.PI

  dataArr.forEach(point => {
    const radomRadius = Math.floor(Math.random() * (defaultRadius - Math.max(defaultRadius * 0.8, pointRadius))) + Math.max(defaultRadius * 0.8, pointRadius)
    point.x *= w
    point.y *= h

    for (let i = 0; i < point.value; i++) {
      const radiusScope = radomRadius - pointRadius

      const randomNormalRadius = Math.min(Math.abs(randomNormalDistribution(0, radiusScope)), radomRadius - pointRadius)

      const randomAngle = Math.random() * 360

      const randomSin = Math.sin(2 * PI * randomAngle / 360)
      const randomCos = Math.cos(2 * PI * randomAngle / 360)

      const randomX = randomSin * randomNormalRadius
      const randomY = randomCos * randomNormalRadius

      resultArr.push({
        x: Math.floor(point.x + randomX),
        y: Math.floor(point.y + randomY),
        value: 1
      })
    }
  })

  const resultMax = Math.pow(pointRadius, 2) / Math.pow(mainRadius, 2) * max * 0.6826

  return [resultArr, resultMax]
}

export const randomHeatMap = (id, arr, pointRadius, mainRadius, max) => {
  const dataArr = deepClone(arr)
  const resultArr = []

  const wapper = document.querySelector('#' + id)
  const w = wapper.offsetWidth
  const h = wapper.offsetHeight
  const defaultRadius = mainRadius / 1920 * w

  const PI = Math.PI

  dataArr.forEach((point, index) => {
    const radomRadius = Math.floor(Math.random() * (defaultRadius - Math.max(defaultRadius * 0.8, pointRadius))) + Math.max(defaultRadius * 0.8, pointRadius)
    point.x *= w
    point.y *= h

    for (let i = 0; i < point.value; i++) {
      const radiusScope = (radomRadius - pointRadius) * 0.3

      const randomRadius = Math.random() * radiusScope

      const randomAngle = Math.random() * 360

      const randomSin = Math.sin(2 * PI * randomAngle / 360)
      const randomCos = Math.cos(2 * PI * randomAngle / 360)

      const randomX = randomSin * randomRadius
      const randomY = randomCos * randomRadius

      resultArr.push({
        x: Math.floor(point.x + randomX),
        y: Math.floor(point.y + randomY),
        value: 1
      })
    }
  })

  const resultMax = Math.pow(pointRadius, 2) / Math.pow(mainRadius, 2) * max

  return [resultArr, resultMax]
}

export const randomAddFakeHeatMap = (id, arr, pointRadius, mainRadius, max) => {
  const dataArr = deepClone(arr)
  const resultArr = []

  const wapper = document.querySelector('#' + id)
  const w = wapper.offsetWidth
  const h = wapper.offsetHeight
  const defaultRadius = mainRadius / 1920 * w

  const PI = Math.PI

  dataArr.forEach((point, index) => {
    const radomRadius = Math.floor(Math.random() * (defaultRadius - Math.max(defaultRadius * 0.8, pointRadius))) + Math.max(defaultRadius * 0.8, pointRadius)
    point.x *= w
    point.y *= h

    for (let i = 0; i < point.value; i++) {
      const radiusScope = radomRadius - pointRadius

      const randomRadius = Math.random() * radiusScope

      const randomAngle = Math.random() * 360

      const randomSin = Math.sin(2 * PI * randomAngle / 360)
      const randomCos = Math.cos(2 * PI * randomAngle / 360)

      const randomX = randomSin * randomRadius
      const randomY = randomCos * randomRadius

      resultArr.push({
        x: Math.floor(point.x + randomX),
        y: Math.floor(point.y + randomY),
        value: 1
      })
    }
  })

  const resultMax = Math.pow(pointRadius, 2) / Math.pow(mainRadius, 2) * max

  return [resultArr, resultMax]
}

export const centerOffset = (id, arr, pointRadius, mainRadius, max) => {
  const dataArr = deepClone(arr)
  const resultArr = []

  const wapper = document.querySelector('#' + id)
  const w = wapper.offsetWidth
  const h = wapper.offsetHeight
  const defaultRadius = mainRadius / 1920 * w

  const PI = Math.PI

  dataArr.forEach((point, index) => {
    const randomRadius = Math.floor(Math.random() * (defaultRadius - Math.max(defaultRadius * 0.8, pointRadius))) + Math.max(defaultRadius * 0.8, pointRadius)
    point.x *= w
    point.y *= h

    for (let i = 0; i < point.value; i++) {
      const randomAngle = Math.random() * 360

      const randomSin = Math.sin(2 * PI * randomAngle / 360)
      const randomCos = Math.cos(2 * PI * randomAngle / 360)

      const randomX = randomSin * randomRadius * 0.6
      const randomY = randomCos * randomRadius * 0.6

      resultArr.push({
        x: Math.floor(point.x + randomX),
        y: Math.floor(point.y + randomY),
        value: 1,
        radius: randomRadius
      })
    }
  })

  const resultMax = max / 10

  console.log(resultArr)

  return [resultArr, resultMax]
}
