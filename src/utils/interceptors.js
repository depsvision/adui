import axios from 'axios'
import Storage from '@/utils/token'

import { handleErrorCode } from '@/utils/error'

const baseUrl = {
  dev: '/api' // 开发环境
  // pro: "http://production.com" 生产环境
}

const CancelToken = axios.CancelToken
let cancel
const curRequest = {}

//  缓存当前请求  设置存储对象
const setCurRequest = (url, data = {}, requestCancel) => {
  const requestKey = dealRequestKey(url, data)

  //  清空上一次请求
  if (curRequest[requestKey]) {
    curRequest[requestKey]()

    delete curRequest[requestKey]
  }

  curRequest[requestKey] = requestCancel
}

const dealRequestKey = (url, data = {}) => {
  const keys = Object.keys(data)
  let requestKey = url
  const symbol = '-'

  keys.forEach((key) => {
    const val = data[key]
    requestKey += symbol + key + symbol + val
  })

  return requestKey
}

export function cleanRequestList(requestList) {
  const keys = Object.keys(curRequest)

  if (requestList) {
    requestList.forEach(req => {
      keys.forEach(key => {
        if (key.includes(req)) {
          const cancel = curRequest[key]
          cancel && cancel()
          delete curRequest[key]
        }
      })
    })
  } else {
    keys.forEach(key => {
      const cancel = curRequest[key]
      cancel && cancel()
      delete curRequest[key]
    })
  }
}

export function cleanInit() {
  cleanRequestList()
  const keys = Object.keys(curRequest)
  keys.forEach(key => {
    delete curRequest[key]
  })
}

const _baseUrl = baseUrl.dev // 使用到代理

// create an axios instance
const service = axios.create({
  baseURL: _baseUrl, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 120000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    const params = config.method.toUpperCase() === 'GET' ? config.params : (config.data === undefined ? config.data : JSON.parse(config.data))
    config.cancelToken = new CancelToken(function executor(c) {
      cancel = c
      setCurRequest(config.url, params, cancel)
    })

    const accessToken = Storage.getLocal('accessToken') || ''

    config.headers.Authorization = `Bearer ${accessToken}`

    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data

    const config = response.config

    const params = config.method.toUpperCase() === 'GET' ? config.params : (config.data === undefined ? config.data : JSON.parse(config.data))

    const requestKey = dealRequestKey(config.url, params)

    if (curRequest[requestKey]) {
      delete curRequest[requestKey]
    }

    // if the custom code is not 2001, it is judged as an error.
    if (res.requestInfo && !res.requestInfo.flag) {
      handleErrorCode(res.data.errorCode, response.config.url)

      return Promise.reject(res.data || 'Error')
    } else {
      return res
    }
  },
  error => {
    if (axios.isCancel(error)) {
      return 'cancel'
    } else {
      return Promise.reject(error)
    }
  }
)

export default service
