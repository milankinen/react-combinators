import React from "react"
import {Model} from "bacon.model"
import {Combinator, createComponent} from "react-combinators/baconjs"

// in reactive components, passed properties are observables
// and the returned value must be an observable that contains the
// rendered JSX
export default createComponent(({model}) => model.map(({addItem}) => {
  // if components must contain their own "state", it can be declared as observables
  // in a similar ways you declare your application's state
  const text = Model("")
  const handleEsc = text.map(txt => e => {
    if (e.which === 13 && txt) {
      addItem(txt)
      text.set("")
    }
  })
  return (
    <Combinator>
      <input
        id="new-todo"
        placeholder="What needs to be done?"
        autoFocus={true}
        value={text}
        onChange={e => text.set(e.target.value)}
        onKeyDown={handleEsc}
        />
    </Combinator>
  )
}))
