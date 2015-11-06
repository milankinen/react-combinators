import Bacon from "baconjs"


export default {
  keys, values, zipObject, zip, isArray, isEmpty, isObs, contains, find
}

function isObs(x) {
  return x && x instanceof Bacon.Observable
}

function isArray(x) {
  return x && x.constructor === Array
}

function isEmpty(x) {
  return !x || x.length === 0
}

function contains(arr, val) {
  if (arr) {
    for (let i = 0 ; i < arr.length ; i++) {
      if (arr[i] === val) return true
    }
  }
  return false
}

function find(arr, predicate) {
  if (arr) {
    for (let i = 0 ; i < arr.length ; i++) {
      if (predicate(arr[i])) return arr[i]
    }
  }
}

function keys(obj = {}) {
  return Object.keys(obj)
}

function values(obj) {
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

function zipObject(keys, values) {
  const result = {}
  for (let i = 0 ; i < keys.length ; i++) {
    result[keys[i]] = values[i]
  }
  return result
}

function zip(...arrays) {
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
