# React Combinators

Seamless combination of React and reactive programming with (RxJs / Kefir / Bacon.js).

[![npm version](https://badge.fury.io/js/react-combinators.svg)](http://badge.fury.io/js/react-combinators)
[![Build Status](https://travis-ci.org/milankinen/react-combinators.svg)](https://travis-ci.org/milankinen/react-combinators)


## Motivation

Modeling your application state with observables gives you powerful tools for
(async) state handling. However, combining those observables with React UIs has been
a difficult: every observable must be subscribed and disposed separately with the 
component's lifecycle hooks. Such boilerplate!

The goal of this project is to enable seamless combination of React and observable 
by introducing **React Observable Combinators**.  Say hello to truly reactive and 
declarative React app development!

## Example

Reddit post search implemented with combinators and `kefir` (counter example
would have been too easy):

```javascript
import React from "react"
import Kefir from "kefir"
import {Combinator} from "react-combinators/kefir"
import {render} from "react-dom"

// lets define our reactive Reddit state model, see Kefir
// docs for more info about pools and other used methods
function Reddit(initial) {
  const pool = Kefir.pool()
  const setReddit = reddit => pool.plug(Kefir.constant(reddit))
  const reddit =
    pool.merge(Kefir.constant(initial)).toProperty()
  const posts =
    reddit
      .flatMapLatest(reddit => Kefir.fromPromise(
        fetch(`http://www.reddit.com/r/${reddit}.json`).then(req => req.json())
      ))
      .map(json => json.data.children.map(({data}) => data))
      .merge(Kefir.constant([])) // initial value
      .toProperty()
  const loading =
    reddit.map(() => true).merge(posts.map(() => false)).toProperty()

  // yes. the model is just a plain object with a set of actions
  // and reactive properties
  return { reddit, posts, loading, setReddit }
}

// no containers are needed! reactive properties and combinators handle that
// UI syncs with state
function App({model}) {
  const { reddit, posts, loading, setReddit } = model

  // we can derive properties as well
  const loadingIndicator =
    loading.map(loading => loading ? <img src="spinner.gif" /> : null)

  // all you need to do is to surround your JSX with <Combinator> element
  return (
    <Combinator>
      <div>
        Select Reddit:
        <select value={reddit} onChange={e => setReddit(e.target.value)}>
          <option value="reactjs">/r/reactjs</option>
          <option value="javascript">/r/javascript</option>
          <option value="ReactiveProgramming">/r/ReactiveProgramming</option>
        </select>
        {loadingIndicator}
        <hr />
        <ul>
          {posts.map(posts => posts.map(post => (
            <li>{post.title}</li>
          )))}
        </ul>
      </div>
    </Combinator>
  )
}

const myReddit = Reddit("ReactiveProgramming")
render(<App model={myReddit} />, document.getElementById("app"))
```

## Installation

    npm i --save react react-combinators <your-frp-library>

Currently supported FRP libraries are 

* `rx`
* `baconjs`
* `kefir` 


## API

All API functions and components are implemented for each supported FRP
library and they are accessible through:

```javascript
const {<functions/components...>} = require("react-combinators/baconjs")
```

### `<Combinator>`

Higher order component that collects the observables from its child elements
and them with the surrounding virtual dom. Combinator comonents should be 
used at the top-level of your React component.

Usage:

```javascript 
import {Combinator} from "react-combinators/<your-frp-library>"

function MyApp(observable) {
  return (
    <Combinator>
      <span>My observable value: {observable}</span>
    </Combinator>
  )
}
```

### `combineVDOM`

Higher order function that transforms a virtual dom tree containing observables 
to an observable that returns the same virtual dom where the observables are 
replaced with their values. Same as `combine*` functions in FRP libraries but
this one is optimized for virtual dom.

Usage (example with Bacon.js):

```javascript
const a = Bacon.constant(10)
const b = Bacon.constant(20)
const vdom = combineVDOM(
  <div>{a} + {b} = {Bacon.combineWith(a, b, (a, b) => a + b)}</div>
)
console.log(vdom instanceof Bacon.Property)  // => true
```

### `createComponent`

Creates a reactive component which wraps its observables into `React.Component`,
hence it can be mixed with normal react components.

`createComponent` takes one function which receives the component's properties
as **observables** and returns an **observable containing the rendered virtual
dom**.

Signature:

    createComponent :: ({propsObservales} => Observable(VDOM)) => React.Component

Usage (example with Bacon.js):

```javascript
const Example = createComponent(({a, b}) => {
  const c = Bacon.combineWith(a, b, (a, b) => a + b)
  return combineVDOM(
    <div>{a} + {b} = {c}</div>
  )
})

// ... somewhere in your app...
<div>
  Example: <Example a={10} b={20} />
</div>
```

## License

MIT
