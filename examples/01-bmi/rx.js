import React from "react"
import {Subject, Observable} from "rx"
import {render} from "react-dom"
import {Combinator} from "react-combinators/rx"

// lets define our "reactive" model with observables
function model(initialHeight, initialWeight) {
  const setHeight = createAction()
  const setWeight = createAction()
  const height = setHeight.$.startWith(initialHeight).share()
  const weight = setWeight.$.startWith(initialWeight).share()
  const bmi = Observable.combineLatest(weight, height, (w, h) => (
    Math.round(w / (h * h * 0.0001))
  )).share()

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
        Your BMI is: <span className="bmi">{bmi}</span>
      </div>
    </Combinator>
  )
}

function renderSlider(title, value, setValue, min, max) {
  return (
    <div>
      {title}: {value} <br />
      <input type="range" min={min} max={max} value={value} className={title}
             onChange={e => setValue(e.target.value)} />
    </div>
  )
}

function createAction() {
  const subject = new Subject()
  const creator = (val) => subject.onNext(val)
  creator.$ = subject
  return creator
}

render(<App />, document.getElementById("app"))
