import React from "react"
import {Observable} from "rx"
import _ from "lodash"
import {Combinator, createComponent} from "react-combinators/rx"


export default createComponent(({model}) => model.map(({items, setStatusForAllItems}) => {
  const allCompleted =
    items
      .map(items => items.map(it => it.fields.map(f => f.status === "completed")))
      .flatMapLatest(completed => Observable.combineLatest(...completed).share())
      .map(completed => _.every(completed))

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
