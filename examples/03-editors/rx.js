import React from "react"
import {Subject} from "rx"
import {render} from "react-dom"
import {Combinator} from "react-combinators/rx"

function Counter(initial) {
  const inc = createAction()
  const dec = createAction()
  const step = inc.$.map(() => 1).merge(dec.$.map(() => -1))
  const value = step.startWith(initial).scan((state, step) => state + step).shareReplay()
  return { value, inc, dec }
}

function Name(initialFirst, initialLast) {
  const setFirst = createAction()
  const setLast = createAction()
  const first = setFirst.$.startWith(initialFirst).shareReplay()
  const last = setLast.$.startWith(initialLast).shareReplay()
  return { first, last, setFirst, setLast }
}

function App() {
  const modifySelection = createAction()
  const addEditor = createAction()

  const selection =
    modifySelection.$
      .map(id => ({
        counter: {create: () => Counter(0), render: renderCounter},
        name: {create: () => Name("Foo", "Bar"), render: renderNameEditor}
      })[id])
      .startWith({create: () => Counter(0), render: renderCounter})
      .shareReplay()

  const editors =
    addEditor.$
      .withLatestFrom(selection, (_, sel) => sel)
      .startWith([])
      .scan((editors, {create, render}) => [...editors, {editor: create(), render}])
      .share()

  const numEditors =
    editors.map(editors => editors.length)

  return (
    <Combinator>
      <div>
        <h1>Editors {numEditors}</h1>
        <div>
          Add new editor
          <select onChange={e => modifySelection(e.target.value)}>
            <option value="counter">Counter</option>
            <option value="name">Name</option>
          </select>
          <button id="add" onClick={addEditor}>Add</button>
        </div>
        <div>
          {editors.map(editors => editors.map(({editor, render}) => (
            render(editor)
          )))}
        </div>
      </div>
    </Combinator>
  )
}

function renderCounter({value, inc, dec}) {
  return (
    <Combinator>
      <div className="counter">
        <span className="val">{value}</span>
        <button className="inc" onClick={inc}>+</button>
        <button className="dec" onClick={dec}>-</button>
      </div>
    </Combinator>
  )
}

function renderNameEditor({first, last, setFirst, setLast}) {
  return (
    <Combinator>
      <div>
        First name: <input value={first} onChange={e => setFirst(e.target.value)} /> <br />
        Last name: <input value={last} onChange={e => setLast(e.target.value)} />
      </div>
    </Combinator>
  )
}

function createAction() {
  const subject = new Subject()
  const creator = (val) => subject.onNext(val)
  creator.$ = subject
  return creator
}


render(<App />, document.getElementById("app"))
