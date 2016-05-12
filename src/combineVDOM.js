import {cloneElement, isValidElement} from "react/lib/ReactElement"
import {contains, isEmpty, isArray, zip, find} from "./util"
import Combinator from "./Combinator"


export default ({constant, combineAsArray, isObservable, map}) => {
  return function combineVDOM(vdom) {
    const obs = resolveObservables(vdom, [])
    if (isEmpty(obs)) {
      return constant(vdom)
    } else {
      return map(combineAsArray(obs), values => assignObservableValues(vdom, zip(obs, values)))
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
            if (isObservable(child) && !contains(obs, child)) {
              obs.push(child)
            } else if (isValidElement(child) && !isCombinator(child)) {
              resolveObservables(child, obs)
            }
          }
        } else {
          if (isObservable(prop) && !contains(obs, prop)) {
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
            if (isObservable(child)) {
              newChildren.push(find(obsValues, r => r[0] === child)[1])
            } else if (isValidElement(child) && !isCombinator(child)) {
              newChildren.push(assignObservableValues(child, obsValues))
            } else {
              newChildren.push(child)
            }
          }
          newProps.children = isArray(prop) ? newChildren : newChildren[0]
        } else {
          if (isObservable(prop)) {
            newProps[key] = find(obsValues, r => r[0] === prop)[1]
          } else {
            newProps[key] = prop
          }
        }
      }
      return cloneElement(el, newProps)
    }
  }
}


function isCombinator(el) {
  return el && el.type === Combinator
}
