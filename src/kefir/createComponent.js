import Kefir from "kefir"
import React from "react"
import {keys, values, zip, zipObject} from "../util"

export default function createComponent(renderFn) {
  return React.createClass({
    getInitialState() {
      const propsPools = zipObject(keys(this.props), values(this.props).map(() => Kefir.pool()))

      const propsS =
        zipObject(keys(this.props), zip(values(propsPools), values(this.props)).map(([pool, initial]) => (
          pool.merge(Kefir.constant(initial)).skipDuplicates()
        )))

      return {
        propsPools,
        vdomS: renderFn(propsS),
        vdom: null
      }
    },
    updateVDOM(vdom) {
      this.setState({vdom})
    },
    componentWillMount() {
      if (process.browser) {
        this.state.vdomS.onValue(this.updateVDOM)
      } else {
        this.state.vdomS.take(1).onValue(this.updateVDOM)
      }
    },
    componentWillReceiveProps(nextProps) {
      keys(nextProps).forEach(propName => {
        const pool = this.state.propsPools[propName]
        if (!pool) {
          console.warn(
            `Trying to pass property "${propName}" that is not set during the component creation.`,
            `Ignoring this property.`
          )
        } else {
          pool.plug(Kefir.constant(nextProps[propName]))
        }
      })
    },
    shouldComponentUpdate(nextProps, nextState) {
      return nextState.vdom !== this.state.vdom
    },
    componentWillUnmount() {
      this.state.vdomS.offValue(this.updateVDOM)
    },
    render() {
      return this.state.vdom
    }
  })
}
