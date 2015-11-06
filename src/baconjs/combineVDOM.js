import Bacon from "baconjs"
import {cloneAndReplaceProps, isValidElement} from "react/lib/ReactElement"
import Combinator from "./Combinator"
import {contains, isEmpty, isArray, zip, find} from "../util"

/**
 *  Transforms: VDOM(Observable) => Observable(VDOM)
 *  Example:
 *    const a = Bacon.constant(4)
 *    const b = Bacon.constant(3)
 *    const c = Bacon.combineWith(a, b, (a, b) => a + b)
 *
 *    combineVDOM(<div>{a} + {b} = <span className="result">{c}</span></div>)
 */
export default function combineVDOM(vdom) {
  const obs = resolveObservables(vdom, [])
  if (isEmpty(obs)) {
    return Bacon.constant(vdom)
  } else {
    return Bacon
      .combineAsArray(obs)
      .map(values => assignObservableValues(vdom, zip(obs, values)))
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
  return x && x instanceof Bacon.Observable
}
