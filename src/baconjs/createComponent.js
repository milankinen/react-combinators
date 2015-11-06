import Bacon from "baconjs"
import React from "react"
import {keys, values, zip, zipObject} from "../util"

/**
 * Wraps function (...args) => Observable into React.Component so that
 * properties that are passed from parent elements are transformed to EventStreams
 * (e.g. (prop1, prop2) => (Observable(prop1), Observable(prop2))
 *
 * Example:
 *
 *    const App = React.createClass({
 *      render() {
 *        const {width, height} = this.state   // change this somehow
 *        return (
 *          <div>
 *            Example
 *            <BMI width={width} height={height} />
 *          </div>
 *        )
 *      }
 *    })
 *
 *    const BMI = createComponent({width, height} => {
 *      const bmiP = Bacon.combineWith(weight, height, (w, h) => Math.round(w/(h * h * 0.0001)))
 *      return Bacon.combineTemplate(
 *        <div>BMI for {width} and {height} is {bmiP}</div>
 *      )
 *    })
 */
export default function createComponent(renderFn) {
  return React.createClass({
    getInitialState() {
      const propsBuses = zipObject(keys(this.props), values(this.props).map(val => new Bacon.Bus()))

      const propsS =
        zipObject(keys(this.props), zip(values(propsBuses), values(this.props)).map(([bus, initial]) => (
          bus.startWith(initial).skipDuplicates()
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
        this.setState({ dispose: this.state.vdomS.onValue(updateVDOM) })
      } else {
        this.state.vdomS.take(1).onValue(updateVDOM)
      }
    },
    componentWillReceiveProps(nextProps) {
      keys(nextProps).forEach(propName => {
        const bus = this.state.propsBuses[propName]
        if (!bus) {
          console.warn(
            `Trying to pass property "${propName}" that is not set during the component creation.`,
            `Ignoring this property.`
          )
        } else {
          bus.push(nextProps[propName])
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
