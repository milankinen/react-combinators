import {Observable, Subject} from "rx"
import React from "react"
import {keys, values, zip, zipObject} from "../util"


export default function createComponent(renderFn) {
  return React.createClass({
    getInitialState() {
      const propsSubjects = zipObject(keys(this.props), values(this.props).map(() => new Subject()))

      const propsS =
        zipObject(keys(this.props), zip(values(propsSubjects), values(this.props)).map(([subject, initial]) => (
          subject.startWith(initial).distinctUntilChanged().share()
        )))

      return {
        propsSubjects,
        vdomS: renderFn(propsS),
        vdom: null
      }
    },
    componentWillMount() {
      const updateVDOM = vdom => this.setState({vdom})
      if (process.browser) {
        this.setState({ subscription: this.state.vdomS.subscribe(updateVDOM) })
      } else {
        this.state.vdomS.take(1).subscribe(updateVDOM)
      }
    },
    componentWillReceiveProps(nextProps) {
      keys(nextProps).forEach(propName => {
        const subject = this.state.propsSubjects[propName]
        if (!subject) {
          console.warn(
            `Trying to pass property "${propName}" that is not set during the component creation.`,
            `Ignoring this property.`
          )
        } else {
          subject.onNext(nextProps[propName])
        }
      })
    },
    shouldComponentUpdate(nextProps, nextState) {
      return nextState.vdom !== this.state.vdom
    },
    componentWillUnmount() {
      const {subscription} = this.state
      if (subscription) {
        subscription.dispose()
      }
    },
    render() {
      return this.state.vdom
    }
  })
}
