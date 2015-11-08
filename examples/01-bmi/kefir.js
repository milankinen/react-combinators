import React from "react"
import Kefir from "kefir"
import {render} from "react-dom"
import {Combinator} from "react-combinators/kefir"

// lets define our "reactive" model with observables
function model(initialHeight, initialWeight) {
  const setHeight = createAction()
  const setWeight = createAction()
  const height = toProp(setHeight.$, initialHeight)
  const weight = toProp(setWeight.$, initialWeight)
  const bmi = Kefir.combine([weight, height], (w, h) => (
    Math.round(w / (h * h * 0.0001))
  ))

  // yeah. model is just a pure factory function that returns plain object
  return { setHeight, setWeight, height, weight, bmi }
}

function App() {
  // and here we can use the same object like any other object
  const { setHeight, setWeight, height, weight, bmi } = model(180, 80)
  return (
    <Combinator>
      <div>
        <h1>BMI counter example</h1>
        {renderSlider("Height", height, setHeight, 100, 240)}
        {renderSlider("Weight", weight, setWeight, 40, 150)}
        {/* and here we can embed the observables directly into the JSX */}
        Your BMI is: {bmi}
      </div>
    </Combinator>
  )
}

function renderSlider(title, value, setValue, min, max) {
  return (
    <div>
      {title}: {value} <br />
      <input type="range" min={min} max={max} value={value}
             onChange={e => setValue(e.target.value)} />
    </div>
  )
}

function createAction() {
  const pool = Kefir.pool()
  const creator = (val) => pool.plug(Kefir.constant(val))
  creator.$ = pool
  return creator
}

function toProp(stream, initial) {
  return stream.merge(Kefir.constant(initial)).toProperty()
}

render(<App />, document.getElementById("app"))
