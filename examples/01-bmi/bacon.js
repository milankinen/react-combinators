import React from "react"
import Bacon from "baconjs"
import {render} from "react-dom"
import {Combinator} from "react-combinators/baconjs"


function model(initialHeight, initialWeight) {
  const setHeight = createAction()
  const setWeight = createAction()
  const height = setHeight.$.toProperty(initialHeight)
  const weight = setWeight.$.toProperty(initialWeight)
  const bmi = Bacon.combineWith(weight, height, (w, h) => (
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
  const bus = new Bacon.Bus()
  const creator = (val) => bus.push(val)
  creator.$ = bus
  return creator
}

render(<App />, document.getElementById("app"))
