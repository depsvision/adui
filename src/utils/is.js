/**
 * @description: 判断值是否未某个类型
 * @param {unknown} val
 * @param {string} type
 * @return {boolean}
 */
export function is(val, type) {
  return toString.call(val) === `[object ${type}]`
}

export function isNull(val) {
  return val === null
}

export function isNumber(val) {
  return is(val, 'Number')
}

export function isString(val) {
  return is(val, 'String')
}

export function isArray(val) {
  return val && Array.isArray(val)
}
