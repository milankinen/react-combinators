import Kefir from "kefir"
import {cloneAndReplaceProps, isValidElement} from "react/lib/ReactElement"
import Combinator from "./Combinator"
import {contains, isEmpty, isArray, zip, find} from "../util"


export default function combineVDOM(vdom) {
  const obs = resolveObservables(vdom, [])
  if (isEmpty(obs)) {
    return Kefir.constant(vdom)
  } else {
    return Kefir.combine(obs).map(values => assignObservableValues(vdom, zip(obs, values)))
  }

  function resolveObservables(el, obs) {
    const propKeys = Object.keys(el.props || {})
    for (let k = 0 ; k < propKeys.length ; k++) {
      const key = propKeys[k]
      const prop = el.props[key]
      if (key === "children") {
        const children = isArray(prop) ? prop : [ prop ]
        for (let i = 0 ; i < children.length ; i++) {
          const child = children[i]
          if (isObs(child) && !contains(obs, child)) {
            obs.push(child)
          } else if (isValidElement(child) && !isCombinator(child)) {
            resolveObservables(child, obs)
          }
        }
      } else {
        if (isObs(prop) && !contains(obs, prop)) {
          obs.push(prop)
        }
      }
    }
    return obs
  }

  function assignObservableValues(el, obsValues) {
    const newProps = {}

    const propKeys = Object.keys(el.props || {})
    for (let k = 0 ; k < propKeys.length ; k++) {
      const key = propKeys[k]
      const prop = el.props[key]
      if (key === "children") {
        const children = isArray(prop) ? prop : [ prop ]
        const newChildren = []
        for (let i = 0 ; i < children.length ; i++) {
          const child = children[i]
          if (isObs(child)) {
            newChildren.push(find(obsValues, r => r[0] === child)[1])
          } else if (isValidElement(child) && !isCombinator(child)) {
            newChildren.push(assignObservableValues(child, obsValues))
          } else {
            newChildren.push(child)
          }
        }
        newProps.children = isArray(prop) ? newChildren : newChildren[0]
      } else {
        if (isObs(prop)) {
          newProps[key] = find(obsValues, r => r[0] === prop)[1]
        } else {
          newProps[key] = prop
        }
      }
    }
    return cloneAndReplaceProps(el, newProps)
  }
}


function isCombinator(el) {
  return el && el.type === Combinator
}

function isObs(x) {
  return x && x instanceof Kefir.Observable
}
