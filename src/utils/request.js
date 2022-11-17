import interceptors from '@/utils/interceptors'
import { ElMessage  as Message} from 'element-plus'
import { uint8ArrayToStringDecoder } from './index'

import Storage from '@/utils/token'

import { handleErrorCode } from '@/utils/error'

// 封装get请求
export function get(url, params, notMessage, baseURL) {
  return new Promise((resolve, reject) => {
    interceptors
      .get(url, { params, baseURL })
      .then(response => {
        if (response !== 'cancel') {
          resolve(response)
        } else {
          reject(response)
        }
      })
      .catch(err => {
        if (err && !notMessage) {
          Message({
            message: err.errorMsg || 'Error',
            type: 'error',
            offset: 70,
            duration: 5 * 1000,
            showClose: true
          })
        }
        reject(err)
      })
  })
}

// 封装post请求
export function post(url, params, notMessage) {
  return new Promise((resolve, reject) => {
    interceptors({
      url: url,
      method: 'post',
      data: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response !== 'cancel') {
        resolve(response)
      } else {
        reject(response)
      }
    })
      .catch(err => {
        if (err && !notMessage) {
          Message({
            message: err.errorMsg || 'Error',
            type: 'error',
            offset: 70,
            duration: 5 * 1000,
            showClose: true
          })
        }
        reject(err)
      })
  })
}

// 封装put请求
export function put(url, params, data, notMessage) {
  return new Promise((resolve, reject) => {
    interceptors({
      url: url,
      method: 'put',
      params: params,
      data: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        if (response !== 'cancel') {
          resolve(response)
        } else {
          reject()
        }
      }).catch(err => {
        if (err && !notMessage) {
          Message({
            message: err.errorMsg || 'Error',
            type: 'error',
            offset: 70,
            duration: 5 * 1000,
            showClose: true
          })
        }
        reject(err)
      })
  })
}

// 封装delete请求
export function deleteApi(url, params, notMessage) {
  return new Promise((resolve, reject) => {
    interceptors.delete(url, { params })
      .then(response => {
        if (response !== 'cancel') {
          resolve(response)
        } else {
          reject()
        }
      }).catch(err => {
        if (err && !notMessage) {
          Message({
            message: err.errorMsg || 'Error',
            type: 'error',
            offset: 70,
            duration: 5 * 1000,
            showClose: true
          })
        }
        reject(err)
      })
  })
}

// 封装fetch请求
export function fetchApi(url, params, option, notMessage) {
  const accessToken = Storage.getLocal('accessToken') || ''

  let dealOption = {
    body: JSON.stringify(params),
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  }

  dealOption = Object.assign(dealOption, option)

  return new Promise((resolve, reject) => {
    fetch('api/' + url, dealOption)
      .then(response => {
        if (response.ok && response.status === 200) {
          resolve(response)
        } else {
          const reader = response.body.getReader()
          const pump = () => reader.read()
            .then(res => {
              const errResult = JSON.parse(uint8ArrayToStringDecoder(res.value))

              if (!notMessage) {
                Message({
                  message: errResult.data.errorMsg || 'Error',
                  type: 'error',
                  offset: 70,
                  duration: 5 * 1000,
                  showClose: true
                })
              }

              handleErrorCode(errResult.data.errorCode)

              reject(errResult.data.errorMsg)
            })

          pump()
        }
      })
      .catch(error => {
        reject(error.message)
      })
  })
}

