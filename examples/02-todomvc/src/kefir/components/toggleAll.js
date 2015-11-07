import React from "react"
import Kefir from "kefir"
import _ from "lodash"
import {Combinator, createComponent} from "react-combinators/kefir"


export default createComponent(({model}) => model.map(({items, setStatusForAllItems}) => {
  const allCompleted =
    items
      .map(items => items.map(it => it.fields.map(f => f.status === "completed")))
      .flatMapLatest(Kefir.combine)
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
