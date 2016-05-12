
export default {
  keys, values, zipObject, zip, isArray, isEmpty, contains, find
}

export function isArray(x) {
  return x && x.constructor === Array
}

export function isEmpty(x) {
  return !x || x.length === 0
}

export function contains(arr, val) {
  if (arr) {
    for (let i = 0 ; i < arr.length ; i++) {
      if (arr[i] === val) return true
    }
  }
  return false
}

export function find(arr, predicate) {
  if (arr) {
    for (let i = 0 ; i < arr.length ; i++) {
      if (predicate(arr[i])) return arr[i]
    }
  }
}

export function keys(obj = {}) {
  return Object.keys(obj)
}

export function values(obj) {
  const k = keys(obj)
  const result = []
  for (let i = 0 ; i < k.length; i++) {
    const key = k[i]
    if (obj.hasOwnProperty(key)) {
      result.push(obj[key])
    }
  }
  return result
}

export function zipObject(keys, values) {
  const result = {}
  for (let i = 0 ; i < keys.length ; i++) {
    result[keys[i]] = values[i]
  }
  return result
}

export function zip(...arrays) {
  const len = Math.max(...arrays.map(a => a.length))
  const result = []
  for (let i = 0 ; i < len ; i++) {
    const elem = []
    for (let j = 0 ; j < arrays.length ; j++) {
      elem.push(arrays[j][i])
    }
    result.push(elem)
  }
  return result
}
