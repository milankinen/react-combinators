import React from "react"
import {keys, values, zip, zipObject} from "./util"

export default ({createEventBus, pushToEventBus, take, startWith, skipDuplicates, subscribe, toProperty}) => {
  return function createComponent(renderFn) {
    return React.createClass({
      getInitialState() {
        const propsBuses = zipObject(keys(this.props), values(this.props).map(() => createEventBus()))

        const propsS =
          zipObject(keys(this.props), zip(values(propsBuses), values(this.props)).map(([bus, initial]) => (
            toProperty(skipDuplicates(startWith(bus, initial)))
          )))

        return {
          propsBuses,
          vdomS: renderFn(propsS),
          vdom: null
        }
      },
      componentWillMount() {
        const updateVDOM = vdom => this.setState({vdom})
        if (process.browser) {
          this.setState({ dispose: subscribe(this.state.vdomS, updateVDOM) })
        } else {
          subscribe(take(this.state.vdomS, 1), updateVDOM)
        }
      },
      componentWillReceiveProps(nextProps) {
        keys(nextProps).forEach(propName => {
          const bus = this.state.propsBuses[propName]
          if (!bus) {
            console.warn(
              `Trying to pass property "${propName}" that is not set during the component creation.`,
              "Ignoring this property."
            )
          } else {
            pushToEventBus(bus, nextProps[propName])
          }
        })
      },
      shouldComponentUpdate(nextProps, nextState) {
        return nextState.vdom !== this.state.vdom
      },
      componentWillUnmount() {
        const {dispose} = this.state
        if (dispose) {
          dispose()
        }
      },
      render() {
        return this.state.vdom
      }
    })

  }
}
