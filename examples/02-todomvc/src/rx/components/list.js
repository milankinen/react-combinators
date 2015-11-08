import React from "react"
import {Observable} from "rx"
import _ from "lodash"
import {Model} from "../model"
import classNames from "classnames"
import {Combinator, createComponent} from "react-combinators/rx"


export default createComponent(({model}) => model.map(({displayedItems, removeItem}) => (
  <Combinator>
    <ul id="todo-list">
      {displayedItems.map(items => items.map(it => (
        <Item key={it.id} item={it} remove={removeItem} />
      )))}
    </ul>
  </Combinator>
)))

const Item = createComponent(({item, remove}) =>
  Observable.combineLatest(item, remove, ({id, fields, setStatus, setText}, remove) => {
    const inputEl = Model(null)
    const editing = Model(false)
    const isCompleted = fields.map(({status}) => status === "completed")
    const text = fields.map(f => f.text)
    const classes = Observable.combineLatest(editing, isCompleted,
      (editing, completed) => classNames({editing, completed})
    )
    const setEditing = setting => {
      editing.set(setting)
      _.defer(() => inputEl.get().focus())
    }

    return (
      <Combinator>
        <li className={classes}>
          <div className="view">
            <input
              className="toggle"
              type="checkbox"
              onChange={e => setStatus(e.target.checked ? "completed" : "active")}
              checked={isCompleted}
              />
            <label onDoubleClick={() => setEditing(true)}>
              {text}
            </label>
            <button className="destroy" onClick={() => remove(id)}/>
          </div>
          <input
            ref={el => inputEl.set(el)}
            className="edit"
            value={text}
            onBlur={() => setEditing(false)}
            onKeyDown={e => e.which === 13 ? setEditing(false) : null}
            onChange={e => setText(e.target.value)}
            />
        </li>
      </Combinator>
    )
  }))
