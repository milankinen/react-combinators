import React from "react"
import Bacon from "baconjs"
import _ from "lodash"
import {Combinator, createComponent} from "react-combinators/baconjs"


export default createComponent(({model}) => model.map(({items, setStatusForAllItems}) => {
  const allCompleted =
    items
      .map(items => items.map(it => it.fields.map(".status").map(s => s === "completed")))
      .flatMapLatest(Bacon.combineAsArray)
      .map(_.all)

  return (
    <Combinator>
      <input
        id="toggle-all"
        type="checkbox"
        checked={allCompleted}
        onChange={e => setStatusForAllItems(e.target.checked ? "completed" : "active")}
        />
    </Combinator>
  )
}))
