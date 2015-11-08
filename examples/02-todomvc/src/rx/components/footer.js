import React from "react"
import {Observable} from "rx"
import classNames from "classnames"
import {Combinator, createComponent} from "react-combinators/rx"

export default createComponent(({model}) =>
  model.map(({filter, resetFilter, itemsLeft, totalItems, clearCompletedItems}) => {
    const Btn = (name, id) =>
      <a className={filter.map(current => classNames({selected: current === id}))}
         onClick={() => resetFilter(id)}>
        {name}
      </a>

    const somethingToClear =
      Observable.combineLatest(totalItems, itemsLeft, (tot, left) => tot - left > 0)

    const itemsText =
      itemsLeft.map(left => left === 1 ? "item" : "items")

    return (
      <Combinator>
        <footer id="footer">
        <span id="todo-count">
          <strong>{itemsLeft}</strong> {itemsText} left
        </span>
          <ul id="filters">
            <li>{Btn("All", "")}</li>
            <li>{Btn("Active", "active")}</li>
            <li>{Btn("Completed", "completed")}</li>
          </ul>
          {somethingToClear.map(yes => yes ?
              <button
                id="clear-completed"
                onClick={clearCompletedItems}>
                Clear completed
              </button> : null
          )}
        </footer>
      </Combinator>
    )
  }))
